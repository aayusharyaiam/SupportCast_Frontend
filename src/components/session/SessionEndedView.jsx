import { CheckCircle, MessageSquare, Clock, Download, FileText } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function SessionEndedView() {
  const { session, recordingUrl } = useSessionStore();

  const formatDuration = (seconds) => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-bg-surface rounded-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-live/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-status-live" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Session Ended</h1>
          <p className="text-text-secondary mt-2">Thank you for using SupportCast</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-text-secondary" />
              <span className="text-text-primary">Duration</span>
            </div>
            <span className="font-semibold text-text-primary">
              {formatDuration(session?.duration_seconds)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-text-secondary" />
              <span className="text-text-primary">Messages</span>
            </div>
            <span className="font-semibold text-text-primary">
              {session?.message_count || 0}
            </span>
          </div>
        </div>

        {recordingUrl && (
          <div className="mb-6 p-4 rounded-lg bg-status-live/10 border border-status-live/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-status-live" />
                <span className="font-medium text-status-live">Recording Available</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(recordingUrl, '_blank')}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        )}

        <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}