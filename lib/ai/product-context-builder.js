/**
 * Jaipur Stonecraft — Product Context Builder
 * 
 * Prepares intelligent, compact prompt context for AI analysis.
 * Enforces strict hierarchy of truth:
 * - PRIORITY 1: Manual product facts entered by administrator (AUTHORITATIVE)
 * - PRIORITY 2: Structured product data (Category, material, SKU, attributes)
 * - PRIORITY 3: Selected product image analysis (SUPPLEMENTARY ONLY)
 * 
 * Strictly excludes synthetic materials and prevents hallucination of facts.
 * Generates high-impact descriptions, SEO, and AEO metadata without artificial FAQs.
 */

import { AI_CONFIG } from "./config.js";
import { materialsDB } from "../../content/products-db/materials-db.js";

/**
 * Normalizes raw product data into a compact, clean object suitable for AI analysis.
 * 
 * @param {Object} product 
 * @returns {Object} normalized input payload
 */
export function normalizeProductInput(product = {}) {
  const sanitizeText = (val) => {
    if (!val || typeof val !== "string") return "";
    let str = val.trim();
    AI_CONFIG.forbiddenTerms.forEach(term => {
      const reg = new RegExp(`\\b${term}\\b`, "gi");
      str = str.replace(reg, "Natural Stone");
    });
    return str;
  };

  const name = sanitizeText(product.name || "Untitled Product");
  const sku = sanitizeText(product.sku || "N/A");
  const slug = sanitizeText(product.slug || "");
  const productType = sanitizeText(product.productType || product.product_type || "Stone Craft");
  const parentCollection = sanitizeText(product.parentCollection || product.parent_collection || "");
  const parentSubcategory = sanitizeText(product.parentSubcategory || product.parent_subcategory || "");
  const parentCategory = sanitizeText(product.parentCategory || product.parent_category || "");
  
  let rawMat = product.primaryMaterialName || product.primaryMaterial?.name || product.materialName || product.primaryMaterialId || product.primary_material_id || product.material || "Makrana Pure White Marble";
  const matchedMat = materialsDB.find(m => m.id === rawMat || m.id === String(rawMat).toLowerCase() || m.name.toLowerCase() === String(rawMat).toLowerCase());
  let primaryMaterial = sanitizeText(matchedMat ? matchedMat.name : rawMat);
  const materialOrigin = sanitizeText(matchedMat ? matchedMat.origin : (product.primaryMaterial?.origin || "Rajasthan, India"));

  // Subject / Deity identity
  const subjectName = sanitizeText(product.subjectObj?.primaryName || product.subjectName || product.subjectId || "");

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

  // Dimensions & Weight
  const height = attributesObj.dimensions_height_inches || attributesObj.dimensions?.heightInches || "";
  const width = attributesObj.dimensions_width_inches || attributesObj.dimensions?.widthInches || "";
  const depth = attributesObj.dimensions_depth_inches || attributesObj.dimensions?.depthInches || "";
  const weight = attributesObj.approximate_weight_kg || attributesObj.weightKg || "";
  const finish = sanitizeText(attributesObj.finish || "Hand Honed (Natural Matte)");
  const intendedApplication = sanitizeText(attributesObj.intendedApplication || attributesObj.environment || "Home Shrine & Architectural Placement");

  const shortDescription = sanitizeText(product.shortDescription || product.short_description || "");
  const detailedDescription = sanitizeText(product.detailedDescription || product.detailed_description || "");
  const manualNotes = sanitizeText(product.manualNotes || product.notes || "");

  const seoObj = typeof product.seo === "string" ? safeJsonParse(product.seo, {}) : (product.seo || {});

  return {
    name,
    sku,
    slug,
    productType,
    subjectName,
    categoryPath: [parentCategory, parentSubcategory, parentCollection].filter(Boolean).join(" > ") || "Stonecraft",
    primaryMaterial,
    materialOrigin,
    attributes: cleanAttributes,
    dimensions: { height, width, depth, weight },
    finish,
    intendedApplication,
    shortDescription,
    detailedDescription,
    manualNotes,
    existingSeo: {
      title: sanitizeText(seoObj.title || seoObj.seoTitle || ""),
      description: sanitizeText(seoObj.description || seoObj.metaDescription || ""),
      primaryKeyword: sanitizeText(seoObj.primaryKeyword || "")
    }
  };
}

/**
 * Builds the complete prompt context payload for AI analysis.
 * 
 * @param {Object} product - Product record or draft state
 * @param {Object} [options] - Options like selectedImages, manualNotes, mode ("FULL_ANALYSIS" | "TEXT_OPTIMIZATION" | "field" | "descriptions" | "seo"), fieldTarget
 * @returns {Object} { systemInstruction, userPrompt, normalized, selectedImages }
 */
export function buildProductContext(product = {}, options = {}) {
  const normalized = normalizeProductInput(product);
  const manualNotes = (options.manualNotes || "").trim();

  // Attributes list
  const formattedAttributes = Object.keys(normalized.attributes).length > 0
    ? Object.entries(normalized.attributes).map(([k, v]) => `  - ${k}: ${v}`).join("\n")
    : "  - None specified (custom dimensions available)";

  // Dimension details string
  const dimParts = [];
  if (normalized.dimensions.height) dimParts.push(`Height: ${normalized.dimensions.height} inches`);
  if (normalized.dimensions.width) dimParts.push(`Width: ${normalized.dimensions.width} inches`);
  if (normalized.dimensions.depth) dimParts.push(`Depth: ${normalized.dimensions.depth} inches`);
  if (normalized.dimensions.weight) dimParts.push(`Approx Weight: ${normalized.dimensions.weight} kg`);
  const dimensionStr = dimParts.length > 0 ? dimParts.join(", ") : "Custom dimensions available upon request";

  // Selected Images for visual analysis
  const selectedImages = options.selectedImages || extractProductImages(product);

  const systemInstruction = `
You are the Master Stone Art Curator & Senior Search Intelligence Specialist for Jaipur Stonecraft — an atelier specializing in hand-carved natural marble sculptures, sacred deity murtis, architectural stone screens, and bespoke heritage stone art based in Jaipur, Rajasthan, India.

CRITICAL OPERATIONAL RULES & HIERARCHY:
1. TRUTH HIERARCHY:
   - PRIORITY 1: Manual product data entered by the admin is HIGHEST AUTHORITY.
   - PRIORITY 2: Structured product data (Category, confirmed stone material, SKU, dimensions).
   - PRIORITY 3: Image visual analysis (Supplementary evidence only). Visible details enrich aesthetics, but never override confirmed facts.
2. DO NOT INVENT FACTS:
   - Never fabricate unverified stone origin, dimensions, historical age, certifications, durability claims, or manufacturing techniques not supported by the product data.
   - If exact dimensions or weight are not confirmed, state that bespoke sizing is available rather than inventing numbers.
3. STRICT MATERIAL FIDELITY:
   - All generated descriptions, craftsmanship details, geological context, and SEO metadata MUST be written specifically for the confirmed natural stone: "${normalized.primaryMaterial}" (Quarry provenance: ${normalized.materialOrigin}).
   - Never substitute or contradict the confirmed stone. If the selected stone is Sandstone, Granite, Black Marble, or Onyx, NEVER call it white marble.
4. FORBIDDEN CONTENT:
   - DO NOT generate generic, repetitive, or speculative FAQs. The workflow prioritizes product descriptions, SEO metadata, and AEO intelligence.
   - Strictly forbid synthetic composites (resin cast, cultured marble, synthetic marble, bonded marble).
5. TONE & VOCABULARY:
   - Write prestigious, elegant, evocative, and professional copy.
   - Avoid generic marketing fluff, keyword stuffing, and unsupported superlatives.
   - Infuse natural high-intent search terms seamlessly into authentic craft prose.
6. STRICT JSON OUTPUT:
   - Return strictly a single valid JSON object matching the requested schema.
   - Do NOT include markdown codeblocks (\`\`\`json), conversational preamble, or reasoning commentary.
`.trim();

  let userPrompt = "";

  // Single-field targeted refinement mode
  if (options.mode === "field" && options.fieldTarget) {
    const isShort = options.fieldTarget === "shortDescription";
    const targetLabel = isShort ? "Short Product Description" : "Complete Long Description";
    const currentVal = isShort ? normalized.shortDescription : normalized.detailedDescription;
    
    userPrompt = `
Refine and enhance the following ${targetLabel} for Jaipur Stonecraft.

[CONFIRMED PRODUCT DATA]
- Product Name: ${normalized.name}
- Deity / Subject: ${normalized.subjectName || "Stone Sculpture"}
- Product Type: ${normalized.productType}
- Category: ${normalized.categoryPath}
- Confirmed Stone: ${normalized.primaryMaterial} (${normalized.materialOrigin})
- Finish: ${normalized.finish}
- Confirmed Sizing: ${dimensionStr}
- Current Text: ${currentVal || "None provided"}
- Guidance: ${manualNotes || (isShort ? "Write a concise 1-2 sentence refined short description (150-220 characters) highlighting key distinguishing features." : "Write a complete 120-220 word publication-grade long description detailing sculpture identity, stone grain, hand-chiseling, and placement.")}

Respond strictly in valid JSON:
{
  "${options.fieldTarget}": "Refined copy here"
}
`.trim();

  } else if (options.mode === "descriptions") {
    userPrompt = `
Generate refined short and complete long descriptions for: ${normalized.name}.

[CONFIRMED PRODUCT DATA]
- Product Name: ${normalized.name}
- Deity / Subject: ${normalized.subjectName || "Stone Sculpture"}
- Category: ${normalized.categoryPath}
- Confirmed Stone: ${normalized.primaryMaterial} (${normalized.materialOrigin})
- Finish: ${normalized.finish}
- Sizing: ${dimensionStr}
- Current Short Description: ${normalized.shortDescription || "(empty)"}
- Current Long Description: ${normalized.detailedDescription || "(empty)"}

Respond strictly in valid JSON:
{
  "short_description": "1-2 sentence concise, captivating description (150-220 chars) highlighting distinguishing features.",
  "long_description": "Complete 120-220 word publication narrative covering sculpture identity, stone character, hand-chiseling craft, and placement."
}
`.trim();

  } else if (options.mode === "seo") {
    userPrompt = `
Generate high-CTR SEO title, meta description, and search keywords for: ${normalized.name}.

[CONFIRMED PRODUCT DATA]
- Product Name: ${normalized.name}
- Deity / Subject: ${normalized.subjectName || "Stone Sculpture"}
- Category: ${normalized.categoryPath}
- Confirmed Stone: ${normalized.primaryMaterial}
- Sizing: ${dimensionStr}

Respond strictly in valid JSON:
{
  "seo_title": "Descriptive high-CTR title tag up to 120 chars (${normalized.name} - Hand-Carved ${normalized.primaryMaterial} | Jaipur Stonecraft)",
  "meta_description": "140-160 char meta description emphasizing artisanal quality, natural stone, and custom sizing",
  "primary_keyword": "Primary 2-4 word commercial search phrase",
  "secondary_keywords": ["3-5 supporting keyword phrases"],
  "long_tail_keywords": ["2-4 high-intent long-tail search phrases"],
  "suggested_slug": "clean-url-slug"
}
`.trim();

  } else {
    // Comprehensive Dual-Mode Product Intelligence (Descriptions + SEO + AEO + Visuals)
    const hasImages = selectedImages.length > 0;
    
    userPrompt = `
Analyze the Jaipur Stonecraft product below and generate improved short and long descriptions, complete SEO metadata, and Answer Engine Optimization (AEO) intelligence.

=== [CONFIRMED PRODUCT SPECIFICATIONS] ===
- Product Name: ${normalized.name}
- Deity / Subject: ${normalized.subjectName || "Stone Sculpture"}
- SKU: ${normalized.sku}
- Product Type: ${normalized.productType}
- Taxonomy Hierarchy: ${normalized.categoryPath}
- Primary Stone Material: ${normalized.primaryMaterial}
- Stone Quarry Provenance: ${normalized.materialOrigin}
- Dimensions / Weight: ${dimensionStr}
- Surface Finish: ${normalized.finish}
- Intended Application: ${normalized.intendedApplication}
- Other Attributes:
${formattedAttributes}
- Current Short Description: ${normalized.shortDescription || "(empty)"}
- Current Long Description: ${normalized.detailedDescription || "(empty)"}
- Admin Guidance / Notes: ${manualNotes || normalized.manualNotes || "None"}

=== [VISUAL CONTEXT] ===
- Available Product Images: ${selectedImages.length}
${hasImages ? selectedImages.map((img, i) => `- Image ${i + 1}: ${img.url || img}`).join("\n") : "- No images provided. Rely exclusively on confirmed product specifications."}

CRITICAL OUTPUT REQUIREMENTS:
1. Short Description: 1-2 sentences (150-220 chars) clearly stating what the product is and highlighting key features with natural search phrasing.
2. Complete Long Description: Coherent 120-220 word publication-ready narrative covering:
   - Sculpture identity, visual character, and iconography
   - Natural stone material characteristics and quarry provenance (${normalized.primaryMaterial})
   - Generational hand-carving and chisel technique (Shilpa Shastra traditions)
   - Distinctive design features and surface finishing
   - Suitable placement (home mandir, entrance, landscape, spiritual sanctum)
   - Do NOT invent unverified dimensions or unsupported claims.
3. SEO Metadata: Descriptive high-CTR SEO title (up to 120 chars), meta description (120-160 chars), primary search keyword, secondary keywords, long-tail search phrases, and suggested URL slug.
4. AEO (Answer Engine Optimization): 2-3 sentence factual, entity-dense summary explicitly identifying product identity, stone provenance, artisan technique, and sanctum suitability.
5. Factual Attributes: Structured object with verified stoneVariety, finish, craftsmanship, and intendedApplication.
6. NO FAQS: Do NOT generate artificial or repetitive questions and answers.

Respond strictly in valid JSON matching this exact structure:
{
  "short_description": "1-2 sentence refined short summary",
  "long_description": "Complete 120-220 word publication narrative",
  "seo_title": "${normalized.name} - Hand-Carved ${normalized.primaryMaterial} | Jaipur Stonecraft",
  "meta_description": "Hand-carved ${normalized.name} sculpted from authentic ${normalized.primaryMaterial} in Jaipur. Custom dimensions and worldwide delivery available.",
  "primary_keyword": "${normalized.primaryMaterial} ${normalized.name}",
  "secondary_keywords": ["hand carved ${normalized.name}", "${normalized.primaryMaterial} statue Jaipur", "custom stone sculpture"],
  "long_tail_keywords": ["best hand carved ${normalized.name} for home mandir", "${normalized.primaryMaterial} murti makers in Jaipur"],
  "suggested_slug": "${normalized.slug || normalized.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}",
  "aeo_summary": "A 2-3 sentence factual, machine-readable summary defining product identity, stone provenance, and artisan technique.",
  "factual_attributes": {
    "stoneVariety": "${normalized.primaryMaterial}",
    "finish": "${normalized.finish}",
    "craftsmanship": "100% Manual Steel Chisel",
    "intendedApplication": "${normalized.intendedApplication}"
  },
  "discovery_tags": ["Hand-Carved", "${normalized.primaryMaterial}", "Jaipur-Stonecraft", "Sanctum-Art"],
  "image_alt_texts": [
    { "suggested_alt": "${normalized.name} hand-carved in ${normalized.primaryMaterial} by Jaipur Stonecraft artisans" }
  ],
  "image_visual_notes": "${hasImages ? "Observable visual features such as carving depth, posture, and surface texture." : "Text-only analysis without image input."}"
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
  if (product.imageSrc && !product.imageSrc.includes("placehold.co")) {
    images.push({ url: product.imageSrc, alt: product.imageAlt || product.name });
  }
  if (Array.isArray(product.imageGallery)) {
    product.imageGallery.forEach(img => {
      const url = typeof img === "string" ? img : img?.url || img?.src;
      if (url && !url.includes("placehold.co") && !images.some(existing => existing.url === url)) {
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
