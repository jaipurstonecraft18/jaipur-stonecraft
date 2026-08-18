import { initDB, query, execute } from "../lib/db/client.js";

import catModule from "../content/categories.js";
import colModule from "../content/collections.js";
import matModule from "../content/products-db/materials-db.js";
import subjModule from "../content/products-db/subjects-db.js";
import prodModule from "../content/products-db/products-db.js";

const categoriesData = catModule.categoriesData || catModule;
const collectionsData = colModule.collectionsData || colModule;
const materialsDB = matModule.materialsDB || matModule;
const subjectsDB = subjModule.subjectsDB || subjModule;
const productsDatabaseStore = prodModule.productsDatabaseStore || prodModule;

async function seedMySQL() {
  console.log("Starting Jaipur Stonecraft MySQL Database Seeding...");

  await initDB();

  let countCollections = 0;
  let countSubcategories = 0;
  let countCategories = 0;
  let countMaterials = 0;
  let countSubjects = 0;
  let countProducts = 0;
  let countImages = 0;

  // 1. Seed Collections & Subcategories
  for (const col of Object.values(collectionsData)) {
    await execute(`
      INSERT INTO collections (id, slug, name, description, image_src)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), image_src = VALUES(image_src)
    `, [col.slug, col.slug, col.name, col.description || "", col.imageSrc || ""]);
    countCollections++;

    if (Array.isArray(col.subcategories)) {
      for (const sub of col.subcategories) {
        await execute(`
          INSERT INTO subcategories (id, slug, parent_collection_slug, name, description, image_src)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), image_src = VALUES(image_src)
        `, [`${col.slug}-${sub.slug}`, sub.slug, col.slug, sub.name, sub.description || "", sub.imageSrc || ""]);
        countSubcategories++;
      }
    }
  }

  // 2. Seed Categories
  for (const cat of Object.values(categoriesData)) {
    await execute(`
      INSERT INTO categories (id, slug, parent_collection_slug, parent_subcategory_slug, name, description, image_src, image_alt, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), image_src = VALUES(image_src), image_alt = VALUES(image_alt), featured = VALUES(featured)
    `, [
      cat.slug,
      cat.slug,
      cat.parentCollection,
      cat.parentSubcategory,
      cat.name,
      cat.description || "",
      cat.imageSrc || "",
      cat.imageAlt || "",
      cat.featured ? 1 : 0
    ]);
    countCategories++;
  }

  // 3. Seed Materials
  for (const mat of materialsDB) {
    if (mat.name.toLowerCase().includes("granite")) continue;
    await execute(`
      INSERT INTO materials (id, name, category, origin, color_family, durability, is_sacred_grade, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category), origin = VALUES(origin), color_family = VALUES(color_family), durability = VALUES(durability), is_sacred_grade = VALUES(is_sacred_grade), description = VALUES(description)
    `, [
      mat.id,
      mat.name,
      mat.category,
      mat.origin || "",
      mat.colorFamily || "",
      mat.durability || "",
      mat.isSacredGrade ? 1 : 0,
      mat.description || ""
    ]);
    countMaterials++;
  }

  // 4. Seed Subjects
  for (const subj of subjectsDB) {
    await execute(`
      INSERT INTO subjects (id, primary_name, synonyms, tradition, iconography_elements, default_category_slug)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE primary_name = VALUES(primary_name), synonyms = VALUES(synonyms), tradition = VALUES(tradition), iconography_elements = VALUES(iconography_elements), default_category_slug = VALUES(default_category_slug)
    `, [
      subj.id,
      subj.primaryName,
      JSON.stringify(subj.synonyms || []),
      subj.tradition || "",
      JSON.stringify(subj.iconographyElements || []),
      subj.defaultCategorySlug || ""
    ]);
    countSubjects++;
  }

  // 5. Seed Products & Images
  await execute("DELETE FROM product_images");

  for (const p of Object.values(productsDatabaseStore)) {
    await execute(`
      INSERT INTO products (
        id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
        product_type, parent_collection, parent_subcategory, parent_category,
        subject_id, primary_material_id, short_description, detailed_description,
        knowledge_layer, attributes, tags, variants, seo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        status = VALUES(status),
        is_featured = VALUES(is_featured),
        is_new_arrival = VALUES(is_new_arrival),
        is_custom_only = VALUES(is_custom_only),
        product_type = VALUES(product_type),
        parent_collection = VALUES(parent_collection),
        parent_subcategory = VALUES(parent_subcategory),
        parent_category = VALUES(parent_category),
        subject_id = VALUES(subject_id),
        primary_material_id = VALUES(primary_material_id),
        short_description = VALUES(short_description),
        detailed_description = VALUES(detailed_description),
        knowledge_layer = VALUES(knowledge_layer),
        attributes = VALUES(attributes),
        tags = VALUES(tags),
        variants = VALUES(variants),
        seo = VALUES(seo)
    `, [
      p.id,
      p.sku,
      p.slug,
      p.name,
      p.status || "published",
      p.isFeatured ? 1 : 0,
      p.isNewArrival ? 1 : 0,
      p.isCustomOnly ? 1 : 0,
      p.productType || "sculpture",
      p.parentCollection,
      p.parentSubcategory,
      p.parentCategory,
      p.subjectId || null,
      p.primaryMaterialId,
      p.shortDescription || "",
      p.detailedDescription || "",
      JSON.stringify(p.knowledgeLayer || {}),
      JSON.stringify(p.attributes || {}),
      JSON.stringify(p.tags || []),
      JSON.stringify(p.variants || {}),
      JSON.stringify(p.seo || {})
    ]);
    countProducts++;

    if (p.imageSrc) {
      await execute(`
        INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
        VALUES (?, ?, ?, 'hero', 0, 1)
      `, [p.slug, p.imageSrc, `${p.name} - Hand-carved in Jaipur`]);
      countImages++;
    }

    if (Array.isArray(p.imageGallery)) {
      for (let index = 0; index < p.imageGallery.length; index++) {
        const imgUrl = p.imageGallery[index];
        await execute(`
          INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
          VALUES (?, ?, ?, 'gallery', ?, 0)
        `, [p.slug, imgUrl, `${p.name} detail view ${index + 1}`, index + 1]);
        countImages++;
      }
    }
  }

  console.log("Seeding completed successfully!");
  console.log(`- Collections: ${countCollections}`);
  console.log(`- Subcategories: ${countSubcategories}`);
  console.log(`- Categories: ${countCategories}`);
  console.log(`- Materials: ${countMaterials}`);
  console.log(`- Subjects: ${countSubjects}`);
  console.log(`- Products: ${countProducts}`);
  console.log(`- Images: ${countImages}`);
  process.exit(0);
}

seedMySQL().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
