import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { useParticipantStore } from '../store/participantStore';
import { useChatStore } from '../store/chatStore';
import { useUiStore } from '../store/uiStore';
import { useSocket } from '../hooks/useSocket';
import { useLocalMedia } from '../hooks/useLocalMedia';
import { useMediasoup } from '../hooks/useMediasoup';
import { useConnectionQuality } from '../hooks/useConnectionQuality';
import { useRecording } from '../hooks/useRecording';
import VideoGrid from '../components/video/VideoGrid';
import VideoControls from '../components/video/VideoControls';
import ChatPanel from '../components/chat/ChatPanel';
import RecordingBadge from '../components/session/RecordingBadge';
import MediaPermission from '../components/video/MediaPermission';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function SessionView() {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket(sessionId);
  const peerConnectionRef = useRef(null);

  const { setSession } = useSessionStore();
  const { setLocalParticipant, setRemoteParticipant, clearRemoteParticipant } = useParticipantStore();
  const { messages } = useChatStore();
  const { showError, showInfo, showSuccess, connectionError } = useUiStore();

  const {
    localStream,
    isMediaReady,
    isRequestingPermission,
    getUserMedia,
    toggleAudio: toggleLocalAudio,
    toggleVideo: toggleLocalVideo,
    stopMedia,
    isAudioEnabled,
    isVideoEnabled,
    isMediaError,
  } = useLocalMedia();

  const {
    initializeDevice,
    createSendTransport,
    createRecvTransport,
    produce,
    consume,
  } = useMediasoup();

  const { emit, on, joinedData, isConnecting } = socket;
  const { quality: connectionQuality } = useConnectionQuality(peerConnectionRef.current);
  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useRecording(sessionId, socket?.socket || null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [recvTransport, setRecvTransport] = useState(null);

  const isAgent = joinedData?.role === 'agent';

  useEffect(() => {
    if (!joinedData) return;

    setSession({
      id: joinedData.sessionId,
      role: joinedData.role,
      participantId: joinedData.participantId,
      producers: joinedData.producers || []
    });
    setLocalParticipant({
      id: joinedData.participantId,
      name: localStorage.getItem('displayName') || 'You',
      role: joinedData.role,
    });
  }, [joinedData, setSession, setLocalParticipant]);

  useEffect(() => {
    if (!sessionId) return;

    const participantJoined = on('participant-joined', (data) => {
      setRemoteParticipant({
        id: data.participantId,
        name: data.name,
        role: data.role,
      });
      showInfo(`${data.name} joined the call`);
    });

    const participantLeft = on('participant-left', (data) => {
      clearRemoteParticipant();
      setRemoteStream(null);
      showInfo(data.name ? `${data.name} left the call` : 'Participant left the call');
    });

    const newProducer = on('new-producer', async (data) => {
      try {
        if (!recvTransport) return;
        const consumer = await consume(recvTransport, data.producerId, sessionId, emit);
        setRemoteStream(new MediaStream([consumer.track]));
      } catch (error) {
        showError('Failed to receive video');
      }
    });

    const sessionEnded = on('session-ended', () => {
      stopMedia();
      showSuccess('Session ended');
      navigate(`/session/${sessionId}/ended`);
    });

    const participantAudioMuted = on('participant-audio-muted', (data) => {
      showInfo(data.muted ? 'Participant muted their microphone' : 'Participant unmuted');
    });

    const participantVideoToggled = on('participant-video-toggled', (data) => {
      showInfo(data.enabled ? 'Participant turned on camera' : 'Participant turned off camera');
    });

    return () => {
      participantJoined();
      participantLeft();
      newProducer();
      sessionEnded();
      participantAudioMuted();
      participantVideoToggled();
    };
  }, [sessionId, on, setRemoteParticipant, clearRemoteParticipant, showInfo, showError, showSuccess, stopMedia, navigate, consume, emit, recvTransport]);

  const handleToggleAudio = useCallback(() => {
    toggleLocalAudio();
    emit('mute-audio', { sessionId, muted: !isAudioEnabled });
  }, [toggleLocalAudio, emit, sessionId, isAudioEnabled]);

  const handleToggleVideo = useCallback(() => {
    toggleLocalVideo();
    emit('toggle-video', { sessionId, enabled: !isVideoEnabled });
  }, [toggleLocalVideo, emit, sessionId, isVideoEnabled]);

  const handleStartRecording = useCallback(() => {
    startRecording();
  }, [startRecording]);

  const handleStopRecording = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  const handleEndCall = useCallback(() => {
    emit('end-session', { sessionId });
    stopMedia();
    navigate(`/session/${sessionId}/ended`);
  }, [emit, sessionId, stopMedia, navigate]);

  const handleJoinCall = useCallback(async () => {
    try {
      const stream = await getUserMedia();
      if (!stream) return;

      const rtpCaps = await emit('get-rtp-capabilities', { sessionId });
      await initializeDevice(rtpCaps);

      const sendTransportOptions = await emit('create-transport', { sessionId, direction: 'send' });
      const sendTransport = await createSendTransport(sendTransportOptions, sessionId, emit);

      const recvTransportOptions = await emit('create-transport', { sessionId, direction: 'recv' });
      const activeRecvTransport = await createRecvTransport(recvTransportOptions, sessionId, emit);
      setRecvTransport(activeRecvTransport);

      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];

      if (audioTrack) {
        await produce(sendTransport, audioTrack, 'audio');
      }
      if (videoTrack) {
        await produce(sendTransport, videoTrack, 'video');
      }

      for (const producer of joinedData?.producers || []) {
        const consumer = await consume(activeRecvTransport, producer.producerId, sessionId, emit);
        setRemoteStream(new MediaStream([consumer.track]));
      }
    } catch (error) {
      showError('Failed to join call');
    }
  }, [sessionId, emit, getUserMedia, initializeDevice, createSendTransport, createRecvTransport, produce, consume, joinedData, showError]);

  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

  if (connectionError || isMediaError) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-error/20 flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-2">Connection Error</h1>
          <p className="text-text-secondary mb-6">{connectionError || 'Failed to access camera/microphone'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="text-center">
          <Spinner size="lg" className="text-primary-500 mb-4" />
          <p className="text-text-secondary">Connecting to session...</p>
        </div>
      </div>
    );
  }

  if (!isMediaReady) {
    return (
      <MediaPermission
        onRequest={handleJoinCall}
        isRequesting={isRequestingPermission}
      />
    );
  }

  return (
    <div className="h-screen bg-bg-base flex">
      <div className="flex-1 flex flex-col">
        <div className="h-16 px-4 flex items-center justify-between bg-[#0D1220]/70 backdrop-blur-md border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-text-primary">Support Session</h1>
            <RecordingBadge />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {messages.length} messages
            </span>
          </div>
        </div>

        <div className="flex-1 p-4">
          <VideoGrid localStream={localStream} remoteStream={remoteStream} />
        </div>

        <VideoControls
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onOpenChat={() => setIsChatOpen(true)}
          onEndCall={handleEndCall}
          connectionQuality={connectionQuality}
          isRecording={isRecording}
          isAgent={isAgent}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      </div>

      {isChatOpen && (
        <ChatPanel
          sessionId={sessionId}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
