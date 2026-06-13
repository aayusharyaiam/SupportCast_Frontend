import { useEffect, useRef } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      <div
        ref={modalRef}
        className={`
          relative w-full ${sizes[size]}
          bg-bg-surface rounded-xl
          shadow-2xl
          animate-fade-in
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-bg-elevated">
          <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-bg-elevated">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}