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
import { getErrorDetails } from '../store/uiStore';

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
    getUserMediaAudioOnly,
    toggleAudio: toggleLocalAudio,
    toggleVideo: toggleLocalVideo,
    stopMedia,
    isAudioEnabled,
    isVideoEnabled,
    mediaError,
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
  const [remotePeers, setRemotePeers] = useState({});
  const [recvTransport, setRecvTransport] = useState(null);
  const remoteStreamsRef = useRef(new Map());
  const consumedProducerIdsRef = useRef(new Set());
  const pendingProducerIdsRef = useRef(new Set());

  const isAgent = joinedData?.role === 'agent' || joinedData?.role === 'admin';
  const remoteParticipant = useParticipantStore((state) => state.remoteParticipant);
  const peersCount = Object.keys(remotePeers).length;
  const participantStatus = peersCount > 0
    ? `${peersCount} participant${peersCount > 1 ? 's' : ''} joined`
    : 'Waiting for another participant';

  const resetRemoteMedia = useCallback(() => {
    remoteStreamsRef.current.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    });
    remoteStreamsRef.current.clear();
    consumedProducerIdsRef.current.clear();
    pendingProducerIdsRef.current.clear();
    setRemotePeers({});
  }, []);

  const attachRemoteTrack = useCallback((track, participantId) => {
    if (!participantId) return;

    let stream = remoteStreamsRef.current.get(participantId);
    if (!stream) {
      stream = new MediaStream();
      remoteStreamsRef.current.set(participantId, stream);
    }

    const nextStream = new MediaStream(stream.getTracks());
    nextStream.addTrack(track);
    remoteStreamsRef.current.set(participantId, nextStream);

    setRemotePeers(prev => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        stream: nextStream,
        id: participantId
      }
    }));
  }, []);

  const consumeRemoteProducer = useCallback(async (transport, producerId, participantId) => {
    if (!transport || !producerId || consumedProducerIdsRef.current.has(producerId)) return;
    consumedProducerIdsRef.current.add(producerId);

    try {
      const consumer = await consume(transport, producerId, sessionId, emit);
      attachRemoteTrack(consumer.track, participantId);
    } catch (error) {
      consumedProducerIdsRef.current.delete(producerId);
      throw error;
    }
  }, [attachRemoteTrack, consume, emit, sessionId]);

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
    if (joinedData.participants?.length > 0) {
      const newPeers = {};
      joinedData.participants.forEach(p => {
        newPeers[p.participantId] = { id: p.participantId, name: p.name, role: p.role, stream: remoteStreamsRef.current.get(p.participantId) || new MediaStream() };
      });
      setRemotePeers(prev => ({ ...prev, ...newPeers }));
      showInfo(`${joinedData.participants.length} participant(s) already in the call`);
    }
  }, [joinedData, setSession, setLocalParticipant, setRemoteParticipant, showInfo]);

  useEffect(() => {
    if (!sessionId) return;

    const participantJoined = on('participant-joined', (data) => {
      setRemotePeers(prev => ({
        ...prev,
        [data.participantId]: {
          id: data.participantId,
          name: data.name,
          role: data.role,
          stream: remoteStreamsRef.current.get(data.participantId) || new MediaStream()
        }
      }));
      showInfo(`${data.name} joined the call`);
    });

    const participantLeft = on('participant-left', (data) => {
      setRemotePeers(prev => {
        const next = { ...prev };
        delete next[data.participantId];
        return next;
      });
      
      const stream = remoteStreamsRef.current.get(data.participantId);
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        remoteStreamsRef.current.delete(data.participantId);
      }
      showInfo(data.name ? `${data.name} left the call` : 'Participant left the call');
    });

    const newProducer = on('new-producer', async (data) => {
      try {
        if (!recvTransport) {
          pendingProducerIdsRef.current.add({ producerId: data.producerId, participantId: data.participantId });
          return;
        }
        await consumeRemoteProducer(recvTransport, data.producerId, data.participantId);
      } catch (error) {
        showError('Failed to receive participant media', getErrorDetails(error));
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
  }, [sessionId, on, setRemoteParticipant, clearRemoteParticipant, showInfo, showError, showSuccess, stopMedia, navigate, recvTransport, consumeRemoteProducer, resetRemoteMedia]);

  useEffect(() => {
    if (!recvTransport) return;

    const pending = [...pendingProducerIdsRef.current];
    pendingProducerIdsRef.current.clear();

    pending.forEach(({ producerId, participantId }) => {
      consumeRemoteProducer(recvTransport, producerId, participantId).catch(() => {
        showError('Failed to receive participant media');
      });
    });
  }, [recvTransport, consumeRemoteProducer, showError]);

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
    stopMedia();
    if (isAgent) {
      emit('end-session', { sessionId }).catch(() => {});
      navigate(`/session/${sessionId}/ended`);
      return;
    }
    navigate(`/session/${sessionId}/ended?left=1`);
  }, [emit, isAgent, sessionId, stopMedia, navigate]);

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
        setRemotePeers(prev => ({
          ...prev,
          [producer.participantId]: {
            ...prev[producer.participantId],
            id: producer.participantId,
            name: producer.name || 'Participant',
            role: producer.role || 'participant'
          }
        }));
        await consumeRemoteProducer(activeRecvTransport, producer.producerId, producer.participantId);
      }
    } catch (error) {
      showError('Failed to join call', getErrorDetails(error));
    }
  }, [sessionId, emit, getUserMedia, initializeDevice, createSendTransport, createRecvTransport, produce, joinedData, showError, setRemoteParticipant, consumeRemoteProducer]);

  const handleJoinCallAudioOnly = useCallback(async () => {
    try {
      const stream = await getUserMediaAudioOnly();
      if (!stream) return;

      const rtpCaps = await emit('get-rtp-capabilities', { sessionId });
      await initializeDevice(rtpCaps);

      const sendTransportOptions = await emit('create-transport', { sessionId, direction: 'send' });
      const sendTransport = await createSendTransport(sendTransportOptions, sessionId, emit);

      const recvTransportOptions = await emit('create-transport', { sessionId, direction: 'recv' });
      const activeRecvTransport = await createRecvTransport(recvTransportOptions, sessionId, emit);
      setRecvTransport(activeRecvTransport);

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        await produce(sendTransport, audioTrack, 'audio');
      }

      for (const producer of joinedData?.producers || []) {
        setRemotePeers(prev => ({
          ...prev,
          [producer.participantId]: {
            ...prev[producer.participantId],
            id: producer.participantId,
            name: producer.name || 'Participant',
            role: producer.role || 'participant'
          }
        }));
        await consumeRemoteProducer(activeRecvTransport, producer.producerId, producer.participantId);
      }
    } catch (error) {
      showError('Failed to join call', getErrorDetails(error));
    }
  }, [sessionId, emit, getUserMediaAudioOnly, initializeDevice, createSendTransport, createRecvTransport, produce, joinedData, showError, setRemoteParticipant, consumeRemoteProducer]);

  useEffect(() => {
    return () => {
      stopMedia();
      resetRemoteMedia();
    };
  }, [stopMedia, resetRemoteMedia]);

  if (connectionError || mediaError) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-error/20 flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-2">Connection Error</h1>
          <p className="text-text-secondary mb-6">{connectionError || 'Failed to access camera/microphone'}</p>
          {(connectionError || mediaError) && (
            <details className="mb-6 rounded-lg border border-white/[0.08] bg-black/20 text-left">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-200">
                Error details
              </summary>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words px-3 pb-3 text-xs text-gray-400">
                {getErrorDetails(mediaError || connectionError)}
              </pre>
            </details>
          )}
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
        onRequestAudioOnly={handleJoinCallAudioOnly}
        isRequesting={isRequestingPermission}
        participantStatus={participantStatus}
      />
    );
  }

  return (
    <div className="h-screen bg-bg-base flex overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className={`h-12 sm:h-14 px-3 sm:px-4 flex items-center justify-between bg-[#0D1220]/70 backdrop-blur-md border-b border-white/[0.08] transition-all duration-500 shrink-0 ${isRecording ? 'shadow-[0_1px_15px_rgba(239,68,68,0.12)] border-red-500/20' : ''}`}>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-text-primary">Support Session</h1>
            <RecordingBadge />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full border transition-all duration-300 ${
                peersCount > 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 animate-scale-bounce'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              {participantStatus}
            </span>
            <span className="text-sm text-text-secondary">
              {messages.length} messages
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-2 sm:p-3">
          <VideoGrid
            localStream={localStream}
            remotePeers={Object.values(remotePeers)}
          />
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
          endCallLabel={isAgent ? 'End session' : 'Leave call'}
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
