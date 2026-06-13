import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Circle, Square } from 'lucide-react';
import Button from '../ui/Button';
import ConnectionQuality from './ConnectionQuality';

export default function VideoControls({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onOpenChat,
  onEndCall,
  connectionQuality,
  isRecording,
  isAgent,
  onStartRecording,
  onStopRecording,
  endCallLabel = 'End call',
}) {
  return (
    <div className="h-20 px-4 flex items-center justify-center gap-4 bg-[#0D1220]/80 backdrop-blur-md border-t border-white/[0.08]">
      <Button
        variant={isAudioEnabled ? 'secondary' : 'danger'}
        size="icon"
        onClick={onToggleAudio}
        aria-label={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {isAudioEnabled ? (
          <Mic className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </Button>

      <Button
        variant={isVideoEnabled ? 'secondary' : 'danger'}
        size="icon"
        onClick={onToggleVideo}
        aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {isVideoEnabled ? (
          <Video className="w-5 h-5" />
        ) : (
          <VideoOff className="w-5 h-5" />
        )}
      </Button>

      {connectionQuality && (
        <ConnectionQuality quality={connectionQuality} />
      )}

      <Button
        variant="secondary"
        size="icon"
        onClick={onOpenChat}
        aria-label="Open chat"
      >
        <MessageSquare className="w-5 h-5" />
      </Button>

      {isAgent && (
        <>
          <div className="w-px h-8 bg-white/10" />

          {isRecording ? (
            <Button
              variant="danger"
              size="icon"
              onClick={onStopRecording}
              aria-label="Stop recording"
              className="animate-pulse-recording"
            >
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="icon"
              onClick={onStartRecording}
              aria-label="Start recording"
            >
              <Circle className="w-4 h-4 text-red-400" />
            </Button>
          )}
        </>
      )}

      <div className="w-px h-8 bg-white/10" />

      <Button
        variant="danger"
        size="icon"
        onClick={onEndCall}
        aria-label={endCallLabel}
      >
        <PhoneOff className="w-5 h-5" />
      </Button>
    </div>
  );
}
