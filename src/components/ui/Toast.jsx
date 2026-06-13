import { useUiStore } from '../../store/uiStore';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-status-live/20 border-status-live text-status-live',
  error: 'bg-status-error/20 border-status-error text-status-error',
  warning: 'bg-status-warning/20 border-status-warning text-status-warning',
  info: 'bg-primary-500/20 border-primary-500 text-primary-500',
};

export default function ToastContainer() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;

        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 p-4
              rounded-lg border
              shadow-lg
              animate-fade-in
              ${styles[toast.type]}
            `}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}