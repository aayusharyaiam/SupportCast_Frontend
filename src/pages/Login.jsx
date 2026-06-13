import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import { signInWithPassword } from '../services/supabase';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { accessToken, agent } = await signInWithPassword(email, password);

      localStorage.setItem('token', accessToken);
      localStorage.setItem('socketToken', accessToken);
      localStorage.setItem('role', agent.role);
      localStorage.setItem('userId', agent.id);
      localStorage.setItem('displayName', agent.display_name);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
            <Video className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">SupportCast</h1>
          <p className="text-text-secondary mt-2">Agent Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-surface rounded-xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-status-error/20 border border-status-error text-status-error text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-bg-base border border-bg-elevated text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="agent@supportcast.app"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-bg-base border border-bg-elevated text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Sign In'}
          </Button>
        </form>

        <p className="text-center mt-6 text-text-secondary text-sm">
          Joining a call? Use your invite link.
        </p>
      </div>
    </div>
  );
}
