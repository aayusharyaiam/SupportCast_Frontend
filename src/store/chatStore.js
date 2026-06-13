import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set((state) => ({
    messages: upsertMessage(state.messages, message),
  })),

  addOptimisticMessage: (tempId, message) => set((state) => ({
    messages: [...state.messages, { ...message, id: tempId, pending: true }],
  })),

  confirmMessage: (tempId, confirmedMessage) => set((state) => ({
    messages: state.messages.map((m) =>
      m.id === tempId ? { ...confirmedMessage, id: tempId } : m
    ),
  })),

  updateMessageStatus: (id, updates) => set((state) => ({
    messages: state.messages.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    ),
  })),

  clearMessages: () => set({ messages: [] }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getMessagesBySession: (sessionId) => {
    return get().messages.filter((m) => m.session_id === sessionId);
  },
}));

function upsertMessage(messages, message) {
  if (!message) return messages;

  const existingIndex = messages.findIndex((m) => m.id === message.id);
  if (existingIndex >= 0) {
    return messages.map((m, index) => (index === existingIndex ? { ...m, ...message } : m));
  }

  const optimisticIndex = messages.findIndex((m) => {
    if (!m.pending || m.session_id !== message.session_id || m.type !== message.type) {
      return false;
    }

    if (m.sender_role !== message.sender_role) {
      return false;
    }

    if (message.type === 'file') {
      return m.file_name === message.file_name && m.file_size === message.file_size;
    }

    return m.content === message.content;
  });

  if (optimisticIndex >= 0) {
    return messages.map((m, index) => (index === optimisticIndex ? message : m));
  }

  return [...messages, message];
}
