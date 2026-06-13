import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Video, Clock, Users } from 'lucide-react';
import { sessionAPI } from '../services/api';
import { useSessionStore } from '../store/sessionStore';
import { useUiStore } from '../store/uiStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import SessionCard from '../components/session/SessionCard';
import InviteModal from '../components/session/InviteModal';

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
    } catch (error) {
      showError('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setSessions, showError]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleCreateSession = async () => {
    try {
      const session = await sessionAPI.create();
      showSuccess('Session created! Share the invite link.');
      setInviteModalSession(session);
      loadSessions();
    } catch (error) {
      showError('Failed to create session');
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await sessionAPI.delete(sessionId);
      showSuccess('Session ended');
      loadSessions();
    } catch (error) {
      showError('Failed to end session');
    }
  };

  const activeSessions = sessions.filter((s) => s.status === 'active' || s.status === 'waiting');
  const pastSessions = sessions.filter((s) => s.status === 'ended');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Sessions</h1>
          <p className="text-text-secondary mt-1">Manage your support sessions</p>
        </div>
        <Button onClick={handleCreateSession}>
          <Plus className="w-4 h-4" />
          New Session
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
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
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-live" />
                Active Sessions
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onJoin={() => navigate(`/session/${session.id}`)}
                    onEnd={() => handleEndSession(session.id)}
                    onShare={() => setInviteModalSession(session)}
                  />
                ))}
              </div>
            </section>
          )}

          {pastSessions.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-text-secondary" />
                Past Sessions
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onView={() => navigate(`/session/${session.id}/ended`)}
                  />
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
