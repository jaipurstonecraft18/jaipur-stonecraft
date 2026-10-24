import assert from "node:assert";
import { categoriesData } from "../content/categories-data.js";
import { collectionsData } from "../content/collections.js";
import { LEGACY_CATEGORY_REDIRECTS } from "../lib/taxonomy/legacy-redirects.js";
import { query } from "../lib/db/client.js";

const BASE_URL = "http://localhost:3000";

async function checkUrl(path, expectedStatus = [200], followRedirects = false) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    redirect: followRedirects ? "follow" : "manual"
  });
  return {
    status: res.status,
    location: res.headers.get("location"),
    ok: expectedStatus.includes(res.status),
    res
  };
}

async function runTests() {
  console.log("=== 1. VERIFYING REPORTED BROKEN BUTTON & DESTINATION ===");

  // A. Check the reported old 2-segment URL directly:
  const oldUrl = "/collections/temples-architectural-stonework/balcony-staircase-jali";
  const oldUrlCheck = await checkUrl(oldUrl, [307, 308, 301, 302], false);
  console.log(`[OLD URL] ${oldUrl} -> ${oldUrlCheck.status} (Location: ${oldUrlCheck.location})`);
  assert(
    [307, 308, 301, 302].includes(oldUrlCheck.status),
    `Old 2-segment URL should return a permanent redirect, got ${oldUrlCheck.status}`
  );
  assert(
    oldUrlCheck.location?.includes("/collections/temples-architectural-stonework/jali-designs/balcony-staircase-jali"),
    `Redirect location should be canonical 3-segment URL, got: ${oldUrlCheck.location}`
  );

  // B. Check the canonical destination loads 200 OK:
  const canonicalUrl = "/collections/temples-architectural-stonework/jali-designs/balcony-staircase-jali";
  const canonicalCheck = await checkUrl(canonicalUrl, [200], false);
  console.log(`[CANONICAL DESTINATION] ${canonicalUrl} -> ${canonicalCheck.status}`);
  assert(canonicalCheck.status === 200, `Canonical category page must load with 200 OK, got ${canonicalCheck.status}`);
  const html = await canonicalCheck.res.text();
  assert(html.includes("Balcony &amp; Staircase Jali") || html.includes("Balcony & Staircase Jali"), "Page renders Balcony & Staircase Jali title");

  // C. Test following redirect end-to-end:
  const followCheck = await checkUrl(oldUrl, [200], true);
  console.log(`[FOLLOW REDIRECT] ${oldUrl} followed -> ${followCheck.status}`);
  assert(followCheck.status === 200, `Following redirect must resolve to 200 OK, got ${followCheck.status}`);

  console.log("\n=== 2. VERIFYING PRODUCT RECOMMENDATION BUTTON HREF ===");
  const prods = await query("SELECT slug, parent_category, name FROM products WHERE parent_category = 'balcony-staircase-jali' AND status = 'published' LIMIT 3");
  console.log(`Found ${prods.length} published products in balcony-staircase-jali`);
  
  if (prods.length > 0) {
    const testProd = prods[0];
    const designUrl = `/designs/${testProd.parent_category}/${testProd.slug}`;
    const designCheck = await checkUrl(designUrl, [200], false);
    console.log(`[PRODUCT DETAIL] ${designUrl} -> ${designCheck.status}`);
    assert(designCheck.status === 200, `Product detail page must return 200 OK, got ${designCheck.status}`);
    const designHtml = await designCheck.res.text();
    
    const idx = designHtml.indexOf("viewAllBtn");
    if (idx !== -1) {
      console.log("HTML snippet around viewAllBtn:", designHtml.substring(idx - 50, idx + 200));
    }
    assert(
      designHtml.includes('href="/collections/temples-architectural-stonework/jali-designs/balcony-staircase-jali"'),
      "Product recommendation 'View All' button links to canonical 3-segment URL"
    );
  }

  console.log("\n=== 3. VERIFYING 2-SEGMENT LEGACY CATEGORY REDIRECTS (SAMPLE ACROSS COLLECTIONS) ===");
  const test2Segments = [
    { from: "/collections/sculptures-statues/ganesh-ji", to: "/collections/sculptures-statues/hindu-sculptures/ganesh-ji" },
    { from: "/collections/sculptures-statues/buddha-statues", to: "/collections/sculptures-statues/buddhist-jain-sculptures/buddha-statues" },
    { from: "/collections/wall-art-reliefs/religious-wall-murals", to: "/collections/wall-art-reliefs/religious-spiritual-wall-art/religious-wall-murals" },
    { from: "/collections/decorative-stone-art/marble-stone-planters", to: "/collections/decorative-stone-art/planters-tulsi-pots/marble-stone-planters" },
  ];

  for (const t of test2Segments) {
    const r = await checkUrl(t.from, [307, 308, 301, 302], false);
    console.log(`[2-SEG REDIRECT] ${t.from} -> ${r.status} (Target: ${r.location})`);
    assert([307, 308, 301, 302].includes(r.status), `Expected redirect for ${t.from}, got ${r.status}`);
    assert(r.location?.includes(t.to), `Expected target ${t.to}, got ${r.location}`);
  }

  console.log("\n=== 4. VERIFYING RETIRED CATEGORY REDIRECTS (LEGACY MAPPINGS) ===");
  const retiredSamples = [
    { from: "/collections/temples-architectural-stonework/compact-wall-mandirs", to: "/collections/temples-architectural-stonework/mandirs-temples/small-marble-mandir-for-home" },
    { from: "/collections/wall-art-reliefs/mandala-wall-art", to: "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels" },
    { from: "/collections/fountains-water-features/pedestal-fountains", to: "/collections/fountains-water-features/tiered-classical-fountains/tiered-fountains" },
  ];

  for (const t of retiredSamples) {
    const r = await checkUrl(t.from, [307, 308, 301, 302], false);
    console.log(`[RETIRED REDIRECT] ${t.from} -> ${r.status} (Target: ${r.location})`);
    assert([307, 308, 301, 302].includes(r.status), `Expected redirect for ${t.from}, got ${r.status}`);
    assert(r.location?.includes(t.to), `Expected target ${t.to}, got ${r.location}`);
  }

  console.log("\n=== 5. AUDIT ALL 20 APPROVED SUBCATEGORY URLS (MUST BE 200) ===");
  let subCount = 0;
  for (const col of Object.values(collectionsData)) {
    for (const sub of col.subcategories || []) {
      const subUrl = `/collections/${col.slug}/${sub.slug}`;
      const r = await checkUrl(subUrl, [200], false);
      assert(r.status === 200, `Subcategory URL ${subUrl} must return 200, got ${r.status}`);
      subCount++;
    }
  }
  console.log(`✓ All ${subCount} approved subcategories returned 200 OK.`);

  console.log("\n=== 6. AUDIT ALL 74 ACTIVE CATEGORY URLS (MUST BE 200) ===");
  let catCount = 0;
  const cats = Object.values(categoriesData);
  for (const cat of cats) {
    const catUrl = `/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`;
    const r = await checkUrl(catUrl, [200], false);
    assert(r.status === 200, `Category URL ${catUrl} must return 200, got ${r.status}`);
    catCount++;
  }
  console.log(`✓ All ${catCount} active categories returned 200 OK.`);

  console.log("\n==============================================");
  console.log("ALL TAXONOMY NAVIGATION & REDIRECT TESTS PASSED!");
  console.log("==============================================");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
