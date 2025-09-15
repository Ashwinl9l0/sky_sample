import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error in component tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if passed
      return (
        this.props.fallback || (
          <div>
            <h1>Something went wrong</h1>
            <p>Please refresh the page or try again later.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
