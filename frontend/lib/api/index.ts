/**
 * Common API helper — use this everywhere in the project.
 *
 * @example
 *   import { api, ApiError } from "@lib/api";
 *
 *   // GET request
 *   const user = await api.get<User>("/users/me");
 *
 *   // POST request
 *   const token = await api.post<AuthResponse>("/auth/signin", { email, password });
 *
 *   // SSR — forward cookies from next/headers
 *   const cookieStore = await cookies();
 *   const data = await api.get<T>("/secure", { cookies: cookieStore.toString() });
 */

import { apiClient, ApiError } from "./client";
import type { ApiRequestOptions } from "./client";

type BaseOptions = Omit<ApiRequestOptions, "method" | "body">;

export const api = {
  /** GET /endpoint */
  get<T>(endpoint: string, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "GET" });
  },

  /** POST /endpoint with body */
  post<T>(endpoint: string, body?: unknown, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "POST", body });
  },

  /** PUT /endpoint with body */
  put<T>(endpoint: string, body?: unknown, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "PUT", body });
  },

  /** PATCH /endpoint with partial body */
  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: BaseOptions,
  ): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "PATCH", body });
  },

  /** DELETE /endpoint */
  delete<T>(endpoint: string, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "DELETE" });
  },
};

// Re-export error class and types so consumers only need one import
export { ApiError };
export type { ApiRequestOptions };
