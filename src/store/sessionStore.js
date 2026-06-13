import { create } from 'zustand';

export const useSessionStore = create((set, get) => ({
  session: null,
  sessions: [],
  isLoading: false,
  error: null,
  recordingStatus: null,
  recordingUrl: null,

  setSession: (session) => set({ session }),

  clearSession: () => set({ session: null, recordingStatus: null, recordingUrl: null }),

  setSessions: (sessions) => set({ sessions }),

  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions],
  })),

  updateSession: (id, updates) => set((state) => ({
    sessions: state.sessions.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    ),
    session: state.session?.id === id
      ? { ...state.session, ...updates }
      : state.session,
  })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setRecordingStatus: (recordingStatus) => set({ recordingStatus }),

  setRecordingUrl: (recordingUrl) => set({ recordingUrl }),

  getSessionById: (id) => {
    const { sessions, session } = get();
    if (session?.id === id) return session;
    return sessions.find((s) => s.id === id);
  },
}));