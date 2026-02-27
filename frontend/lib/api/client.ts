// Base API client for making HTTP requests to the backend
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: ApiMethod;
  body?: unknown;
  headers?: Record<string, string>;
  // Pass cookies string for SSR requests (from next/headers)
  cookies?: string;
  // Custom cache / revalidate options for Next.js fetch
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
  // FastAPI returns `detail` as a string or array
  detail?: string | ValidationError[];
  statusCode?: number;
}

function extractDetail(
  detail?: string | ValidationError[],
): string | undefined {
  if (!detail) return undefined;
  if (typeof detail === "string") return detail;
  // Pydantic validation errors - join all messages
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

// Core fetch wrapper for prepending base URL, setting JSON headers, and parsing responses
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

  // Automatically attach Authorization header if auth_token exists in cookies
  let token: string | undefined;
  const cookieSource =
    cookies || (typeof document !== "undefined" ? document.cookie : "");

  if (cookieSource) {
    const authRow = cookieSource
      .split(";")
      .find((row) => row.trim().startsWith("auth_token="));
    if (authRow) {
      let val = authRow.trim().split("=").slice(1).join("=").trim();
      // Remove wrapping quotes
      val = val.replace(/^["%22]+|["%22]+$/g, "");

      if (val && val !== "undefined" && val !== "null") {
        token = val;
      }
    }
  }

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
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

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof document !== "undefined") {
      // Clear all auth cookies on 401 Unauthorized
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie =
        "user_info=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

      // Redirect to sign-in page
      window.location.href = "/sign-in";
    }
    throw new ApiError(response.status, result as ApiErrorResponse);
  }

  // Handle standard backend wrapper: { status, message, data }
  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    "status" in result
  ) {
    return result.data as T;
  }

  return result as T;
}
