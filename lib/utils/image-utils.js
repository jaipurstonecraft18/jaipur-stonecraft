/**
 * Jaipur Stonecraft — Client & Server Image Variant & Optimization Helper
 * Lightweight pure utility with zero database or node dependencies.
 */

export function getImageVariantUrl(url, variant = "display") {
  if (!url || typeof url !== "string") return url;
  if (url.includes("/uploads/")) {
    return url.replace(/\/uploads\/([^/]+)\/(raw|display|card|thumb)\//, `/uploads/$1/${variant}/`);
  }
  // If it's a static image under /images/ with .jpg, .jpeg, or .png, point to its optimized .webp equivalent
  if (url.startsWith("/images/") && /\.(jpg|jpeg|png)$/i.test(url)) {
    return url.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  }
  return url;
}

export const getOptimizedImageUrl = getImageVariantUrl;
