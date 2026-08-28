import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "jaipur_stonecraft.db");
const db = new Database(dbPath);

console.log("=== PHASE 5 PILOT SEO & DISCOVERY VALIDATION ===");

const pilotSlugs = [
  "blessing-ganesh-statue",
  "traditional-seated-ganesh",
  "flute-playing-krishna",
  "geometric-star-pattern-jali",
  "botanical-lotus-lattice-screen"
];

let passCount = 0;

pilotSlugs.forEach((slug) => {
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
  if (!row) {
    console.error(`❌ Product [${slug}] not found in DB.`);
    return;
  }

  const attributes = JSON.parse(row.attributes || "{}");
  const seo = JSON.parse(row.seo || "{}");

  const checks = [
    { label: "Status Published", ok: row.status === "published" },
    { label: "Valid Parent Category", ok: Boolean(row.parent_category) },
    { label: "Valid Material ID", ok: Boolean(row.primary_material_id) },
    { label: "Product Family Present", ok: Boolean(attributes.productFamily) },
    { label: "Availability Status Present", ok: Boolean(attributes.availabilityStatus) },
    { label: "SEO Title Tag Present", ok: Boolean(seo.title) },
    { label: "Canonical URL Present", ok: Boolean(seo.canonicalUrl) }
  ];

  const failed = checks.filter(c => !c.ok);
  if (failed.length === 0) {
    console.log(`✓ [PASS] Product "${row.name}" (${slug})`);
    passCount++;
  } else {
    console.log(`❌ [FAIL] Product "${row.name}" (${slug}) - Failed checks: ${failed.map(f => f.label).join(", ")}`);
  }
});

console.log(`\nValidation Summary: ${passCount} / ${pilotSlugs.length} Pilot Products PASSED all checks.`);

db.close();
