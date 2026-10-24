async function testHttp() {
  const baseUrl = "http://localhost:3000";
  console.log(`Testing Live HTTP Endpoints against ${baseUrl}...\n`);

  const tests = [
    { name: "Collections Overview", url: `${baseUrl}/collections`, expectStatus: 200 },
    { name: "Sculptures Collection (Protected)", url: `${baseUrl}/collections/sculptures-statues`, expectStatus: 200 },
    { name: "Temples & Architecture Collection", url: `${baseUrl}/collections/temples-architectural-stonework`, expectStatus: 200 },
    { name: "Wall Art & Reliefs Collection", url: `${baseUrl}/collections/wall-art-reliefs`, expectStatus: 200 },
    { name: "Fountains Collection", url: `${baseUrl}/collections/fountains-water-features`, expectStatus: 200 },
    { name: "Decorative Stone Art Collection", url: `${baseUrl}/collections/decorative-stone-art`, expectStatus: 200 },
    { name: "Custom Creations Collection", url: `${baseUrl}/collections/custom-bespoke-creations`, expectStatus: 200 },
    
    // Subcategories
    { name: "Jali Subcategory Page", url: `${baseUrl}/collections/temples-architectural-stonework/jali`, expectStatus: 200 },
    { name: "Pillars & Columns Subcategory Page", url: `${baseUrl}/collections/temples-architectural-stonework/pillars-columns`, expectStatus: 200 },
    { name: "Mandir & Temple Subcategory Page", url: `${baseUrl}/collections/temples-architectural-stonework/mandir-temple`, expectStatus: 200 },
    { name: "Wall Murals Subcategory Page", url: `${baseUrl}/collections/wall-art-reliefs/wall-murals`, expectStatus: 200 },
    { name: "Relief Panels Subcategory Page", url: `${baseUrl}/collections/wall-art-reliefs/relief-panels`, expectStatus: 200 },

    // Categories
    { name: "Small Marble Mandir for Home Category", url: `${baseUrl}/collections/temples-architectural-stonework/mandir-temple/small-marble-mandir-for-home`, expectStatus: 200 },
    { name: "Marble Jali Designs Category", url: `${baseUrl}/collections/temples-architectural-stonework/jali/marble-jali-designs`, expectStatus: 200 },
    { name: "Stone Arches & Door Frames Category", url: `${baseUrl}/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames`, expectStatus: 200 },
    { name: "Stone Relief Panels Category", url: `${baseUrl}/collections/wall-art-reliefs/relief-panels/stone-relief-panels`, expectStatus: 200 },
    { name: "Tiered Fountains Category", url: `${baseUrl}/collections/fountains-water-features/tiered-fountains/tiered-fountains`, expectStatus: 200 },
    { name: "Marble & Stone Planters Category", url: `${baseUrl}/collections/decorative-stone-art/planters-tulsi-pots/marble-stone-planters`, expectStatus: 200 },

    // Protected Statue Category & Product
    { name: "Protected Ganesh Ji Category", url: `${baseUrl}/collections/sculptures-statues/hindu-sculptures/ganesh-ji`, expectStatus: 200 },
    { name: "Protected Ganesh Statue Product", url: `${baseUrl}/designs/ganesh-ji/blessing-ganesh-statue`, expectStatus: 200 },

    // Migrated Canonical Product Detail
    { name: "Migrated Mandir Product Detail", url: `${baseUrl}/designs/small-marble-mandir-for-home/bespoke-compact-wall-mandirs-sculpture`, expectStatus: 200 },
    { name: "Migrated Jali Product Detail", url: `${baseUrl}/designs/marble-jali-designs/botanical-lotus-lattice-screen`, expectStatus: 200 }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await fetch(t.url, { redirect: "manual" });
      if (res.status === t.expectStatus) {
        console.log(`  ✅ PASS: [${res.status}] ${t.name}`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: [${res.status} vs expected ${t.expectStatus}] ${t.name} (${t.url})`);
        failed++;
      }
    } catch (e) {
      console.error(`  ❌ FAIL (Error): ${t.name} - ${e.message}`);
      failed++;
    }
  }

  // Test Redirects
  console.log("\n--- Testing Redirects ---");
  const redirectTests = [
    {
      name: "Legacy Subcategory Redirect: home-mandirs",
      url: `${baseUrl}/collections/temples-architectural-stonework/home-mandirs`,
      expectRedirectTo: "/collections/temples-architectural-stonework/mandir-temple"
    },
    {
      name: "Legacy Category Redirect: compact-wall-mandirs",
      url: `${baseUrl}/collections/temples-architectural-stonework/home-mandirs/compact-wall-mandirs`,
      expectRedirectTo: "/collections/temples-architectural-stonework/mandir-temple/small-marble-mandir-for-home"
    },
    {
      name: "Legacy Product URL Redirect: compact-wall-mandirs -> small-marble-mandir-for-home",
      url: `${baseUrl}/designs/compact-wall-mandirs/bespoke-compact-wall-mandirs-sculpture`,
      expectRedirectTo: "/designs/small-marble-mandir-for-home/bespoke-compact-wall-mandirs-sculpture"
    }
  ];

  for (const rt of redirectTests) {
    try {
      const res = await fetch(rt.url, { redirect: "manual" });
      const location = res.headers.get("location") || "";
      if ([301, 302, 307, 308].includes(res.status) && location.includes(rt.expectRedirectTo)) {
        console.log(`  ✅ PASS: [${res.status} -> ${location}] ${rt.name}`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: [${res.status}, Location: "${location}"] ${rt.name}`);
        failed++;
      }
    } catch (e) {
      console.error(`  ❌ FAIL (Error): ${rt.name} - ${e.message}`);
      failed++;
    }
  }

  console.log(`\nHTTP Summary: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) process.exit(1);
  process.exit(0);
}

testHttp();
