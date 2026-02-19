/**
 * Auth API service — handles all authentication-related API calls.
 *
 * Endpoints:
 *  POST /auth/signup   → Register a new user
 *  POST /auth/signin   → Authenticate an existing user
 */

import { apiClient, type ApiRequestOptions } from "./client";
import type {
  SignInFormValues,
  SignUpFormValues,
} from "@/lib/validations/auth";

// ─── Response Types ──────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email?: string;
    mobile: string;
    role: string;
  };
}

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email?: string;
    mobile: string;
  };
}

// ─── API Methods ─────────────────────────────────────────────────────────

/**
 * POST /auth/signup
 * Register a new user account.
 */
export async function signUp(
  data: SignUpFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<SignUpResponse> {
  return apiClient<SignUpResponse>("/auth/signup", {
    method: "POST",
    body: data,
    ...options,
  });
}

/**
 * POST /auth/signin
 * Authenticate a user and receive a token.
 */
export async function signIn(
  data: SignInFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/signin", {
    method: "POST",
    body: data,
    ...options,
  });
}
