import { revalidatePath } from "next/cache";

/**
 * Revalidates public category, subcategory, and collection taxonomy pages.
 */
export function revalidateTaxonomyPaths(categorySlug = null, collectionSlug = null, subcategorySlug = null) {
  try {
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/products");
    revalidatePath("/sitemap.xml");

    // Template page revalidations
    revalidatePath("/collections/[collection]", "page");
    revalidatePath("/collections/[collection]/[subcategory]", "page");
    revalidatePath("/collections/[collection]/[subcategory]/[category]", "page");
    revalidatePath("/designs/[category]/[design]", "page");

    // Specific path revalidations if parameters known
    if (collectionSlug && subcategorySlug && categorySlug) {
      revalidatePath(`/collections/${collectionSlug}/${subcategorySlug}/${categorySlug}`);
    }
    if (collectionSlug && subcategorySlug) {
      revalidatePath(`/collections/${collectionSlug}/${subcategorySlug}`);
    }
    if (collectionSlug) {
      revalidatePath(`/collections/${collectionSlug}`);
    }
  } catch (err) {
    console.warn("[Revalidate Taxonomy Cache Warning]:", err?.message || err);
  }
}

/**
 * Revalidates all relevant public paths affected by a product mutation.
 */
export function revalidateProductPaths({
  slug,
  parentCategory,
  parentCollection,
  parentSubcategory,
  oldSlug,
  oldCategory,
  oldCollection,
  oldSubcategory
} = {}) {
  try {
    revalidateTaxonomyPaths(parentCategory, parentCollection, parentSubcategory);

    if (parentCategory && slug) {
      revalidatePath(`/designs/${parentCategory}/${slug}`);
    }

    if (oldSlug || oldCategory) {
      const prevCat = oldCategory || parentCategory;
      const prevSlug = oldSlug || slug;
      if (prevCat && prevSlug) {
        revalidatePath(`/designs/${prevCat}/${prevSlug}`);
      }
      if (oldCollection || oldSubcategory || oldCategory) {
        revalidateTaxonomyPaths(oldCategory, oldCollection, oldSubcategory);
      }
    }
  } catch (err) {
    console.warn("[Revalidate Product Cache Warning]:", err?.message || err);
  }
}

