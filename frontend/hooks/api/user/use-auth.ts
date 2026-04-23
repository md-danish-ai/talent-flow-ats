/**
 * TanStack Query hooks for Auth API.
 *
 * These hooks use `useMutation` since auth endpoints are POST (side-effects).
 * For SSR, call the API functions directly in Server Components
 * and pass the data as props — these hooks are for client-side mutations only.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp, updateBasicInfo } from "@lib/api/auth";
import { AuthResponse, SignUpResponse, IApiError } from "@types";
import type { SignInFormValues, SignUpFormValues } from "@lib/validations/auth";

// ─── Sign Up Mutation ────────────────────────────────────────────────────

export function useSignUp() {
  return useMutation<SignUpResponse, IApiError, SignUpFormValues>({
    mutationFn: (data) => signUp(data),
    mutationKey: ["auth", "signup"],
  });
}

// ─── Sign In Mutation ────────────────────────────────────────────────────

export function useSignIn() {
  return useMutation<AuthResponse, IApiError, SignInFormValues>({
    mutationFn: (data) => signIn(data),
    mutationKey: ["auth", "signin"],
  });
}

// ─── Update Basic Info Mutation ──────────────────────────────────────────

export function useUpdateBasicInfo(userId: number | string) {
  return useMutation<
    { message: string; user_id: number },
    IApiError,
    SignUpFormValues
  >({
    mutationFn: (data) => updateBasicInfo(Number(userId), data),
    mutationKey: ["auth", "update-basic", userId],
  });
}
