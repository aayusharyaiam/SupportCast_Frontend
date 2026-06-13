import { Video, Clock, Share2, PhoneOff } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function SessionCard({ session, onJoin, onEnd, onShare, onView }) {
  const isActive = session.status === 'active' || session.status === 'waiting';
  const role = localStorage.getItem('role');
  const isAgent = role === 'agent' || role === 'admin';
  const customer = session.participants?.find((p) => p.role === 'customer');

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    return `${Math.floor(seconds / 60)}m`;
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
    <div className="glass-card p-5 hover:border-white/16 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="font-mono text-xs text-gray-500">
            #{session.id.slice(0, 8)}
          </span>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant={isActive ? 'live' : 'idle'} size="sm">
              {session.status}
            </Badge>
            {session.duration_seconds && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(session.duration_seconds)}
              </span>
            )}
          </div>
        </div>
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </div>

      {(session.customer_name || customer?.display_name) ? (
        <p className="text-sm text-gray-300 mb-4">
          {session.customer_name || customer.display_name}
        </p>
      ) : isActive ? (
        <p className="text-sm text-gray-600 mb-4 italic">Waiting for customer...</p>
      ) : null}

      <p className="text-xs text-gray-600 mb-5">
        {formatDate(session.created_at)} &middot; {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>

      <div className="flex gap-2">
        {isActive && isAgent && (
          <>
            <Button variant="primary" size="sm" className="flex-1" onClick={onJoin}>
              <Video className="w-3.5 h-3.5" />
              Join
            </Button>
            <Button variant="secondary" size="sm" onClick={onShare}>
              <Share2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="danger" size="sm" onClick={onEnd}>
              <PhoneOff className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
        {isActive && !isAgent && (
          <Button variant="primary" size="sm" className="flex-1" onClick={onJoin}>
            <Video className="w-3.5 h-3.5" />
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