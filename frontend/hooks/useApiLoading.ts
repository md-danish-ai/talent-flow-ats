"use client";

import { useState, useEffect } from "react";
import { apiLoadingState } from "@lib/api/loading-state";

/**
 * Hook to use the global API loading state in React components.
 * Must be used in Client Components.
 */
export function useIsApiLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return apiLoadingState.subscribe(setIsLoading);
  }, []);

  return isLoading;
}
