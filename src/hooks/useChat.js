import { useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useUiStore } from '../store/uiStore';
import { getSocket } from '../services/socket';
import { sessionAPI } from '../services/api';

export function useChat(sessionId) {
  const socket = getSocket();
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);
  const showError = useUiStore((state) => state.showError);

  const tempIdCounter = useRef(0);

  useEffect(() => {
    if (!sessionId) return;

    const handleChatMessage = (message) => {
      if (message.session_id === sessionId) {
        addMessage(message);
      }
    };

    socket.on('chat-message', handleChatMessage);

    sessionAPI.getChat(sessionId)
      .then((history) => setMessages(history))
      .catch(() => {});

    return () => {
      socket.off('chat-message', handleChatMessage);
    };
  }, [sessionId, socket, addMessage, setMessages]);

  const sendMessage = useCallback(
    (content) => {
      const tempId = `temp-${++tempIdCounter.current}`;
      const role = localStorage.getItem('role');
      const name = localStorage.getItem('displayName') || 'You';

      addMessage({
        id: tempId,
        session_id: sessionId,
        sender_role: role,
        sender_name: name,
        type: 'text',
        content,
        created_at: new Date().toISOString(),
        pending: true,
      });

      if (socket?.connected) {
        socket.emit('send-chat', { sessionId, message: content }, (error, response) => {
          if (error || response?.ok === false) {
            showError('Failed to send message');
          }
        });
      }
    },
    [sessionId, socket, addMessage, showError]
  );

  const shareFile = useCallback(
    async (file) => {
      const tempId = `temp-${++tempIdCounter.current}`;
      const role = localStorage.getItem('role');
      const name = localStorage.getItem('displayName') || 'You';

      addMessage({
        id: tempId,
        session_id: sessionId,
        sender_role: role,
        sender_name: name,
        type: 'file',
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: null,
        created_at: new Date().toISOString(),
        pending: true,
      });

      try {
        const signed = await sessionAPI.getFileSignedUrl(sessionId, {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });

        const uploadRes = await fetch(signed.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadRes.ok) {
          throw new Error('Upload failed');
        }

        if (socket?.connected) {
          socket.emit(
            'share-file',
            {
              sessionId,
              fileName: file.name,
              fileUrl: signed.publicUrl,
              fileSize: file.size,
              fileType: file.type,
            },
            (error, response) => {
              if (error || response?.ok === false) {
                showError('Failed to share file');
              }
            }
          );
        }
      } catch (err) {
        showError('Failed to upload file');
      }
    },
    [sessionId, socket, addMessage, showError]
  );

  return {
    messages: messages.filter((m) => m.session_id === sessionId),
    sendMessage,
    shareFile,
  };
}