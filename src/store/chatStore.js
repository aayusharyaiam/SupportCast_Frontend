import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
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