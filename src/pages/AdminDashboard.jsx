import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Video, Clock, ChevronLeft, ChevronRight, Search, X, Eye } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useUiStore } from '../store/uiStore';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function AdminDashboard() {
  const { showError } = useUiStore();
  const navigate = useNavigate();

  const [liveSessions, setLiveSessions] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [forceEndTarget, setForceEndTarget] = useState(null);
  const [isEnding, setIsEnding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadLive = useCallback(async () => {
    try {
      const data = await adminAPI.getLiveSessions();
      setLiveSessions(Array.isArray(data) ? data : []);
    } catch {
      // Silently refresh live sessions
    }
  }, []);

  const loadHistory = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        ...(dateFrom ? { date_from: toStartOfDay(dateFrom) } : {}),
        ...(dateTo ? { date_to: toEndOfDay(dateTo) } : {}),
      };
      const result = await adminAPI.getSessionHistory(params);
      const sessions = Array.isArray(result) ? result : (result?.data ?? []);
      const meta = result?.pagination ?? null;
      setHistorySessions(sessions);
      setPagination(meta);
      setHistoryPage(page);
    } catch {
      showError('Failed to load session history');
    } finally {
      setIsLoading(false);
    }
  }, [dateFrom, dateTo, showError]);

  useEffect(() => {
    loadLive();
    loadHistory(1);
    const interval = setInterval(loadLive, 5000);
    return () => clearInterval(interval);
  }, [loadLive, loadHistory]);

  const handleForceEnd = async () => {
    if (!forceEndTarget) return;
    setIsEnding(true);
    try {
      await adminAPI.forceEndSession(forceEndTarget.id);
      setForceEndTarget(null);
      loadLive();
      loadHistory(historyPage);
    } catch {
      showError('Failed to end session');
    } finally {
      setIsEnding(false);
    }
  };

  const filteredHistory = searchQuery.trim()
    ? historySessions.filter(s =>
        s.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.agents?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : historySessions;

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
                        onClick={() => setForceEndTarget(session)}
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Session History</h2>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2 bg-bg-surface border border-bg-elevated rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Filter sessions from date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2 bg-bg-surface border border-bg-elevated rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Filter sessions to date"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by session ID or agent..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 py-2 bg-bg-surface border border-bg-elevated rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-text-muted hover:text-text-primary"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No sessions found"
            description={searchQuery ? 'Try a different search term' : 'Past sessions will appear here'}
          />
        ) : (
          <>
            <div className="bg-bg-surface rounded-xl overflow-hidden mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bg-elevated">
                    <th className="text-left p-4 text-text-secondary font-medium">Session</th>
                    <th className="text-left p-4 text-text-secondary font-medium">Agent</th>
                    <th className="text-left p-4 text-text-secondary font-medium">Started</th>
                    <th className="text-left p-4 text-text-secondary font-medium">Duration</th>
                    <th className="text-left p-4 text-text-secondary font-medium">Status</th>
                    <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((session) => (
                    <tr key={session.id} className="border-b border-bg-elevated last:border-0 hover:bg-bg-elevated/50">
                      <td className="p-4">
                        <span className="font-mono text-sm text-text-primary">#{session.id.slice(0, 8)}</span>
                      </td>
                      <td className="p-4 text-text-primary">{getAgentName(session)}</td>
                      <td className="p-4 text-text-secondary">
                        {session.started_at ? new Date(session.started_at).toLocaleString() : '-'}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {session.duration_seconds ? `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s` : '-'}
                      </td>
                      <td className="p-4">
                        <Badge variant={session.recordings?.some((recording) => recording.status === 'ready') ? 'live' : 'idle'}>
                          {session.recordings?.some((recording) => recording.status === 'ready') ? 'Recorded' : 'No Recording'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/admin/sessions/${session.id}`)}
                          aria-label={`View session ${session.id.slice(0, 8)}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} sessions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => loadHistory(pagination.page - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-text-secondary px-2">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => loadHistory(pagination.page + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <ConfirmDialog
        isOpen={!!forceEndTarget}
        onClose={() => setForceEndTarget(null)}
        onConfirm={handleForceEnd}
        title="End session?"
        message={`Are you sure you want to force-end session #${forceEndTarget?.id?.slice(0, 8)}? Both participants will be disconnected.`}
        confirmLabel="End Session"
        variant="danger"
        loading={isEnding}
      />
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

const toStartOfDay = (date) => `${date}T00:00:00.000Z`;

const toEndOfDay = (date) => `${date}T23:59:59.999Z`;
