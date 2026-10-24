import fs from "fs";
import { categoriesData } from "../content/categories.js";

const APPROVED_SLUGS = [
  // 1. Sculptures & Statues (35 categories - protected)
  "ganesh-ji", "krishna-ji", "shiva-ji", "hanuman-ji", "radha-krishna", "durga-ji",
  "lakshmi-ji", "saraswati-ji", "ram-darbar", "vishnu-ji", "lakshmi-narayan", "jagannath",
  "kartikeya", "parvati-ji", "nandi", "other-deities",
  "buddha-statues", "mahavira-statues", "tirthankara-sculptures", "meditating-buddha", "reclining-buddha",
  "bespoke-portrait-busts", "full-body-figures", "cultural-tribal-figures", "artisan-figures",
  "abstract-form-sculptures", "contemporary-stone-art", "roman-greek-figures", "modernist-carvings",
  "elephants", "lions", "peacocks", "horses", "swans", "custom-animal-figures",

  // 2. Wall Art & Reliefs (4 categories)
  "religious-wall-murals",
  "devotional-relief-panels",
  "stone-relief-panels",
  "floral-nature-wall-panels",

  // 3. Temples & Architectural Stonework (8 categories)
  "small-marble-mandir-for-home",
  "temple-parts-designs",
  "marble-jali-designs",
  "jali-for-partitions",
  "balcony-staircase-jali",
  "stone-arches-door-frames",
  "jharokhas-windows",
  "gazebo-sculptural-elements",

  // 4. Fountains & Water Features (3 categories)
  "tiered-fountains",
  "wall-fountains",
  "freestanding-fountains",

  // 5. Decorative Stone Art (3 categories)
  "marble-stone-planters",
  "marble-tulsi-pots",
  "marble-pedestals-stands",

  // 6. Custom & Bespoke Creations (4 categories)
  "full-temple-construction",
  "luxury-estate-stonework",
  "bespoke-heritage-restoration",
  "commemorative-reliefs"
];

console.log("Approved category count:", APPROVED_SLUGS.length); // 57

const newCategoriesData = {};

for (const slug of APPROVED_SLUGS) {
  if (slug === "freestanding-fountains") {
    newCategoriesData[slug] = {
      slug: "freestanding-fountains",
      name: "Freestanding Fountains",
      parentCollection: "fountains-water-features",
      parentSubcategory: "freestanding-fountains",
      description: "Freestanding courtyard stone fountains, lotus basins, and sculptural water features.",
      imageSrc: "/images/collections/hero-sculptures-group.webp",
      imageAlt: "Freestanding courtyard stone fountain hand-carved in Jaipur",
      featured: true
    };
  } else if (slug === "gazebo-sculptural-elements") {
    newCategoriesData[slug] = {
      slug: "gazebo-sculptural-elements",
      name: "Chhatri & Gazebo Elements",
      parentCollection: "temples-architectural-stonework",
      parentSubcategory: "architectural-components",
      description: "Handcrafted stone chhatris, pavilions, domed canopies, and gazebo structural elements.",
      imageSrc: categoriesData[slug]?.imageSrc || "https://placehold.co/800x500/E8E4DF/1A1918?text=Gazebo+Elements",
      imageAlt: "Carved stone chhatri and gazebo architectural elements",
      featured: false
    };
  } else if (categoriesData[slug]) {
    newCategoriesData[slug] = categoriesData[slug];
  } else {
    console.error("Missing slug:", slug);
  }
}

const fileContent = `export const categoriesData = ${JSON.stringify(newCategoriesData, null, 2)};

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
`;

fs.writeFileSync("content/categories.js", fileContent, "utf8");
console.log("Successfully written clean 57 categories to content/categories.js");
