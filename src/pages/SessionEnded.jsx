import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageSquare, Clock, Download } from 'lucide-react';
import { useSessionStore } from '../store/sessionStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function SessionEnded() {
  const navigate = useNavigate();
  const { session, recordingUrl } = useSessionStore();

  const durMin = session?.duration_seconds ? Math.floor(session.duration_seconds / 60) : 0;
  const durSec = session?.duration_seconds ? session.duration_seconds % 60 : 0;

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dotgrid pointer-events-none" />
      <div className="absolute inset-0 bg-orb-warm pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="glass-card p-8 text-center">
          {/* Check icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Session Ended</h1>
          <p className="text-gray-500 mb-8">
            Thank you for using SupportCast. Your session has ended.
          </p>

          {session?.duration_seconds && (
            <div className="flex justify-center gap-10 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-gray-200 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xl font-semibold">{durMin}m {durSec}s</span>
                </div>
                <p className="text-xs text-gray-600">Duration</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-gray-200 mb-1">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-xl font-semibold">{session.message_count || 0}</span>
                </div>
                <p className="text-xs text-gray-600">Messages</p>
              </div>
            </div>
          )}

          {recordingUrl && (
            <div className="mb-7">
              <Badge variant="live" size="md" className="mb-4">
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

          <Button variant="secondary" className="w-full" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}