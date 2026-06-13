import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Video, Clock, BarChart2, Users } from 'lucide-react';
import { sessionAPI } from '../services/api';
import { useSessionStore } from '../store/sessionStore';
import { useUiStore } from '../store/uiStore';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import SessionCard from '../components/session/SessionCard';
import InviteModal from '../components/session/InviteModal';
import JudgeGuide from '../components/ui/JudgeGuide';

export default function Dashboard() {
  const navigate = useNavigate();
  const { sessions, setSessions, isLoading, setIsLoading } = useSessionStore();
  const { showError, showSuccess } = useUiStore();
  const [inviteModalSession, setInviteModalSession] = useState(null);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await sessionAPI.list({ page: 1, limit: 20 });
      setSessions(data);
    } catch {
      showError('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setSessions, showError]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const handleCreateSession = async () => {
    try {
      const session = await sessionAPI.create();
      showSuccess('Session created!');
      setInviteModalSession(session);
      loadSessions();
    } catch {
      showError('Failed to create session');
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await sessionAPI.delete(sessionId);
      showSuccess('Session ended');
      loadSessions();
    } catch {
      showError('Failed to end session');
    }
  };

  const activeSessions = sessions.filter((s) => s.status === 'active' || s.status === 'waiting');
  const pastSessions = sessions.filter((s) => s.status === 'ended');

  const totalMin = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const avgDur = sessions.length > 0 ? Math.round(totalMin / sessions.length / 60) : 0;

  const statCards = [
    { label: 'Total Sessions', value: sessions.length, icon: BarChart2 },
    { label: 'Active Now', value: activeSessions.length, icon: Users },
    { label: 'Avg Duration', value: avgDur > 0 ? `${avgDur}m` : '--', icon: Clock },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <JudgeGuide />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 perspective-1000">
        {statCards.map(({ label, value, icon: Icon }, idx) => (
          <div
            key={label}
            className={`glass-card-premium p-4 flex items-center gap-4 card-3d animate-slide-up`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5 text-blue-400 animate-pulse-recording" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight animate-scale-in">{value}</p>
              <p className="text-xs text-gray-400/80">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in animation-delay-300">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sessions</h1>
          <p className="text-sm text-gray-400/80 mt-0.5">Manage your support sessions</p>
        </div>
        <Button onClick={handleCreateSession}>
          <Plus className="w-4 h-4" />
          New Session
        </Button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No sessions yet"
          description="Create your first session to start supporting customers"
          action={
            <Button onClick={handleCreateSession}>
              <Plus className="w-4 h-4" />
              Create Session
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {activeSessions.length > 0 && (
            <section className="animate-fade-in animation-delay-300">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-ripple inline-block" />
                Active Sessions
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <SessionCard
                      session={session}
                      onJoin={() => navigate(`/session/${session.id}`)}
                      onEnd={() => handleEndSession(session.id)}
                      onShare={() => setInviteModalSession(session)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {pastSessions.length > 0 && (
            <section className="animate-fade-in animation-delay-500">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Past Sessions
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SessionCard
                      session={session}
                      onView={() => navigate(`/session/${session.id}/ended`)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {inviteModalSession && (
        <InviteModal
          session={inviteModalSession}
          onClose={() => setInviteModalSession(null)}
        />
      )}
    </div>
  );
}