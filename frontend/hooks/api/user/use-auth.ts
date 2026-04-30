/**
 * TanStack Query hooks for Auth API.
 *
 * These hooks use `useMutation` since auth endpoints are POST (side-effects).
 * For SSR, call the API functions directly in Server Components
 * and pass the data as props — these hooks are for client-side mutations only.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp, updateBasicInfo, changePassword } from "@lib/api/auth";
import { AuthResponse, SignUpResponse } from "@types";
import { ApiError } from "@lib/api";
import type {
  SignInFormValues,
  SignUpFormValues,
  ChangePasswordFormValues,
} from "@lib/validations/auth";

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

// ─── Update Basic Info Mutation ──────────────────────────────────────────

export function useUpdateBasicInfo(userId: number | string) {
  return useMutation<
    { message: string; user_id: number },
    ApiError,
    SignUpFormValues
  >({
    mutationFn: (data) => updateBasicInfo(Number(userId), data),
    mutationKey: ["auth", "update-basic", userId],
  });
}

// ─── Change Password Mutation ────────────────────────────────────────────

export function useChangePassword() {
  return useMutation<{ message: string }, ApiError, ChangePasswordFormValues>({
    mutationFn: (data) => changePassword(data),
    mutationKey: ["auth", "change-password"],
  });
}
