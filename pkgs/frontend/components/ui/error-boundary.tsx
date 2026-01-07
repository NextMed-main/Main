/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the whole app.
 * 
 * @module components/ui/error-boundary
 */

"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./button";

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether to show reset button */
  showReset?: boolean;
  /** Title for error message */
  title?: string;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * 
 * @example
 * ```tsx
 * <ErrorBoundary title="Dashboard Error">
 *   <Dashboard />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const {
      children,
      fallback,
      showReset = true,
      title = "Something went wrong",
    } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-md">
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 text-center max-w-md mb-4">
            {error?.message || "An unexpected error occurred. Please try again."}
          </p>
          {showReset && (
            <Button
              onClick={this.handleReset}
              variant="outline"
              className="border-red-500/30 hover:bg-red-500/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      );
    }

    return children;
  }
}

/**
 * Props for AsyncBoundary component
 */
interface AsyncBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Loading component */
  loadingFallback?: ReactNode;
  /** Error component */
  errorFallback?: ReactNode;
  /** Retry callback */
  onRetry?: () => void;
}

/**
 * Combined loading and error boundary for async operations
 * 
 * @example
 * ```tsx
 * <AsyncBoundary isLoading={isLoading} error={error} onRetry={refetch}>
 *   <DataList items={items} />
 * </AsyncBoundary>
 * ```
 */
export function AsyncBoundary({
  children,
  isLoading = false,
  error = null,
  loadingFallback,
  errorFallback,
  onRetry,
}: AsyncBoundaryProps): ReactNode {
  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (error) {
    return (
      errorFallback ?? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <p className="text-sm text-red-400 font-medium mb-2">Error</p>
          <p className="text-sm text-gray-400 text-center max-w-md mb-4">
            {error}
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="border-red-500/30 hover:bg-red-500/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      )
    );
  }

  return <>{children}</>;
}

/**
 * Props for SuspenseFallback component
 */
interface SuspenseFallbackProps {
  /** Message to display */
  message?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default fallback component for React Suspense
 */
export function SuspenseFallback({
  message = "Loading...",
  className,
}: SuspenseFallbackProps): ReactNode {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 ${className}`}
    >
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
