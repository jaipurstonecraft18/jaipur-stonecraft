import fs from "fs";
import path from "path";

const mapping = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "migration-mapping.json"), "utf8"));
const baseline = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "audit-baseline.json"), "utf8"));

console.log("=== PHASE 3 VALIDATION OF MIGRATION MAPPING ===");

const errors = [];
const warnings = [];

// 1. Missing targets or target fields
mapping.forEach(m => {
  if (!m.targetCollection || !m.targetSubcategory || !m.targetCategory) {
    errors.push(`Product ${m.productId} has incomplete target path: ${m.targetCollection} -> ${m.targetSubcategory} -> ${m.targetCategory}`);
  }
});

// 2. Statue taxonomy protection check
const protectedInMigration = mapping.filter(m => m.currentCollection === "sculptures-statues");
if (protectedInMigration.length !== 127) {
  errors.push(`Expected 127 protected statues, found ${protectedInMigration.length}`);
}
protectedInMigration.forEach(m => {
  if (m.action !== "RETAIN_PROTECTED") {
    errors.push(`Protected statue ${m.productId} has invalid action: ${m.action}`);
  }
  if (m.targetCollection !== "sculptures-statues") {
    errors.push(`Protected statue ${m.productId} was reassigned away from sculptures-statues!`);
  }
  if (m.currentPath !== m.targetPath) {
    errors.push(`Protected statue ${m.productId} path was changed from ${m.currentPath} to ${m.targetPath}!`);
  }
});

// 3. One primary category check (no product mapped multiple times)
const productIds = mapping.map(m => m.productId);
const uniqueProductIds = new Set(productIds);
if (uniqueProductIds.size !== mapping.length) {
  errors.push(`Duplicate product IDs in mapping: ${mapping.length - uniqueProductIds.size} duplicates found.`);
}

// 4. Duplicate SKUs or Slugs
const skus = baseline.products.map(p => p.sku);
const uniqueSkus = new Set(skus);
if (uniqueSkus.size !== skus.length) {
  warnings.push(`Baseline has ${skus.length - uniqueSkus.size} duplicate SKUs.`);
}

// 5. Granite verification check
baseline.products.forEach(p => {
  const contentStr = JSON.stringify(p).toLowerCase();
  if (contentStr.includes("granite")) {
    errors.push(`CRITICAL VIOLATION: Granite detected in product record ${p.id}!`);
  }
});

// 6. Check target categories breakdown
const targetCategoryCounts = {};
mapping.forEach(m => {
  const key = `${m.targetCollection} -> ${m.targetSubcategory} -> ${m.targetCategory}`;
  targetCategoryCounts[key] = (targetCategoryCounts[key] || 0) + 1;
});

console.log("\nTarget Categories Breakdown:");
for (const [key, count] of Object.entries(targetCategoryCounts).sort()) {
  console.log(`  ${key}: ${count} products`);
}

// 7. Check redirect mapping
const redirects = [];
mapping.forEach(m => {
  if (m.urlChange) {
    redirects.push({
      from: m.currentProductUrl,
      to: m.targetProductUrl,
      productId: m.productId
    });
  }
});

console.log(`\nTotal product URL redirects required: ${redirects.length}`);

// Verify no redirect loops
redirects.forEach(r => {
  if (r.from === r.to) {
    errors.push(`Redirect loop detected for ${r.productId}: ${r.from} -> ${r.to}`);
  }
});

console.log("\nValidation Summary:");
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.error("Errors found:", errors);
  process.exit(1);
} else {
  console.log("✅ All Phase 3 validation checks PASSED successfully!");
  process.exit(0);
}
