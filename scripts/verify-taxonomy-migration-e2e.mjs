import fs from "fs";

const BASE_URL = "http://localhost:3000";

async function checkRoute(urlPath, expectedStatus = [200]) {
  try {
    const res = await fetch(`${BASE_URL}${urlPath}`, { redirect: "manual" });
    const isOk = expectedStatus.includes(res.status);
    const location = res.headers.get("location");
    return {
      path: urlPath,
      status: res.status,
      ok: isOk,
      location,
      error: isOk ? null : `Expected ${expectedStatus.join(",")}, got ${res.status}`
    };
  } catch (err) {
    return {
      path: urlPath,
      status: 0,
      ok: false,
      location: null,
      error: err.message
    };
  }
}

async function run() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — TAXONOMY MIGRATION E2E TEST");
  console.log("==================================================\n");

  const results = {
    collections: [],
    subcategories: [],
    categories: [],
    products: [],
    redirects: [],
    sculpturesProtection: []
  };

  // 1. Test All 6 Collections Level 1
  console.log("--- 1. Testing Collection Level-1 Pages ---");
  const collections = [
    "sculptures-statues",
    "temples-architectural-stonework",
    "wall-art-reliefs",
    "fountains-water-features",
    "decorative-stone-art",
    "custom-bespoke-creations"
  ];
  for (const c of collections) {
    const res = await checkRoute(`/collections/${c}`, [200]);
    results.collections.push(res);
    console.log(`[COL] /collections/${c} -> ${res.status} ${res.ok ? "✓" : "❌"}`);
  }

  // 2. Test 15 Approved Subcategories Level 2
  console.log("\n--- 2. Testing 15 Approved Subcategories Level-2 Pages ---");
  const approvedSubs = [
    // Temples & Architectural Stonework (4)
    "/collections/temples-architectural-stonework/mandirs-temples",
    "/collections/temples-architectural-stonework/jali-designs",
    "/collections/temples-architectural-stonework/pillars-columns",
    "/collections/temples-architectural-stonework/architectural-components",
    // Wall Art & Reliefs (3)
    "/collections/wall-art-reliefs/religious-spiritual-wall-art",
    "/collections/wall-art-reliefs/heritage-decorative-wall-art",
    "/collections/wall-art-reliefs/custom-wall-art-reliefs",
    // Fountains & Water Features (3)
    "/collections/fountains-water-features/tiered-classical-fountains",
    "/collections/fountains-water-features/wall-freestanding-fountains",
    "/collections/fountains-water-features/sculptural-water-features",
    // Decorative Stone Art (3)
    "/collections/decorative-stone-art/planters-tulsi-pots",
    "/collections/decorative-stone-art/pedestals-stands",
    "/collections/decorative-stone-art/decorative-garden-stone-art",
    // Custom & Bespoke Creations (2)
    "/collections/custom-bespoke-creations/custom-architectural-stonework",
    "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs"
  ];

  for (const s of approvedSubs) {
    const res = await checkRoute(s, [200]);
    results.subcategories.push(res);
    console.log(`[SUB] ${s} -> ${res.status} ${res.ok ? "✓" : "❌"}`);
  }

  // 3. Test Sample Categories Level 3 in the 5 collections
  console.log("\n--- 3. Testing Sample Category Level-3 Pages ---");
  const sampleCategories = [
    "/collections/temples-architectural-stonework/mandirs-temples/small-marble-mandir-for-home",
    "/collections/temples-architectural-stonework/mandirs-temples/temple-parts-designs",
    "/collections/temples-architectural-stonework/jali-designs/marble-jali-designs",
    "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
    "/collections/temples-architectural-stonework/architectural-components/jharokhas-windows",
    "/collections/wall-art-reliefs/religious-spiritual-wall-art/devotional-relief-panels",
    "/collections/wall-art-reliefs/religious-spiritual-wall-art/religious-wall-murals",
    "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
    "/collections/wall-art-reliefs/heritage-decorative-wall-art/floral-nature-wall-panels",
    "/collections/wall-art-reliefs/custom-wall-art-reliefs/commemorative-reliefs",
    "/collections/fountains-water-features/tiered-classical-fountains/tiered-fountains",
    "/collections/fountains-water-features/tiered-classical-fountains/central-courtyard-fountains",
    "/collections/fountains-water-features/wall-freestanding-fountains/wall-fountains",
    "/collections/fountains-water-features/wall-freestanding-fountains/freestanding-fountains",
    "/collections/fountains-water-features/sculptural-water-features/cascading-water-walls",
    "/collections/fountains-water-features/sculptural-water-features/poolside-stone-waterfalls",
    "/collections/decorative-stone-art/planters-tulsi-pots/marble-stone-planters",
    "/collections/decorative-stone-art/pedestals-stands/marble-pedestals-stands",
    "/collections/decorative-stone-art/decorative-garden-stone-art/carved-stone-vases",
    "/collections/decorative-stone-art/decorative-garden-stone-art/marble-urns",
    "/collections/decorative-stone-art/decorative-garden-stone-art/decorative-bowls",
    "/collections/decorative-stone-art/decorative-garden-stone-art/garden-lanterns-lamps",
    "/collections/decorative-stone-art/decorative-garden-stone-art/benches-seating",
    "/collections/custom-bespoke-creations/custom-architectural-stonework/full-temple-construction",
    "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs/custom-monumental-sculptures",
    "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs/ancestral-portrait-carvings",
    "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs/lifesize-memorial-busts"
  ];

  for (const cat of sampleCategories) {
    const res = await checkRoute(cat, [200]);
    results.categories.push(res);
    console.log(`[CAT] ${cat} -> ${res.status} ${res.ok ? "✓" : "❌"}`);
  }

  // 4. Test Key Redirects (Must return 308 / 307 / 301 and have correct location)
  console.log("\n--- 4. Testing Old Taxonomy Permanent Redirects ---");
  const testRedirects = [
    { from: "/collections/wall-art-reliefs/religious-reliefs", to: "/collections/wall-art-reliefs/religious-spiritual-wall-art" },
    { from: "/collections/wall-art-reliefs/wall-murals", to: "/collections/wall-art-reliefs/religious-spiritual-wall-art" },
    { from: "/collections/wall-art-reliefs/stone-relief-panels", to: "/collections/wall-art-reliefs/heritage-decorative-wall-art" },
    { from: "/collections/custom-bespoke-creations/custom-wall-art-reliefs", to: "/collections/wall-art-reliefs/custom-wall-art-reliefs" },
    { from: "/collections/fountains-water-features/tiered-fountains", to: "/collections/fountains-water-features/tiered-classical-fountains" },
    { from: "/collections/fountains-water-features/wall-fountains", to: "/collections/fountains-water-features/wall-freestanding-fountains" },
    { from: "/collections/fountains-water-features/freestanding-fountains", to: "/collections/fountains-water-features/wall-freestanding-fountains" },
    { from: "/collections/fountains-water-features/sculptural-fountains", to: "/collections/fountains-water-features/sculptural-water-features" },
    { from: "/collections/decorative-stone-art/planters", to: "/collections/decorative-stone-art/planters-tulsi-pots" },
    { from: "/collections/decorative-stone-art/tulsi-pots", to: "/collections/decorative-stone-art/planters-tulsi-pots" },
    { from: "/collections/decorative-stone-art/garden-outdoor-stone-art", to: "/collections/decorative-stone-art/decorative-garden-stone-art" },
    { from: "/collections/custom-bespoke-creations/custom-sculptures", to: "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs" },
    { from: "/collections/custom-bespoke-creations/custom-portraits", to: "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs" }
  ];

  for (const r of testRedirects) {
    const res = await checkRoute(r.from, [301, 307, 308]);
    const matchesTarget = res.location === r.to || res.location === `${BASE_URL}${r.to}`;
    const ok = res.ok && matchesTarget;
    results.redirects.push({ ...res, expectedTo: r.to, matchesTarget, ok });
    console.log(`[REDIR] ${r.from} -> ${res.status} [Location: ${res.location}] ${ok ? "✓" : "❌"}`);
  }

  // 5. Test Sculptures & Statues Protection (5 subcategories and sample categories)
  console.log("\n--- 5. Testing Protected Sculptures & Statues ---");
  const sculptureRoutes = [
    "/collections/sculptures-statues/hindu-sculptures",
    "/collections/sculptures-statues/buddhist-jain-sculptures",
    "/collections/sculptures-statues/human-portrait-sculptures",
    "/collections/sculptures-statues/classical-artistic-sculptures",
    "/collections/sculptures-statues/animal-bird-sculptures",
    "/collections/sculptures-statues/hindu-sculptures/ganesh-ji",
    "/collections/sculptures-statues/hindu-sculptures/krishna-ji",
    "/collections/sculptures-statues/hindu-sculptures/shiva-ji"
  ];

  for (const sc of sculptureRoutes) {
    const res = await checkRoute(sc, [200]);
    results.sculpturesProtection.push(res);
    console.log(`[PROTECTED] ${sc} -> ${res.status} ${res.ok ? "✓" : "❌"}`);
  }

  // 6. Test Detail Pages for previously unparked products
  console.log("\n--- 6. Testing Product Detail Pages for Unparked Products ---");
  const sampleProducts = [
    "/designs/carved-stone-vases/bespoke-carved-stone-vases-sculpture",
    "/designs/benches-seating/traditional-benches-seating",
    "/designs/garden-lanterns-lamps/royal-carved-garden-lanterns-lamps",
    "/designs/custom-monumental-sculptures/bespoke-custom-monumental-sculptures-sculpture",
    "/designs/ancestral-portrait-carvings/traditional-ancestral-portrait-carvings",
    "/designs/cascading-water-walls/bespoke-cascading-water-walls-sculpture",
    "/designs/commemorative-reliefs/bespoke-commemorative-reliefs-sculpture"
  ];

  for (const p of sampleProducts) {
    const res = await checkRoute(p, [200]);
    results.products.push(res);
    console.log(`[PROD] ${p} -> ${res.status} ${res.ok ? "✓" : "❌"}`);
  }

  const allPassed = [
    ...results.collections,
    ...results.subcategories,
    ...results.categories,
    ...results.redirects,
    ...results.sculpturesProtection,
    ...results.products
  ].every(r => r.ok);

  console.log("\n==================================================");
  console.log(allPassed ? "🎉 ALL ROUTES & REDIRECT TESTS PASSED PERFECTLY!" : "⚠️ SOME TESTS FAILED!");
  console.log("==================================================");

  fs.writeFileSync("scripts/e2e-test-results.json", JSON.stringify(results, null, 2));
}

run();
