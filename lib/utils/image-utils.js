/**
 * Jaipur Stonecraft — Client & Server Image Variant Helper
 * Lightweight pure utility with zero database or node dependencies.
 */

export function getImageVariantUrl(url, variant = "display") {
  if (!url || typeof url !== "string") return url;
  if (url.includes("/uploads/")) {
    return url.replace(/\/uploads\/([^/]+)\/(raw|display|card|thumb)\//, `/uploads/$1/${variant}/`);
  }
  return url;
}
