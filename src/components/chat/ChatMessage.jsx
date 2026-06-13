import { FileText } from 'lucide-react';

export default function ChatMessage({ message }) {
  const currentRole = localStorage.getItem('role');
  const isOwnMessage = message.sender_role === currentRole;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (message.type === 'file') {
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] p-3 rounded-xl ${
            isOwnMessage
              ? 'bg-primary-500 text-white'
              : 'bg-bg-elevated text-text-primary'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <a
              href={message.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium underline ${
                isOwnMessage ? 'text-white' : 'text-primary-500'
              }`}
            >
              {message.file_name}
            </a>
          </div>
          <p className="text-xs mt-1 opacity-70">
            {message.file_size && `${(message.file_size / 1024 / 1024).toFixed(2)} MB`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] ${
          isOwnMessage ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-3 py-2 rounded-xl ${
            isOwnMessage
              ? 'bg-primary-500 text-white rounded-br-sm'
              : 'bg-bg-elevated text-text-primary rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-muted">{message.sender_name}</span>
          <span className="text-xs text-text-muted">
            {formatTime(message.created_at)}
          </span>
          {message.pending && (
            <span className="text-xs text-text-muted">Sending...</span>
          )}
        </div>
      </div>
    </div>
  );
}
