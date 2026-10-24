import { performSmartSearch } from "../lib/search/smart-search-engine.js";

async function main() {
  const terms = [
    "religious relief",
    "stone mural",
    "marble jali",
    "mandir",
    "wall fountain"
  ];

  console.log("==================================================");
  console.log("TESTING SEARCH & DISCOVERY ACROSS APPROVED TAXONOMY");
  console.log("==================================================");

  for (const term of terms) {
    const result = await performSmartSearch(term, { scope: "all", limit: 5 });
    console.log(`\nQuery: "${term}" -> Found ${result.totalCount} results:`);
    console.log(`  - Products (${result.products?.length || 0}):`, (result.products || []).slice(0, 3).map(p => p.name));
    console.log(`  - Categories (${result.categories?.length || 0}):`, (result.categories || []).map(c => `${c.name} (${c.href})`));
    console.log(`  - Collections (${result.collections?.length || 0}):`, (result.collections || []).map(col => col.name));
  }

  console.log("\n==================================================");
  console.log("✓ SEARCH VERIFICATION COMPLETE");
  console.log("==================================================");
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
