import { BASE_URL } from "../api/client";

/**
 * Ensures an image URL is properly prefixed with the backend base URL if it's a relative path.
 *
 * @param url The image URL string (e.g. "/images/abc.png" or "http://example.com/img.png")
 * @returns The absolute image URL
 */
export function getFullImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // If it's already an absolute URL (starts with http or https), return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it starts with /images/, prepend the backend base URL
  if (url.startsWith("/images/")) {
    // Ensure no double slashes if BASE_URL ends with a slash (though our client.ts doesn't)
    const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${base}${url}`;
  }

  // Fallback for other relative paths if any
  if (url.startsWith("/")) {
    const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${base}${url}`;
  }

  return url;
}
