/**
 * Jaipur Stonecraft — Centralized Media & Storage Helper
 * 
 * Provides unified media URL resolution for native Hostinger & local filesystem paths.
 * Supports:
 *   - Local filesystem (/uploads/...)
 *   - Static assets (/images/...)
 *   - External CDN / Placeholders (https://...)
 */

/**
 * Checks if a URL is an absolute external HTTP/HTTPS URL
 */
export function isAbsoluteUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Checks if a URL is a local /uploads path
 */
export function isLocalUploadUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("/uploads/") || url.startsWith("uploads/");
}

/**
 * Resolves a media URL to canonical local/web paths
 * 
 * Rules:
 *   1. Absolute URLs (external CDNs, placeholders) -> returned as-is.
 *   2. Local paths -> formatted with leading slash (/uploads/..., /images/...).
 */
export function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") return "";

  // 1. External URLs are preserved untouched
  if (isAbsoluteUrl(url)) {
    return url;
  }

  // 2. Ensure local upload paths have leading slash
  if (url.startsWith("uploads/")) {
    return `/${url}`;
  }

  // 3. Ensure local image paths have leading slash
  if (url.startsWith("images/")) {
    return `/${url}`;
  }

  return url;
}

