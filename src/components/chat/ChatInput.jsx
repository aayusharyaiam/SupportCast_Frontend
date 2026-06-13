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
    <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06] bg-[#0A0E18]/40">
      <div className="flex items-end gap-2">
        {onFileSelect && (
          <label className="p-2 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer transform hover:rotate-12 active:scale-95 group">
            <Paperclip className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
                e.target.value = '';
              }}
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
            className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-350"
            style={{ maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 rounded-lg bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 active:scale-90 hover:scale-105 transition-all duration-200 transform"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
