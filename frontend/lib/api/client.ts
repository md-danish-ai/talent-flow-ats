/**
 * Base API client for making HTTP requests to the backend.
 * Works in both Server Components (SSR) and Client Components.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: ApiMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Pass cookies string for SSR requests (from next/headers) */
  cookies?: string;
  /** Custom cache / revalidate options for Next.js fetch */
  next?: NextFetchRequestConfig;
}

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  /** FastAPI returns `detail` as a string (HTTPException) or array (Pydantic validation) */
  detail?: string | ValidationError[];
  statusCode?: number;
}

function extractDetail(
  detail?: string | ValidationError[],
): string | undefined {
  if (!detail) return undefined;
  if (typeof detail === "string") return detail;
  // Pydantic validation errors — join all messages
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((e) => e.msg).join(". ");
  }
  return undefined;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse;

  constructor(status: number, data: ApiErrorResponse) {
    super(
      extractDetail(data.detail) ??
        data.message ??
        data.error ??
        `API Error: ${status}`,
    );
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Core fetch wrapper. Automatically:
 *  - Prepends the base URL
 *  - Sets JSON content-type for POST/PUT/PATCH
 *  - Parses JSON responses
 *  - Throws `ApiError` for non-2xx responses
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers: customHeaders = {},
    cookies,
    next: nextOptions,
  } = options;

  const headers: Record<string, string> = {
    ...customHeaders,
  };

  // Set content-type for requests with body
  if (body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Forward cookies for SSR requests
  if (cookies) {
    headers["Cookie"] = cookies;
  }

  const url = `${BASE_URL}${endpoint}`;

  const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(nextOptions ? { next: nextOptions } : {}),
  };

  const response = await fetch(url, fetchOptions);

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data as ApiErrorResponse);
  }

  return data as T;
}
