/**
 * JAIPUR STONECRAFT — PRODUCT INTELLIGENCE ENGINE (PIE)
 * Comprehensive Automated Verification Suite
 * 
 * Tests representative products across:
 * 1. Marble Murti / Sacred Statue (Makrana White Marble Ganesh Murti)
 * 2. Bas-Relief / Wall Art (Sangemarmar Stone Wall Mural)
 * 3. Architectural Stonework / Jali (Custom Carved Jali Screen)
 * 4. Decorative Water Feature (Tiered Lotus Marble Fountain)
 * 5. Bespoke / Custom Project (Bespoke Temple Sanctum Mandir)
 * 
 * Verifies:
 * - 30 Quality Checks (P01-P07, C01-C08, S01-S10, M01-M06, G01-G05)
 * - 4 Rule Outcomes (PASS, WARNING, BLOCKER, NOT_APPLICABLE)
 * - 5 Distinct Status Dimensions
 * - Weighted Scoring Algorithm
 * - Strict Granite Ban Enforcement
 * - 15 Versioned AI Prompts & Validation
 * - Technical SEO Metadata & Schema.org JSON-LD Generation
 */

import {
  evaluateProductIntelligence,
  PIE_RULE_STATUS,
  PIE_DIMENSIONS,
  FORBIDDEN_STONE_TERMS
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

console.log("\n=======================================================");
console.log("JAIPUR STONECRAFT — PRODUCT INTELLIGENCE VERIFICATION");
console.log("=======================================================\n");

// -------------------------------------------------------------------
// TEST 1: REPRESENTATIVE PRODUCTS SUITE
// -------------------------------------------------------------------

const representativeProducts = [
  // 1. Marble Murti / Sacred Statue
  {
    id: "prod-01",
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
    detailedDescription: "Exquisitely hand-chiseled by master Rajasthani sthapatis using traditional steel chisels. Features classical Shilpa Shastra proportions, intricate trunk detailing, and natural unsealed crystalline luster suitable for sanctum puja rooms.",
    imageSrc: "https://jaipurstonecraft.com/images/products/ganesh-24-front.jpg",
    imageGallery: [
      { src: "https://jaipurstonecraft.com/images/products/ganesh-24-front.jpg", altText: "Front view of 24-inch Makrana marble Ganesh murti" },
      { src: "https://jaipurstonecraft.com/images/products/ganesh-24-side.jpg", altText: "Side profile showing chisel carving detail on marble Ganesh idol" },
      { src: "https://jaipurstonecraft.com/images/products/ganesh-24-plinth.jpg", altText: "Detailed view of hand-carved lotus plinth base" }
    ],
    attributes: {
      height: "24 inches",
      weight: "48 kg",
      posture: "Lalitasana (Seated)",
      finish: "Natural Silk Hone",
      intendedApplication: "Home Mandir / Sacred Sanctum"
    },
    knowledgeLayer: {
      sections: [
        { title: "Craftsmanship & Traditional Chiseling", content: "Hand-sculpted in Jaipur using single-block natural stone with traditional steel chisels." },
        { title: "Material Origin", content: "Mined from ancient Makrana quarries in Rajasthan, renowned for pure crystalline calcite." }
      ],
      faqs: [
        { question: "Can this murti be carved in bespoke dimensions?", answer: "Yes, our atelier sculpts custom orders from 12 inches to over 10 feet." }
      ]
    },
    seo: {
      title: "24-Inch Makrana White Marble Ganesh Statue | Jaipur Stonecraft",
      description: "Authentic hand-carved 24-inch Makrana white marble Ganesh statue for sacred home mandirs. Meticulously sculpted by master Jaipur artisans.",
      primaryKeyword: "Makrana White Marble Ganesh Statue",
      secondaryKeywords: ["Marble Ganesh Murti for Home Temple", "Jaipur Hand Carved Deity Idols"],
      tags: ["Makrana Marble", "Ganesh Statue", "Home Temple Murti"]
    }
  },

  // 2. Bas-Relief / Wall Art
  {
    id: "prod-02",
    name: "Sangemarmar Marble Lotus Wall Relief Panel",
    slug: "sangemarmar-marble-lotus-wall-relief-panel",
    sku: "JSC-RELIEF-LOT-002",
    status: "published",
    productType: "relief",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "stone-relief-panels",
    parentCategory: "floral-nature-wall-panels",
    primaryMaterialId: "sangemarmar-white-marble",
    shortDescription: "Hand-sculpted 3D bas-relief panel carved from pure Sangemarmar white marble featuring multi-petaled blooming lotus blossoms.",
    detailedDescription: "Intricate architectural wall carving sculpted to a 3-inch relief depth. Designed for luxury courtyard feature walls, temple foyers, and heritage interior backdrops.",
    imageSrc: "https://jaipurstonecraft.com/images/products/lotus-relief.jpg",
    imageGallery: [
      { src: "https://jaipurstonecraft.com/images/products/lotus-relief.jpg", altText: "Sangemarmar white marble lotus relief wall panel" }
    ],
    attributes: {
      dimensions: "36 x 24 x 3 inches",
      reliefDepth: "3 inches",
      finish: "Soft Matte Honed"
    },
    seo: {
      title: "Sangemarmar Marble Lotus Wall Relief Panel | Jaipur Stonecraft",
      description: "Hand-sculpted 3D stone wall mural carved from authentic Sangemarmar white marble. Perfect for luxury architectural feature walls.",
      primaryKeyword: "Marble Lotus Wall Relief Panel"
    }
  },

  // 3. Jali / Architectural Stonework
  {
    id: "prod-03",
    name: "Geometric Mughal Sandstone Jali Screen",
    slug: "geometric-mughal-sandstone-jali-screen",
    sku: "JSC-JALI-MUG-003",
    status: "draft",
    productType: "architectural",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali-designs",
    parentCategory: "marble-jali-designs",
    primaryMaterialId: "bansi-paharpur-pink-sandstone",
    shortDescription: "Intricate perforated sandstone jali screen hand-pierced from authentic Bansi Paharpur pink sandstone.",
    detailedDescription: "Traditional Rajasthani perforated screen carving offering passive cooling, dappled natural light filtration, and heritage privacy partition aesthetics for courtyards and facades.",
    imageSrc: "https://jaipurstonecraft.com/images/products/jali-screen.jpg",
    imageGallery: [
      { src: "https://jaipurstonecraft.com/images/products/jali-screen.jpg", altText: "Hand-carved pink sandstone jali partition screen" }
    ],
    attributes: {
      thickness: "50 mm",
      patternStyle: "Geometric Hexagonal Lattice",
      weatherResistance: "All-climate natural weathering"
    },
    seo: {
      title: "Geometric Mughal Sandstone Jali Screen | Jaipur Stonecraft",
      description: "Custom hand-pierced pink sandstone jali screen partition. Traditional Rajasthani architectural lattice for heritage facades and courtyards.",
      primaryKeyword: "Pink Sandstone Jali Screen"
    }
  },

  // 4. Decorative Water Feature / Fountain
  {
    id: "prod-04",
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
    detailedDescription: "Carved from monolithic blocks of natural Makrana marble with traditional scolloped bowls. Creates a gentle acoustic cascade for private estate courtyards and villa gardens.",
    imageSrc: "https://jaipurstonecraft.com/images/products/fountain.jpg",
    imageGallery: [
      { src: "https://jaipurstonecraft.com/images/products/fountain.jpg", altText: "Tiered white marble courtyard water fountain" }
    ],
    attributes: {
      height: "6 feet",
      tierCount: "3 tiers",
      basinDiameter: "4 feet"
    },
    seo: {
      title: "Tiered Petal White Marble Courtyard Fountain | Jaipur Stonecraft",
      description: "Three-tiered hand-carved Makrana marble courtyard fountain. Monolithic stone sculpting with tranquil water cascade for estate gardens.",
      primaryKeyword: "White Marble Courtyard Fountain"
    }
  },

  // 5. Custom / Quotation-based Product
  {
    id: "prod-05",
    name: "Bespoke Carved Stone Temple Sanctum Mandir",
    slug: "bespoke-carved-stone-temple-sanctum-mandir",
    sku: "JSC-BESPOKE-MAN-005",
    status: "draft",
    isCustomOnly: true,
    productType: "architectural",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "mandirs-temples",
    parentCategory: "small-marble-mandir-for-home",
    primaryMaterialId: "makrana-pure-white",
    shortDescription: "Architectural commission for bespoke home mandir crafted to custom client sanctum blueprints in pure Makrana white marble.",
    detailedDescription: "Full architectural mandir ensemble including carved shikhara dome, pillars with kirtimukha motifs, and consecrated sanctum pediment. Built strictly to sacred Vastu orientations.",
    imageSrc: "https://jaipurstonecraft.com/images/products/mandir-cad.jpg",
    imageGallery: [
      { src: "https://jaipurstonecraft.com/images/products/mandir-cad.jpg", altText: "Bespoke marble mandir architectural elevation" }
    ],
    attributes: {
      installationType: "On-site modular assembly",
      customizationLevel: "Fully bespoke to architectural drawing",
      sanctumOrientation: "Ishanya (North-East)"
    },
    seo: {
      title: "Bespoke Carved Stone Temple Sanctum Mandir | Jaipur Stonecraft",
      description: "Custom hand-carved white marble mandirs engineered to exact sanctum dimensions. Master Shilpa Shastra stone craftsmanship from Jaipur.",
      primaryKeyword: "Bespoke Marble Mandir Jaipur"
    }
  }
];

console.log("Section 1: Evaluating 5 Representative Products across 30 PIE Checks...\n");

for (const prod of representativeProducts) {
  const result = evaluateProductIntelligence(prod);

  console.log(`Testing Product: "${prod.name}" (${prod.sku})`);
  assert(result.score >= 70, `Score is high-quality (${result.score}%)`);
  assert(result.dimensionScores !== undefined, "All 5 dimension scores calculated");
  assert(result.statuses.publicationEligibility === "ELIGIBLE", `Publication status is ELIGIBLE (${result.statuses.publicationEligibility})`);
  assert(result.items.length === 36, `Full 36 checks evaluated across P01-G05 (found: ${result.items.length})`);

  // Verify no blockers exist on clean products
  const blockers = result.items.filter(i => i.rawStatus === PIE_RULE_STATUS.BLOCKER);
  assert(blockers.length === 0, `0 blockers on well-formed product record (found ${blockers.length})`);
  console.log("");
}

// -------------------------------------------------------------------
// TEST 2: STRICT GRANITE BAN ENFORCEMENT
// -------------------------------------------------------------------
console.log("Section 2: Verifying Strict Granite Ban Enforcement...\n");

const graniteContaminatedProduct = {
  name: "Black Granite Temple Elephant",
  slug: "black-granite-temple-elephant",
  sku: "JSC-CONTAM-001",
  primaryMaterialId: "black-granite",
  shortDescription: "Solid black granite carving for outdoor entrance.",
  detailedDescription: "Carved from polished black granite with durable weather resistance.",
  seo: {
    title: "Black Granite Temple Elephant | Jaipur Stonecraft",
    description: "Authentic black granite statue for outdoor placement.",
    primaryKeyword: "Black Granite Elephant"
  }
};

const graniteResult = evaluateProductIntelligence(graniteContaminatedProduct);

assert(
  graniteResult.statuses.publicationEligibility === "BLOCKED",
  "Product with granite is strictly BLOCKED from publication"
);

const graniteBlocker = graniteResult.items.find(i => i.code === "P03");
assert(
  graniteBlocker && graniteBlocker.rawStatus === PIE_RULE_STATUS.BLOCKER,
  "Rule P03 correctly flags granite as a critical BLOCKER"
);

const factualConsistencyCheck = graniteResult.items.find(i => i.code === "P07");
assert(
  factualConsistencyCheck && factualConsistencyCheck.rawStatus === PIE_RULE_STATUS.BLOCKER,
  "Rule P07 flags contradiction when granite is mentioned in product claims"
);

console.log("");

// -------------------------------------------------------------------
// TEST 3: PROMPT SUITE & OUTPUT VALIDATION (15 PROMPTS)
// -------------------------------------------------------------------
console.log("Section 3: Verifying 15 Versioned PIE Prompts & Output Schema Sanitization...\n");

const sampleProduct = representativeProducts[0];
const promptIds = Object.keys(PIE_PROMPTS);

assert(promptIds.length === 15, `All 15 versioned prompts are registered (found: ${promptIds.length})`);

for (const pId of promptIds) {
  const promptDef = PIE_PROMPTS[pId];
  assert(promptDef.version === "2.0.0", `${pId} is version 2.0.0`);
  assert(typeof promptDef.buildUserPrompt === "function", `${pId} has valid buildUserPrompt function`);

  const builtPrompt = promptDef.buildUserPrompt(sampleProduct);
  assert(builtPrompt.length > 50, `${pId} prompt built successfully with verified context (${builtPrompt.length} chars)`);
  assert(!builtPrompt.includes("granite"), `${pId} prompt contains no forbidden granite references`);
}

// Test validateAndCleanPieOutput sanitization
console.log("\nTesting Output Sanitizer against forbidden stone terms...");
const rawAiOutputWithGranite = JSON.stringify({
  seo_title: "Hand-Carved Granite Ganesh Statue | Jaipur Stonecraft",
  meta_description: "Beautiful granite idol carved by master artisans in Jaipur.",
  primary_keyword: "Granite Ganesh Statue",
  secondary_keywords: ["Granite idols", "Black granite temple art"],
  discovery_tags: ["Granite", "Sculpture"]
});

const cleanedOutput = validateAndCleanPieOutput("generate_seo", rawAiOutputWithGranite);
assert(!cleanedOutput.seo_title.toLowerCase().includes("granite"), "Sanitizer replaced granite in seo_title with Natural Stone");
assert(!cleanedOutput.meta_description.toLowerCase().includes("granite"), "Sanitizer replaced granite in meta_description");
assert(!cleanedOutput.primary_keyword.toLowerCase().includes("granite"), "Sanitizer replaced granite in primary_keyword");

console.log("");

// -------------------------------------------------------------------
// TEST 4: TECHNICAL SEO METADATA & SCHEMA.ORG JSON-LD GENERATION
// -------------------------------------------------------------------
console.log("Section 4: Verifying Technical SEO & Structured Data Generation...\n");

// Metadata generation
const meta = generateProductMetadata(sampleProduct);
assert(meta.title === sampleProduct.seo.title, "generateProductMetadata respects custom product.seo.title");
assert(meta.description === sampleProduct.seo.description, "generateProductMetadata respects custom product.seo.description");
assert(meta.alternates.canonical === `https://jaipurstonecraft.com/designs/${sampleProduct.parentCategory}/${sampleProduct.slug}`, "Canonical URL is accurately constructed");
assert(meta.openGraph.images[0].url === sampleProduct.imageSrc, "Open Graph image set to valid product image");

// Structured data generation
const schema = generateProductSchema(sampleProduct);
assert(schema["@context"] === "https://schema.org", "Schema.org @context is valid");
assert(Array.isArray(schema["@graph"]), "Schema output is an @graph with VisualArtwork and Product");

const productEntity = schema["@graph"].find(e => e["@type"] === "Product");
assert(productEntity !== undefined, "Product schema entity exists");
assert(productEntity.name === sampleProduct.name, "Product schema name matches verified product");
assert(productEntity.brand.name === "Jaipur Stonecraft", "Brand is Jaipur Stonecraft");
assert(productEntity.offers !== undefined, "Offer entity exists");
assert(productEntity.offers.price !== "0", "Price is never fabricated as '0'");
assert(productEntity.offers.price !== "Upon Request", "Price string is not set to invalid string 'Upon Request'");

console.log("\n=======================================================");
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} CHECKS`);
console.log("=======================================================\n");

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
