import { query, getOne, initDB } from "../lib/db/client.js";
import { createSessionToken } from "../lib/admin/auth.js";
import { categoriesData } from "../content/categories.js";
import { collectionsData } from "../content/collections.js";

async function runAudit() {
  await initDB();

  console.log("==========================================================");
  console.log("JAIPUR STONECRAFT — TAXONOMY AUDIT & INTEGRITY VERIFICATION");
  console.log("==========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = "") {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? "- " + details : ""}`);
      failed++;
    }
  }

  // 1. Data Preservation
  console.log("--- 1. DATA PRESERVATION & PRODUCT COUNTS ---");
  const [totalProds] = await query("SELECT count(*) as count FROM products");
  assert(totalProds.count === 320, "Total product count strictly preserved at 320", `Found: ${totalProds.count}`);

  const [pubProds] = await query("SELECT count(*) as count FROM products WHERE status = 'published'");
  assert(pubProds.count === 277, "Published products strictly preserved at 277", `Found: ${pubProds.count}`);

  const [draftProds] = await query("SELECT count(*) as count FROM products WHERE status = 'draft'");
  assert(draftProds.count === 41, "Draft products strictly preserved at 41", `Found: ${draftProds.count}`);

  const [archivedProds] = await query("SELECT count(*) as count FROM products WHERE status = 'archived'");
  assert(archivedProds.count === 2, "Archived products strictly preserved at 2", `Found: ${archivedProds.count}`);

  const [totalImages] = await query("SELECT count(*) as count FROM product_images");
  assert(totalImages.count === 1242, "Product images preserved intact at 1242", `Found: ${totalImages.count}`);

  // 2. Sculptures & Statues Protected Collection Parity
  console.log("\n--- 2. PROTECTED SCULPTURES & STATUES INTEGRITY ---");
  const [sculptProds] = await query("SELECT count(*) as count FROM products WHERE parent_collection = 'sculptures-statues'");
  assert(sculptProds.count === 127, "Sculptures & Statues products strictly unchanged at 127", `Found: ${sculptProds.count}`);

  const [sculptSubs] = await query("SELECT count(*) as count FROM subcategories WHERE parent_collection_slug = 'sculptures-statues' AND is_active = 1");
  assert(sculptSubs.count === 5, "Sculptures & Statues active subcategories strictly unchanged at 5", `Found: ${sculptSubs.count}`);

  const [sculptCats] = await query("SELECT count(*) as count FROM categories WHERE parent_collection_slug = 'sculptures-statues' AND is_active = 1");
  assert(sculptCats.count === 37, "Sculptures & Statues active categories strictly unchanged at 37", `Found: ${sculptCats.count}`);

  // 3. Database Relationship Integrity & No Duplicate Active Categories
  console.log("\n--- 3. DATABASE RELATIONSHIP INTEGRITY ---");
  const dupCatSlugs = await query("SELECT slug, count(*) as count FROM categories WHERE is_active = 1 GROUP BY slug HAVING count > 1");
  assert(dupCatSlugs.length === 0, "Zero duplicate active category slugs in database");

  const dupSubSlugs = await query("SELECT slug, count(*) as count FROM subcategories WHERE is_active = 1 GROUP BY slug HAVING count > 1");
  assert(dupSubSlugs.length === 0, "Zero duplicate active subcategory slugs in database");

  // Check orphaned active categories (parent subcategory inactive or missing)
  const orphanActiveCats = await query(`
    SELECT c.slug, c.name, c.parent_subcategory_slug 
    FROM categories c
    LEFT JOIN subcategories s ON c.parent_subcategory_slug = s.slug
    WHERE c.is_active = 1 AND (s.id IS NULL OR s.is_active = 0)
  `);
  assert(orphanActiveCats.length === 0, "Zero active categories under missing/inactive subcategories", JSON.stringify(orphanActiveCats));

  // Check categories pointing to wrong collections
  const mismatchedColCats = await query(`
    SELECT c.slug, c.parent_collection_slug, s.parent_collection_slug as sub_col
    FROM categories c
    JOIN subcategories s ON c.parent_subcategory_slug = s.slug
    WHERE c.is_active = 1 AND c.parent_collection_slug != s.parent_collection_slug
  `);
  assert(mismatchedColCats.length === 0, "Zero active categories with mismatched collection vs subcategory hierarchy");

  // 4. Admin API & Active Taxonomy Verification
  console.log("\n--- 4. ADMIN API & TAXONOMY VALIDATION ---");
  const token = createSessionToken();
  const apiRes = await fetch("http://localhost:3000/api/admin/categories", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const apiData = await apiRes.json();
  assert(apiRes.status === 200, "Admin categories API returns HTTP 200 with valid authorization");
  assert(apiData.collections.length === 6, "Admin API returns exactly the 6 approved collections", `Count: ${apiData.collections?.length}`);
  assert(apiData.subcategories.length === 20, "Admin API returns exactly the 20 approved subcategories", `Count: ${apiData.subcategories?.length}`);
  assert(apiData.categories.length === 59, "Admin API returns exactly the approved active categories (37 sculpture + 22 non-sculpture)", `Count: ${apiData.categories?.length}`);

  // Test unauthorized rejection
  const unauthRes = await fetch("http://localhost:3000/api/admin/categories");
  assert(unauthRes.status === 401, "Admin categories API correctly rejects unauthenticated requests (HTTP 401)");

  // Test Sculptures & Statues modification rejection
  const sculptModRes = await fetch("http://localhost:3000/api/admin/categories", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "category",
      payload: {
        name: "Test Sculpture Category",
        slug: "test-sculpture-cat",
        parentCollection: "sculptures-statues",
        parentSubcategory: "hindu-sculptures"
      }
    })
  });
  assert(sculptModRes.status === 403, "Admin API strictly blocks modifications to Sculptures & Statues (HTTP 403)");

  // 5. Public Routes & Sitemap Parity
  console.log("\n--- 5. PUBLIC WEBSITE, SITEMAP & REDIRECT PARITY ---");
  const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
  const sitemapText = await sitemapRes.text();
  assert(sitemapRes.status === 200, "Sitemap generates successfully (HTTP 200)");
  assert(!sitemapText.includes("/mandir-temple/"), "Sitemap contains zero obsolete /mandir-temple/ URLs");
  assert(!sitemapText.includes("/garden-fountains/garden-fountains"), "Sitemap contains zero obsolete /garden-fountains/ URLs");
  assert(!sitemapText.includes("/compact-wall-mandirs"), "Sitemap contains zero deactivated /compact-wall-mandirs URLs");

  const redirRes = await fetch("http://localhost:3000/collections/temples-architectural-stonework/mandir-temple", { redirect: "manual" });
  assert([301, 307, 308].includes(redirRes.status), "Legacy category URL redirects properly (HTTP 308/301)");

  console.log("\n==========================================================");
  console.log(`AUDIT RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================================");

  process.exit(failed > 0 ? 1 : 0);
}

runAudit().catch(err => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
