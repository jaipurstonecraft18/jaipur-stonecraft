import fs from "fs";

// Load DB snapshot
const snapshot = JSON.parse(fs.readFileSync("scripts/post-migration-snapshot.json", "utf8"));
const activeCats = snapshot.categories;

// Load existing categoriesData
const { categoriesData } = await import("../content/categories-data.js");

const updatedCategories = {};

// Keep all 38 sculptures-statues categories exactly as they are in categoriesData
for (const [slug, cat] of Object.entries(categoriesData)) {
  if (cat.parentCollection === "sculptures-statues") {
    updatedCategories[slug] = cat;
  }
}

// For categories in the other collections, synchronize with active DB categories
for (const dbCat of activeCats) {
  if (dbCat.parent_collection_slug === "sculptures-statues") {
    continue; // already handled
  }

  const existing = categoriesData[dbCat.slug] || {};

  updatedCategories[dbCat.slug] = {
    slug: dbCat.slug,
    name: dbCat.name,
    parentCollection: dbCat.parent_collection_slug,
    parentSubcategory: dbCat.parent_subcategory_slug,
    description: dbCat.description || existing.description || `${dbCat.name} hand-carved in Jaipur`,
    imageSrc: dbCat.image_src || existing.imageSrc || "/images/collections/luxury.webp",
    imageAlt: dbCat.image_alt || existing.imageAlt || `${dbCat.name} hand-carved stone art in Jaipur atelier`,
    featured: Boolean(dbCat.featured || existing.featured || false)
  };
}

const fileContent = `export const categoriesData = ${JSON.stringify(updatedCategories, null, 2)};\n`;
fs.writeFileSync("content/categories-data.js", fileContent);
console.log(`Successfully synced content/categories-data.js with ${Object.keys(updatedCategories).length} categories.`);
