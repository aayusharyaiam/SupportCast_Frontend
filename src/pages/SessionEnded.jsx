import { useNavigate } from 'react-router-dom';
import { CheckCircle, MessageSquare, Clock, Download } from 'lucide-react';
import { useSessionStore } from '../store/sessionStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function SessionEnded() {
  const navigate = useNavigate();
  const { session, recordingUrl } = useSessionStore();

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-bg-surface rounded-xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-status-live/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-status-live" />
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-2">Session Ended</h1>
        <p className="text-text-secondary mb-8">
          Thank you for using SupportCast. Your session has ended.
        </p>

        {session?.duration_seconds && (
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-text-primary mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xl font-semibold">
                  {Math.floor(session.duration_seconds / 60)}m {session.duration_seconds % 60}s
                </span>
              </div>
              <p className="text-text-secondary text-sm">Duration</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-text-primary mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xl font-semibold">{session.message_count || 0}</span>
              </div>
              <p className="text-text-secondary text-sm">Messages</p>
            </div>
          </div>
        )}

        {recordingUrl && (
          <div className="mb-8">
            <Badge variant="live" size="lg" className="mb-4">
              Recording Available
            </Badge>
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => window.open(recordingUrl, '_blank')}
              >
                <Download className="w-4 h-4" />
                Download Recording
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
