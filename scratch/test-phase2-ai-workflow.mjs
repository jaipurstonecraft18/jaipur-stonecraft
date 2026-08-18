/**
 * Step 2 Verification Script — AI Generation Workflow Testing
 * Tests multiple product types, scenarios, and safety constraints.
 */

import { buildProductContext } from "../lib/ai/product-context-builder.js";
import { normalizeAiResponse } from "../lib/ai/response-schema.js";
import { generateProductContentIntelligence } from "../lib/ai/gemini-provider.js";

async function runStep2Verification() {
  console.log("==================================================");
  console.log("STEP 2 VERIFICATION: AI GENERATION WORKFLOW");
  console.log("==================================================\n");

  // SCENARIO 1: Minimal Product Draft
  console.log("[Scenario 1] Minimal Product with Minimal Information...");
  const minimalProduct = {
    name: "Classic Marble Elephant Statuette",
    sku: "JSC-ELE-001",
    productType: "figurine",
    parentCollection: "decorative-home-accents",
    parentCategory: "animals-elephants",
    primaryMaterialId: "makrana-pure-white"
  };
  const ctx1 = buildProductContext(minimalProduct);
  if (!ctx1.userPrompt.includes("Product Name: Classic Marble Elephant Statuette")) {
    throw new Error("Scenario 1 context builder failed.");
  }
  console.log("✓ Context built cleanly for minimal product.\n");

  // SCENARIO 2: Product with Existing Description
  console.log("[Scenario 2] Product with Existing Description & Notes...");
  const existingProduct = {
    name: "Hand-Carved Standing Vishnu Statue",
    sku: "JSC-VIS-108",
    productType: "statue",
    primaryMaterialId: "vietnam-white-marble",
    shortDescription: "Standing Lord Vishnu idol carved in white marble.",
    detailedDescription: "Four-armed Lord Vishnu holding Shankha, Chakra, Gada, and Padma carved according to Shilpa Shastra standards.",
    attributes: {
      height: "36 inches",
      finish: "Mirror Polished"
    }
  };
  const ctx2 = buildProductContext(existingProduct, {
    manualNotes: "Carved from single block Vietnam white marble for temple installation."
  });
  if (!ctx2.userPrompt.includes("Shilpa Shastra standards")) {
    throw new Error("Scenario 2 context builder failed to retain existing description.");
  }
  console.log("✓ Context retains existing detailed description and manual notes.\n");

  // SCENARIO 3: Product with Multiple Images
  console.log("[Scenario 3] Product with Multiple Product Images...");
  const multiImageProduct = {
    name: "Ornate Jali Screen Panel",
    sku: "JSC-JAL-099",
    productType: "architectural_element",
    primaryMaterialId: "pink-sandstone-bansi-paharpur",
    imageSrc: "/uploads/products/display/ganesh-ji-1787044620564-a0efv.webp",
    images: [
      { url: "/uploads/products/display/krishna-ji-1787045164392-7zixz.webp", alt_text: "Detail 1" },
      { url: "/uploads/products/display/marble-ganesh-ji-1787043911183-otai6.webp", alt_text: "Detail 2" }
    ]
  };
  const ctx3 = buildProductContext(multiImageProduct);
  if (ctx3.selectedImages.length !== 3) {
    throw new Error(`Scenario 3 failed: expected 3 images, got ${ctx3.selectedImages.length}`);
  }
  console.log(`✓ Multimodal image selection verified (${ctx3.selectedImages.length} images).\n`);

  // SCENARIO 4: Mock AI Output Normalization for Flexible Detail Sections
  console.log("[Scenario 4] Flexible Detail Sections & Knowledge Layer Normalization...");
  const mockAiOutput = {
    product_summary: "Hand-carved Jaipur stonecraft artifact.",
    short_description: "Artisanal stone carving crafted in Rajasthan.",
    detailed_description: "Detailed copy emphasizing traditional stonemasonry techniques.",
    suggested_knowledge_sections: [
      { title: "Craftsmanship & Technique", content: "Hand chiseling techniques using traditional iron tools." },
      { title: "Symbolism & Heritage", content: "Iconography depicting divine grace and protection." },
      { title: "Care & Maintenance", content: "Clean gently with warm water and soft microfiber cloth." }
    ],
    seo_title: "Hand-Carved Stone Carving | Jaipur Stonecraft",
    meta_description: "Exquisite hand-carved stone artifacts crafted by master artisans in Jaipur.",
    search_intent_keywords: ["marble statue jaipur", "hand carved stone murti"],
    image_alt_texts: [],
    content_readiness: { score: 90, status: "Good", observations: ["Fully detailed."] },
    possible_inconsistencies: ["Dimensions not specified."]
  };

  const norm4 = normalizeAiResponse(mockAiOutput);
  if (norm4.suggested_knowledge_sections.length !== 3) {
    throw new Error("Scenario 4 failed: Knowledge sections normalization failed.");
  }
  console.log(`✓ Flexible knowledge sections normalized (${norm4.suggested_knowledge_sections.length} sections).\n`);

  // SCENARIO 5: Fact Preservation Verification
  console.log("[Scenario 5] Fact Preservation & Non-Hallucination Boundaries...");
  // Confirm system instruction explicitly forbids changing material or inventing facts
  if (!ctx1.systemInstruction.includes("STRICTLY EXCLUDE GRANITE")) {
    throw new Error("Scenario 5 failed: Granite exclusion missing.");
  }
  if (!ctx1.systemInstruction.includes("DO NOT INVENT FACTS")) {
    throw new Error("Scenario 5 failed: Fact preservation rule missing.");
  }
  console.log("✓ Fact preservation & anti-hallucination rules verified.\n");

  console.log("==================================================");
  console.log("ALL STEP 2 VERIFICATION SCENARIOS PASSED!");
  console.log("==================================================");
}

runStep2Verification().catch(err => {
  console.error("STEP 2 VERIFICATION FAILED:", err);
  process.exit(1);
});
