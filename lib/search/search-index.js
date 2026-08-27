import { getAllProductsFromDB } from "@/content/products-db";
import { categoriesData } from "@/content/categories";
import { collectionsData } from "@/content/collections";

let cachedIndex = null;

export async function buildSearchIndex() {
  if (cachedIndex) return cachedIndex;

  const products = await getAllProductsFromDB();

  const indexedProducts = products.map((p) => {
    const categoryObj = categoriesData[p.parentCategory];
    const categoryName = categoryObj ? categoryObj.name : p.parentCategory || "";
    const collectionName = p.parentCollectionName || (categoryObj ? categoryObj.parentCollection : "") || "";
    const materialName = p.primaryMaterial ? p.primaryMaterial.name : "Natural Stone";

    return {
      id: p.id || p.slug,
      type: "product",
      name: p.name,
      slug: p.slug,
      parentCategory: p.parentCategory,
      parentCategoryName: categoryName,
      parentCollectionName: collectionName,
      primaryMaterial: materialName,
      shortDescription: p.shortDescription || p.detailedDescription || "",
      tags: Array.isArray(p.tags) ? p.tags : (p.keywords || []),
      imageSrc: p.imageSrc,
      href: `/designs/${p.parentCategory}/${p.slug}`,
      // Search normalized tokens
      searchTokens: {
        name: (p.name || "").toLowerCase(),
        category: (categoryName || "").toLowerCase(),
        collection: (collectionName || "").toLowerCase(),
        material: (materialName || "").toLowerCase(),
        tags: (Array.isArray(p.tags) ? p.tags.join(" ") : (p.keywords || "")).toLowerCase(),
        description: (p.shortDescription || "").toLowerCase(),
      },
    };
  });

  // Index Categories
  const indexedCategories = Object.values(categoriesData).map((cat) => ({
    id: cat.id || cat.slug,
    type: "category",
    name: cat.name,
    slug: cat.slug,
    parentCollection: cat.parentCollection,
    parentSubcategory: cat.parentSubcategory,
    description: cat.description || "",
    href: `/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`,
    searchTokens: {
      name: (cat.name || "").toLowerCase(),
      category: (cat.name || "").toLowerCase(),
      collection: (cat.parentCollection || "").toLowerCase(),
      tags: (cat.name || "").toLowerCase(),
      description: (cat.description || "").toLowerCase(),
    },
  }));

  // Index Collections
  const indexedCollections = Object.values(collectionsData).map((col) => ({
    id: col.id || col.slug,
    type: "collection",
    name: col.name,
    slug: col.slug,
    description: col.description || "",
    href: `/collections/${col.slug}`,
    searchTokens: {
      name: (col.name || "").toLowerCase(),
      category: "",
      collection: (col.name || "").toLowerCase(),
      tags: (col.name || "").toLowerCase(),
      description: (col.description || "").toLowerCase(),
    },
  }));

  cachedIndex = {
    products: indexedProducts,
    categories: indexedCategories,
    collections: indexedCollections,
  };

  return cachedIndex;
}
