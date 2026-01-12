/**
 * Loading State Components
 *
 * Provides consistent loading states across the application with
 * skeleton loaders, loading cards, and data loading indicators.
 *
 * @module components/ui/loading
 */

"use client";

import { Loader2 } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional label for accessibility */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Animated loading spinner with size variants
 */
export function LoadingSpinner({
  size = "md",
  label = "Loading...",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2
        className={cn("animate-spin text-blue-600", sizeClasses[size])}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Props for LoadingCard component
 */
interface LoadingCardProps {
  /** Number of skeleton rows to show */
  rows?: number;
  /** Show header skeleton */
  showHeader?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading skeleton for card content
 */
export function LoadingCard({
  rows = 3,
  showHeader = true,
  className,
}: LoadingCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-slate-50 backdrop-blur-md p-6 animate-pulse",
        className,
      )}
    >
      {showHeader && (
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-slate-100" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 rounded bg-slate-100" />
            <div className="h-3 w-48 rounded bg-slate-50" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-slate-100"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Props for LoadingTransaction component
 */
interface LoadingTransactionProps {
  /** Number of transaction skeletons to show */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading skeleton for transaction list items
 */
export function LoadingTransaction({
  count = 3,
  className,
}: LoadingTransactionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 animate-pulse"
        >
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-slate-100" />
            <div className="h-3 w-56 rounded bg-slate-50" />
          </div>
          <div className="h-6 w-20 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

/**
 * Props for LoadingStats component
 */
interface LoadingStatsProps {
  /** Number of stat cards to show */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading skeleton for stats/metrics grid
 */
export function LoadingStats({ count = 3, className }: LoadingStatsProps) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-slate-50 backdrop-blur-md p-6 animate-pulse"
        >
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="flex items-baseline gap-2">
              <div className="h-8 w-16 rounded bg-slate-100" />
              <div className="h-5 w-5 rounded bg-slate-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Props for LoadingOverlay component
 */
interface LoadingOverlayProps {
  /** Whether to show the overlay */
  isLoading: boolean;
  /** Loading message */
  message?: string;
  /** Children to render behind overlay */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Full-screen loading overlay with blur effect
 */
export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  children,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl z-10">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-slate-500 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Props for DataLoader component
 */
interface DataLoaderProps<T> {
  /** Data to render */
  data: T | null | undefined;
  /** Whether data is loading */
  isLoading: boolean;
  /** Error message if any */
  error?: string | null;
  /** Render function for data */
  children: (data: T) => React.ReactNode;
  /** Loading skeleton component */
  loadingComponent?: React.ReactNode;
  /** Empty state component */
  emptyComponent?: React.ReactNode;
  /** Error state component */
  errorComponent?: React.ReactNode;
}

/**
 * Generic data loader with loading, error, and empty states
 */
export function DataLoader<T>({
  data,
  isLoading,
  error,
  children,
  loadingComponent,
  emptyComponent,
  errorComponent,
}: DataLoaderProps<T>) {
  if (isLoading) {
    return (
      loadingComponent ?? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" label="Loading data..." />
        </div>
      )
    );
  }

  if (error) {
    return (
      errorComponent ?? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-sm text-red-400 font-medium">{error}</p>
          <p className="text-xs text-slate-400 mt-1">Please try again later</p>
        </div>
      )
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      emptyComponent ?? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-gray-500/10 flex items-center justify-center mb-3">
            <span className="text-2xl">📭</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">No data available</p>
        </div>
      )
    );
  }

  return <>{children(data)}</>;
}

/**
 * Props for ButtonLoading component
 */
interface ButtonLoadingProps {
  /** Whether button is in loading state */
  isLoading: boolean;
  /** Loading text to show */
  loadingText?: string;
  /** Default button content */
  children: React.ReactNode;
}

/**
 * Button content with loading state
 */
export function ButtonLoading({
  isLoading,
  loadingText = "Loading...",
  children,
}: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        {loadingText}
      </>
    );
  }
  return <>{children}</>;
}
