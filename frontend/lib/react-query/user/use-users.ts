/**
 * TanStack Query hooks for Users API.
 *
 * - `useGetUserByEmail`  — SSR-friendly query (prefetch in Server Components)
 * - `useCreateUser`      — Client-side mutation
 *
 * SSR Pattern:
 *   In Server Component:
 *     const queryClient = new QueryClient()
 *     await queryClient.prefetchQuery({ queryKey: userKeys.byEmail(email), queryFn: ... })
 *     return <HydrationBoundary state={dehydrate(queryClient)}><ClientComp /></HydrationBoundary>
 *
 *   In Client Component:
 *     const { data } = useGetUserByEmail(email)  // picks up prefetched data automatically
 */

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser, getUserByEmail } from "@lib/api/users";
import type { User, CreateUserPayload } from "@lib/api/users";
import type { ApiError } from "@lib/api/client";

// ─── Query Keys ──────────────────────────────────────────────────────────

export const userKeys = {
  all: ["users"] as const,
  byEmail: (email: string) => ["users", "byEmail", email] as const,
};

// ─── Get User By Email (SSR-friendly) ────────────────────────────────────

export function useGetUserByEmail(email: string, enabled = true) {
  return useQuery<User, ApiError>({
    queryKey: userKeys.byEmail(email),
    queryFn: () => getUserByEmail(email),
    enabled: enabled && !!email,
  });
}

// ─── Create User Mutation ────────────────────────────────────────────────

export function useCreateUser() {
  return useMutation<User, ApiError, CreateUserPayload>({
    mutationFn: (data) => createUser(data),
    mutationKey: ["users", "create"],
  });
}
