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
      <div className="max-w-lg w-full glass-elevated rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Session Ended</h1>
          <p className="text-gray-400 mt-2">Thank you for using SupportCast</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-200">Duration</span>
            </div>
            <span className="font-semibold text-white">
              {formatDuration(session?.duration_seconds)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <span className="text-gray-200">Messages</span>
            </div>
            <span className="font-semibold text-white">
              {session?.message_count || 0}
            </span>
          </div>
        </div>

        {recordingUrl && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-medium text-emerald-400">Recording Available</span>
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