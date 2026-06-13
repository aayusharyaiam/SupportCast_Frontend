import { useSessionStore } from '../../store/sessionStore';
import Badge from '../ui/Badge';

export default function RecordingBadge() {
  const recordingStatus = useSessionStore((state) => state.recordingStatus);
  const isRecording = recordingStatus === 'recording';
  const isProcessing = recordingStatus === 'processing';

  if (!recordingStatus || recordingStatus === 'idle') {
    return null;
  }

  if (isRecording) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/25 shadow-md shadow-red-500/10 animate-pulse-recording">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
        REC
      </span>
    );
  }

  if (isProcessing) {
    return (
      <Badge variant="warning" size="md">
        Processing...
      </Badge>
    );
  }

  return null;
}
