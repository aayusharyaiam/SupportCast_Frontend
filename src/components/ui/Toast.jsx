import { useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

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
  const [detailsToast, setDetailsToast] = useState(null);

  if (toasts.length === 0 && !detailsToast) return null;

  return (
    <>
      {toasts.length > 0 && (
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
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{toast.message}</p>
                  {toast.details && (
                    <button
                      type="button"
                      onClick={() => setDetailsToast(toast)}
                      className="mt-2 text-xs font-medium text-gray-200 underline underline-offset-2 hover:text-white"
                    >
                      View details
                    </button>
                  )}
                </div>
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
      )}

      <Modal
        isOpen={!!detailsToast}
        onClose={() => setDetailsToast(null)}
        title="Error Details"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setDetailsToast(null)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-text-secondary mb-3">
          {detailsToast?.message}
        </p>
        <details className="rounded-lg border border-white/[0.08] bg-black/20">
          <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-200">
            Technical details
          </summary>
          <pre
            className="max-h-80 overflow-auto whitespace-pre-wrap break-words px-3 pb-3 text-xs text-gray-400"
            aria-label="Technical error details"
          >
            {detailsToast?.details}
          </pre>
        </details>
      </Modal>
    </>
  );
}
