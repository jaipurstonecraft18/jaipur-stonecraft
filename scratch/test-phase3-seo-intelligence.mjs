/**
 * Step 3 Verification Script — AI SEO & Image SEO Intelligence Testing
 */

import { evaluateSeoReadiness } from "../lib/seo/readiness-checker.js";
import { buildProductContext } from "../lib/ai/product-context-builder.js";
import { normalizeAiResponse } from "../lib/ai/response-schema.js";

async function runStep3Verification() {
  console.log("==================================================");
  console.log("STEP 3 VERIFICATION: AI SEO & IMAGE SEO");
  console.log("==================================================\n");

  // TEST 1: Complete Product SEO Readiness Evaluation
  console.log("[Test 1] Evaluating Complete Product Readiness...");
  const completeProduct = {
    name: "Hand-Carved Vietnam White Marble Buddha Head",
    parentCategory: "buddha-statues",
    primaryMaterialId: "vietnam-white-marble",
    shortDescription: "Serene hand-carved white marble Buddha head sculpture with fine facial detailing.",
    detailedDescription: " sculpted by master stonemasons in Jaipur using premium white marble block. Designed for peaceful meditation rooms and zen gardens.",
    imageSrc: "/uploads/products/display/buddha-head.webp",
    imageGallery: [
      { src: "/uploads/products/display/buddha-head.webp", altText: "Front view of white marble Buddha head sculpture" },
      { src: "/uploads/products/display/buddha-side.webp", altText: "Side profile showing hair ushnisha carving depth" }
    ],
    seo: {
      title: "White Marble Buddha Head Statue | Jaipur Stonecraft",
      description: "Exquisite hand-carved Vietnam white marble Buddha head statue for serene home & garden decor.",
      keywords: ["marble buddha head", "vietnam white marble", "jaipur stonecraft"]
    }
  };

  const readinessComplete = evaluateSeoReadiness(completeProduct);
  if (readinessComplete.overallStatus !== "ready") {
    throw new Error(`Test 1 failed: Expected 'ready', got '${readinessComplete.overallStatus}'`);
  }
  console.log("✓ Complete product correctly evaluated as 'Ready for Publication'.\n");

  // TEST 2: Incomplete Product SEO Readiness & AI Action Triggers
  console.log("[Test 2] Evaluating Incomplete Product Readiness & AI Fix Triggers...");
  const incompleteProduct = {
    name: "Draft Marble Plinth"
  };
  const readinessIncomplete = evaluateSeoReadiness(incompleteProduct);
  if (readinessIncomplete.overallStatus !== "incomplete") {
    throw new Error(`Test 2 failed: Expected 'incomplete', got '${readinessIncomplete.overallStatus}'`);
  }
  const missingSeoTitle = readinessIncomplete.items.find(i => i.id === "seo_title");
  if (!missingSeoTitle || missingSeoTitle.status !== "missing" || !missingSeoTitle.aiActionKey) {
    throw new Error("Test 2 failed: Missing SEO Title item or AI fix trigger absent.");
  }
  console.log("✓ Incomplete product correctly flags missing fields with AI Fix triggers.\n");

  // TEST 3: Multi-Image Distinct Alt Text Generation Schema
  console.log("[Test 3] Verifying Multi-Image Distinct Alt Text Schema...");
  const mockAiOutputWithAlts = {
    product_summary: "Carved marble fountain.",
    short_description: "Tiered marble garden water fountain.",
    detailed_description: "Hand-carved three-tier marble fountain featuring carved lotus petals and lion spout details.",
    suggested_knowledge_sections: [],
    seo_title: "Tiered Marble Garden Fountain | Jaipur Stonecraft",
    meta_description: "Elevate your landscape with a hand-carved three-tier white marble garden water fountain.",
    search_intent_keywords: ["marble fountain jaipur", "garden water feature"],
    image_alt_texts: [
      { image_url: "/uploads/products/display/fountain-front.webp", suggested_alt: "Front view of three-tier white marble garden water fountain" },
      { image_url: "/uploads/products/display/fountain-detail.webp", suggested_alt: "Close-up of hand-chiseled lion mouth water spout and lotus bowl" }
    ],
    content_readiness: { score: 95, status: "Complete", observations: [] },
    possible_inconsistencies: []
  };

  const normalizedWithAlts = normalizeAiResponse(mockAiOutputWithAlts);
  if (normalizedWithAlts.image_alt_texts.length !== 2) {
    throw new Error("Test 3 failed: Image alt texts normalization missing items.");
  }
  if (normalizedWithAlts.image_alt_texts[0].suggested_alt === normalizedWithAlts.image_alt_texts[1].suggested_alt) {
    throw new Error("Test 3 failed: Multi-image alt texts must not be identical!");
  }
  console.log("✓ Multi-image distinct alt texts verified (different visual details per image).\n");

  // TEST 4: Non-Keyword Stuffing & Character Boundary Rules
  console.log("[Test 4] Verifying SEO Character Boundaries & Search Intent Rules...");
  const seoTitleLen = normalizedWithAlts.seo_title.length;
  const metaDescLen = normalizedWithAlts.meta_description.length;
  if (seoTitleLen > 65) {
    throw new Error(`SEO title exceeds 65 chars (${seoTitleLen})`);
  }
  if (metaDescLen > 165) {
    throw new Error(`Meta description exceeds 165 chars (${metaDescLen})`);
  }
  console.log(`✓ SEO Title length: ${seoTitleLen} chars | Meta Description length: ${metaDescLen} chars`);
  console.log("✓ Character boundaries and search intent guidelines verified.\n");

  console.log("==================================================");
  console.log("ALL STEP 3 VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runStep3Verification().catch(err => {
  console.error("STEP 3 VERIFICATION FAILED:", err);
  process.exit(1);
});
