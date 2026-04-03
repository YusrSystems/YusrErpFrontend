import React from "react";
import ErrorFallback from "./errorFallback";

interface ErrorBoundaryProps
{
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState
{
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState>
{
  constructor(props: ErrorBoundaryProps)
  {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState
  {
    return { hasError: true, error };
  }

  handleReset = () =>
  {
    this.setState({ hasError: false, error: null });
  };

  render()
  {
    if (this.state.hasError)
    {
      return (this.props.fallback || <ErrorFallback reset={ this.handleReset } />);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
