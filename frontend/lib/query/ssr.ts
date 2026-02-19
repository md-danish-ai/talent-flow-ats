/**
 * SSR utilities for TanStack Query.
 *
 * Use these in Server Components to prefetch data
 * so the client picks it up instantly (no loading state).
 *
 * Usage in a Server Component (page.tsx):
 *
 *   import { createSSRQueryClient, prefetchQuery } from "@/lib/query/ssr";
 *   import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
 *
 *   export default async function Page() {
 *     const queryClient = createSSRQueryClient();
 *
 *     await prefetchQuery(queryClient, {
 *       queryKey: ["users", "byEmail", "user@example.com"],
 *       queryFn: () => getUserByEmail("user@example.com"),
 *     });
 *
 *     return (
 *       <HydrationBoundary state={dehydrate(queryClient)}>
 *         <ClientComponent />
 *       </HydrationBoundary>
 *     );
 *   }
 */

import { QueryClient, type FetchQueryOptions } from "@tanstack/react-query";

/**
 * Create a fresh QueryClient for SSR.
 * Each request gets its own client to avoid cross-request data leaks.
 */
export function createSSRQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute — same as the client provider
        refetchOnWindowFocus: false,
      },
    },
  });
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
