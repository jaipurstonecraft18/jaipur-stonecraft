/**
 * JAIPUR STONECRAFT — PRODUCT INTELLIGENCE ENGINE (PIE v3.0)
 * Comprehensive Automated Verification Suite
 * 
 * Verifies all 15 required realistic scenarios and failure cases:
 * 1. Well-described marble statue with essential facts present and optional attributes absent (Scores 100%, 0 blockers, Ready)
 * 2. Granite relief panel with its correct material preserved (Granite supported natural stone, 0 blockers)
 * 3. Jali panel with concise but useful content (Passes cleanly without arbitrary length penalties)
 * 4. Fountain with category-appropriate content (Category-specific water feature intent)
 * 5. Custom temple project with legitimately inapplicable retail fields (Marked NOT_APPLICABLE, no penalty)
 * 6. Product with a genuinely missing essential fact (Flags BLOCKER, BLOCKED from publication)
 * 7. Product without FAQs, secondary keywords, or optional tags (OPTIONAL, 0 score deduction)
 * 8. Product with an empty optional field that should not be penalized (OPTIONAL, 0 penalty)
 * 9. Product with contradictory material data (Flags contradiction recommendation)
 * 10. Real technical SEO defect detected by technical check (e.g. external canonical URL -> BLOCKER)
 * 11. Product that requires no changes (Clean state: 100%, ELIGIBLE, overallStatus 'ready', 0 blockers, 0 recommendations)
 * 12. AI suggestion that attempts to introduce an unsupported claim (Flagged by C08 trustworthiness)
 * 13. AI suggestion that conflicts with a verified material (Preserves verified stone, blocks synthetic composites)
 * 14. Malformed AI response (Safely caught and rejected without crashing)
 * 15. Product that can be saved, reopened, edited, and rendered publicly without losing valid data (Metadata & Schema.org JSON-LD generation)
 */

import {
  evaluateProductIntelligence,
  PIE_RULE_STATUS,
  PIE_DIMENSIONS,
  APPROVED_STONE_MATERIALS,
  FORBIDDEN_STONE_TERMS,
  DEFAULT_SEO_AUDIT_CONFIG
} from "../lib/seo/product-intelligence-engine.js";

import {
  PIE_PROMPTS,
  validateAndCleanPieOutput,
  formatVerifiedProductFacts
} from "../lib/ai/prompts/product-prompts.js";

import {
  generatePageMetadata,
  generateProductMetadata
} from "../lib/seo/metadata.js";

import {
  generateProductSchema,
  generateBreadcrumbSchema
} from "../lib/seo/schemas.js";

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

console.log("\n===============================================================================");
console.log("JAIPUR STONECRAFT — PRODUCT INTELLIGENCE ENGINE (PIE v3.0) VERIFICATION SUITE");
console.log("===============================================================================\n");

// -------------------------------------------------------------------
// SCENARIO 1: Well-described marble statue with essential facts present and optional attributes absent
// -------------------------------------------------------------------
console.log("Scenario 1: Well-described marble statue with essential facts present & optional attributes absent...");
const scenario1Product = {
  name: "24-Inch Makrana White Marble Ganesh Statue",
  slug: "makrana-white-marble-ganesh-statue-24-inch",
  sku: "JSC-MURTI-GAN-001",
  status: "published",
  productType: "statue",
  parentCollection: "sculptures-statues",
  parentSubcategory: "hindu-sculptures",
  parentCategory: "ganesh-ji",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Hand-carved 24-inch Lord Ganesh statue sculpted from single-block authentic Makrana pure white marble at Jaipur Stonecraft atelier.",
  imageSrc: "https://jaipurstonecraft.com/images/products/ganesh-24.jpg",
  seo: {
    title: "24-Inch Makrana White Marble Ganesh Statue | Jaipur Stonecraft",
    description: "Authentic hand-carved 24-inch Makrana white marble Ganesh statue for sacred home mandirs. Meticulously sculpted by master Jaipur artisans."
  }
  // Optional attributes, FAQs, secondary keywords, and gallery angles are deliberately absent
};

const res1 = evaluateProductIntelligence(scenario1Product);
assert(res1.score === 100, `Scenario 1 scores 100% (got ${res1.score}%)`);
assert(res1.statuses.publicationEligibility === "ELIGIBLE", "Scenario 1 publication eligibility is ELIGIBLE");
assert(res1.overallStatus === "ready", "Scenario 1 overallStatus is 'ready'");
assert(res1.blockers.length === 0, `Scenario 1 has 0 blockers (found: ${res1.blockers.length})`);
assert(res1.recommendations.length === 0, `Scenario 1 has 0 recommendations (found: ${res1.recommendations.length})`);
assert(res1.optionalCount > 0, `Scenario 1 identifies optional enhancements without score deduction (found: ${res1.optionalCount})`);
console.log("");

// -------------------------------------------------------------------
// SCENARIO 2: Granite relief panel with its correct material preserved
// -------------------------------------------------------------------
console.log("Scenario 2: Granite relief panel with correct material preserved (Granite is supported)...");
const scenario2Product = {
  name: "Black Granite Lotus Wall Relief Panel",
  slug: "black-granite-lotus-wall-relief-panel",
  sku: "JSC-RELIEF-GRA-002",
  status: "published",
  productType: "relief",
  parentCollection: "wall-art-reliefs",
  parentSubcategory: "stone-relief-panels",
  parentCategory: "floral-nature-wall-panels",
  primaryMaterialId: "black-granite",
  shortDescription: "Hand-chiseled architectural wall mural panel carved from monolithic natural black granite with polished raised relief accents.",
  imageSrc: "https://jaipurstonecraft.com/images/products/granite-lotus.jpg",
  seo: {
    title: "Black Granite Lotus Wall Relief Panel | Jaipur Stonecraft",
    description: "Monolithic natural black granite wall relief panel featuring hand-sculpted blooming lotus motifs for interior and exterior architectural accents."
  }
};

const res2 = evaluateProductIntelligence(scenario2Product);
assert(res2.statuses.publicationEligibility === "ELIGIBLE", "Granite product is ELIGIBLE for publication");
assert(res2.score === 100, `Granite product scores 100% without penalty (got ${res2.score}%)`);
assert(!res2.blockers.some(b => b.code === "P03"), "Rule P03 approves natural granite");
assert(!res2.blockers.some(b => b.code === "P07"), "Rule P07 finds no contradiction for natural granite");
assert(APPROVED_STONE_MATERIALS.includes("black-granite"), "black-granite is registered in APPROVED_STONE_MATERIALS");
assert(!FORBIDDEN_STONE_TERMS.includes("granite"), "granite is NOT in FORBIDDEN_STONE_TERMS");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 3: Jali panel with concise but useful content
// -------------------------------------------------------------------
console.log("Scenario 3: Jali panel with concise but useful content...");
const scenario3Product = {
  name: "Geometric Sandstone Jali Screen",
  slug: "geometric-sandstone-jali-screen",
  sku: "JSC-JALI-003",
  status: "published",
  productType: "architectural",
  parentCollection: "temples-architectural-stonework",
  parentSubcategory: "jali-designs",
  parentCategory: "marble-jali-designs",
  primaryMaterialId: "bansi-paharpur-pink-sandstone",
  shortDescription: "Hand-pierced architectural sandstone jali screen featuring traditional geometric lattice patterns for courtyards and privacy facades.",
  imageSrc: "https://jaipurstonecraft.com/images/products/jali.jpg",
  seo: {
    title: "Geometric Sandstone Jali Screen | Jaipur Stonecraft",
    description: "Perforated natural pink sandstone jali screen hand-carved in Jaipur for passive cooling, diffused lighting, and architectural elegance."
  }
};

const res3 = evaluateProductIntelligence(scenario3Product);
assert(res3.score === 100, `Jali panel scores 100% with concise content (got ${res3.score}%)`);
assert(res3.blockers.length === 0, "0 blockers on concise jali screen");
assert(!res3.recommendations.some(r => r.code === "C01"), "C01 recognizes concise summary clarity without arbitrary length penalty");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 4: Fountain with category-appropriate content
// -------------------------------------------------------------------
console.log("Scenario 4: Fountain with category-appropriate content...");
const scenario4Product = {
  name: "Tiered Petal White Marble Courtyard Fountain",
  slug: "tiered-petal-white-marble-courtyard-fountain",
  sku: "JSC-FOUNT-004",
  status: "published",
  productType: "fountain",
  parentCollection: "fountains-water-features",
  parentSubcategory: "tiered-fountains",
  parentCategory: "tiered-fountains",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Three-tiered hand-carved white marble garden fountain featuring fluted lotus basins and self-contained water recirculation plumbing.",
  imageSrc: "https://jaipurstonecraft.com/images/products/fountain.jpg",
  seo: {
    title: "Tiered Petal White Marble Courtyard Fountain | Jaipur Stonecraft",
    description: "Three-tiered hand-carved Makrana marble courtyard fountain with tranquil water cascade for estate gardens."
  }
};

const res4 = evaluateProductIntelligence(scenario4Product);
assert(res4.score === 100, `Fountain scores 100% (got ${res4.score}%)`);
assert(res4.items.find(i => i.code === "C04").rawStatus === PIE_RULE_STATUS.PASS, "C04 validates fountain and water feature intent");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 5: Custom temple project with legitimately inapplicable retail fields
// -------------------------------------------------------------------
console.log("Scenario 5: Custom temple project with legitimately inapplicable retail fields...");
const scenario5Product = {
  name: "Bespoke Carved Stone Temple Mandir",
  slug: "bespoke-carved-stone-temple-mandir",
  sku: "JSC-BESPOKE-005",
  status: "published",
  isCustomOnly: true,
  productType: "bespoke",
  parentCollection: "temples-architectural-stonework",
  parentSubcategory: "mandirs-temples",
  parentCategory: "small-marble-mandir-for-home",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Custom-commissioned stone temple sanctum engineered and chiseled to bespoke architectural dimensions.",
  imageSrc: "https://jaipurstonecraft.com/images/products/mandir.jpg",
  seo: {
    title: "Bespoke Carved Stone Temple Mandir | Jaipur Stonecraft",
    description: "Custom hand-carved white marble mandirs engineered to client sanctum dimensions with master Shilpa Shastra stone craftsmanship."
  }
  // No fixed retail dimensions (since dimensions depend on client architectural drawing)
};

const res5 = evaluateProductIntelligence(scenario5Product);
const p04Check = res5.items.find(i => i.code === "P04");
assert(p04Check.rawStatus === PIE_RULE_STATUS.NOT_APPLICABLE, "P04 marks fixed physical dimensions as NOT_APPLICABLE for bespoke project");
assert(res5.score === 100, `Bespoke project is not penalized for absent retail dimensions (got ${res5.score}%)`);
console.log("");

// -------------------------------------------------------------------
// SCENARIO 6: Product with a genuinely missing essential fact
// -------------------------------------------------------------------
console.log("Scenario 6: Product with a genuinely missing essential fact...");
const scenario6Product = {
  name: "", // Missing essential identity
  slug: "unnamed-artwork",
  parentCategory: "", // Missing category
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Hand-carved marble item.",
  imageSrc: "" // Missing cover photo
};

const res6 = evaluateProductIntelligence(scenario6Product);
assert(res6.statuses.publicationEligibility === "BLOCKED", "Missing essential facts BLOCKS publication eligibility");
assert(res6.overallStatus === "incomplete", "overallStatus is 'incomplete'");
assert(res6.blockers.some(b => b.code === "P01"), "P01 flags missing product name as BLOCKER");
assert(res6.blockers.some(b => b.code === "P02"), "P02 flags missing category as BLOCKER");
assert(res6.blockers.some(b => b.code === "M01"), "M01 flags missing cover image as BLOCKER");
assert(res6.score <= 50, `Score is heavily penalized for multiple essential blockers (${res6.score}%)`);
console.log("");

// -------------------------------------------------------------------
// SCENARIO 7: Product without FAQs, secondary keywords, or optional tags
// -------------------------------------------------------------------
console.log("Scenario 7: Product without FAQs, secondary keywords, or optional tags...");
const scenario7Product = {
  name: "Pure White Marble Elephant Statue",
  slug: "pure-white-marble-elephant-statue",
  sku: "JSC-ELE-007",
  status: "published",
  parentCollection: "sculptures-statues",
  parentSubcategory: "animal-bird-sculptures",
  parentCategory: "custom-animal-figures",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Finely hand-carved Makrana pure white marble elephant statue with traditional ceremonial decorative trappings.",
  imageSrc: "https://jaipurstonecraft.com/images/products/elephant.jpg",
  seo: {
    title: "Pure White Marble Elephant Statue | Jaipur Stonecraft",
    description: "Hand-carved Makrana pure white marble elephant statue for sanctum entrance and luxury interior decor."
  }
  // FAQs, secondary keywords, discovery tags deliberately empty
};

const res7 = evaluateProductIntelligence(scenario7Product);
assert(res7.score === 100, `Product without FAQs and secondary keywords scores 100% (got ${res7.score}%)`);
const c06Check = res7.items.find(i => i.code === "C06");
const c07Check = res7.items.find(i => i.code === "C07");
assert(c06Check.rawStatus === PIE_RULE_STATUS.OPTIONAL, "C06 secondary keywords is marked OPTIONAL");
assert(c07Check.rawStatus === PIE_RULE_STATUS.OPTIONAL, "C07 FAQs is marked OPTIONAL");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 8: Product with an empty optional field that should not be penalized
// -------------------------------------------------------------------
console.log("Scenario 8: Product with empty optional field that should not be penalized...");
const scenario8Product = {
  name: "Hand-Carved Stone Wall Plaque",
  slug: "hand-carved-stone-wall-plaque",
  sku: "JSC-PLQ-008",
  status: "published",
  parentCollection: "wall-art-reliefs",
  parentSubcategory: "stone-relief-panels",
  parentCategory: "floral-nature-wall-panels",
  primaryMaterialId: "jodhpur-red-sandstone",
  shortDescription: "Decorative hand-chiseled Jodhpur red sandstone wall plaque featuring traditional Rajasthani floral motifs.",
  imageSrc: "https://jaipurstonecraft.com/images/products/plaque.jpg",
  seo: {
    title: "Hand-Carved Stone Wall Plaque | Jaipur Stonecraft",
    description: "Authentic Jodhpur red sandstone decorative wall plaque hand-crafted by master stone carvers."
  },
  attributes: {} // Empty optional attributes
};

const res8 = evaluateProductIntelligence(scenario8Product);
assert(res8.score === 100, "Empty optional attributes dictionary does not penalize score (100%)");
assert(res8.blockers.length === 0, "No blockers on product with empty optional attributes");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 9: Product with contradictory material data
// -------------------------------------------------------------------
console.log("Scenario 9: Product with contradictory material data...");
const scenario9Product = {
  name: "White Marble and Red Sandstone Mixed Idol",
  slug: "white-marble-and-red-sandstone-mixed-idol",
  sku: "JSC-MIX-009",
  status: "draft",
  parentCollection: "sculptures-statues",
  parentSubcategory: "hindu-sculptures",
  parentCategory: "ganesh-ji",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Carved from pure white marble but also crafted from solid red sandstone in identical carving.",
  imageSrc: "https://jaipurstonecraft.com/images/products/mix.jpg",
  seo: {
    title: "Mixed Stone Idol | Jaipur Stonecraft",
    description: "Idol mentioning both white marble and red sandstone simultaneously."
  }
};

const res9 = evaluateProductIntelligence(scenario9Product);
const p07 = res9.items.find(i => i.code === "P07");
assert(p07.rawStatus === PIE_RULE_STATUS.RECOMMENDED, "P07 flags contradictory stone materials as RECOMMENDED review item");
assert(res9.recommendations.some(r => r.code === "P07"), "Contradiction surfaced in recommendations array");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 10: Real technical SEO defect detected by relevant check
// -------------------------------------------------------------------
console.log("Scenario 10: Real technical SEO defect detected (external canonical URL)...");
const scenario10Product = {
  name: "Fine Carrara Marble Bust",
  slug: "fine-carrara-marble-bust",
  sku: "JSC-BUST-010",
  status: "published",
  parentCollection: "sculptures-statues",
  parentSubcategory: "portrait-busts",
  parentCategory: "portrait-busts",
  primaryMaterialId: "italian-carrara-marble",
  shortDescription: "Classical portrait bust carved from genuine Italian Carrara marble.",
  imageSrc: "https://jaipurstonecraft.com/images/products/bust.jpg",
  seo: {
    title: "Fine Carrara Marble Bust | Jaipur Stonecraft",
    description: "Classical portrait bust hand-sculpted in authentic Carrara marble.",
    canonicalUrl: "https://malicious-external-site.com/hijack" // Real technical SEO defect
  }
};

const res10 = evaluateProductIntelligence(scenario10Product);
const s05 = res10.items.find(i => i.code === "S05");
assert(s05.rawStatus === PIE_RULE_STATUS.BLOCKER, "S05 flags external domain canonical URL as critical BLOCKER");
assert(res10.statuses.publicationEligibility === "BLOCKED", "Technical SEO defect blocks publication eligibility");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 11: Product that requires no changes
// -------------------------------------------------------------------
console.log("Scenario 11: Product that requires no changes...");
const scenario11Product = {
  name: "Sacred Nandi Bull Makrana Marble Statue",
  slug: "sacred-nandi-bull-makrana-marble-statue",
  sku: "JSC-NANDI-011",
  status: "published",
  parentCollection: "sculptures-statues",
  parentSubcategory: "hindu-sculptures",
  parentCategory: "shiva-ji",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Devotional hand-carved Nandi bull statue sculpted from single-block authentic Makrana white marble for Shiva temple sanctums.",
  imageSrc: "https://jaipurstonecraft.com/images/products/nandi.jpg",
  seo: {
    title: "Sacred Nandi Bull Makrana Marble Statue | Jaipur Stonecraft",
    description: "Hand-sculpted sacred Nandi bull idol in pure Makrana white marble. Traditional Vastu sanctum alignment from Jaipur atelier."
  }
};

const res11 = evaluateProductIntelligence(scenario11Product);
assert(res11.isClean === true, "res11.isClean is true");
assert(res11.score === 100, "res11.score is 100");
assert(res11.overallStatus === "ready", "res11.overallStatus is 'ready'");
assert(res11.blockers.length === 0, "res11.blockers is empty");
assert(res11.recommendations.length === 0, "res11.recommendations is empty");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 12: AI suggestion that attempts to introduce an unsupported claim
// -------------------------------------------------------------------
console.log("Scenario 12: AI suggestion attempting to introduce unsupported claim...");
const scenario12Product = {
  name: "Hand-Carved Stone Diya",
  slug: "hand-carved-stone-diya",
  sku: "JSC-DIYA-012",
  status: "published",
  parentCollection: "decorative-stone-art",
  parentSubcategory: "decor-accents",
  parentCategory: "pooja-accessories",
  primaryMaterialId: "soapstone-natural",
  shortDescription: "100% guaranteed #1 NASA approved miraculous magical stone oil lamp.",
  imageSrc: "https://jaipurstonecraft.com/images/products/diya.jpg",
  seo: {
    title: "Hand-Carved Stone Diya | Jaipur Stonecraft",
    description: "Authentic soapstone diya handcrafted by master artisans."
  }
};

const res12 = evaluateProductIntelligence(scenario12Product);
const c08 = res12.items.find(i => i.code === "C08");
assert(c08.rawStatus === PIE_RULE_STATUS.RECOMMENDED, "C08 flags unsupported claim (NASA approved / 100% guaranteed #1)");
assert(c08.message.includes("marketing claim"), "C08 provides clear evidence-based explanation");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 13: AI suggestion that conflicts with verified material or attempts synthetic substitution
// -------------------------------------------------------------------
console.log("Scenario 13: Synthetic stone conflict detection (resin cast / cultured marble)...");
const scenario13Product = {
  name: "Resin Cast Cultured Marble Idol",
  slug: "resin-cast-cultured-marble-idol",
  sku: "JSC-FAKE-013",
  status: "draft",
  parentCollection: "sculptures-statues",
  parentSubcategory: "hindu-sculptures",
  parentCategory: "ganesh-ji",
  primaryMaterialId: "synthetic-marble",
  shortDescription: "Bonded marble and resin cast sculpture.",
  imageSrc: "https://jaipurstonecraft.com/images/products/fake.jpg",
  seo: {
    title: "Resin Cast Cultured Marble Idol | Jaipur Stonecraft",
    description: "Plastic composite statue."
  }
};

const res13 = evaluateProductIntelligence(scenario13Product);
const p03Synthetic = res13.items.find(i => i.code === "P03");
assert(p03Synthetic.rawStatus === PIE_RULE_STATUS.BLOCKER, "P03 strictly blocks synthetic resin / cultured marble");
assert(res13.statuses.publicationEligibility === "BLOCKED", "Synthetic stone product is BLOCKED from publication");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 14: Malformed AI response handling
// -------------------------------------------------------------------
console.log("Scenario 14: Malformed AI response handling...");
let malformedHandled = false;
try {
  validateAndCleanPieOutput("generate_short_description", "Invalid non-JSON plain text response");
} catch (err) {
  malformedHandled = true;
  assert(err.message.includes("Failed to parse AI output as JSON"), "Invalid JSON string caught with clear error");
}
assert(malformedHandled, "Malformed non-JSON AI response safely handled");

let missingFieldHandled = false;
try {
  validateAndCleanPieOutput("generate_short_description", JSON.stringify({ wrongField: "Hello" }));
} catch (err) {
  missingFieldHandled = true;
  assert(err.message.includes("missing required schema field"), "Missing schema required field caught with clear error");
}
assert(missingFieldHandled, "Missing field schema violation safely handled");
console.log("");

// -------------------------------------------------------------------
// SCENARIO 15: Product saved, reopened, edited, and rendered publicly without losing valid data
// -------------------------------------------------------------------
console.log("Scenario 15: Public rendering metadata & schema integrity roundtrip...");
const scenario15Product = {
  id: "prod-roundtrip",
  name: "36-Inch Black Granite Shiva Murti",
  slug: "36-inch-black-granite-shiva-murti",
  sku: "JSC-SHIVA-GRA-015",
  status: "published",
  parentCollection: "sculptures-statues",
  parentSubcategory: "hindu-sculptures",
  parentCategory: "shiva-family",
  primaryMaterialId: "black-granite",
  shortDescription: "Hand-sculpted 36-inch Lord Shiva murti carved from solid black granite for indoor sanctums and outdoor temple courtyards.",
  imageSrc: "https://jaipurstonecraft.com/images/products/shiva-granite.jpg",
  seo: {
    title: "36-Inch Black Granite Shiva Murti | Jaipur Stonecraft",
    description: "Authentic hand-carved natural black granite Lord Shiva statue for temple sanctums and outdoor courtyards."
  }
};

const metaRoundtrip = generateProductMetadata(scenario15Product);
assert(metaRoundtrip.title === scenario15Product.seo.title, "Metadata title matches product SEO title");
assert(metaRoundtrip.description === scenario15Product.seo.description, "Metadata description matches product SEO description");
assert(metaRoundtrip.alternates.canonical === `https://jaipurstonecraft.com/designs/${scenario15Product.parentCategory}/${scenario15Product.slug}`, "Canonical URL is accurate");

const schemaRoundtrip = generateProductSchema(scenario15Product);
assert(schemaRoundtrip["@context"] === "https://schema.org", "Schema.org @context is valid");
const productNode = schemaRoundtrip["@graph"].find(e => e["@type"] === "Product");
assert(productNode !== undefined, "Product schema entity exists");
assert(productNode.name === scenario15Product.name, "Product schema entity name matches verified product");
assert(productNode.brand.name === "Jaipur Stonecraft", "Brand is Jaipur Stonecraft");
console.log("");

// -------------------------------------------------------------------
// SECTION 16: VERIFY 15 REGISTERED PROMPTS
// -------------------------------------------------------------------
console.log("Section 16: Verifying 15 Versioned PIE Prompts & Clean Output Schema...");
const registeredPromptIds = Object.keys(PIE_PROMPTS);
assert(registeredPromptIds.length === 15, `All 15 versioned prompts are registered (found: ${registeredPromptIds.length})`);

for (const pId of registeredPromptIds) {
  const promptDef = PIE_PROMPTS[pId];
  assert(promptDef.version === "2.0.0", `${pId} is version 2.0.0`);
  assert(typeof promptDef.buildUserPrompt === "function", `${pId} has valid buildUserPrompt function`);
  const built = promptDef.buildUserPrompt(scenario1Product);
  assert(built.length > 50, `${pId} built user prompt with verified product facts (${built.length} chars)`);
}

// Verify output sanitizer removes synthetic composites while keeping natural stone
console.log("\nTesting Output Sanitizer against synthetic composite terms...");
const rawAiOutputWithSynthetic = JSON.stringify({
  seo_title: "Hand-Carved Synthetic Marble Ganesh Statue | Jaipur Stonecraft",
  meta_description: "Cultured marble and bonded marble idol carved by master artisans in Jaipur.",
  primary_keyword: "Synthetic Marble Ganesh",
  secondary_keywords: ["Cultured marble idols", "Black granite temple art"],
  discovery_tags: ["Resin cast", "Granite"]
});

const sanitized = validateAndCleanPieOutput("generate_seo", rawAiOutputWithSynthetic);
assert(!sanitized.seo_title.toLowerCase().includes("synthetic marble"), "Sanitizer replaced 'synthetic marble' with 'Natural Stone'");
assert(!sanitized.meta_description.toLowerCase().includes("cultured marble"), "Sanitizer replaced 'cultured marble' with 'Natural Stone'");
assert(!sanitized.meta_description.toLowerCase().includes("bonded marble"), "Sanitizer replaced 'bonded marble' with 'Natural Stone'");
assert(sanitized.secondary_keywords.some(k => k.includes("granite")), "Natural stone 'granite' is preserved in secondary_keywords");
assert(sanitized.discovery_tags.includes("Granite"), "Natural stone 'Granite' is preserved in discovery_tags");

// -------------------------------------------------------------------
// SECTION 17: S01 SEO TITLE TAG LENGTH LIMIT (UP TO 120 CHARACTERS)
// -------------------------------------------------------------------
console.log("\nSection 17: Verifying S01 SEO Title Tag Length Thresholds...");

// Test 17A: 99-character title tag (Real-world descriptive product title)
const title99 = "Hand-Carved Makrana Pure White Marble Geometric Jali Screen for Mandir Sanctums | Jaipur Stonecraft";
assert(title99.length === 99, `Verified test title length is exactly 99 chars (got ${title99.length})`);

const prodWith99CharTitle = {
  name: "Makrana Pure White Marble Geometric Jali",
  slug: "makrana-white-marble-geometric-jali",
  sku: "JSC-JALI-MAK-099",
  status: "published",
  productType: "architectural",
  parentCollection: "temples-architectural-stonework",
  parentSubcategory: "jali-designs",
  parentCategory: "marble-jali-designs",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Authentic hand-chiselled Makrana white marble lattice jali panel with geometric motif.",
  imageSrc: "https://jaipurstonecraft.com/images/products/jali-099.jpg",
  seo: {
    title: title99,
    description: "Handcrafted Makrana pure white marble geometric jali panel crafted by master artisans in Jaipur. Custom architectural sizes available for temples and private residences."
  }
};

const rep17A = evaluateProductIntelligence(prodWith99CharTitle);
const s01Check17A = rep17A.items.find(i => i.code === "S01");
assert(s01Check17A.rawStatus === PIE_RULE_STATUS.PASS, "99-character title tag PASSES S01 without penalty");
assert(rep17A.recommendations.filter(r => r.code === "S01").length === 0, "99-character title tag generates 0 S01 recommendations");
assert(s01Check17A.message.includes("99 chars"), `S01 message references title length: "${s01Check17A.message}"`);
assert(s01Check17A.message.includes("120-character limit"), "S01 message clarifies the 120-character limit");

// Test 17B: Excessively long title tag (> 120 chars) receives recommended warning
const titleOver120 = "Hand-Carved Makrana Pure White Marble Geometric Jali Screen with Traditional Lattice Trellis Carving for Mandir Sanctuary and Luxury Heritage Haveli | Jaipur Stonecraft";
assert(titleOver120.length > 120, `Long title exceeds 120 chars (is ${titleOver120.length} chars)`);

const prodWithLongTitle = {
  ...prodWith99CharTitle,
  seo: {
    ...prodWith99CharTitle.seo,
    title: titleOver120
  }
};

const rep17B = evaluateProductIntelligence(prodWithLongTitle);
const s01Check17B = rep17B.items.find(i => i.code === "S01");
assert(s01Check17B.rawStatus === PIE_RULE_STATUS.RECOMMENDED, "Title exceeding 120 characters receives RECOMMENDED warning");
assert(s01Check17B.message.includes("exceeds recommended maximum"), "S01 warning explains max limit exceeded");

// Test 17C: Too short title (< 20 chars) receives recommended warning
const prodWithShortTitle = {
  ...prodWith99CharTitle,
  seo: {
    ...prodWith99CharTitle.seo,
    title: "Short Jali" // 10 chars
  }
};

const rep17C = evaluateProductIntelligence(prodWithShortTitle);
const s01Check17C = rep17C.items.find(i => i.code === "S01");
assert(s01Check17C.rawStatus === PIE_RULE_STATUS.RECOMMENDED, "Title under 20 chars receives RECOMMENDED warning for brevity");
assert(s01Check17C.message.includes("too short"), "S01 warning explains title is too short");

// -------------------------------------------------------------------
// SECTION 18: C05 PRIMARY SEARCH PHRASE VALIDATION & OPTIONAL RULE
// -------------------------------------------------------------------
console.log("\nSection 18: Verifying C05 Optional Primary Search Phrase Placement...");

const complexPrimaryPhrase = "Makrana Pure White Marble Hand-Carved White Marble Geometric Jali";
const prodWithComplexPhrase = {
  name: "Geometric Heritage Jali Screen",
  slug: "geometric-heritage-jali-screen",
  sku: "JSC-JALI-HER-001",
  status: "published",
  productType: "architectural",
  parentCollection: "temples-architectural-stonework",
  parentSubcategory: "jali-designs",
  parentCategory: "marble-jali-designs",
  primaryMaterialId: "makrana-pure-white",
  shortDescription: "Architectural stone screen delicately chiselled from authentic Makrana white marble.",
  imageSrc: "https://jaipurstonecraft.com/images/products/jali-her.jpg",
  seo: {
    title: "Geometric Heritage Jali Screen in Pure Makrana Marble | Jaipur Stonecraft",
    description: "Fine architectural stone trellis screen hand-carved in pure Makrana marble by Jaipur Stonecraft artisans. Bespoke sizes and global shipping.",
    primaryKeyword: complexPrimaryPhrase
  }
};

// Test 18A: Default evaluation (Rule disabled: requireExactPrimarySearchPhrasePlacement = false)
const rep18Default = evaluateProductIntelligence(prodWithComplexPhrase);
const c05Default = rep18Default.items.find(i => i.code === "C05");
assert(c05Default.rawStatus === PIE_RULE_STATUS.PASS, "When disabled by default, missing exact primary phrase PASSES C05");
assert(rep18Default.recommendations.filter(r => r.code === "C05").length === 0, "C05 generates 0 recommendations when rule disabled");
assert(rep18Default.score === 100, `Product retains 100% score (got ${rep18Default.score}%)`);
assert(c05Default.message.includes("optional"), `C05 message notes optional placement: "${c05Default.message}"`);

// Test 18B: Enabled evaluation (requireExactPrimarySearchPhrasePlacement = true)
const rep18Strict = evaluateProductIntelligence(prodWithComplexPhrase, {
  requireExactPrimarySearchPhrasePlacement: true
});
const c05Strict = rep18Strict.items.find(i => i.code === "C05");
assert(c05Strict.rawStatus === PIE_RULE_STATUS.RECOMMENDED, "When strictly required, missing exact primary phrase flags RECOMMENDED");
assert(c05Strict.message.includes("is not reflected in title, summary, or product name"), "Strict C05 explains exact phrase missing");
assert(rep18Strict.score < 100, `Score is penalized under strict mode (got ${rep18Strict.score}%)`);

// Test 18C: Primary keyword tracking & generic keyword collision check (S10) continue working
const prodWithGenericKw = {
  ...prodWithComplexPhrase,
  seo: {
    ...prodWithComplexPhrase.seo,
    primaryKeyword: "marble" // Generic single-word collision
  }
};
const rep18Generic = evaluateProductIntelligence(prodWithGenericKw);
const s10Check = rep18Generic.items.find(i => i.code === "S10");
assert(s10Check.rawStatus === PIE_RULE_STATUS.RECOMMENDED, "S10 continues flagging generic single-word primary keywords ('marble')");

console.log("\n===============================================================================");
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} CHECKS`);
console.log("===============================================================================\n");

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
