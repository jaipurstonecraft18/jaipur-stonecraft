import { query, initDB } from "../lib/db/client.js";
import { collectionsData } from "../content/collections.js";
import { categoriesData } from "../content/categories.js";
import fs from "fs";

async function main() {
  await initDB();

  const collections = await query("SELECT * FROM collections ORDER BY id ASC");
  const subcategories = await query("SELECT * FROM subcategories ORDER BY parent_collection_slug, sort_order, id ASC");
  const categories = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order, id ASC");
  const products = await query("SELECT * FROM products ORDER BY id ASC");

  const approvedCollections = [
    "sculptures-statues",
    "wall-art-reliefs",
    "temples-architectural-stonework",
    "fountains-water-features",
    "decorative-stone-art",
    "custom-bespoke-creations"
  ];

  const approvedTaxonomy = {
    "sculptures-statues": [
      "hindu-sculptures",
      "buddhist-jain-sculptures",
      "human-portrait-sculptures",
      "classical-artistic-sculptures",
      "animal-bird-sculptures"
    ],
    "wall-art-reliefs": [
      "wall-murals",
      "religious-reliefs",
      "stone-relief-panels"
    ],
    "temples-architectural-stonework": [
      "mandirs-temples",
      "jali-designs",
      "pillars-columns",
      "architectural-components"
    ],
    "fountains-water-features": [
      "tiered-fountains",
      "wall-fountains",
      "freestanding-fountains"
    ],
    "decorative-stone-art": [
      "planters",
      "tulsi-pots",
      "pedestals-stands"
    ],
    "custom-bespoke-creations": [
      "custom-architectural-stonework",
      "custom-wall-art-reliefs"
    ]
  };

  // Product counts by category
  const prodByCat = {};
  for (const p of products) {
    if (!prodByCat[p.parent_category]) {
      prodByCat[p.parent_category] = { total: 0, published: 0, draft: 0, archived: 0 };
    }
    prodByCat[p.parent_category].total++;
    prodByCat[p.parent_category][p.status] = (prodByCat[p.parent_category][p.status] || 0) + 1;
  }

  // Product counts by subcategory
  const prodBySub = {};
  for (const p of products) {
    if (!prodBySub[p.parent_subcategory]) {
      prodBySub[p.parent_subcategory] = { total: 0, published: 0, draft: 0, archived: 0 };
    }
    prodBySub[p.parent_subcategory].total++;
    prodBySub[p.parent_subcategory][p.status] = (prodBySub[p.parent_subcategory][p.status] || 0) + 1;
  }

  // Product counts by collection
  const prodByCol = {};
  for (const p of products) {
    if (!prodByCol[p.parent_collection]) {
      prodByCol[p.parent_collection] = { total: 0, published: 0, draft: 0, archived: 0 };
    }
    prodByCol[p.parent_collection].total++;
    prodByCol[p.parent_collection][p.status] = (prodByCol[p.parent_collection][p.status] || 0) + 1;
  }

  console.log("Auditing classification of all 104 categories and 43 subcategories...");

  const manifest = {
    collectionsSummary: collections.map(c => ({
      slug: c.slug,
      name: c.name,
      isActive: Boolean(c.is_active),
      isApproved: approvedCollections.includes(c.slug),
      products: prodByCol[c.slug] || { total: 0, published: 0, draft: 0, archived: 0 }
    })),
    subcategoriesSummary: subcategories.map(s => {
      const isApproved = (approvedTaxonomy[s.parent_collection_slug] || []).includes(s.slug);
      const isSculpture = s.parent_collection_slug === "sculptures-statues";
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        parentCollection: s.parent_collection_slug,
        isActive: Boolean(s.is_active),
        isApproved,
        isProtected: isSculpture,
        products: prodBySub[s.slug] || { total: 0, published: 0, draft: 0, archived: 0 },
        childCategoriesCount: categories.filter(c => c.parent_subcategory_slug === s.slug).length
      };
    }),
    categoriesClassification: categories.map(cat => {
      const isSculpture = cat.parent_collection_slug === "sculptures-statues";
      const prods = prodByCat[cat.slug] || { total: 0, published: 0, draft: 0, archived: 0 };
      const sub = subcategories.find(s => s.slug === cat.parent_subcategory_slug);
      const isSubApproved = (approvedTaxonomy[cat.parent_collection_slug] || []).includes(cat.parent_subcategory_slug);
      const isSubActive = Boolean(sub?.is_active);

      let group = "Group 7: Ambiguous";
      let proposedAction = "Retain";
      let reason = "";

      if (isSculpture) {
        group = "Protected";
        proposedAction = "Retain strictly without modification";
        reason = "Sculptures & Statues is strictly protected by non-negotiable safeguard";
      } else if (prods.total > 0) {
        group = "Approved Active Category with Products";
        proposedAction = "Retain";
        reason = `Contains ${prods.total} products (${prods.published} published)`;
      } else if (!isSubActive || !isSubApproved) {
        if (cat.is_active === 1) {
          group = "Group 1 / Group 2: Orphaned/Obsolete Category with Inactive Parent";
          proposedAction = "Deactivate (is_active = 0) and preserve redirects";
          reason = `Parent subcategory '${cat.parent_subcategory_slug}' is inactive/obsolete, category has 0 products but was left active`;
        } else {
          group = "Group 2: Obsolete Legacy Category";
          proposedAction = "Retain as deactivated (is_active = 0) with redirects preserved";
          reason = `Already inactive with 0 products and parent subcategory is inactive`;
        }
      } else if (cat.slug === "marble-tulsi-pots") {
        group = "Group 3: Empty but potentially useful category";
        proposedAction = "Retain (active or inactive per business readiness)";
        reason = "Approved product family under Tulsi Pots in Decorative Stone Art";
      } else if (["marble-pillars", "stone-pillars", "decorative-pillars"].includes(cat.slug)) {
        group = "Group 1: Near-duplicate empty pillar categories";
        proposedAction = "Retain stone-arches-door-frames as canonical active category, deactivate redundant empty pillar sub-types";
        reason = "Near-duplicate pillar category variations with 0 products";
      } else {
        group = "Group 3: Empty approved category";
        proposedAction = "Retain";
        reason = "Empty category under approved active subcategory";
      }

      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        parentCollection: cat.parent_collection_slug,
        parentSubcategory: cat.parent_subcategory_slug,
        isActive: Boolean(cat.is_active),
        products: prods,
        isSculpture,
        isSubApproved,
        isSubActive,
        group,
        proposedAction,
        reason
      };
    })
  };

  fs.writeFileSync("scripts/detailed-manifest.json", JSON.stringify(manifest, null, 2));
  console.log("Detailed manifest written to scripts/detailed-manifest.json");
  process.exit(0);
}

main().catch(console.error);
