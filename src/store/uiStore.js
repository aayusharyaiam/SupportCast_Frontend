import { create } from 'zustand';

let toastId = 0;

export const useUiStore = create((set, get) => ({
  isSidebarOpen: true,
  activeModal: null,
  modalData: null,
  toasts: [],
  isConnecting: false,
  connectionError: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  addToast: (toast) => {
    const id = ++toastId;
    const newToast = { id, ...toast };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (toast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration || 4000);
    }

    return id;
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),

  clearToasts: () => set({ toasts: [] }),

  setIsConnecting: (isConnecting) => set({ isConnecting }),

  setConnectionError: (error) => set({ connectionError: error }),

  showSuccess: (message) => get().addToast({ type: 'success', message }),

  showError: (message) => get().addToast({ type: 'error', message }),

  showWarning: (message) => get().addToast({ type: 'warning', message }),

  showInfo: (message) => get().addToast({ type: 'info', message }),
}));