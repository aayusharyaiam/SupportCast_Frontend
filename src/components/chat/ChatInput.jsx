import { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

export default function ChatInput({ onSend, onFileSelect }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06]">
      <div className="flex items-end gap-2">
        {onFileSelect && (
          <label className="p-2 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-colors cursor-pointer">
            <Paperclip className="w-5 h-5" />
            <input
              type="file"
              className="hidden"
              onChange={onFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </label>
        )}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            style={{ maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 rounded-lg bg-primary-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
