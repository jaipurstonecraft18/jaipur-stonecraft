import { categoriesData } from "./categories-data.js";
export { categoriesData };

import {
  getCategory as getCategoryFromDB,
  getCategoriesBySubcategory as getCategoriesBySubcategoryFromDB,
  getAllCategories as getAllCategoriesFromDB
} from "../lib/db/taxonomy.js";

export async function getAllCategories() {
  try {
    const dbCats = await getAllCategoriesFromDB();
    if (dbCats && dbCats.length > 0) return dbCats;
  } catch (e) {}

  return Object.values(categoriesData);
}

export async function getCategory(arg1, arg2, arg3) {
  const collectionSlug = arg3 ? arg1 : null;
  const subcategorySlug = arg3 ? arg2 : null;
  const targetSlug = arg3 || arg1;

  try {
    const dbCat = await getCategoryFromDB(collectionSlug, subcategorySlug, targetSlug);
    if (dbCat) return dbCat;
  } catch (e) {}

  return categoriesData[targetSlug] || null;
}

export async function getCategoriesBySubcategory(collectionSlug, subcategorySlug) {
  try {
    const dbCats = await getCategoriesBySubcategoryFromDB(collectionSlug, subcategorySlug);
    if (dbCats && dbCats.length > 0) return dbCats;
  } catch (e) {}

  return Object.values(categoriesData).filter(
    (cat) => cat.parentCollection === collectionSlug && cat.parentSubcategory === subcategorySlug
  );
}

export { LEGACY_CATEGORY_REDIRECTS, resolveCanonicalCategoryUrl } from "@/lib/taxonomy/legacy-redirects.js";

export function getCategoryCanonicalUrl(catOrSlug, fallbackCollection, fallbackSubcategory) {
  if (!catOrSlug) return "/collections";
  const cat = typeof catOrSlug === "object" ? catOrSlug : categoriesData[catOrSlug];
  if (cat && cat.parentCollection && cat.parentSubcategory) {
    return `/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`;
  }
  if (typeof catOrSlug === "string") {
    if (fallbackCollection && fallbackSubcategory) {
      return `/collections/${fallbackCollection}/${fallbackSubcategory}/${catOrSlug}`;
    }
  }
  return cat?.slug ? `/collections/${cat.slug}` : "/collections";
}

