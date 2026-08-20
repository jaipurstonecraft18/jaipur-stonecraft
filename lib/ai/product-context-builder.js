/**
 * Jaipur Stonecraft — Product Context Builder
 * 
 * Prepares intelligent, compact prompt context for AI analysis.
 * Enforces strict hierarchy of truth:
 * - PRIORITY 1: Manual product facts entered by administrator (AUTHORITATIVE)
 * - PRIORITY 2: Structured product data (Category, material, SKU, attributes)
 * - PRIORITY 3: Selected product image analysis (SUPPLEMENTARY ONLY)
 * 
 * Strictly excludes granite and prevents hallucination of facts.
 */

import { AI_CONFIG } from "./config.js";

/**
 * Normalizes raw product data into a compact, clean object suitable for AI analysis and fingerprinting.
 * 
 * @param {Object} product 
 * @returns {Object} normalized input payload
 */
export function normalizeProductInput(product = {}) {
  const sanitizeText = (val) => {
    if (!val || typeof val !== "string") return "";
    let str = val.trim();
    // Exclude granite / granitic references explicitly
    AI_CONFIG.forbiddenTerms.forEach(term => {
      const reg = new RegExp(`\\b${term}\\b`, "gi");
      str = str.replace(reg, "Natural Stone");
    });
    return str;
  };

  const name = sanitizeText(product.name || "Untitled Product");
  const sku = sanitizeText(product.sku || "N/A");
  const productType = sanitizeText(product.productType || product.product_type || "Stone Craft");
  const parentCollection = sanitizeText(product.parentCollection || product.parent_collection || "");
  const parentSubcategory = sanitizeText(product.parentSubcategory || product.parent_subcategory || "");
  const parentCategory = sanitizeText(product.parentCategory || product.parent_category || "");
  
  let primaryMaterial = sanitizeText(product.primaryMaterialId || product.primary_material_id || product.material || "Marble / Natural Stone");
  if (primaryMaterial.toLowerCase().includes("granite")) {
    primaryMaterial = "Marble / Natural Stone";
  }

  // Format attributes object cleanly
  const attributesObj = typeof product.attributes === "string" 
    ? safeJsonParse(product.attributes, {}) 
    : (product.attributes || {});

  const cleanAttributes = {};
  if (attributesObj && typeof attributesObj === "object") {
    Object.entries(attributesObj).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        const cleanKey = sanitizeText(formatKeyLabel(k));
        cleanAttributes[cleanKey] = sanitizeText(String(v));
      }
    });
  }

  const shortDescription = sanitizeText(product.shortDescription || product.short_description || "");
  const detailedDescription = sanitizeText(product.detailedDescription || product.detailed_description || "");
  const manualNotes = sanitizeText(product.manualNotes || product.notes || "");

  return {
    name,
    sku,
    productType,
    categoryPath: [parentCategory, parentSubcategory, parentCollection].filter(Boolean).join(" > ") || "Stonecraft",
    primaryMaterial,
    attributes: cleanAttributes,
    shortDescription,
    detailedDescription,
    manualNotes
  };
}

/**
 * Builds the complete prompt context payload for Gemini AI analysis.
 * 
 * @param {Object} product - Product record or draft state
 * @param {Object} [options] - Options like selectedImages, manualNotes, mode ("full" | "field" | "descriptions" | "seo" | "imageSeo"), fieldTarget
 * @returns {Object} { systemInstruction, userPrompt, normalized, selectedImages }
 */
export function buildProductContext(product = {}, options = {}) {
  const normalized = normalizeProductInput(product);
  const manualNotes = (options.manualNotes || "").trim();

  // Attributes list
  const formattedAttributes = Object.keys(normalized.attributes).length > 0
    ? Object.entries(normalized.attributes).map(([k, v]) => `- ${k}: ${v}`).join("\n")
    : "- None explicitly specified";

  // Selected Images for visual analysis
  const selectedImages = options.selectedImages || extractProductImages(product);

  const systemInstruction = `
You are the Master Content & SEO Intelligence Specialist for Jaipur Stonecraft — an atelier specializing in hand-carved marble sculptures, divine murtis, architectural stone elements, and bespoke stone artifacts based in Jaipur, Rajasthan, India.

CRITICAL OPERATIONAL RULES & HIERARCHY:
1. TRUTH HIERARCHY:
   - PRIORITY 1: Manual product data entered by admin is HIGHEST AUTHORITY.
   - PRIORITY 2: Factual product specifications (Category, material, SKU, attributes).
   - PRIORITY 3: Image visual analysis (Supplementary evidence only). Image findings MUST NEVER override manual facts.
2. DO NOT INVENT FACTS: Do NOT invent unconfirmed dimensions, weights, historical age, sacred claims, pricing, or techniques not stated in [CONFIRMED DATA].
3. STRICTLY EXCLUDE GRANITE: Jaipur Stonecraft works with marbles, sandstones, and soapstones. Granite is strictly forbidden.
4. ZERO CONVERSATIONAL FLUFF: Do NOT include chain-of-thought reasoning, commentary, preamble, or analysis logs.
5. CONCISE HIGH-DENSITY OUTPUT: Keep all descriptions concise, elegant, and high-density to ensure maximum speed and quality.
`.trim();

  let userPrompt = "";

  if (options.mode === "field" && options.fieldTarget) {
    const targetLabel = options.fieldTarget === "shortDescription" ? "Short Product Description" : "Detailed Product Description";
    const currentVal = options.fieldTarget === "shortDescription" ? normalized.shortDescription : normalized.detailedDescription;
    
    userPrompt = `
Refine and enhance the following ${targetLabel} for Jaipur Stonecraft.

[CONFIRMED DATA]
- Product Name: ${normalized.name}
- Product Type: ${normalized.productType}
- Material: ${normalized.primaryMaterial}
- Current Text: ${currentVal || "None provided"}
- Instructions: ${manualNotes || "Improve clarity, devotional/craft tone, and search alignment."}

Respond in valid JSON with key '${options.fieldTarget}' containing the refined text string.
`.trim();

  } else if (options.mode === "descriptions") {
    userPrompt = `
Generate refined product descriptions and knowledge sections for Jaipur Stonecraft product: ${normalized.name}.

[CONFIRMED DATA]
- Product Name: ${normalized.name}
- Product Type: ${normalized.productType}
- Category Path: ${normalized.categoryPath}
- Material: ${normalized.primaryMaterial}
- Current Short Description: ${normalized.shortDescription}
- Current Detailed Description: ${normalized.detailedDescription}

Respond strictly in valid JSON containing:
{
  "content": {
    "shortDescription": "Concise 1-2 sentence preview",
    "detailedDescription": "Refined 60-80 word craft & heritage copy",
    "knowledgeSections": [{ "title": "Section Title", "content": "1-2 sentence section copy" }]
  }
}
`.trim();

  } else if (options.mode === "seo") {
    userPrompt = `
Generate HTML title tag, meta description, and search keywords for Jaipur Stonecraft product: ${normalized.name}.

[CONFIRMED DATA]
- Product Name: ${normalized.name}
- Product Type: ${normalized.productType}
- Category Path: ${normalized.categoryPath}
- Material: ${normalized.primaryMaterial}

Respond strictly in valid JSON containing:
{
  "seo": {
    "seoTitle": "50-60 char HTML title tag",
    "metaDescription": "140-160 char HTML meta description",
    "primaryKeyword": "Primary search term",
    "secondaryKeywords": ["2-3 terms"],
    "longTailKeywords": ["2-3 phrases"]
  }
}
`.trim();

  } else if (options.mode === "imageSeo") {
    userPrompt = `
Generate image SEO alt text, title tag, and caption for Jaipur Stonecraft product: ${normalized.name}.

[CONFIRMED DATA]
- Product Name: ${normalized.name}
- Product Type: ${normalized.productType}
- Material: ${normalized.primaryMaterial}
- Image count: ${selectedImages.length}

Respond strictly in valid JSON containing:
{
  "imageSeo": {
    "altText": "Descriptive image alt text focusing on carving details",
    "imageTitle": "Title tag for image element",
    "imageCaption": "Short display caption"
  }
}
`.trim();

  } else {
    userPrompt = `
Analyze the Jaipur Stonecraft product below and generate structured content, SEO, image SEO, and readiness insights.

=== [PRIORITY 1: CONFIRMED MANUAL DATA & SPECS] ===
- Product Name: ${normalized.name}
- SKU: ${normalized.sku}
- Product Type: ${normalized.productType}
- Category Path: ${normalized.categoryPath}
- Primary Material: ${normalized.primaryMaterial}
- Confirmed Attributes:
${formattedAttributes}
- Current Short Description: ${normalized.shortDescription || "None provided"}
- Current Detailed Description: ${normalized.detailedDescription || "None provided"}
- Admin Notes: ${manualNotes || normalized.manualNotes || "None"}

=== [PRIORITY 3: VISUAL CONTEXT] ===
- Attached image(s) for visual context: ${selectedImages.length}
${selectedImages.map((img, i) => `- Image ${i + 1}: ${img.url || img}`).join("\n")}

Respond strictly in valid JSON containing:
{
  "content": {
    "shortDescription": "Concise 1-2 sentence preview",
    "detailedDescription": "Refined 60-80 word craft & heritage copy",
    "knowledgeSections": [{ "title": "Section Title", "content": "1-2 sentence section copy" }],
    "faqs": [{ "question": "Frequently asked question?", "answer": "Clear factual answer." }]
  },
  "seo": {
    "seoTitle": "50-60 char title tag",
    "metaDescription": "140-160 char meta description",
    "primaryKeyword": "One focused 2-4 word primary search phrase representing main intent",
    "secondaryKeywords": ["2-4 supporting phrases"],
    "longTailKeywords": ["2-3 phrases"],
    "discoveryTags": ["3-5 discovery tags for organization and internal search"]
  },
  "imageSeo": {
    "altText": "Descriptive alt text",
    "imageTitle": "Title tag",
    "imageCaption": "Short display caption"
  },
  "readiness": {
    "score": 85,
    "status": "Good",
    "observations": ["1-2 items"],
    "flaggedInconsistencies": []
  }
}
`.trim();
  }

  return {
    systemInstruction,
    userPrompt,
    normalized,
    selectedImages
  };
}

/**
 * Extracts list of image items from product object.
 */
function extractProductImages(product) {
  const images = [];
  if (product.imageSrc) {
    images.push({ url: product.imageSrc, alt: product.imageAlt || product.name });
  }
  if (Array.isArray(product.images)) {
    product.images.forEach(img => {
      const url = typeof img === "string" ? img : img?.url || img?.src;
      if (url && !images.some(existing => existing.url === url)) {
        images.push({ url, alt: img?.alt_text || img?.alt || product.name });
      }
    });
  }
  return images;
}

function formatKeyLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
