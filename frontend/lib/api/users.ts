/**
 * Users API service — handles all user-related API calls.
 *
 * Endpoints:
 *  POST /users/users/         → Create a new user
 *  GET  /users/users/{email}  → Get user by email
 */

import { apiClient, type ApiRequestOptions } from "./client";

// ─── Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  mobile?: string;
  role?: string;
}

// ─── API Methods ─────────────────────────────────────────────────────────

/**
 * POST /users/users/
 * Create a new user.
 */
export async function createUser(
  data: CreateUserPayload,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<User> {
  return apiClient<User>("/users/users/", {
    method: "POST",
    body: data,
    ...options,
  });
}

/**
 * GET /users/users/{email}
 * Get a user by their email address.
 */
export async function getUserByEmail(
  email: string,
  options?: Pick<ApiRequestOptions, "cookies" | "next">,
): Promise<User> {
  return apiClient<User>(`/users/users/${encodeURIComponent(email)}`, {
    method: "GET",
    ...options,
  });
}
