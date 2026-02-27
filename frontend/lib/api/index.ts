// Common API helper used throughout the project
import { apiClient, ApiError } from "./client";
import type { ApiRequestOptions } from "./client";

type BaseOptions = Omit<ApiRequestOptions, "method" | "body">;

export const api = {
  // GET /endpoint
  get<T>(endpoint: string, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "GET" });
  },

  // POST /endpoint with body
  post<T>(endpoint: string, body?: unknown, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "POST", body });
  },

  // PUT /endpoint with body
  put<T>(endpoint: string, body?: unknown, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "PUT", body });
  },

  // PATCH /endpoint with partial body
  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: BaseOptions,
  ): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "PATCH", body });
  },

  // DELETE /endpoint
  delete<T>(endpoint: string, options?: BaseOptions): Promise<T> {
    return apiClient<T>(endpoint, { ...options, method: "DELETE" });
  },
};

// Re-export error class and types
export { ApiError };
export type { ApiRequestOptions };

export * from "./questions";
export * from "./classifications";
