import { toast } from "@lib/toast";
import { ENDPOINTS } from "./endpoints";

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
  // Suppress the automatic success toast for this request (e.g. silent auto-saves)
  silentSuccess?: boolean;
  // Suppress the automatic error toast for this request
  silentError?: boolean;
  // Query parameters for GET/DELETE requests
  params?: Record<string, string | number | boolean | undefined>;
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
    silentSuccess = false,
    silentError = false,
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
      // Grab everything after the first '='
      let val = authRow.trim().substring("auth_token=".length).trim();
      // Remove wrapping double-quotes or URL-encoded quotes (%22)
      val = val.replace(/^"|"$/g, "").replace(/^%22|%22$/g, "");
      // URL-decode the value in case it was encoded
      try {
        val = decodeURIComponent(val);
      } catch {
        /* keep raw val */
      }

      if (val && val !== "undefined" && val !== "null" && val.length > 10) {
        token = val;
      }
    }
  }

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Construct URL with query parameters if present
  let url = `${BASE_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    // When cookies are forwarded (SSR context), always bypass the Next.js
    // fetch data cache so we never serve stale server-side data.
    ...(cookies ? { cache: "no-store" as RequestCache } : {}),
    ...(nextOptions ? { next: nextOptions } : {}),
  };

  const response = await fetch(url, fetchOptions);

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const apiErr = new ApiError(response.status, result as ApiErrorResponse);
    const isAuthRequest =
      endpoint.startsWith(ENDPOINTS.AUTH.SIGN_IN) ||
      endpoint.startsWith(ENDPOINTS.AUTH.SIGN_UP);

    if (
      response.status === 401 &&
      typeof document !== "undefined" &&
      !isAuthRequest
    ) {
      // Clear all auth cookies on 401 Unauthorized
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie =
        "user_info=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

      // Redirect to sign-in page with clear_auth parameter
      window.location.href = "/sign-in?clear_auth=1";
    } else if (!silentError && method !== "GET" && !isAuthRequest) {
      // Auto error toast for all non-GET failures (skip GET to avoid
      // spamming toast on background data fetches)
      toast.error(apiErr.message, { title: `Error ${response.status}` });
    }

    throw apiErr;
  }

  // ── Auto success toast for mutations ──────────────────────────────────────
  // Fire a success toast for all non-GET calls using the backend's message.
  // Suppressed if silentSuccess is set (e.g. per-keystroke auto-saves).
  // Auth endpoints (signin/signup) are handled by the form itself.
  const isAuthEndpoint =
    endpoint.startsWith(ENDPOINTS.AUTH.SIGN_IN) ||
    endpoint.startsWith(ENDPOINTS.AUTH.SIGN_UP);
  if (
    !silentSuccess &&
    method !== "GET" &&
    !isAuthEndpoint &&
    typeof window !== "undefined" &&
    result &&
    typeof result === "object" &&
    "message" in result &&
    typeof result.message === "string"
  ) {
    toast.success(result.message);
  }

  // Handle standard backend wrapper: { status, message, data, pagination? }
  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    "status" in result
  ) {
    if ("pagination" in result && result.pagination) {
      return {
        data: result.data,
        pagination: result.pagination,
      } as T;
    }
    return result.data as T;
  }

  return result as T;
}
