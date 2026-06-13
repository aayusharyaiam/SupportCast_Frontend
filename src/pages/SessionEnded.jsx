import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageSquare, Clock, Download, RotateCcw, Home } from 'lucide-react';
import { useSessionStore } from '../store/sessionStore';
import { sessionAPI } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function SessionEnded() {
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const storeSession = useSessionStore((state) => state.session);
  const storeRecordingUrl = useSessionStore((state) => state.recordingUrl);
  const leftCall = searchParams.get('left') === '1';

  const [localSession, setLocalSession] = useState(storeSession);
  const [localRecordingUrl, setLocalRecordingUrl] = useState(storeRecordingUrl);

  useEffect(() => {
    if (storeRecordingUrl) {
      setLocalRecordingUrl(storeRecordingUrl);
      return;
    }
    
    if (storeSession?.recordings) {
      const readyRecording = storeSession.recordings.find(r => r.status === 'ready');
      if (readyRecording) {
        setLocalRecordingUrl(readyRecording.file_url);
      }
    } else if (sessionId) {
      sessionAPI.get(sessionId).then(data => {
        setLocalSession(data);
        const readyRecording = data.recordings?.find(r => r.status === 'ready');
        if (readyRecording) {
          setLocalRecordingUrl(readyRecording.file_url);
        }
      }).catch(console.error);
    }
  }, [storeSession, storeRecordingUrl, sessionId]);

  const session = localSession || storeSession;
  const recordingUrl = localRecordingUrl || storeRecordingUrl;

  const role = localStorage.getItem('role');
  const isCustomer = role === 'customer';
  const isAgent = role === 'agent' || role === 'admin';
  const hasToken = !!(localStorage.getItem('token') || localStorage.getItem('socketToken'));

  const durMin = session?.duration_seconds ? Math.floor(session.duration_seconds / 60) : 0;
  const durSec = session?.duration_seconds ? session.duration_seconds % 60 : 0;

  const handleRejoin = () => {
    if (sessionId) {
      navigate(`/session/${sessionId}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dotgrid pointer-events-none" />
      <div className="absolute inset-0 bg-orb-warm pointer-events-none" />

      {/* Confetti particles - only when session fully ended */}
      {!leftCall && (
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
      )}

      <div className="relative w-full max-w-md perspective-1000 animate-slide-up">
        <div className="glass-card-premium p-8 text-center card-3d">
          {/* Icon */}
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg animate-scale-bounce ${
            leftCall
              ? 'bg-amber-500/10 border border-amber-500/30 shadow-amber-500/20'
              : 'bg-emerald-500/10 border border-emerald-500/30 shadow-emerald-500/20'
          }`}>
            {leftCall ? (
              <RotateCcw className="w-8 h-8 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            )}
          </div>

          <div className="animate-fade-in animation-delay-75">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {leftCall ? 'You Left the Call' : 'Session Complete'}
            </h1>
            <p className="text-gray-400 mb-8 text-sm">
              {leftCall && isCustomer
                ? 'You can rejoin the call if it\'s still active, or wait here.'
                : leftCall
                ? 'You have left the call. The support session can continue for the agent.'
                : isCustomer
                ? 'Thank you for using SupportCast. We hope we could help!'
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

          <div className="space-y-3 animate-fade-in animation-delay-300">
            {/* Rejoin button - for anyone who left the call */}
            {leftCall && sessionId && (
              <Button className="w-full shadow-lg shadow-blue-500/20" onClick={handleRejoin}>
                <RotateCcw className="w-4 h-4" />
                Rejoin Call
              </Button>
            )}

            {/* Back to Dashboard - only for logged-in agents */}
            {isAgent && hasToken && (
              <Button variant="secondary" className="w-full" onClick={handleBackToDashboard}>
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
            )}

            {/* For customers who don't have dashboard access */}
            {isCustomer && !leftCall && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-gray-400">
                  You can safely close this tab. If you need further support, please contact your agent for a new invite link.
                </p>
              </div>
            )}

            {/* Fallback if no role is set */}
            {!isAgent && !isCustomer && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-gray-400">
                  You can safely close this tab.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
