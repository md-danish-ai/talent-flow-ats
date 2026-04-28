import { BASE_URL } from "@lib/api/client";

/**
 * Standardizes image URLs by prepending the backend BASE_URL if the path is relative,
 * and ensuring localhost/127.0.0.1 URLs are redirected to the current configured BASE_URL.
 */
export const getCanonicalImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // If it's already an absolute URL (http/https)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Special case: if the URL points to localhost/127.0.0.1, it might be from a different environment
    // We redirect it to the currently configured BASE_URL for consistency
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
    if (!isLocal) return url;

    const imagePath = url.split("/images/")[1];
    if (imagePath) {
      const base = (BASE_URL || "").replace(/\/$/, "");
      return `${base}/images/${imagePath}`;
    }
    return url;
  }

  // Handle data URIs or blobs as-is
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  const base = (BASE_URL || "").replace(/\/$/, "");
  
  // If the URL already contains the /images/ path
  if (url.includes("/images/")) {
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  }

  // Default: assume it's just a filename or a path that needs /images/ prefix
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  return `${base}/images/${cleanUrl}`;
};
