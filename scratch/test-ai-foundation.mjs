/**
 * Verification Script for Step 1 — AI Foundation & Product Context
 * Runs in Node.js ESM environment.
 */

import { buildProductContext } from "../lib/ai/product-context-builder.js";
import { normalizeAiResponse, PRODUCT_AI_RESPONSE_SCHEMA } from "../lib/ai/response-schema.js";
import { isAiAvailable, getGeminiModel } from "../lib/ai/config.js";
import { generateProductContentIntelligence } from "../lib/ai/gemini-provider.js";

async function runVerification() {
  console.log("=========================================");
  console.log("STEP 1 VERIFICATION: AI FOUNDATION & CONTEXT");
  console.log("=========================================\n");

  // 1. Verify Configuration & Safety
  console.log("[Test 1] Checking AI Provider Config & Availability...");
  const available = isAiAvailable();
  const model = getGeminiModel();
  console.log(`- AI Key Configured: ${available}`);
  console.log(`- Configured Model: ${model}`);
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("SECURITY FAILURE: GEMINI_API_KEY must NEVER be prefixed with NEXT_PUBLIC_!");
  }
  console.log("✓ Security Check Passed: API key is not exposed to client.\n");

  // 2. Verify Product Context Builder
  console.log("[Test 2] Testing Product Context Builder...");
  const mockProduct = {
    name: "Divine White Marble Ganesh Statue",
    sku: "JSC-GAN-001",
    productType: "statue",
    parentCollection: "sculptures-statues",
    parentSubcategory: "hindu-sculptures",
    parentCategory: "ganesh-ji",
    primaryMaterialId: "makrana-pure-white",
    attributes: {
      height: "24 inches",
      width: "14 inches",
      finish: "Hand-Polished Gloss",
      color: "Pure White"
    },
    shortDescription: "Hand-carved white marble Ganesh murti.",
    detailedDescription: "Exquisitely carved Lord Ganesha statue from single-block Makrana white marble.",
    knowledgeLayer: {
      sections: [
        { title: "Symbolism", content: "Represents auspicious beginnings and removal of obstacles." }
      ]
    },
    seo: {
      title: "Buy White Marble Ganesh Statue Online | Jaipur Stonecraft",
      description: "Handcrafted Makrana marble Ganesh murti for mandir.",
      keywords: ["ganesh statue", "white marble murti", "jaipur stonecraft"]
    },
    imageSrc: "/uploads/products/display/ganesh-ji-1787044620564-a0efv.webp"
  };

  const context = buildProductContext(mockProduct, {
    manualNotes: "Carved by master artisans in Jaipur atelier.",
    selectedImages: ["/uploads/products/display/ganesh-ji-1787044620564-a0efv.webp"]
  });

  if (!context.systemInstruction.includes("MANUAL DATA IS HIGHEST AUTHORITY")) {
    throw new Error("Context Builder missing authority enforcement in system instructions.");
  }
  if (!context.userPrompt.includes("=== [SECTION 1: CONFIRMED DATA] ===")) {
    throw new Error("Context Builder missing Section 1: Confirmed Data demarcation.");
  }
  if (!context.userPrompt.includes("=== [SECTION 2: EXISTING CONTENT & NOTES] ===")) {
    throw new Error("Context Builder missing Section 2: Existing Content demarcation.");
  }
  if (!context.userPrompt.includes("=== [SECTION 3: VISUAL CONTEXT] ===")) {
    throw new Error("Context Builder missing Section 3: Visual Context demarcation.");
  }
  console.log("✓ Context Builder correctly structures manual data, existing content, and visual context.\n");

  // 3. Verify Handling of Missing Optional Fields
  console.log("[Test 3] Testing Context Builder with sparse/minimal product data...");
  const minimalProduct = {
    name: "Minimalist Marble Carving",
    sku: "JSC-MIN-001"
  };
  const sparseContext = buildProductContext(minimalProduct);
  if (!sparseContext.userPrompt.includes("Product Name: Minimalist Marble Carving")) {
    throw new Error("Context Builder failed to handle minimal product safely.");
  }
  console.log("✓ Minimal product data handled safely without errors.\n");

  // 4. Verify AI Response Normalizer & Schema Validation
  console.log("[Test 4] Testing Response Normalizer & Schema Validation...");
  const mockRawResponse = {
    product_summary: "Hand-crafted marble Ganesha statue.",
    short_description: "Premium white marble Ganesh murti for home temples.",
    detailed_description: "Crafted from pure Makrana marble with intricate gold leaf work.",
    suggested_knowledge_sections: [
      { title: "Iconography", content: "Carries Modak and blessing mudra." }
    ],
    seo_title: "White Marble Ganesh Statue | Jaipur Stonecraft",
    meta_description: "Explore exquisite hand-carved white marble Ganesh statues for home mandirs.",
    search_intent_keywords: ["marble ganesh murti", "makrana marble statue"],
    image_alt_texts: [
      { image_url: "/uploads/products/display/ganesh-ji.webp", suggested_alt: "Hand-carved white marble Ganesh statue front view" }
    ],
    content_readiness: {
      score: 95,
      status: "Excellent",
      observations: ["Comprehensive dimensions and material origin provided."]
    },
    possible_inconsistencies: []
  };

  const normalized = normalizeAiResponse(mockRawResponse);
  if (normalized.content_readiness.score !== 95) {
    throw new Error("Response normalizer failed to preserve score.");
  }
  if (normalized.suggested_knowledge_sections.length !== 1) {
    throw new Error("Response normalizer failed to preserve knowledge sections.");
  }
  console.log("✓ Response Schema and Normalizer verified successfully.\n");

  // 5. Verify Graceful Error Handling when AI Key is Missing / API Fails
  console.log("[Test 5] Testing Graceful Provider Error Handling (Key Missing / Unconfigured)...");
  const fallbackResult = await generateProductContentIntelligence(mockProduct);
  if (fallbackResult.success === true && !available) {
    throw new Error("Provider should not claim success when API key is missing!");
  }
  if (!available) {
    console.log(`- Expected fallback message received: "${fallbackResult.error}"`);
    console.log("✓ Graceful error handling verified: System does not crash when API key is unconfigured.");
  } else {
    console.log(`- Live test result success: ${fallbackResult.success}`);
  }

  console.log("\n=========================================");
  console.log("ALL STEP 1 VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
}

runVerification().catch(err => {
  console.error("VERIFICATION FAILED:", err);
  process.exit(1);
});
