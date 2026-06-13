import { Video, Clock, Share2, PhoneOff } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function SessionCard({ session, onJoin, onEnd, onShare, onView }) {
  const isActive = session.status === 'active' || session.status === 'waiting';
  const role = localStorage.getItem('role');
  const isAgent = role === 'agent' || role === 'admin';
  const customer = session.participants?.find((participant) => participant.role === 'customer');

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-bg-surface rounded-xl p-4 border border-bg-elevated hover:border-primary-500/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-mono text-sm text-text-primary">
            #{session.id.slice(0, 8)}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={isActive ? 'live' : 'idle'}
              size="sm"
            >
              {session.status}
            </Badge>
            {session.duration_seconds && (
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(session.duration_seconds)}
              </span>
            )}
          </div>
        </div>
      </div>

      {(session.customer_name || customer?.display_name) && (
        <p className="text-sm text-text-secondary mb-4">
          Customer: {session.customer_name || customer.display_name}
        </p>
      )}

      {!session.customer_name && !customer?.display_name && isActive && (
        <p className="text-sm text-text-muted mb-4 italic">
          Waiting for customer...
        </p>
      )}

      <p className="text-xs text-text-muted mb-4">
        {formatDate(session.created_at)} · {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>

      <div className="flex gap-2">
        {isActive && isAgent && (
          <>
            <Button variant="primary" size="sm" className="flex-1" onClick={onJoin}>
              <Video className="w-4 h-4" />
              Join
            </Button>
            <Button variant="secondary" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="danger" size="sm" onClick={onEnd}>
              <PhoneOff className="w-4 h-4" />
            </Button>
          </>
        )}

        {isActive && !isAgent && (
          <Button variant="primary" size="sm" className="flex-1" onClick={onJoin}>
            <Video className="w-4 h-4" />
            Rejoin
          </Button>
        )}

        {!isActive && (
          <Button variant="secondary" size="sm" className="flex-1" onClick={onView}>
            View Details
          </Button>
        )}
      </div>
    </div>
  );
}
