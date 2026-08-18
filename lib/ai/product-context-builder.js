/**
 * Jaipur Stonecraft — Product Context Builder
 * 
 * Prepares intelligent, structured prompt context for AI analysis.
 * Strictly separates:
 * 1. CONFIRMED DATA (Highest authority — manual facts & specs)
 * 2. EXISTING CONTENT (Current descriptions & knowledge sections)
 * 3. VISUAL CONTEXT (Observational guidance for selected product images)
 * 
 * Enforces strict boundaries to prevent hallucinations and keyword stuffing.
 */

/**
 * Builds the complete prompt context payload for Gemini AI analysis.
 * 
 * @param {Object} product - Product record or draft state
 * @param {Object} [options] - Additional contextual hints or selected images
 * @returns {Object} { systemInstruction, userPrompt, imageAnalysisTargets }
 */
export function buildProductContext(product = {}, options = {}) {
  const name = (product.name || "Untitled Product").trim();
  const sku = (product.sku || "N/A").trim();
  const productType = (product.productType || product.product_type || "Stone Craft").trim();
  const parentCollection = (product.parentCollection || product.parent_collection || "").trim();
  const parentSubcategory = (product.parentSubcategory || product.parent_subcategory || "").trim();
  const parentCategory = (product.parentCategory || product.parent_category || "").trim();
  const primaryMaterial = (product.primaryMaterialId || product.primary_material_id || product.material || "Marble / Natural Stone").trim();
  
  // Format attributes
  const attributesObj = typeof product.attributes === "string" 
    ? safeJsonParse(product.attributes, {}) 
    : (product.attributes || {});

  const formattedAttributes = Object.entries(attributesObj)
    .filter(([_, val]) => val !== null && val !== undefined && val !== "")
    .map(([key, val]) => `- ${formatKeyLabel(key)}: ${val}`)
    .join("\n") || "- None explicitly specified";

  // Existing content
  const shortDescription = (product.shortDescription || product.short_description || "").trim();
  const detailedDescription = (product.detailedDescription || product.detailed_description || "").trim();
  const manualNotes = (product.manualNotes || product.notes || options.manualNotes || "").trim();
  
  // Existing Knowledge Layer
  const knowledgeObj = typeof product.knowledgeLayer === "string"
    ? safeJsonParse(product.knowledgeLayer, {})
    : (product.knowledgeLayer || {});

  let formattedKnowledge = "";
  if (Array.isArray(knowledgeObj.sections)) {
    formattedKnowledge = knowledgeObj.sections
      .map(sec => `### ${sec.title || "Section"}\n${sec.content || ""}`)
      .join("\n\n");
  } else if (typeof knowledgeObj === "object" && Object.keys(knowledgeObj).length > 0) {
    formattedKnowledge = Object.entries(knowledgeObj)
      .map(([k, v]) => `### ${formatKeyLabel(k)}\n${typeof v === "string" ? v : JSON.stringify(v)}`)
      .join("\n\n");
  }

  // Existing SEO
  const seoObj = typeof product.seo === "string"
    ? safeJsonParse(product.seo, {})
    : (product.seo || {});

  const existingSeoTitle = (seoObj.title || seoObj.titleTag || "").trim();
  const existingMetaDesc = (seoObj.description || seoObj.metaDescription || "").trim();
  const existingKeywords = Array.isArray(seoObj.keywords) ? seoObj.keywords.join(", ") : (seoObj.keywords || "");

  // Selected Images for visual analysis
  const selectedImages = options.selectedImages || extractProductImages(product);

  const systemInstruction = `
You are the Master Content & SEO Intelligence Specialist for Jaipur Stonecraft — a world-renowned atelier specializing in hand-carved marble sculptures, divine murtis, architectural stone elements, and bespoke stone artifacts based in Jaipur, Rajasthan, India.

CRITICAL RULES YOU MUST STRICTLY FOLLOW:
1. MANUAL DATA IS HIGHEST AUTHORITY: Never contradict, alter, or ignore confirmed factual specifications provided under [CONFIRMED DATA].
2. DO NOT INVENT FACTS: Do NOT invent unconfirmed facts, dimensions, stone origins, weights, historical age, sacred claims, pricing, or manufacturing techniques not stated in [CONFIRMED DATA] or clearly visible in images.
3. PRESERVE IDENTITY WHILE IMPROVING WORDING: Enhance clarity, vocabulary, devotional/architectural nuances, and search intent alignment while keeping the true product identity intact.
4. NO KEYWORD STUFFING: Avoid repetitive, unnatural keyword lists. Use clear, natural, semantically rich language suitable for premium clientele and modern search engines.
5. STRICTLY EXCLUDE GRANITE: Jaipur Stonecraft works with sacred marbles, sandstones, and soapstones. Granite is strictly forbidden across all descriptions.
6. FLAG UNCERTAINTIES: If important specifications (like dimensions, material grade, or care instructions) are missing, flag them in 'possible_inconsistencies' for human review instead of making assumptions.
`.trim();

  const userPrompt = `
Analyze the following product from Jaipur Stonecraft and generate structured SEO, content quality improvements, knowledge sections, and search intent insights.

=== [SECTION 1: CONFIRMED DATA] ===
- Product Name: ${name}
- SKU: ${sku}
- Product Type: ${productType}
- Collection: ${parentCollection || "N/A"}
- Subcategory: ${parentSubcategory || "N/A"}
- Category: ${parentCategory || "N/A"}
- Primary Material: ${primaryMaterial}
- Confirmed Specifications & Attributes:
${formattedAttributes}

=== [SECTION 2: EXISTING CONTENT & NOTES] ===
- Current Short Description: ${shortDescription || "None provided"}
- Current Detailed Description: ${detailedDescription || "None provided"}
- Manual Admin Notes: ${manualNotes || "None"}
- Existing Knowledge Sections:
${formattedKnowledge || "None provided"}
- Current SEO Title: ${existingSeoTitle || "None"}
- Current Meta Description: ${existingMetaDesc || "None"}
- Current Keywords: ${existingKeywords || "None"}

=== [SECTION 3: VISUAL CONTEXT] ===
- Number of attached image(s) for visual context: ${selectedImages.length}
${selectedImages.map((img, i) => `- Image ${i + 1}: ${img.url || img}`).join("\n")}

Respond strictly in valid JSON matching the required schema.
`.trim();

  return {
    systemInstruction,
    userPrompt,
    selectedImages,
    productSummaryContext: { name, sku, primaryMaterial, productType }
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
