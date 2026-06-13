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

  showSuccess: (message, details = null) => get().addToast({ type: 'success', message, details }),

  showError: (message, details = null) => get().addToast({ type: 'error', message, details, duration: 0 }),

  showWarning: (message, details = null) => get().addToast({ type: 'warning', message, details }),

  showInfo: (message, details = null) => get().addToast({ type: 'info', message, details }),
}));

export function getErrorDetails(error) {
  if (!error) return null;
  if (typeof error === 'string') return error;

  const parts = [
    error.code ? `Code: ${error.code}` : null,
    error.message ? `Message: ${error.message}` : null,
    error.details ? `Details: ${JSON.stringify(error.details, null, 2)}` : null,
    error.stack ? `Stack:\n${error.stack}` : null,
  ].filter(Boolean);

  return parts.join('\n\n') || String(error);
}
