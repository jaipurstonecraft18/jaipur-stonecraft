import { query, execute, initDB } from "../lib/db/client.js";

const ORPHANED_CATEGORIES_TO_DEACTIVATE = [
  "lifesize-memorial-busts",
  "ancestral-portrait-carvings",
  "bespoke-deity-statues",
  "custom-monumental-sculptures",
  "commissioned-statuary",
  "garden-lanterns-lamps",
  "benches-seating",
  "carved-stone-vases",
  "marble-urns",
  "decorative-bowls",
  "tabletop-statuettes",
  "artisan-accessories",
  "garden-fountains",
  "window-jali",
  "floor-standing-marble-mandir",
  "large-marble-temple",
  "architectural-accent-murals"
];

const REDUNDANT_EMPTY_PILLAR_CATEGORIES = [
  "decorative-pillars",
  "marble-pillars",
  "stone-pillars"
];

async function runCleanup(isDryRun = true) {
  await initDB();

  console.log("==================================================");
  console.log(`JAIPUR STONECRAFT — CONTROLLED TAXONOMY CLEANUP (${isDryRun ? "DRY-RUN" : "EXECUTE"})`);
  console.log("==================================================\n");

  // 1. Audit before counts
  const [totalProdsBefore] = await query("SELECT count(*) as count FROM products");
  const [pubProdsBefore] = await query("SELECT count(*) as count FROM products WHERE status = 'published'");
  const [draftProdsBefore] = await query("SELECT count(*) as count FROM products WHERE status = 'draft'");
  const [sculptProdsBefore] = await query("SELECT count(*) as count FROM products WHERE parent_collection = 'sculptures-statues'");

  const [activeCatsBefore] = await query("SELECT count(*) as count FROM categories WHERE is_active = 1");
  const [inactiveCatsBefore] = await query("SELECT count(*) as count FROM categories WHERE is_active = 0");
  const [activeSubsBefore] = await query("SELECT count(*) as count FROM subcategories WHERE is_active = 1");
  const [inactiveSubsBefore] = await query("SELECT count(*) as count FROM subcategories WHERE is_active = 0");

  console.log("--- BEFORE COUNTS ---");
  console.log(`Total Products: ${totalProdsBefore.count} (Published: ${pubProdsBefore.count}, Draft: ${draftProdsBefore.count})`);
  console.log(`Sculptures & Statues Products: ${sculptProdsBefore.count}`);
  console.log(`Subcategories: ${activeSubsBefore.count} active, ${inactiveSubsBefore.count} inactive`);
  console.log(`Categories: ${activeCatsBefore.count} active, ${inactiveCatsBefore.count} inactive`);
  console.log("");

  const allSlugsToDeactivate = [...ORPHANED_CATEGORIES_TO_DEACTIVATE, ...REDUNDANT_EMPTY_PILLAR_CATEGORIES];

  // Verify each category has 0 products and is not in sculptures-statues
  for (const slug of allSlugsToDeactivate) {
    const [cat] = await query("SELECT * FROM categories WHERE slug = ?", [slug]);
    if (!cat) {
      console.warn(`⚠️ Warning: Category "${slug}" not found in database.`);
      continue;
    }
    if (cat.parent_collection_slug === "sculptures-statues") {
      throw new Error(`CRITICAL VIOLATION: Attempted to deactivate category in protected sculptures-statues collection: ${slug}`);
    }
    const [prodCount] = await query("SELECT count(*) as count FROM products WHERE parent_category = ?", [slug]);
    if (prodCount.count > 0) {
      throw new Error(`CRITICAL VIOLATION: Attempted to deactivate category with existing products (${prodCount.count}): ${slug}`);
    }
    console.log(`✓ Verified safe to deactivate: [${slug}] "${cat.name}" (0 products, parent_sub: "${cat.parent_subcategory_slug}")`);
  }

  if (!isDryRun) {
    console.log("\nExecuting deactivations in database...");
    for (const slug of allSlugsToDeactivate) {
      await execute("UPDATE categories SET is_active = 0 WHERE slug = ?", [slug]);
    }
    console.log("✅ Deactivation completed.");
  } else {
    console.log("\n[DRY RUN]: No database modifications performed.");
  }

  // 2. Audit after counts
  const [totalProdsAfter] = await query("SELECT count(*) as count FROM products");
  const [pubProdsAfter] = await query("SELECT count(*) as count FROM products WHERE status = 'published'");
  const [draftProdsAfter] = await query("SELECT count(*) as count FROM products WHERE status = 'draft'");
  const [sculptProdsAfter] = await query("SELECT count(*) as count FROM products WHERE parent_collection = 'sculptures-statues'");

  const [activeCatsAfter] = await query("SELECT count(*) as count FROM categories WHERE is_active = 1");
  const [inactiveCatsAfter] = await query("SELECT count(*) as count FROM categories WHERE is_active = 0");

  console.log("\n--- AFTER COUNTS ---");
  console.log(`Total Products: ${totalProdsAfter.count} (Change: ${totalProdsAfter.count - totalProdsBefore.count})`);
  console.log(`Published Products: ${pubProdsAfter.count} (Change: ${pubProdsAfter.count - pubProdsBefore.count})`);
  console.log(`Sculptures & Statues Products: ${sculptProdsAfter.count} (Change: ${sculptProdsAfter.count - sculptProdsBefore.count})`);
  console.log(`Categories: ${activeCatsAfter.count} active, ${inactiveCatsAfter.count} inactive`);

  process.exit(0);
}

const isExecute = process.argv.includes("--execute");
runCleanup(!isExecute).catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
