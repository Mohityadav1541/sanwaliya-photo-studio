import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#e11d48' }}>Something went wrong.</h1>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                        <h3 style={{ marginTop: 0 }}>Error Details:</h3>
                        <pre style={{ whiteSpace: 'pre-wrap', color: '#dc2626', overflowX: 'auto' }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        {this.state.errorInfo && (
                            <details style={{ marginTop: '10px' }}>
                                <summary>Stack Trace</summary>
                                <pre style={{ fontSize: '12px', marginTop: '10px' }}>
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '8px 16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
