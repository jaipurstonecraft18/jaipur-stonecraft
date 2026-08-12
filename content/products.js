import { categoriesData } from "./categories.js";
import { designsData } from "./designs.js";

export const productsData = categoriesData;

export function getProductsBySubcategory(collectionSlug, subcategorySlug) {
  return Object.values(categoriesData).filter(
    (cat) => cat.parentCollection === collectionSlug && cat.parentSubcategory === subcategorySlug
  );
}

export function getProduct(collectionSlug, subcategorySlug, categorySlug) {
  const item = categoriesData[categorySlug];
  if (item && item.parentCollection === collectionSlug && item.parentSubcategory === subcategorySlug) {
    return item;
  }
  return null;
}
