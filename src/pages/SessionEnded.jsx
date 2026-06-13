import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageSquare, Clock, Download } from 'lucide-react';
import { useSessionStore } from '../store/sessionStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function SessionEnded() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, recordingUrl } = useSessionStore();
  const leftCall = searchParams.get('left') === '1';

  const durMin = session?.duration_seconds ? Math.floor(session.duration_seconds / 60) : 0;
  const durSec = session?.duration_seconds ? session.duration_seconds % 60 : 0;

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dotgrid pointer-events-none" />
      <div className="absolute inset-0 bg-orb-warm pointer-events-none" />

      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="confetti-particle"
            style={{
              left: `${5 + (i * 6.25)}%`,
              top: `-10px`,
              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'][i % 6],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3.5 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md perspective-1000 animate-slide-up">
        <div className="glass-card-premium p-8 text-center card-3d">
          {/* Check icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-scale-bounce">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="animate-fade-in animation-delay-75">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {leftCall ? 'You Left the Call' : 'Session Ended'}
            </h1>
            <p className="text-gray-400 mb-8 text-sm">
              {leftCall
                ? 'You have left the call. The support session can continue for the agent.'
                : 'Thank you for using SupportCast. Your session has ended.'}
            </p>
          </div>

          {session?.duration_seconds && (
            <div className="flex justify-center gap-10 mb-8 animate-fade-in animation-delay-150">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-gray-200 mb-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xl font-semibold tracking-tight">{durMin}m {durSec}s</span>
                </div>
                <p className="text-xs text-gray-500/80">Duration</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-gray-200 mb-1">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-xl font-semibold tracking-tight">{session.message_count || 0}</span>
                </div>
                <p className="text-xs text-gray-500/80">Messages</p>
              </div>
            </div>
          )}

          {recordingUrl && (
            <div className="mb-7 animate-fade-in animation-delay-200">
              <Badge variant="live" size="md" className="mb-4 animate-glow-pulse">
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

          <div className="animate-fade-in animation-delay-300">
            <Button variant="secondary" className="w-full" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
