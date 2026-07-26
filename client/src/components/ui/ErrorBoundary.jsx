import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center text-text">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl font-heading mb-4">Something went wrong.</h1>
          <p className="text-text/70 font-body mb-8 max-w-md mx-auto">
            An unexpected error occurred. We've logged the issue. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-text font-accent uppercase tracking-widest text-sm rounded hover:bg-secondary transition-colors"
          >
            Refresh Page
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 text-left bg-surface p-4 rounded border border-text/20 w-full max-w-3xl overflow-auto text-xs text-red-400 font-mono">
              <p className="font-bold mb-2">{this.state.error?.toString()}</p>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
