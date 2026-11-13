import { cache } from "react";
import { getAllProducts } from "./products.js";

/**
 * Filter verified published marble products for dedicated SEO landing pages.
 * 
 * Strict business & taxonomy rules:
 * 1. Product must have status === 'published'.
 * 2. Primary material must be verified Natural Marble (category === 'Marble' in materials taxonomy).
 *    Resin, Granite, Sandstone, Limestone, and Onyx are strictly excluded.
 * 3. Authoritative deity classification is determined EXCLUSIVELY by the Admin-assigned category in the DB.
 *    Product name, slug, title, description, or image must NOT determine eligibility.
 * 4. All marble varieties and colors qualify (e.g. Makrana Pure White, Black Bhainslana, Super White Vietnam, Sangemarmar).
 */
export const getVerifiedMarbleProducts = cache(async function getVerifiedMarbleProducts(filterFn, limit) {
  try {
    const all = await getAllProducts();
    const filtered = all.filter((p) => {
      // 1. Must be published
      if (p.status !== "published") return false;

      // 2. Strict material classification: primaryMaterial must exist and have category === 'Marble'
      if (!p.primaryMaterial || typeof p.primaryMaterial.category !== "string") {
        return false;
      }
      if (p.primaryMaterial.category.toLowerCase() !== "marble") {
        return false;
      }

      // 3. Custom filter for specific page/deity
      return filterFn ? filterFn(p) : true;
    });

    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  } catch (error) {
    console.error("[getVerifiedMarbleProducts Error]:", error);
    return [];
  }
});

/**
 * Helper to match product's Admin-assigned category
 */
function matchesAdminCategory(product, targetCategorySlug) {
  return (
    product.parentCategory === targetCategorySlug ||
    product.primaryCategorySlug === targetCategorySlug
  );
}

/**
 * Marble Statues Parent Hub: All verified published marble deity statues and sculptures
 * (Excludes architectural elements like jali screens)
 */
export const getMarbleHubProducts = cache(async function getMarbleHubProducts(limit = 24) {
  return getVerifiedMarbleProducts((p) => {
    return (
      p.parentCollection === "sculptures-statues" ||
      p.productType === "sculpture" ||
      p.productType === "statue" ||
      p.productType === "idol" ||
      p.parentSubcategory === "deity-statues" ||
      p.parentSubcategory === "hindu-sculptures"
    );
  }, limit);
});

/**
 * Marble Ganesh Statues: Strictly products with Admin category 'ganesh-ji'
 */
export const getMarbleGaneshProducts = cache(async function getMarbleGaneshProducts(limit = 12) {
  return getVerifiedMarbleProducts((p) => {
    return matchesAdminCategory(p, "ganesh-ji");
  }, limit);
});

/**
 * Marble Radha Krishna Statues: Strictly products with Admin category 'radha-krishna'
 * (Deity classification is based strictly on Admin category, not name or slug)
 */
export const getMarbleRadhaKrishnaProducts = cache(async function getMarbleRadhaKrishnaProducts(limit = 12) {
  return getVerifiedMarbleProducts((p) => {
    return matchesAdminCategory(p, "radha-krishna");
  }, limit);
});

/**
 * Marble Shiva Statues: Strictly products with Admin category 'shiva-ji'
 */
export const getMarbleShivaProducts = cache(async function getMarbleShivaProducts(limit = 12) {
  return getVerifiedMarbleProducts((p) => {
    return matchesAdminCategory(p, "shiva-ji");
  }, limit);
});

/**
 * Marble Hanuman Statues: Strictly products with Admin category 'hanuman-ji'
 */
export const getMarbleHanumanProducts = cache(async function getMarbleHanumanProducts(limit = 12) {
  return getVerifiedMarbleProducts((p) => {
    return matchesAdminCategory(p, "hanuman-ji");
  }, limit);
});
