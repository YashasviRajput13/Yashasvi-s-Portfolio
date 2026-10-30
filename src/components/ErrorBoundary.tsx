import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[Portfolio ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FFF8F0] text-[#4A4047] p-6 text-center z-50">
          <h1 className="text-2xl font-bold mb-2">Yashasvi — 3D Interactive Portfolio</h1>
          <p className="text-sm text-[#6E626A] mb-4">
            A 3D scene resource encountered an issue while loading.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full bg-[#F9D5E5] text-[#8B3A5E] text-sm font-semibold cursor-pointer"
          >
            Reload Experience
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function installLoaderTimeoutWatchdog(timeoutMs = 4000): () => void {
  const timer = window.setTimeout(() => {
    const loader = document.querySelector<HTMLElement>('.loader-container');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
    }
    const canvasPin = document.getElementById('canvas-pin');
    if (canvasPin && canvasPin.classList.contains('hidden')) {
      canvasPin.classList.remove('hidden');
    }
  }, timeoutMs);

  return () => window.clearTimeout(timer);
}
