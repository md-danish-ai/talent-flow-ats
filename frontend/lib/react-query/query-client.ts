import { QueryClient, type FetchQueryOptions } from "@tanstack/react-query";

/**
 * Shared configuration for TanStack Query.
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
};

/**
 * Create a fresh QueryClient for SSR.
 * Each request gets its own client to avoid cross-request data leaks.
 */
export function createSSRQueryClient() {
  return new QueryClient(queryClientConfig);
}

/**
 * Prefetch a query on the server. Swallows errors so the page doesn't
 * crash — the client hook will retry automatically if needed.
 */
export async function prefetchQuery<T>(
  queryClient: QueryClient,
  options: FetchQueryOptions<T>,
) {
  try {
    await queryClient.prefetchQuery(options);
  } catch (error) {
    console.error("[SSR Prefetch Error]", error);
  }
}
