import { useUiStore } from '../../store/uiStore';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 backdrop-blur-sm',
  error: 'bg-red-500/10 border-red-500/30 text-red-400 backdrop-blur-sm',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400 backdrop-blur-sm',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400 backdrop-blur-sm',
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
            <p className="flex-1 text-sm text-gray-200">{toast.message}</p>
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