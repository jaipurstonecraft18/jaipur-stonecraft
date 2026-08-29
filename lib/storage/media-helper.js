/**
 * Jaipur Stonecraft — Centralized Media & Storage Helper
 * 
 * Provides unified, provider-agnostic media URL resolution and translation.
 * Supports seamless hybrid delivery:
 *   - Local filesystem (/uploads/...)
 *   - Backblaze B2 Cloud Media (B2_PUBLIC_URL/production/...)
 *   - External CDN / Placeholders (https://...)
 */

import { getPublicUrl as getB2PublicUrl } from "./b2-client.js";

/**
 * Checks if a URL is an absolute external HTTP/HTTPS URL
 */
export function isAbsoluteUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Checks if a URL points to Backblaze B2
 */
export function isB2Url(url) {
  if (!url || typeof url !== "string") return false;
  return url.includes("backblazeb2.com") || (process.env.B2_PUBLIC_URL && url.startsWith(process.env.B2_PUBLIC_URL));
}

/**
 * Checks if a URL is a local /uploads path
 */
export function isLocalUploadUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("/uploads/") || url.startsWith("uploads/");
}

/**
 * Converts a local /uploads/... path to its deterministic B2 public URL
 */
export function toB2Url(localPath) {
  if (!localPath || typeof localPath !== "string") return "";
  if (isAbsoluteUrl(localPath)) return localPath;

  const cleanPath = localPath.replace(/^\/?uploads\/?/, "");
  const b2Key = `production/${cleanPath}`;

  return getB2PublicUrl(b2Key);
}

/**
 * Converts a B2 URL back to its canonical local /uploads/... path
 */
export function toLocalUploadUrl(b2UrlOrKey) {
  if (!b2UrlOrKey || typeof b2UrlOrKey !== "string") return "";
  
  if (b2UrlOrKey.startsWith("/uploads/")) return b2UrlOrKey;
  if (b2UrlOrKey.startsWith("uploads/")) return `/${b2UrlOrKey}`;

  // If it contains /production/, extract the subpath
  const prodMatch = b2UrlOrKey.match(/production\/(.+)$/);
  if (prodMatch) {
    return `/uploads/${prodMatch[1]}`;
  }

  return b2UrlOrKey;
}

/**
 * Resolves a media URL according to application delivery configuration
 * 
 * Rules:
 *   1. Absolute URLs (placehold.co, external CDNs) -> returned as-is.
 *   2. If delivery mode is B2 (USE_B2_MEDIA="true" or options.preferB2=true) -> returns B2 URL.
 *   3. Default / Fallback -> returns canonical local path (/uploads/...).
 */
export function resolveMediaUrl(url, options = {}) {
  if (!url || typeof url !== "string") return "";

  // 1. External URLs are preserved untouched
  if (isAbsoluteUrl(url)) {
    return url;
  }

  // 2. Determine if B2 delivery is preferred
  const preferB2 = options.preferB2 === true || process.env.USE_B2_MEDIA === "true";

  if (preferB2 && isLocalUploadUrl(url)) {
    return toB2Url(url);
  }

  // 3. Ensure local paths have leading slash
  if (url.startsWith("uploads/")) {
    return `/${url}`;
  }

  return url;
}
