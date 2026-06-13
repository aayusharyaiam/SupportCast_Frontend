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
    <div className="h-20 px-4 flex items-center justify-center gap-4 bg-[#0D1220]/90 backdrop-blur-md border-t border-white/[0.08] animate-slide-up shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-20">
      <div className="hover:scale-105 active:scale-95 transition-transform duration-200" data-tooltip={isAudioEnabled ? 'Mute Mic' : 'Unmute Mic'}>
        <Button
          variant={isAudioEnabled ? 'secondary' : 'danger'}
          size="icon"
          onClick={onToggleAudio}
          className="rounded-full w-11 h-11"
          aria-label={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isAudioEnabled ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="hover:scale-105 active:scale-95 transition-transform duration-200" data-tooltip={isVideoEnabled ? 'Stop Video' : 'Start Video'}>
        <Button
          variant={isVideoEnabled ? 'secondary' : 'danger'}
          size="icon"
          onClick={onToggleVideo}
          className="rounded-full w-11 h-11"
          aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </Button>
      </div>

      {connectionQuality && (
        <div data-tooltip={`Quality: ${connectionQuality}`}>
          <ConnectionQuality quality={connectionQuality} />
        </div>
      )}

      <div className="hover:scale-105 active:scale-95 transition-transform duration-200" data-tooltip="Open Chat">
        <Button
          variant="secondary"
          size="icon"
          onClick={onOpenChat}
          className="rounded-full w-11 h-11"
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>

      {isAgent && (
        <>
          <div className="w-px h-8 bg-white/10 mx-1 animate-pulse" />

          {isRecording ? (
            <div className="hover:scale-105 active:scale-95 transition-transform duration-200" data-tooltip="Stop Recording">
              <Button
                variant="danger"
                size="icon"
                onClick={onStopRecording}
                aria-label="Stop recording"
                className="animate-pulse-recording rounded-full w-11 h-11"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="hover:scale-105 active:scale-95 transition-transform duration-200" data-tooltip="Record Call">
              <Button
                variant="secondary"
                size="icon"
                onClick={onStartRecording}
                className="rounded-full w-11 h-11"
                aria-label="Start recording"
              >
                <Circle className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          )}
        </>
      )}

      <div className="w-px h-8 bg-white/10 mx-1" />

      <div className="hover:scale-105 active:scale-95 transition-transform duration-200" data-tooltip={endCallLabel}>
        <Button
          variant="danger"
          size="icon"
          onClick={onEndCall}
          className="rounded-full w-11 h-11 hover:shadow-red-500/20 hover:shadow-lg"
          aria-label={endCallLabel}
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
