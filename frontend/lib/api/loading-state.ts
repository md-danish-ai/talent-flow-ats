type LoadingListener = (isLoading: boolean) => void;

/**
 * A vanilla JS state manager to track active API requests globally.
 * This file does NOT use "use client" so it can be safely imported
 * in both Server and Client components.
 */
class LoadingStateManager {
  private activeRequests = 0;
  private listeners: Set<LoadingListener> = new Set();

  /** Increment active request count */
  startRequest() {
    this.activeRequests++;
    this.notify();
  }

  /** Decrement active request count */
  stopRequest() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.notify();
  }

  /** Subscribe to loading state changes (Client-side only) */
  subscribe(listener: LoadingListener) {
    this.listeners.add(listener);
    // Initial notification
    listener(this.activeRequests > 0);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const isLoading = this.activeRequests > 0;
    this.listeners.forEach((l) => l(isLoading));
  }
}

export const apiLoadingState = new LoadingStateManager();
