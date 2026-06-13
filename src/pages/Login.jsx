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
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-dotgrid pointer-events-none" />
      <div className="absolute inset-0 bg-orb pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-orb-warm pointer-events-none" />

      {/* Glass card */}
      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Video className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SupportCast</h1>
            <p className="text-gray-500 mt-1">Sign in to your agent account</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full"
                placeholder="agent@supportcast.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input w-full"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center mt-5 text-gray-600 text-sm">
          Joining a call? Use your invite link instead.
        </p>
      </div>
    </div>
  );
}