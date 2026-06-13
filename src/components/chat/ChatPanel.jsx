import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatPanel({ sessionId, onClose }) {
  const { messages, sendMessage, shareFile } = useChat(sessionId);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content) => {
    sendMessage(content);
  };

  return (
    <div className="w-80 bg-bg-surface border-l border-bg-elevated flex flex-col">
      <div className="h-14 px-4 flex items-center justify-between border-b border-bg-elevated">
        <h2 className="font-semibold text-text-primary">Chat</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-text-muted text-sm py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSendMessage} onFileSelect={shareFile} />
    </div>
  );
}