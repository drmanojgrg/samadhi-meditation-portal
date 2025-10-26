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
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('🚨 React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-white text-2xl font-bold mb-4">
              Meditation Portal Error
            </h2>
            <p className="text-gray-300 mb-6">
              Something went wrong while loading the meditation portal. 
              The universe is temporarily misaligned.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              🔄 Realign Consciousness
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-white">
                  Debug Info (Dev Mode)
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 rounded text-xs text-red-300 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;