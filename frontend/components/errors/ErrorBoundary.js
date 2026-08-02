'use client';

import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Prevents entire app from crashing due to component errors
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Store error info for display
    this.setState({ errorInfo });
    
    // Send to error monitoring service (e.g., Sentry)
    if (typeof window !== 'undefined') {
      // Log to analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.toString(),
          fatal: true
        });
      }
      
      // Send to Sentry if available
      if (window.Sentry) {
        window.Sentry.captureException(error, { 
          extra: errorInfo,
          tags: {
            component: errorInfo.componentStack
          }
        });
      }
    }
  }
  
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };
  
  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          background: '#f9fafb'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            {/* Error Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px'
            }}>
              ⚠️
            </div>
            
            {/* Error Title */}
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1a1a1a',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Oops! Something went wrong
            </h2>
            
            {/* Error Description */}
            <p style={{ 
              fontSize: '16px',
              color: '#6b7280', 
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              We're sorry for the inconvenience. Our team has been automatically notified and we're working to fix the issue.
            </p>
            
            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '24px',
                textAlign: 'left',
                background: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#374151'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Error Details (Development Mode)
                </summary>
                <pre style={{ 
                  overflow: 'auto',
                  fontSize: '12px',
                  lineHeight: '1.5'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: '#e63946',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#d62839'}
                onMouseOut={(e) => e.target.style.background = '#e63946'}
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
