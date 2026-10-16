import { getPool } from "../lib/db/client.js";
import { categoriesData, getCategory, getCategoriesBySubcategory, getAllCategories } from "../content/categories.js";
import { collectionsData } from "../content/collections.js";
import { evaluateProductIntelligence, PIE_RULE_STATUS } from "../lib/seo/product-intelligence-engine.js";
import { generateBreadcrumbSchema, generateProductSchema } from "../lib/seo/schemas.js";
import { generateProductMetadata } from "../lib/seo/metadata.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTaxonomyLifecycleTests() {
  console.log("=======================================================");
  console.log("JAIPUR STONECRAFT — TAXONOMY LIFECYCLE REGRESSION TEST");
  console.log("=======================================================\n");

  const pool = getPool().promise();

  // -------------------------------------------------------------------
  // TEST 1: DATABASE vs STATIC TAXONOMY PARITY
  // -------------------------------------------------------------------
  console.log("TEST SUITE 1: Authoritative Taxonomy Parity (MySQL DB vs Client Static Data)");
  const [activeDBCats] = await pool.query(
    `SELECT c.slug, c.name, c.parent_collection_slug, c.parent_subcategory_slug 
     FROM categories c 
     INNER JOIN subcategories s ON c.parent_subcategory_slug = s.slug 
     WHERE c.is_active = 1 AND s.is_active = 1`
  );

  const staticSlugs = Object.keys(categoriesData);
  const dbSlugs = activeDBCats.map((c) => c.slug);

  assert(dbSlugs.length >= 59, `MySQL database has active categories (found ${dbSlugs.length})`);
  assert(staticSlugs.length === dbSlugs.length, `Static categoriesData exactly matches DB active count (${staticSlugs.length} vs ${dbSlugs.length})`);
  assert(staticSlugs.includes("khatu-shyam-ji"), "khatu-shyam-ji is synchronized in static categories");

  const inDbNotStatic = dbSlugs.filter((s) => !staticSlugs.includes(s));
  const inStaticNotDb = staticSlugs.filter((s) => !dbSlugs.includes(s));

  assert(inDbNotStatic.length === 0, `0 categories in DB missing from static (found ${inDbNotStatic.length})`);
  assert(inStaticNotDb.length === 0, `0 categories in static missing from DB (found ${inStaticNotDb.length})`);

  // Verify hierarchy parentage across all 59 categories
  let hierarchyMismatches = 0;
  for (const dbCat of activeDBCats) {
    const staticCat = categoriesData[dbCat.slug];
    if (
      !staticCat ||
      staticCat.parentCollection !== dbCat.parent_collection_slug ||
      staticCat.parentSubcategory !== dbCat.parent_subcategory_slug
    ) {
      hierarchyMismatches++;
    }
  }
  assert(hierarchyMismatches === 0, `0 parent collection/subcategory hierarchy mismatches (found ${hierarchyMismatches})`);

  // -------------------------------------------------------------------
  // TEST 2: ALL 6 COLLECTIONS & 20 SUBCATEGORIES HIERARCHY
  // -------------------------------------------------------------------
  console.log("\nTEST SUITE 2: Collections & Subcategories Structure");
  const collectionKeys = Object.keys(collectionsData);
  assert(collectionKeys.length === 6, `Exactly 6 top-level collections exist (found ${collectionKeys.length})`);

  let totalActiveSubcategories = 0;
  collectionKeys.forEach((colKey) => {
    const col = collectionsData[colKey];
    totalActiveSubcategories += col.subcategories.length;
  });
  assert(totalActiveSubcategories === 20, `Exactly 20 active subcategories exist across collections (found ${totalActiveSubcategories})`);

  // -------------------------------------------------------------------
  // TEST 3: TAXONOMY RESOLUTION APIS (getCategory, getCategoriesBySubcategory)
  // -------------------------------------------------------------------
  console.log("\nTEST SUITE 3: Taxonomy Resolution Functions");
  const ganeshCat = await getCategory("ganesh-ji");
  assert(ganeshCat && ganeshCat.slug === "ganesh-ji", "getCategory resolves ganesh-ji correctly");
  assert(ganeshCat?.parentCollection === "sculptures-statues", "ganesh-ji has parentCollection 'sculptures-statues'");
  assert(ganeshCat?.parentSubcategory === "hindu-sculptures", "ganesh-ji has parentSubcategory 'hindu-sculptures'");

  const saiBabaCat = await getCategory("sai-baba");
  assert(saiBabaCat && saiBabaCat.slug === "sai-baba", "getCategory resolves newly synchronized sai-baba correctly");

  const hinduCats = await getCategoriesBySubcategory("sculptures-statues", "hindu-sculptures");
  assert(hinduCats && hinduCats.length > 0, `getCategoriesBySubcategory returns ${hinduCats?.length} categories for hindu-sculptures`);
  assert(hinduCats.some((c) => c.slug === "sai-baba"), "hindu-sculptures contains sai-baba");
  assert(hinduCats.some((c) => c.slug === "modi-ji"), "hindu-sculptures contains modi-ji");

  // -------------------------------------------------------------------
  // TEST 4: PRODUCT INTELLIGENCE ENGINE (PIE RULE P02) TAXONOMY VALIDATION
  // -------------------------------------------------------------------
  console.log("\nTEST SUITE 4: PIE Rule P02 Taxonomy Hierarchy Validation");

  // Case A: Valid product with 100% matching hierarchy
  const validProd = {
    name: "Hand-Carved Marble Ganesh Murti",
    slug: "marble-ganesh-murti",
    status: "published",
    parentCollection: "sculptures-statues",
    parentSubcategory: "hindu-sculptures",
    parentCategory: "ganesh-ji",
    primaryMaterialId: "makrana-pure-white"
  };
  const repA = evaluateProductIntelligence(validProd);
  const p02A = repA.items.find((i) => i.code === "P02");
  assert(p02A.rawStatus === PIE_RULE_STATUS.PASS, "P02 passes for well-formed product with matching taxonomy hierarchy");

  // Case B: Missing category
  const missingCatProd = { ...validProd, parentCategory: "" };
  const repB = evaluateProductIntelligence(missingCatProd);
  const p02B = repB.items.find((i) => i.code === "P02");
  assert(p02B.rawStatus === PIE_RULE_STATUS.BLOCKER, "P02 flags BLOCKER when parentCategory is missing");

  // Case C: Unrecognized category slug
  const invalidCatProd = { ...validProd, parentCategory: "mythical-nonexistent-category" };
  const repC = evaluateProductIntelligence(invalidCatProd);
  const p02C = repC.items.find((i) => i.code === "P02");
  assert(p02C.rawStatus === PIE_RULE_STATUS.BLOCKER, "P02 flags BLOCKER for nonexistent category slug");

  // Case D: Collection hierarchy mismatch
  const mismatchedCollProd = { ...validProd, parentCollection: "fountains-water-features" };
  const repD = evaluateProductIntelligence(mismatchedCollProd);
  const p02D = repD.items.find((i) => i.code === "P02");
  assert(p02D.rawStatus === PIE_RULE_STATUS.WARNING, "P02 flags WARNING for collection hierarchy mismatch");

  // Case E: Subcategory hierarchy mismatch
  const mismatchedSubProd = { ...validProd, parentSubcategory: "animal-bird-sculptures" };
  const repE = evaluateProductIntelligence(mismatchedSubProd);
  const p02E = repE.items.find((i) => i.code === "P02");
  assert(p02E.rawStatus === PIE_RULE_STATUS.WARNING, "P02 flags WARNING for subcategory hierarchy mismatch");

  // Case F: Draft product with 'review-pending' category
  const reviewPendingProd = { ...validProd, parentCategory: "review-pending", status: "draft" };
  const repF = evaluateProductIntelligence(reviewPendingProd);
  const p02F = repF.items.find((i) => i.code === "P02");
  assert(p02F.rawStatus === PIE_RULE_STATUS.WARNING, "P02 gracefully warns for 'review-pending' draft product requiring curation");

  // -------------------------------------------------------------------
  // TEST 5: BREADCRUMBS & PUBLIC URL RESOLUTION
  // -------------------------------------------------------------------
  console.log("\nTEST SUITE 5: Structured Data Breadcrumbs & SEO Metadata");
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Sculptures & Statues", url: "/collections/sculptures-statues" },
    { name: "Hindu Sculptures", url: "/collections/sculptures-statues/hindu-sculptures" },
    { name: "Ganesh Ji", url: "/collections/sculptures-statues/hindu-sculptures/ganesh-ji" },
    { name: "Marble Ganesh Murti", url: "/designs/ganesh-ji/marble-ganesh-murti" }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  assert(breadcrumbSchema["@type"] === "BreadcrumbList", "generateBreadcrumbSchema produces BreadcrumbList");
  assert(breadcrumbSchema.itemListElement.length === 5, "BreadcrumbList contains all 5 hierarchy elements");
  assert(breadcrumbSchema.itemListElement[3].name === "Ganesh Ji", "Breadcrumb contains correct category name");

  // -------------------------------------------------------------------
  // TEST 6: DATABASE PRODUCT AUDIT & ORPHAN PREVENTION
  // -------------------------------------------------------------------
  console.log("\nTEST SUITE 6: Database Product Taxonomy Audit & Integrity");
  const [allProducts] = await pool.query(
    "SELECT id, name, slug, parent_collection, parent_subcategory, parent_category, status FROM products"
  );
  assert(allProducts.length >= 325, `Total database products verified (found ${allProducts.length})`);

  const validSet = new Set(Object.keys(categoriesData));
  let correctlyAssigned = 0;
  let reviewPendingCount = 0;
  let orphanedCount = 0;

  for (const prod of allProducts) {
    if (validSet.has(prod.parent_category)) {
      correctlyAssigned++;
    } else if (prod.parent_category === "review-pending") {
      reviewPendingCount++;
    } else {
      orphanedCount++;
    }
  }

  assert(correctlyAssigned >= 285, `All active products match active taxonomy categories (found ${correctlyAssigned})`);
  assert(reviewPendingCount === 40, `All 40 draft items remain safely in review-pending state (found ${reviewPendingCount})`);
  assert(orphanedCount === 0, `0 orphaned or invalid category product assignments in database (found ${orphanedCount})`);

  console.log("\n=======================================================");
  console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} CHECKS`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTaxonomyLifecycleTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
