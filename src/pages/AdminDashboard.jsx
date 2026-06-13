import { useState, useEffect, useCallback } from 'react';
import { Shield, Video, Clock } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useUiStore } from '../store/uiStore';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function AdminDashboard() {
  const { showError } = useUiStore();
  const [liveSessions, setLiveSessions] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forceEndId, setForceEndId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [live, history] = await Promise.all([
        adminAPI.getLiveSessions(),
        adminAPI.getSessionHistory({ page: 1, limit: 20 }),
      ]);
      setLiveSessions(live);
      setHistorySessions(history);
    } catch (error) {
      showError('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleForceEnd = async (sessionId) => {
    setForceEndId(sessionId);
    try {
      await adminAPI.forceEndSession(sessionId);
      loadData();
    } catch (error) {
      showError('Failed to end session');
    } finally {
      setForceEndId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary-500" />
            Admin Dashboard
          </h1>
          <p className="text-text-secondary mt-1">Monitor all support sessions</p>
        </div>
        <Badge variant="live" size="lg" pulse>
          {liveSessions.length} Live Sessions
        </Badge>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Live Sessions</h2>
        {liveSessions.length === 0 ? (
          <EmptyState
            icon={Video}
            title="No active sessions"
            description="All support sessions have ended"
          />
        ) : (
          <div className="bg-bg-surface rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bg-elevated">
                  <th className="text-left p-4 text-text-secondary font-medium">Session</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Agent</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Customer</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Duration</th>
                  <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {liveSessions.map((session) => (
                  <tr key={session.id} className="border-b border-bg-elevated last:border-0">
                    <td className="p-4">
                      <span className="font-mono text-sm text-text-primary">#{session.id.slice(0, 8)}</span>
                    </td>
                    <td className="p-4 text-text-primary">{getAgentName(session)}</td>
                    <td className="p-4 text-text-primary">{getCustomerName(session) || 'Waiting...'}</td>
                    <td className="p-4 text-text-secondary">
                      {formatDuration(session)}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="danger"
                        size="sm"
                        loading={forceEndId === session.id}
                        onClick={() => handleForceEnd(session.id)}
                      >
                        End
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Session History (Last 24h)</h2>
        {historySessions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No session history"
            description="Past sessions will appear here"
          />
        ) : (
          <div className="bg-bg-surface rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bg-elevated">
                  <th className="text-left p-4 text-text-secondary font-medium">Session</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Agent</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Started</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Duration</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {historySessions.map((session) => (
                  <tr key={session.id} className="border-b border-bg-elevated last:border-0 hover:bg-bg-elevated/50">
                    <td className="p-4">
                      <span className="font-mono text-sm text-text-primary">#{session.id.slice(0, 8)}</span>
                    </td>
                    <td className="p-4 text-text-primary">{getAgentName(session)}</td>
                    <td className="p-4 text-text-secondary">
                      {session.started_at ? new Date(session.started_at).toLocaleTimeString() : '-'}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {session.duration_seconds ? `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s` : '-'}
                    </td>
                    <td className="p-4">
                      <Badge variant={session.recordings?.some((recording) => recording.status === 'ready') ? 'live' : 'idle'}>
                        {session.recordings?.some((recording) => recording.status === 'ready') ? 'Recorded' : 'No Recording'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const getAgentName = (session) => {
  return session.agents?.display_name || session.agent_name || 'Unknown agent';
};

const getCustomerName = (session) => {
  return (
    session.customer_name ||
    session.participants?.find((participant) => participant.role === 'customer')?.display_name
  );
};

const formatDuration = (session) => {
  if (session.duration_seconds) {
    return `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`;
  }

  if (!session.started_at) {
    return '-';
  }

  const seconds = Math.max(0, Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000));
  return `${Math.floor(seconds / 60)}m`;
};
