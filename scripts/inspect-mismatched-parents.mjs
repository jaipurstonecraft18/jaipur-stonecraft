import { query, initDB } from "../lib/db/client.js";
import { categoriesData } from "../content/categories.js";

async function main() {
  await initDB();
  const cats = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, slug");
  const subs = await query("SELECT slug, parent_collection_slug, is_active FROM subcategories");
  const subMap = Object.fromEntries(subs.map(s => [s.slug, s]));

  console.log("=== CATEGORIES WITH INACTIVE OR INVALID PARENT SUBCATEGORIES ===");
  for (const c of cats) {
    const parentSub = subMap[c.parent_subcategory_slug];
    if (!parentSub || parentSub.is_active === 0) {
      const staticEntry = categoriesData[c.slug];
      console.log(`[CAT] ${c.slug} | Name: "${c.name}" | Active: ${c.is_active} | DB Parent: ${c.parent_collection_slug} -> ${c.parent_subcategory_slug} (sub exists: ${Boolean(parentSub)}, sub active: ${parentSub?.is_active}) | Static Parent: ${staticEntry ? `${staticEntry.parentCollection} -> ${staticEntry.parentSubcategory}` : "NONE"}`);
    }
  }

  process.exit(0);
}

main().catch(console.error);
