import getDB from "../lib/db/client.js";
import { collectionsData } from "../content/collections.js";
import { categoriesData } from "../content/categories.js";
import { materialsDB } from "../content/products-db/materials-db.js";
import { subjectsDB } from "../content/products-db/subjects-db.js";
import { productsDatabaseStore } from "../content/products-db/products-db.js";

console.log("Starting Jaipur Stonecraft Database Seeding...");

const db = getDB();

const seed = db.transaction(() => {
  // 1. Seed Collections & Subcategories
  const insertCollection = db.prepare(`
    INSERT OR REPLACE INTO collections (id, slug, name, description, image_src)
    VALUES (@id, @slug, @name, @description, @image_src)
  `);

  const insertSubcategory = db.prepare(`
    INSERT OR REPLACE INTO subcategories (id, slug, parent_collection_slug, name, description, image_src)
    VALUES (@id, @slug, @parent_collection_slug, @name, @description, @image_src)
  `);

  let countCollections = 0;
  let countSubcategories = 0;

  Object.values(collectionsData).forEach((col) => {
    insertCollection.run({
      id: col.slug,
      slug: col.slug,
      name: col.name,
      description: col.description || "",
      image_src: col.imageSrc || ""
    });
    countCollections++;

    if (Array.isArray(col.subcategories)) {
      col.subcategories.forEach((sub) => {
        insertSubcategory.run({
          id: `${col.slug}-${sub.slug}`,
          slug: sub.slug,
          parent_collection_slug: col.slug,
          name: sub.name,
          description: sub.description || "",
          image_src: sub.imageSrc || ""
        });
        countSubcategories++;
      });
    }
  });

  // 2. Seed Categories
  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO categories (id, slug, parent_collection_slug, parent_subcategory_slug, name, description, image_src, image_alt, featured)
    VALUES (@id, @slug, @parent_collection_slug, @parent_subcategory_slug, @name, @description, @image_src, @image_alt, @featured)
  `);

  let countCategories = 0;
  Object.values(categoriesData).forEach((cat) => {
    insertCategory.run({
      id: cat.slug,
      slug: cat.slug,
      parent_collection_slug: cat.parentCollection,
      parent_subcategory_slug: cat.parentSubcategory,
      name: cat.name,
      description: cat.description || "",
      image_src: cat.imageSrc || "",
      image_alt: cat.imageAlt || "",
      featured: cat.featured ? 1 : 0
    });
    countCategories++;
  });

  // 3. Seed Materials (Granite strictly excluded)
  const insertMaterial = db.prepare(`
    INSERT OR REPLACE INTO materials (id, name, category, origin, color_family, durability, is_sacred_grade, description)
    VALUES (@id, @name, @category, @origin, @color_family, @durability, @is_sacred_grade, @description)
  `);

  let countMaterials = 0;
  materialsDB.forEach((mat) => {
    insertMaterial.run({
      id: mat.id,
      name: mat.name,
      category: mat.category,
      origin: mat.origin || "",
      color_family: mat.colorFamily || "",
      durability: mat.durability || "",
      is_sacred_grade: mat.isSacredGrade ? 1 : 0,
      description: mat.description || ""
    });
    countMaterials++;
  });

  // 4. Seed Sacred & Artistic Subjects
  const insertSubject = db.prepare(`
    INSERT OR REPLACE INTO subjects (id, primary_name, synonyms, tradition, iconography_elements, default_category_slug)
    VALUES (@id, @primary_name, @synonyms, @tradition, @iconography_elements, @default_category_slug)
  `);

  let countSubjects = 0;
  subjectsDB.forEach((subj) => {
    insertSubject.run({
      id: subj.id,
      primary_name: subj.primaryName,
      synonyms: JSON.stringify(subj.synonyms || []),
      tradition: subj.tradition || "",
      iconography_elements: JSON.stringify(subj.iconographyElements || []),
      default_category_slug: subj.defaultCategorySlug || ""
    });
    countSubjects++;
  });

  // 5. Seed Products & Product Images
  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
      product_type, parent_collection, parent_subcategory, parent_category,
      subject_id, primary_material_id, short_description, detailed_description,
      knowledge_layer, attributes, tags, variants, seo
    ) VALUES (
      @id, @sku, @slug, @name, @status, @is_featured, @is_new_arrival, @is_custom_only,
      @product_type, @parent_collection, @parent_subcategory, @parent_category,
      @subject_id, @primary_material_id, @short_description, @detailed_description,
      @knowledge_layer, @attributes, @tags, @variants, @seo
    )
  `);

  const insertImage = db.prepare(`
    INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
    VALUES (@product_slug, @url, @alt_text, @role, @sort_order, @is_primary)
  `);

  const clearImages = db.prepare(`DELETE FROM product_images`);
  clearImages.run();

  let countProducts = 0;
  let countImages = 0;

  Object.values(productsDatabaseStore).forEach((p) => {
    insertProduct.run({
      id: p.id,
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      status: p.status || "published",
      is_featured: p.isFeatured ? 1 : 0,
      is_new_arrival: p.isNewArrival ? 1 : 0,
      is_custom_only: p.isCustomOnly ? 1 : 0,
      
      product_type: p.productType || "sculpture",
      parent_collection: p.parentCollection,
      parent_subcategory: p.parentSubcategory,
      parent_category: p.parentCategory,
      
      subject_id: p.subjectId || null,
      primary_material_id: p.primaryMaterialId,
      
      short_description: p.shortDescription || "",
      detailed_description: p.detailedDescription || "",
      
      knowledge_layer: JSON.stringify(p.knowledgeLayer || {}),
      attributes: JSON.stringify(p.attributes || {}),
      tags: JSON.stringify(p.tags || []),
      variants: JSON.stringify(p.variants || {}),
      seo: JSON.stringify(p.seo || {})
    });
    countProducts++;

    // Insert primary image
    if (p.imageSrc) {
      insertImage.run({
        product_slug: p.slug,
        url: p.imageSrc,
        alt_text: `${p.name} - Hand-carved in Jaipur`,
        role: "hero",
        sort_order: 0,
        is_primary: 1
      });
      countImages++;
    }

    // Insert gallery images
    if (Array.isArray(p.imageGallery)) {
      p.imageGallery.forEach((imgUrl, index) => {
        insertImage.run({
          product_slug: p.slug,
          url: imgUrl,
          alt_text: `${p.name} detail view ${index + 1}`,
          role: "gallery",
          sort_order: index + 1,
          is_primary: 0
        });
        countImages++;
      });
    }
  });

  return {
    countCollections,
    countSubcategories,
    countCategories,
    countMaterials,
    countSubjects,
    countProducts,
    countImages
  };
});

try {
  const result = seed();
  console.log("Seeding completed successfully!");
  console.log(`- Collections: ${result.countCollections}`);
  console.log(`- Subcategories: ${result.countSubcategories}`);
  console.log(`- Categories: ${result.countCategories}`);
  console.log(`- Materials: ${result.countMaterials}`);
  console.log(`- Subjects: ${result.countSubjects}`);
  console.log(`- Products: ${result.countProducts}`);
  console.log(`- Images: ${result.countImages}`);
} catch (err) {
  console.error("Seeding failed:", err);
  process.exit(1);
}
