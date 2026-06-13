import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Link2, Video } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getErrorDetails, useUiStore } from '../../store/uiStore';

export default function InviteModal({ session, onClose }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const showError = useUiStore((state) => state.showError);

  const inviteToken = session.invite_token || session.inviteToken;
  const inviteLink = `${window.location.origin}/join?token=${inviteToken}`;
  const sessionId = session.id || session.session_id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showError('Failed to copy invite link', getErrorDetails(error));
    }
  };

  const handleJoin = () => {
    onClose?.();
    navigate(`/session/${sessionId}`);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Share Invite Link"
      footer={
        <>
          <Button onClick={handleJoin} disabled={!sessionId}>
            <Video className="w-4 h-4" />
            Join Meet
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <p className="text-text-secondary mb-4">
        Share this link with your customer to start the support session.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={inviteLink}
          readOnly
          className="glass-input flex-1 text-sm bg-bg-base/30 focus:ring-0 focus:border-white/20"
        />
        <Button onClick={handleCopy} variant={copied ? 'success' : 'secondary'} size="sm" className="h-10 min-w-[90px]">
          {copied ? (
            <span className="flex items-center gap-1.5 animate-scale-bounce text-emerald-400">
              <Check className="w-4 h-4" />
              Copied
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Copy className="w-4 h-4" />
              Copy
            </span>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-elevated">
        <Link2 className="w-4 h-4 text-text-secondary" />
        <span className="text-sm text-text-secondary">
          Link expires when the session ends
        </span>
      </div>
    </Modal>
  );
}
