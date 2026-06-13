import { useEffect } from 'react';
import { getErrorDetails, useUiStore } from '../../store/uiStore';

export default function GlobalErrorHandlers() {
  const showError = useUiStore((state) => state.showError);

  useEffect(() => {
    const handleError = (event) => {
      const error = event.error || event.message;
      showError('Unexpected app error', getErrorDetails(error));
    };

    const handleRejection = (event) => {
      showError('Unexpected async error', getErrorDetails(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [showError]);

  return null;
}
