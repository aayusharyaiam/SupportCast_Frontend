import { FileText } from 'lucide-react';

export default function ChatMessage({ message }) {
  const currentRole = localStorage.getItem('role');
  const normalizedCurrentRole = currentRole === 'admin' ? 'agent' : currentRole;
  const normalizedMessageRole = message.sender_role === 'admin' ? 'agent' : message.sender_role;
  const isOwnMessage = normalizedMessageRole === normalizedCurrentRole;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (message.type === 'file') {
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-slide-up`}>
        <div
          className={`max-w-[85%] p-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.01] ${
            isOwnMessage
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-xs'
              : 'bg-[#182030]/60 text-gray-200 border border-white/5 rounded-tl-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 shrink-0" />
            <a
              href={message.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium underline break-all ${
                isOwnMessage ? 'text-white' : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {message.file_name}
            </a>
          </div>
          <p className="text-[10px] mt-1 opacity-70">
            {message.file_size && `${(message.file_size / 1024 / 1024).toFixed(2)} MB`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div
        className={`max-w-[85%] flex flex-col ${
          isOwnMessage ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-md ${
            isOwnMessage
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-xs'
              : 'bg-[#182030]/60 text-gray-200 border border-white/5 rounded-tl-xs'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">{message.content}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 px-1">
          <span className="text-[10px] text-text-muted font-medium">{message.sender_name}</span>
          <span className="text-[10px] text-text-muted opacity-60">
            {formatTime(message.created_at)}
          </span>
          {message.pending && (
            <span className="text-[10px] text-blue-400 animate-pulse">Sending...</span>
          )}
        </div>
      </div>
    </div>
  );
}
