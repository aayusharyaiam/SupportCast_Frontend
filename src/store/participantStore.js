import { create } from 'zustand';

export const useParticipantStore = create((set, get) => ({
  participants: {},
  localParticipant: null,
  remoteParticipant: null,

  setParticipants: (participants) => {
    const participantsMap = {};
    participants.forEach((p) => {
      participantsMap[p.id] = p;
    });
    set({ participants: participantsMap });
  },

  addParticipant: (participant) => set((state) => ({
    participants: { ...state.participants, [participant.id]: participant },
  })),

  removeParticipant: (participantId) => set((state) => {
    const { [participantId]: _removed, ...rest } = state.participants;
    return { participants: rest };
  }),

  updateParticipant: (participantId, updates) => set((state) => ({
    participants: {
      ...state.participants,
      [participantId]: { ...state.participants[participantId], ...updates },
    },
  })),

  setLocalParticipant: (participant) => set({ localParticipant: participant }),

  setRemoteParticipant: (participant) => set({ remoteParticipant: participant }),

  clearRemoteParticipant: () => set({ remoteParticipant: null }),

  clearAll: () => set({ participants: {}, localParticipant: null, remoteParticipant: null }),

  getParticipant: (participantId) => {
    return get().participants[participantId];
  },

  getParticipantCount: () => {
    return Object.keys(get().participants).length;
  },
}));
