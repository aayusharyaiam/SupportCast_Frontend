import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, AlertCircle, Download } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useUiStore } from '../store/uiStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function AdminSessionDetail() {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { showError } = useUiStore();
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const data = await adminAPI.getSession(sessionId);
      setSession(data);
      setEvents(data.session_events || []);
    } catch (error) {
      showError('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, showError]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-status-error mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary">Session Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/admin')}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Session #{session.id.slice(0, 8)}
          </h1>
          <p className="text-text-secondary">
            {new Date(session.created_at).toLocaleString()}
          </p>
        </div>
        <Badge
          variant={session.status === 'active' ? 'live' : 'idle'}
          className="ml-auto"
        >
          {session.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-bg-surface rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-text-primary">Agent</h2>
          </div>
          <p className="text-text-secondary">{session.agents?.display_name || session.agent_name || 'Unknown agent'}</p>
        </div>

        <div className="bg-bg-surface rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-text-primary">Duration</h2>
          </div>
          <p className="text-text-secondary">
            {session.duration_seconds
              ? `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`
              : '-'}
          </p>
        </div>
      </div>

      <div className="bg-bg-surface rounded-xl p-6">
        <h2 className="font-semibold text-text-primary mb-4">Event Log</h2>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated"
            >
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
              <div>
                <p className="text-text-primary">{event.event_type}</p>
                <p className="text-text-secondary text-sm">
                  {event.actor_name && `${event.actor_name} · `}
                  {new Date(event.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-text-muted">No events recorded</p>
          )}
        </div>
      </div>

      <div className="bg-bg-surface rounded-xl p-6 mt-6">
        <h2 className="font-semibold text-text-primary mb-4">Recordings</h2>
        {session.recordings?.length > 0 ? (
          <div className="space-y-3">
            {session.recordings.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={r.status === 'ready' ? 'live' : r.status === 'error' ? 'error' : 'idle'}
                    size="sm"
                  >
                    {r.status}
                  </Badge>
                  <span className="text-text-primary text-sm">
                    {new Date(r.created_at).toLocaleString()}
                    {r.duration_seconds ? ` · ${Math.floor(r.duration_seconds / 60)}m ${r.duration_seconds % 60}s` : ''}
                  </span>
                </div>
                {r.status === 'ready' && r.file_url ? (
                  <Button variant="secondary" size="sm" onClick={() => window.open(r.file_url, '_blank')}>
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                ) : r.status === 'error' ? (
                  <span className="text-xs text-status-error">{r.error_message || 'Recording failed'}</span>
                ) : (
                  <span className="text-xs text-text-muted">{r.status === 'processing' ? 'Processing...' : 'In progress'}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted">No recordings available</p>
        )}
      </div>
    </div>
  );
}
