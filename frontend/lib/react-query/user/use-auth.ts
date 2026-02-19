/**
 * TanStack Query hooks for Auth API.
 *
 * These hooks use `useMutation` since auth endpoints are POST (side-effects).
 * For SSR, call the API functions directly in Server Components
 * and pass the data as props — these hooks are for client-side mutations only.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/lib/api/auth";
import type { AuthResponse, SignUpResponse } from "@/lib/api/auth";
import type {
  SignInFormValues,
  SignUpFormValues,
} from "@/lib/validations/auth";
import type { ApiError } from "@/lib/api/client";

// ─── Sign Up Mutation ────────────────────────────────────────────────────

export function useSignUp() {
  return useMutation<SignUpResponse, ApiError, SignUpFormValues>({
    mutationFn: (data) => signUp(data),
    mutationKey: ["auth", "signup"],
  });
}

// ─── Sign In Mutation ────────────────────────────────────────────────────

export function useSignIn() {
  return useMutation<AuthResponse, ApiError, SignInFormValues>({
    mutationFn: (data) => signIn(data),
    mutationKey: ["auth", "signin"],
  });
}
