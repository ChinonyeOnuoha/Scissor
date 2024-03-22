//ErrorBoundary.tsx
import React, { ErrorInfo } from 'react';
import { Link } from 'react-router-dom';
import './errorBoundary.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='page-not-found container'>
          <h1>Something went wrong</h1>
          <p>It's not you, it's us. We're having some trouble on our end, but rest assured, our team is working hard to fix it </p>
          <Link to="/">Go to the home page</Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
