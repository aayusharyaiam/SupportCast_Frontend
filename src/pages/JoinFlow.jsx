import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Video, User, ArrowRight } from 'lucide-react';
import { sessionAPI } from '../services/api';
import { useUiStore } from '../store/uiStore';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function JoinFlow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess } = useUiStore();

  const token = searchParams.get('token');
  const [step, setStep] = useState('name');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [error, setError] = useState('');

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const session = await sessionAPI.join(token, name.trim());
      setSessionInfo(session);
      localStorage.setItem('socketToken', session.accessToken);
      localStorage.setItem('role', 'customer');
      localStorage.setItem('displayName', name);
      localStorage.setItem('sessionId', session.sessionId);
      localStorage.setItem('participantId', session.participant?.id || session.customerId);
      showSuccess('Joined session successfully!');
      setStep('permission');
    } catch (err) {
      setError(err.message || 'Invalid or expired invite link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCall = () => navigate(`/session/${sessionInfo.sessionId}`);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4">
        <div className="text-center glass-card p-8">
          <h1 className="text-xl font-semibold text-white mb-2">Invalid Link</h1>
          <p className="text-gray-500">This invite link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const stepIndex = step === 'name' ? 0 : 1;

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dotgrid pointer-events-none" />
      <div className="absolute inset-0 bg-orb pointer-events-none" />

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === stepIndex ? 'w-6 bg-blue-500' : 'bg-white/15'
              }`}
            />
          ))}
        </div>

        <div className="glass-card p-8">
          {step === 'name' && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-400" />
                </div>
                <h1 className="text-xl font-bold text-white">Join Support Call</h1>
                <p className="text-gray-500 mt-1.5">What should we call you?</p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleNameSubmit} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="glass-input w-full text-center text-lg py-3"
                  placeholder="Your name"
                />
                <Button type="submit" className="w-full" disabled={isLoading || !name.trim()}>
                  {isLoading ? <Spinner size="sm" /> : (
                    <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
                  )}
                </Button>
              </form>
            </>
          )}

          {step === 'permission' && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Video className="w-7 h-7 text-blue-400" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Ready to Join?</h1>
                <p className="text-gray-500 text-sm">
                  Camera and microphone access will be requested when you join.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setStep('name')}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleJoinCall}>
                  <Video className="w-4 h-4" />
                  Join Call
                </Button>
              </div>

              <p className="text-center text-gray-600 text-xs mt-4">
                You can join with audio only if you prefer.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}