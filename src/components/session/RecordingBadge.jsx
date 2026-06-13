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
      <Badge variant="live" size="md" pulse>
        REC
      </Badge>
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
