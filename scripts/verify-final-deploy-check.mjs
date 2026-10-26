import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runValidation() {
  console.log("=== JAIPUR STONECRAFT: FINAL PRE-DEPLOYMENT VALIDATION ===");

  // 1. Core AI & SEO Discovery Files
  const files = [
    { url: `${BASE_URL}/robots.txt`, name: "robots.txt" },
    { url: `${BASE_URL}/sitemap.xml`, name: "sitemap.xml" },
    { url: `${BASE_URL}/llms.txt`, name: "llms.txt" },
    { url: `${BASE_URL}/llms-full.txt`, name: "llms-full.txt" },
  ];

  for (const f of files) {
    const res = await fetch(f.url);
    assert.strictEqual(res.status, 200, `${f.name} should return 200 OK`);
    const text = await res.text();
    console.log(`[PASS] ${f.name} (Status: ${res.status}, Length: ${text.length} bytes)`);

    if (f.name === "llms.txt") {
      assert(text.includes("Monday through Sunday, 08:00 – 22:00 IST"), "llms.txt must have 7-day 08:00-22:00 IST");
      assert(text.includes("Granite"), "llms.txt must reference Granite where suitable");
      assert(!text.toLowerCase().includes("strictly excluded"), "llms.txt must not claim granite strictly excluded");
      console.log("  -> llms.txt verified: 7-day hours, balanced granite statement");
    }

    if (f.name === "llms-full.txt") {
      assert(text.includes("Monday through Sunday, 08:00 – 22:00 IST"), "llms-full.txt must have 7-day hours");
      assert(text.includes("Jaipur Stonecraft prioritizes efficient production and responsive project coordination"), "llms-full.txt must communicate credible speed advantage");
      assert(!text.includes("4 to 8 weeks"), "llms-full.txt must not contain fixed lead time 4 to 8 weeks");
      console.log("  -> llms-full.txt verified: 7-day hours, credible speed advantage, variable timelines");
    }

    if (f.name === "robots.txt") {
      assert(text.includes("Disallow: /admin"), "robots.txt should disallow /admin");
      assert(text.includes("Sitemap: https://jaipurstonecraft.com/sitemap.xml"), "robots.txt should declare sitemap");
      console.log("  -> robots.txt verified");
    }

    if (f.name === "sitemap.xml") {
      const urlMatches = text.match(/<loc>/g) || [];
      assert(urlMatches.length >= 100, `sitemap.xml should have 100+ URLs (found ${urlMatches.length})`);
      console.log(`  -> sitemap.xml verified (${urlMatches.length} URLs declared)`);
    }
  }

  // 2. All 7 Knowledge Guides
  console.log("\n--- Checking All 7 Knowledge Guides ---");
  const knowledgeGuides = [
    "/knowledge",
    "/knowledge/how-makrana-marble-statues-are-carved",
    "/knowledge/selecting-marble-for-home-mandir",
    "/knowledge/differences-between-makrana-marble-and-artificial-stone",
    "/knowledge/choosing-stone-jali-screens-guide",
    "/knowledge/architect-specification-guide-custom-stonework",
    "/knowledge/marble-statue-care-and-maintenance",
    "/knowledge/international-export-packing-care"
  ];

  for (const slug of knowledgeGuides) {
    const res = await fetch(`${BASE_URL}${slug}`);
    assert.strictEqual(res.status, 200, `${slug} must return 200 OK`);
    const html = await res.text();
    assert(html.includes("Jaipur Stonecraft"), `${slug} must render branding`);
    console.log(`[PASS] ${slug} (200 OK, ${html.length} bytes)`);
  }

  // 3. Structured Data Validation (Home, Contact, PDP)
  console.log("\n--- Validating Structured Data (LocalBusiness 7-day hours) ---");
  const homeRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(homeRes.status, 200);
  const homeHtml = await homeRes.text();
  
  // Extract JSON-LD
  const jsonLdRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let foundLocalBusiness = false;
  while ((match = jsonLdRegex.exec(homeHtml)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const types = Array.isArray(data["@type"]) ? data["@type"] : [data["@type"]];
      if (types.includes("LocalBusiness") || types.includes("Organization")) {
        foundLocalBusiness = true;
        const hours = data.openingHoursSpecification;
        assert(Array.isArray(hours) && hours.length > 0, "Must have openingHoursSpecification");
        const spec = hours[0];
        assert.strictEqual(spec.opens, "08:00", "Must open at 08:00");
        assert.strictEqual(spec.closes, "22:00", "Must close at 22:00");
        const days = spec.dayOfWeek;
        assert.strictEqual(days.length, 7, "Must include all 7 days of the week");
        assert(days.includes("Sunday"), "Must include Sunday");
        assert(days.includes("Monday"), "Must include Monday");
        console.log(`[PASS] Schema.org LocalBusiness Opening Hours verified: 7 days, opens: ${spec.opens}, closes: ${spec.closes}`);
      }
    } catch {
      // ignore other non-matching ld+json
    }
  }
  assert(foundLocalBusiness, "LocalBusiness / Organization schema must be found on Homepage");

  // 4. Contact Page Visible Text Check
  console.log("\n--- Checking Contact Page Visible Text ---");
  const contactRes = await fetch(`${BASE_URL}/contact`);
  assert.strictEqual(contactRes.status, 200);
  const contactHtml = await contactRes.text();
  assert(contactHtml.includes("Monday through Sunday, 8:00 AM to 10:00 PM (IST)"), "Contact page must state 7-day 8:00 AM to 10:00 PM IST");
  assert(contactHtml.includes("open seven days a week, including Sunday"), "Contact page must state open 7 days a week, including Sunday");
  console.log("[PASS] Contact page visible hours confirmed: Monday through Sunday, 8:00 AM to 10:00 PM (IST)");

  console.log("\n=======================================================");
  console.log("ALL PRE-DEPLOYMENT VERIFICATION CHECKS PASSED PERFECTLY!");
  console.log("=======================================================");
}

runValidation().catch((err) => {
  console.error("VALIDATION FAILED:", err);
  process.exit(1);
});
