import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      localStorage.setItem('email', agent.email);
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

      {/* Floating animated orbs */}
      <div className="absolute top-10 left-10 floating-orb orb-blue animate-float-slow" />
      <div className="absolute bottom-10 right-10 floating-orb orb-indigo animate-float-slow-reverse" />

      {/* Glass card wrapper with perspective */}
      <div className="relative w-full max-w-sm perspective-1000 animate-slide-up">
        <div className="glass-card-premium p-8 card-3d">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in animation-delay-75">
            <div className="relative inline-block group">
              <span className="absolute -inset-1 rounded-2xl bg-blue-500/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              <img
                src="/icon.png"
                alt="SupportCast"
                className="relative w-14 h-14 mx-auto mb-4 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-2">SupportCast</h1>
            <p className="text-gray-400/80 mt-1 text-sm">Sign in to your agent account</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-wiggle">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in animation-delay-100">
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

            <div className="animate-fade-in animation-delay-150">
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

            <div className="animate-fade-in animation-delay-200">
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-white/10 animate-fade-in animation-delay-250">
            <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider">Demo Credentials</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => { setEmail('agent@supportcast.com'); setPassword('Demo@1234'); }}
                className="px-3 py-1.5 text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-colors"
              >
                Agent
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@supportcast.com'); setPassword('12345678'); }}
                className="px-3 py-1.5 text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('judge@supportcast.com'); setPassword('Judge@1234'); }}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-colors"
              >
                Judge
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-5 text-gray-500/80 text-sm animate-fade-in animation-delay-300">
          Joining a call? Use your invite link instead.
        </p>
      </div>
    </div>
  );
}