"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { logger } from "@/utils/logger";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("React Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4 rounded-md border border-border bg-surface p-8 text-center text-text shadow-sm">
          <AlertCircle className="h-10 w-10 text-danger" />
          <div>
            <h2 className="text-lg font-medium">Something went wrong</h2>
            <p className="text-sm text-text-subtle">
              An unexpected error occurred in this component.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
