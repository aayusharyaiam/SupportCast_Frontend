import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Video, Mic, User } from 'lucide-react';
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

  const handleJoinCall = () => {
    navigate(`/session/${sessionInfo.sessionId}`);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-text-primary mb-2">Invalid Link</h1>
          <p className="text-text-secondary">This invite link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 'name' && (
          <div className="bg-bg-surface rounded-xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary-500" />
              </div>
              <h1 className="text-xl font-semibold text-text-primary">Join Support Call</h1>
              <p className="text-text-secondary mt-2">Enter your name to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-status-error/20 border border-status-error text-status-error text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleNameSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg-base border border-bg-elevated text-text-primary text-center text-lg placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your name"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !name.trim()}>
                {isLoading ? <Spinner size="sm" /> : 'Continue'}
              </Button>
            </form>
          </div>
        )}

        {step === 'permission' && (
          <div className="bg-bg-surface rounded-xl p-6 shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-500/20 flex items-center justify-center">
              <Video className="w-8 h-8 text-primary-500" />
            </div>

            <h1 className="text-xl font-semibold text-text-primary mb-2">
              Allow Camera & Microphone
            </h1>
            <p className="text-text-secondary mb-6">
              To join the video call, please allow access to your camera and microphone.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setStep('name')}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleJoinCall}>
                Join Call
              </Button>
            </div>

            <p className="text-text-muted text-sm mt-4">
              You can still join with audio only if you prefer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
