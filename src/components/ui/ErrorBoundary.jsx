import { Component } from 'react';
import { getErrorDetails, useUiStore } from '../../store/uiStore';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    useUiStore.getState().showError(
      'A screen failed to render',
      [getErrorDetails(error), errorInfo?.componentStack].filter(Boolean).join('\n\n')
    );
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-error/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-status-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h1>
            <p className="text-text-secondary mb-6">
              We encountered an unexpected error. Please try again.
            </p>
            <details className="mb-6 rounded-lg border border-white/[0.08] bg-black/20 text-left">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-200">
                Error details
              </summary>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words px-3 pb-3 text-xs text-gray-400">
                {[getErrorDetails(this.state.error), this.state.errorInfo?.componentStack].filter(Boolean).join('\n\n')}
              </pre>
            </details>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
