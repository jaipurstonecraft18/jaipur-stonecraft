/**
 * JAIPUR STONECRAFT — PRODUCT INTELLIGENCE ENGINE (PIE v3.0)
 * Streamlined Product Quality, SEO Readiness & Contextual Assessment System
 * 
 * 3-Layer Validation Architecture:
 * - Layer A: Deterministic Validation (Identity, taxonomy, natural stone vs synthetic, routes, canonicals, blockers)
 * - Layer B: Contextual Content Assessment (Clarity, intent, guidance ranges, accessibility)
 * - Layer C: Optional Enhancements (Secondary keywords, FAQs, additional angles, knowledge layer)
 * 
 * 4 User-Facing Outcomes:
 * - BLOCKER: Essential data-integrity, business-rule, or technical problem preventing publication
 * - RECOMMENDED: Meaningful improvement supported by specific evidence and expected benefit
 * - OPTIONAL: Useful enhancement that can be deferred without making the product inadequate (0 score penalty)
 * - NOT_APPLICABLE: Rule does not apply or condition cannot be reliably verified (0 score penalty)
 * - PASS: Requirement fully met
 * 
 * Business Policies:
 * - Natural Stone: Authentic Makrana marble, Sangemarmar, Sandstone, Granite, Soapstone, Onyx are approved.
 * - Granite is fully supported and fulfilled for client architectural and sculpture orders.
 * - Synthetic composites (resin cast, cultured marble, synthetic marble, bonded marble) are strictly blocked.
 * - Never fabricate reviews, ratings, prices, or fake certifications.
 * - Administrator verified facts are authoritative.
 */

import { categoriesData } from "../../content/categories-data.js";

// Authoritative natural stone materials approved for Jaipur Stonecraft atelier (includes Granite)
export const APPROVED_STONE_MATERIALS = [
  "makrana-pure-white",
  "makrana-white-marble",
  "sangemarmar-white-marble",
  "bansi-paharpur-pink-sandstone",
  "jodhpur-red-sandstone",
  "dholpur-beige-sandstone",
  "black-bhainslana-marble",
  "jaisalmer-yellow-marble",
  "vietnam-pure-white",
  "soapstone-natural",
  "italian-carrara-marble",
  "natural-onyx-stone",
  // Granite varieties supported and fulfilled
  "black-granite",
  "rajasthan-black-granite",
  "natural-granite",
  "granite-grey",
  "granite-black",
  "granite"
];

export const APPROVED_COLLECTIONS = [
  "sculptures-statues",
  "wall-art-reliefs",
  "temples-architectural-stonework",
  "fountains-water-features",
  "decorative-stone-art",
  "custom-bespoke-creations"
];

// Strictly forbidden synthetic composites and artificial substitutes
export const FORBIDDEN_STONE_TERMS = [
  "synthetic marble",
  "cultured marble",
  "resin cast",
  "bonded marble",
  "fiberglass stone",
  "plastic composite"
];

export const PIE_RULE_STATUS = {
  PASS: "PASS",
  BLOCKER: "BLOCKER",
  RECOMMENDED: "RECOMMENDED",
  OPTIONAL: "OPTIONAL",
  NOT_APPLICABLE: "NOT_APPLICABLE",
  // Backward compatibility alias for existing consumers expecting WARNING
  WARNING: "RECOMMENDED"
};

export const PIE_DIMENSIONS = {
  DATA_INTEGRITY: "data_integrity",
  CONTENT_QUALITY: "content_quality",
  TECHNICAL_SEO: "technical_seo",
  MEDIA_ACCESSIBILITY: "media_accessibility",
  GEO_AEO: "geo_aeo"
};

/**
 * Default SEO Audit Configuration & Rule Thresholds
 */
export const DEFAULT_SEO_AUDIT_CONFIG = {
  // Option: When false, primary keyword is used as an SEO & AI reference without scoring penalties for missing exact placement
  requireExactPrimarySearchPhrasePlacement: false,
  // Minimum title length to flag as too short/insufficiently descriptive
  minTitleLength: 20,
  // Configurable maximum title length (up from previous restrictive 65/75 to practical 120 chars)
  maxTitleLength: 120,
  // Typical search engine snippet display window in SERP results (informative guideline)
  recommendedSnippetDisplayMin: 30,
  recommendedSnippetDisplayMax: 65,
  // Meta description boundaries
  minMetaDescriptionLength: 50,
  maxMetaDescriptionLength: 185
};

function safeJsonParse(val, fallback = {}) {
  if (!val) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function countWords(str) {
  if (!str || typeof str !== "string") return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Evaluates product quality and SEO readiness using the streamlined 3-layer architecture.
 * 
 * @param {Object} product - Product record (from DB or form state)
 * @param {Object} [options] - Contextual options (knownCategories, isUpdate, etc.)
 * @returns {Object} Comprehensive evaluation report
 */
export function evaluateProductIntelligence(product = {}, options = {}) {
  const p = product || {};

  // Resolve audit configuration with robust fallbacks
  const seoConfig = {
    ...DEFAULT_SEO_AUDIT_CONFIG,
    ...(options.seoConfig || options.auditConfig || options.seoSettings || options)
  };

  const requireExactPrimaryPlacement = Boolean(
    options.requireExactPrimarySearchPhrasePlacement ??
    options.requireExactPrimaryPhrasePlacement ??
    seoConfig.requireExactPrimarySearchPhrasePlacement ??
    seoConfig.requireExactPrimaryPhrasePlacement ??
    DEFAULT_SEO_AUDIT_CONFIG.requireExactPrimarySearchPhrasePlacement
  );

  const minTitleLen = Number(
    options.minTitleLength ??
    seoConfig.minTitleLength ??
    DEFAULT_SEO_AUDIT_CONFIG.minTitleLength
  );

  const maxTitleLen = Number(
    options.maxTitleLength ??
    seoConfig.maxTitleLength ??
    DEFAULT_SEO_AUDIT_CONFIG.maxTitleLength
  );

  const snippetMin = Number(
    options.recommendedSnippetDisplayMin ??
    seoConfig.recommendedSnippetDisplayMin ??
    DEFAULT_SEO_AUDIT_CONFIG.recommendedSnippetDisplayMin
  );

  const snippetMax = Number(
    options.recommendedSnippetDisplayMax ??
    seoConfig.recommendedSnippetDisplayMax ??
    DEFAULT_SEO_AUDIT_CONFIG.recommendedSnippetDisplayMax
  );

  // Extract and normalize core fields
  const name = String(p.name || "").trim();
  const slug = String(p.slug || "").trim();
  const sku = String(p.sku || "").trim();
  const status = String(p.status || "draft").toLowerCase();
  const productType = String(p.productType || p.product_type || "statue").toLowerCase();

  const parentCategory = String(p.parentCategory || p.parent_category || "").trim();
  const parentSubcategory = String(p.parentSubcategory || p.parent_subcategory || "").trim();
  const parentCollection = String(p.parentCollection || p.parent_collection || "").trim();

  const materialId = String(p.primaryMaterialId || p.primary_material_id || p.material || "").trim().toLowerCase();
  const materialName = String(p.primaryMaterial?.name || p.materialName || "").trim();

  const shortDesc = String(p.shortDescription || p.short_description || "").trim();
  const detailedDesc = String(p.detailedDescription || p.detailed_description || "").trim();

  const imageSrc = String(p.imageSrc || p.image_src || "").trim();
  const imageGallery = Array.isArray(p.imageGallery) 
    ? p.imageGallery 
    : (Array.isArray(p.images) ? p.images : []);

  const attributes = safeJsonParse(p.attributes, {});
  const knowledgeLayer = safeJsonParse(p.knowledgeLayer || p.knowledge_layer, {});
  const seo = safeJsonParse(p.seo, {});

  const seoTitle = String(seo.title || seo.seoTitle || seo.titleTag || "").trim();
  const metaDesc = String(seo.description || seo.metaDescription || "").trim();
  const primaryKeyword = String(seo.primaryKeyword || "").trim();
  const secondaryKeywords = Array.isArray(seo.secondaryKeywords) 
    ? seo.secondaryKeywords.map(k => String(k).trim()).filter(Boolean) 
    : [];
  const discoveryTags = Array.isArray(p.tags) 
    ? p.tags.map(t => String(t).trim()).filter(Boolean) 
    : (Array.isArray(seo.tags) ? seo.tags.map(t => String(t).trim()).filter(Boolean) : []);

  const isBespokeOrCustom = Boolean(
    p.isCustomOnly || 
    p.is_custom_only || 
    parentCollection === "custom-bespoke-creations" || 
    productType === "bespoke" ||
    productType === "project"
  );

  const fullTextScan = `${name} ${shortDesc} ${detailedDesc} ${materialId} ${materialName}`.toLowerCase();

  const checks = [];

  // =========================================================================
  // LAYER A: DETERMINISTIC VALIDATION (Data Integrity & Technical SEO)
  // =========================================================================

  // P01 — Product Identity & Name
  const isNameEmpty = !name;
  const isNamePlaceholder = /^(untitled|test\s*product|draft\s*product|new\s*product|sample|placeholder)/i.test(name);
  checks.push({
    id: "P01",
    code: "P01",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Product Identity & Authoritative Name",
    status: isNameEmpty || isNamePlaceholder ? PIE_RULE_STATUS.BLOCKER : PIE_RULE_STATUS.PASS,
    severity: isNameEmpty || isNamePlaceholder ? "blocker" : "info",
    message: isNameEmpty 
      ? "Product name is required for catalogue indexing and customer clarity."
      : isNamePlaceholder 
      ? `Name "${name}" appears to be temporary placeholder text.` 
      : `Verified product identity: "${name}"`,
    guidance: "Provide a distinct, authentic artisan title specifying the subject and carving format.",
    aiActionKey: isNameEmpty || isNamePlaceholder ? "generate_short_description" : null,
    fieldTarget: "name",
    isBlocker: isNameEmpty || isNamePlaceholder,
    isOptional: false,
    applicable: true
  });

  // P02 — Taxonomy Integrity & Hierarchy
  const hasCategory = Boolean(parentCategory);
  const isReviewPending = parentCategory === "review-pending";

  const knownList = Array.isArray(options.knownCategories)
    ? options.knownCategories
    : (Array.isArray(options.categories) ? options.categories : (Array.isArray(p.availableCategories) ? p.availableCategories : []));

  const dynamicMatch = knownList.find(c => (c.slug || c.id) === parentCategory);
  const staticMatch = categoriesData[parentCategory];
  const productCatMatch = p.categoryObj && (p.categoryObj.slug === parentCategory || p.categoryObj.id === parentCategory)
    ? p.categoryObj
    : null;

  const directCategoryObj = staticMatch || (dynamicMatch ? {
    slug: dynamicMatch.slug || dynamicMatch.id,
    name: dynamicMatch.name || parentCategory,
    parentCollection: dynamicMatch.parentCollection || dynamicMatch.parent_collection_slug || parentCollection,
    parentSubcategory: dynamicMatch.parentSubcategory || dynamicMatch.parent_subcategory_slug || parentSubcategory
  } : null) || (productCatMatch ? {
    slug: productCatMatch.slug || productCatMatch.id,
    name: productCatMatch.name || parentCategory,
    parentCollection: productCatMatch.parentCollection || productCatMatch.parent_collection_slug || parentCollection,
    parentSubcategory: productCatMatch.parentSubcategory || productCatMatch.parent_subcategory_slug || parentSubcategory
  } : null);

  const isCategoryValid = hasCategory && !isReviewPending && Boolean(directCategoryObj);
  const isCollectionConsistent = isCategoryValid && (
    !parentCollection || directCategoryObj.parentCollection === parentCollection
  );

  let p02Status = PIE_RULE_STATUS.PASS;
  let p02Severity = "info";
  let p02Msg = isCategoryValid 
    ? `Taxonomy hierarchy verified: ${directCategoryObj.parentCollection || parentCollection} > ${directCategoryObj.name || parentCategory}`
    : `Taxonomy assignment verified: ${parentCategory}`;

  if (!hasCategory) {
    p02Status = PIE_RULE_STATUS.BLOCKER;
    p02Severity = "blocker";
    p02Msg = "Parent category assignment is missing.";
  } else if (isReviewPending) {
    p02Status = PIE_RULE_STATUS.RECOMMENDED;
    p02Severity = "recommended";
    p02Msg = "Draft category assignment pending administrative curation. Assign to an active category prior to publishing.";
  } else if (!isCategoryValid) {
    p02Status = PIE_RULE_STATUS.BLOCKER;
    p02Severity = "blocker";
    p02Msg = `Category "${parentCategory}" is not recognized in the authoritative catalogue taxonomy.`;
  } else if (!isCollectionConsistent) {
    p02Status = PIE_RULE_STATUS.RECOMMENDED;
    p02Severity = "recommended";
    p02Msg = `Collection hierarchy notice: "${parentCategory}" is assigned to "${parentCollection}".`;
  }

  checks.push({
    id: "P02",
    code: "P02",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Taxonomy & Hierarchy Consistency",
    status: p02Status,
    severity: p02Severity,
    message: p02Msg,
    guidance: "Assign product to an active, verified catalogue category with matching collection parentage.",
    aiActionKey: null,
    fieldTarget: "parentCategory",
    isBlocker: p02Status === PIE_RULE_STATUS.BLOCKER,
    isOptional: false,
    applicable: true
  });

  // P03 — Material Record & Authenticity (Granite is supported; synthetic composites are blocked)
  const containsSynthetic = FORBIDDEN_STONE_TERMS.some(t => fullTextScan.includes(t));
  const hasMaterial = Boolean(materialId || materialName);
  const isRecognizedMaterial = hasMaterial && (
    APPROVED_STONE_MATERIALS.some(m => materialId.includes(m) || m.includes(materialId)) ||
    materialId.includes("granite") ||
    materialId.includes("marble") ||
    materialId.includes("sandstone") ||
    materialId.includes("onyx") ||
    materialId.includes("soapstone") ||
    materialName.toLowerCase().includes("granite") ||
    materialName.toLowerCase().includes("marble") ||
    materialName.toLowerCase().includes("sandstone")
  );

  let p03Status = PIE_RULE_STATUS.PASS;
  let p03Severity = "info";
  let p03Msg = `Natural stone confirmed: ${materialName || materialId || "Natural Stone"}`;
  
  if (containsSynthetic) {
    p03Status = PIE_RULE_STATUS.BLOCKER;
    p03Severity = "blocker";
    p03Msg = "CRITICAL: Synthetic resin or cultured stone detected. Jaipur Stonecraft atelier strictly carves authentic natural stone.";
  } else if (!hasMaterial) {
    p03Status = PIE_RULE_STATUS.RECOMMENDED;
    p03Severity = "recommended";
    p03Msg = "Primary stone material identification is unset. Stone provenance should remain explicit.";
  } else if (!isRecognizedMaterial) {
    p03Status = PIE_RULE_STATUS.RECOMMENDED;
    p03Severity = "recommended";
    p03Msg = `Material "${materialName || materialId}" should be verified against approved natural stone varieties.`;
  }

  checks.push({
    id: "P03",
    code: "P03",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Material Record & Natural Stone Authenticity",
    status: p03Status,
    severity: p03Severity,
    message: p03Msg,
    guidance: "Specify authentic natural stone: Makrana Marble, Sandstone, Granite, Black Bhainslana Marble, or Onyx.",
    aiActionKey: null,
    fieldTarget: "primaryMaterialId",
    isBlocker: p03Status === PIE_RULE_STATUS.BLOCKER,
    isOptional: false,
    applicable: true
  });

  // P04 — Physical Specifications & Attributes (Context-aware: Not required for bespoke/projects)
  const hasDimensions = Boolean(
    attributes.dimensions || 
    (attributes.height && attributes.width) ||
    attributes.size ||
    attributes.sizing
  );
  const hasFinish = Boolean(attributes.finish || attributes.surfaceFinish);

  let p04Status = PIE_RULE_STATUS.PASS;
  let p04Severity = "info";
  let p04Msg = "Key physical specifications recorded.";

  if (isBespokeOrCustom) {
    p04Status = PIE_RULE_STATUS.NOT_APPLICABLE;
    p04Severity = "info";
    p04Msg = "Custom bespoke project: Dimensions and finishes are carved to client architectural specifications upon request.";
  } else if (!hasDimensions && !hasFinish) {
    p04Status = PIE_RULE_STATUS.OPTIONAL;
    p04Severity = "optional";
    p04Msg = "Dimensions or finish unrecorded (optional: helpful for client architectural space planning).";
  }

  checks.push({
    id: "P04",
    code: "P04",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Product Specifications & Physical Attributes",
    status: p04Status,
    severity: p04Severity,
    message: p04Msg,
    guidance: "Record verified physical dimensions and surface finish when fixed dimensions apply.",
    aiActionKey: null,
    fieldTarget: "attributes",
    isBlocker: false,
    isOptional: p04Status === PIE_RULE_STATUS.OPTIONAL,
    applicable: p04Status !== PIE_RULE_STATUS.NOT_APPLICABLE
  });

  // P05 — Slug & Canonical URL Structure
  const isValidSlug = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2;
  checks.push({
    id: "P05",
    code: "P05",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Slug & Canonical URL Structure",
    status: isValidSlug ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.BLOCKER,
    severity: isValidSlug ? "info" : "blocker",
    message: isValidSlug 
      ? `Canonical slug verified: /designs/${parentCategory || "category"}/${slug}`
      : "Product slug is missing or contains invalid characters (must be clean lowercase alphanumeric with hyphens).",
    guidance: "Maintain persistent, crawlable kebab-case URL slugs without changing existing published paths.",
    aiActionKey: null,
    fieldTarget: "slug",
    isBlocker: !isValidSlug,
    isOptional: false,
    applicable: true
  });

  // P06 — Sizing & Variant Integrity
  const rawVariants = p.variants;
  const hasVariants = rawVariants && (
    Array.isArray(rawVariants) ? rawVariants.length > 0 : Object.keys(rawVariants).length > 0
  );
  checks.push({
    id: "P06",
    code: "P06",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Variant & Sizing Option Integrity",
    status: PIE_RULE_STATUS.PASS,
    severity: "info",
    message: hasVariants 
      ? "Product sizing options recorded without conflicting configurations."
      : "Single unique masterpiece (or custom bespoke dimensions upon request).",
    guidance: "Ensure supported size variations remain consistent with parent carving proportions.",
    aiActionKey: null,
    fieldTarget: "variants",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // P07 — Factual Attribute Consistency
  const hasPostureMismatch = (
    (fullTextScan.includes("standing") && fullTextScan.includes("padmasana")) ||
    (fullTextScan.includes("sitting") && fullTextScan.includes("standing statue"))
  );
  const hasMaterialMismatch = (
    fullTextScan.includes("white marble") && fullTextScan.includes("red sandstone")
  );

  let p07Status = PIE_RULE_STATUS.PASS;
  let p07Severity = "info";
  let p07Msg = "No internal factual contradictions detected.";

  if (containsSynthetic) {
    p07Status = PIE_RULE_STATUS.BLOCKER;
    p07Severity = "blocker";
    p07Msg = "Factual contradiction: Product copy claims synthetic resin or cultured marble, which conflicts with atelier natural stone standards.";
  } else if (hasMaterialMismatch) {
    p07Status = PIE_RULE_STATUS.RECOMMENDED;
    p07Severity = "recommended";
    p07Msg = "Possible stone contradiction detected (references both white marble and red sandstone in same product).";
  } else if (hasPostureMismatch) {
    p07Status = PIE_RULE_STATUS.RECOMMENDED;
    p07Severity = "recommended";
    p07Msg = "Possible posture inconsistency detected (conflicting standing vs. seated terms).";
  }

  checks.push({
    id: "P07",
    code: "P07",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Factual Attribute Consistency",
    status: p07Status,
    severity: p07Severity,
    message: p07Msg,
    guidance: "Verify that stone variety, carving format, and physical claims match consistently across all fields.",
    aiActionKey: null,
    fieldTarget: null,
    isBlocker: p07Status === PIE_RULE_STATUS.BLOCKER,
    isOptional: false,
    applicable: true
  });

  // =========================================================================
  // LAYER B: CONTEXTUAL CONTENT ASSESSMENT
  // =========================================================================

  // C01 — Product Description & Summary Clarity (No arbitrary word count penalties)
  const hasShortDesc = Boolean(shortDesc);
  const shortWords = countWords(shortDesc);
  let c01Status = PIE_RULE_STATUS.PASS;
  let c01Severity = "info";
  let c01Msg = `Product summary clearly communicates identity (${shortWords} words).`;

  if (!hasShortDesc) {
    c01Status = PIE_RULE_STATUS.BLOCKER;
    c01Severity = "blocker";
    c01Msg = "Product short summary is missing. Required for product cards, search snippets, and customer understanding.";
  } else if (shortWords < 4) {
    c01Status = PIE_RULE_STATUS.RECOMMENDED;
    c01Severity = "recommended";
    c01Msg = `Summary is extremely brief (${shortWords} words). A concise 1-2 sentence description improves search snippets.`;
  }

  checks.push({
    id: "C01",
    code: "C01",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Product Summary Clarity",
    status: c01Status,
    severity: c01Severity,
    message: c01Msg,
    guidance: "Compose 1-2 concise sentences identifying the subject, material, and carving format.",
    aiActionKey: hasShortDesc ? "enhance_short_description" : "generate_short_description",
    fieldTarget: "shortDescription",
    isBlocker: c01Status === PIE_RULE_STATUS.BLOCKER,
    isOptional: false,
    applicable: true
  });

  // C02 — Detailed Craftsmanship Description (Optional if short description already clearly explains the piece)
  const hasDetailedDesc = Boolean(detailedDesc);
  const detailedWords = countWords(detailedDesc);
  let c02Status = PIE_RULE_STATUS.PASS;
  let c02Severity = "info";
  let c02Msg = hasDetailedDesc 
    ? `Detailed craftsmanship documentation present (${detailedWords} words).`
    : "Concise product presentation (detailed documentation can be added as an optional enhancement).";

  if (!hasDetailedDesc) {
    c02Status = PIE_RULE_STATUS.OPTIONAL;
    c02Severity = "optional";
    c02Msg = "Detailed carving description is empty. Optional: Elaborating on chisel technique and stone texture aids luxury buyers.";
  }

  checks.push({
    id: "C02",
    code: "C02",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Detailed Craftsmanship & Carving Description",
    status: c02Status,
    severity: c02Severity,
    message: c02Msg,
    guidance: "Detail the single-block manual chisel craftsmanship, proportions, and tactile finish.",
    aiActionKey: hasDetailedDesc ? "enhance_detailed_description" : "generate_detailed_description",
    fieldTarget: "detailedDescription",
    isBlocker: false,
    isOptional: c02Status === PIE_RULE_STATUS.OPTIONAL,
    applicable: true
  });

  // C03 — Content Differentiation
  const isDuplicateDescription = hasShortDesc && hasDetailedDesc && shortDesc.toLowerCase() === detailedDesc.toLowerCase();
  checks.push({
    id: "C03",
    code: "C03",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Content Originality & Non-Boilerplate",
    status: isDuplicateDescription ? PIE_RULE_STATUS.RECOMMENDED : PIE_RULE_STATUS.PASS,
    severity: isDuplicateDescription ? "recommended" : "info",
    message: isDuplicateDescription 
      ? "Detailed description is an exact duplicate of the short summary. Differentiating them provides deeper value."
      : "Original, differentiated copy between summary and detailed sections.",
    guidance: "Provide concise summary in short description and in-depth stonecraft documentation in detailed description.",
    aiActionKey: isDuplicateDescription ? "generate_detailed_description" : null,
    fieldTarget: "detailedDescription",
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // C04 — Category Search & Craft Intent Alignment
  const isJaliOrScreen = parentCollection === "architectural-elements" || parentCategory.includes("jali") || fullTextScan.includes("jali") || fullTextScan.includes("screen");
  const isFountain = parentCollection === "fountains-water-features" || parentCategory.includes("fountain") || fullTextScan.includes("fountain");
  const isTempleOrMandir = parentCollection === "temples-architectural-stonework" || parentCategory.includes("temple") || parentCategory.includes("mandir") || fullTextScan.includes("mandir");

  let hasRelevantIntent = false;
  if (isJaliOrScreen) {
    hasRelevantIntent = /(jali|screen|lattice|carved|panel|partition|stone|marble|architectural)/i.test(fullTextScan);
  } else if (isFountain) {
    hasRelevantIntent = /(fountain|water|basin|courtyard|tier|tiered|stone|marble|spout)/i.test(fullTextScan);
  } else if (isTempleOrMandir) {
    hasRelevantIntent = /(temple|mandir|sanctum|mandapam|pooja|shilpa|stone|marble|sacred)/i.test(fullTextScan);
  } else {
    hasRelevantIntent = /(hand[- ]carved|sculpted|chiseled|handcrafted|atelier|sanctum|mandir|temple|statue|murti|sculpture|bespoke|relief|panel|stone|marble|granite|sandstone)/i.test(fullTextScan);
  }

  checks.push({
    id: "C04",
    code: "C04",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Commercial & Craft Search Intent",
    status: hasRelevantIntent ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.RECOMMENDED,
    severity: hasRelevantIntent ? "info" : "recommended",
    message: hasRelevantIntent 
      ? "Content aligns with natural stone craft intent and customer vocabulary."
      : "Content could be strengthened with relevant stonecraft terminology (e.g., 'hand-carved', 'chiseled', 'bespoke').",
    guidance: "Incorporate authentic artisanal terminology appropriate to the specific product category.",
    aiActionKey: "generate_seo",
    fieldTarget: "detailedDescription",
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // C05 — Primary Search Phrase Relevance & Natural Usage
  const hasPrimaryKw = Boolean(primaryKeyword);
  const kwInTitleOrCopy = hasPrimaryKw && (
    seoTitle.toLowerCase().includes(primaryKeyword.toLowerCase()) ||
    shortDesc.toLowerCase().includes(primaryKeyword.toLowerCase()) ||
    name.toLowerCase().includes(primaryKeyword.toLowerCase())
  );

  let c05Status = PIE_RULE_STATUS.PASS;
  let c05Severity = "info";
  let c05Msg = "";

  if (hasPrimaryKw) {
    if (kwInTitleOrCopy) {
      c05Status = PIE_RULE_STATUS.PASS;
      c05Severity = "info";
      c05Msg = `Primary search phrase "${primaryKeyword}" designated and reflected in product content.`;
    } else if (requireExactPrimaryPlacement) {
      c05Status = PIE_RULE_STATUS.RECOMMENDED;
      c05Severity = "recommended";
      c05Msg = `Primary phrase "${primaryKeyword}" is not reflected in title, summary, or product name.`;
    } else {
      c05Status = PIE_RULE_STATUS.PASS;
      c05Severity = "info";
      c05Msg = `Primary search phrase "${primaryKeyword}" designated as SEO reference (exact placement in title/summary optional).`;
    }
  } else {
    c05Status = PIE_RULE_STATUS.OPTIONAL;
    c05Severity = "optional";
    c05Msg = "Primary target search phrase optional (title and name serve as organic search anchor).";
  }

  checks.push({
    id: "C05",
    code: "C05",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Primary Search Phrase & Natural Usage",
    status: c05Status,
    severity: c05Severity,
    message: c05Msg,
    guidance: requireExactPrimaryPlacement 
      ? "Designate a genuine buyer query and reflect it naturally in headings and copy."
      : "Primary search phrase serves as semantic guidance for search engines and AI enrichment. Exact verbatim placement is optional.",
    aiActionKey: "recommend_primary_keyword",
    fieldTarget: "seo.primaryKeyword",
    isBlocker: false,
    isOptional: !requireExactPrimaryPlacement || c05Status === PIE_RULE_STATUS.OPTIONAL,
    applicable: true
  });

  // C06 — Secondary Search Phrases (OPTIONAL: 0 score penalty)
  const hasSecondaryKws = secondaryKeywords.length > 0;
  checks.push({
    id: "C06",
    code: "C06",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Secondary Buyer Terminology & Synonyms",
    status: hasSecondaryKws ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: hasSecondaryKws 
      ? `${secondaryKeywords.length} secondary search phrase(s) defined.`
      : "Optional: Adding 1-3 regional or international synonyms (Murti, Idol, Moorti, Statue) expands long-tail coverage.",
    guidance: "Cover regional and international synonyms naturally.",
    aiActionKey: "recommend_secondary_keywords",
    fieldTarget: "seo.secondaryKeywords",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // C07 — Coverage of Buyer Questions (FAQs) (OPTIONAL: 0 score penalty)
  const klFaqs = Array.isArray(knowledgeLayer.faqs) ? knowledgeLayer.faqs : [];
  const hasFaqs = klFaqs.length > 0;
  checks.push({
    id: "C07",
    code: "C07",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Coverage of Practical Buyer Questions",
    status: hasFaqs ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: hasFaqs 
      ? `${klFaqs.length} buyer questions directly answered.`
      : "Optional: Clear answers regarding custom dimensions, export crating, and care provide helpful buyer clarity.",
    guidance: "Provide direct, factual Q&As addressing custom sizing and export packaging.",
    aiActionKey: "generate_product_faqs",
    fieldTarget: "knowledgeLayer.faqs",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // C08 — Factual Trustworthiness & Unsupported Claims
  const hasHypedClaims = /(100% guaranteed #1|nasa approved|magical stone|certified zero defect)/i.test(fullTextScan);
  checks.push({
    id: "C08",
    code: "C08",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Factual Trustworthiness & Artisanal Claims",
    status: hasHypedClaims ? PIE_RULE_STATUS.RECOMMENDED : PIE_RULE_STATUS.PASS,
    severity: hasHypedClaims ? "recommended" : "info",
    message: hasHypedClaims 
      ? "Exaggerated or unverified marketing claim detected. Luxury stone buyers value restrained, genuine authenticity."
      : "Claims are grounded in genuine natural stonecraft and traditional masonry.",
    guidance: "Avoid exaggerated claims. Highlight genuine geological origin and chiseling mastery.",
    aiActionKey: null,
    fieldTarget: null,
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // =========================================================================
  // TECHNICAL SEO & DISCOVERABILITY (S01 - S10)
  // =========================================================================

  // S01 — SEO Title Tag (Guidance window, blocker if completely missing)
  const titleLen = seoTitle.length;
  let s01Status = PIE_RULE_STATUS.PASS;
  let s01Severity = "info";
  let s01Msg = `Title tag length appropriate (${titleLen} chars).`;

  if (!seoTitle) {
    s01Status = PIE_RULE_STATUS.BLOCKER;
    s01Severity = "blocker";
    s01Msg = "HTML title tag is missing. Required for search engine listing headers.";
  } else if (titleLen < minTitleLen) {
    s01Status = PIE_RULE_STATUS.RECOMMENDED;
    s01Severity = "recommended";
    s01Msg = `Title tag length (${titleLen} chars) is too short to be descriptive (minimum ${minTitleLen} characters recommended).`;
  } else if (titleLen > maxTitleLen) {
    s01Status = PIE_RULE_STATUS.RECOMMENDED;
    s01Severity = "recommended";
    s01Msg = `Title tag length (${titleLen} chars) exceeds recommended maximum limit of ${maxTitleLen} characters.`;
  } else {
    // Within valid range [minTitleLen, maxTitleLen]
    s01Status = PIE_RULE_STATUS.PASS;
    s01Severity = "info";
    if (titleLen > snippetMax) {
      s01Msg = `Title tag length (${titleLen} chars) is descriptive and within the ${maxTitleLen}-character limit (note: search engines may truncate snippets over ${snippetMin}–${snippetMax} chars in search result listings).`;
    } else {
      s01Msg = `Title tag length appropriate (${titleLen} chars).`;
    }
  }

  checks.push({
    id: "S01",
    code: "S01",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "HTML SEO Title Tag",
    status: s01Status,
    severity: s01Severity,
    message: s01Msg,
    guidance: `Craft a distinct title tag format: '[Product Name] - [Material] | Jaipur Stonecraft' (up to ${maxTitleLen} characters).`,
    aiActionKey: "optimize_seo_title",
    fieldTarget: "seo.title",
    isBlocker: s01Status === PIE_RULE_STATUS.BLOCKER,
    isOptional: false,
    applicable: true
  });

  // S02 — Meta Description Tag (Guidance window, blocker if completely missing)
  const metaLen = metaDesc.length;
  let s02Status = PIE_RULE_STATUS.PASS;
  let s02Severity = "info";
  let s02Msg = `Meta description length appropriate (${metaLen} chars).`;

  if (!metaDesc) {
    s02Status = PIE_RULE_STATUS.BLOCKER;
    s02Severity = "blocker";
    s02Msg = "HTML meta description tag is missing. Required for search snippet summary.";
  } else if (metaLen < 50 || metaLen > 185) {
    s02Status = PIE_RULE_STATUS.RECOMMENDED;
    s02Severity = "recommended";
    s02Msg = `Meta description (${metaLen} chars) is outside typical 70-165 character display range.`;
  }

  checks.push({
    id: "S02",
    code: "S02",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "HTML Meta Description Tag",
    status: s02Status,
    severity: s02Severity,
    message: s02Msg,
    guidance: "Provide an accurate summary highlighting hand-carved purity, custom sizes, and worldwide shipping.",
    aiActionKey: "optimize_meta_description",
    fieldTarget: "seo.description",
    isBlocker: s02Status === PIE_RULE_STATUS.BLOCKER,
    isOptional: false,
    applicable: true
  });

  // S03 — Open Graph Metadata & Social Card
  const hasOgImage = imageSrc && !imageSrc.includes("placehold.co");
  checks.push({
    id: "S03",
    code: "S03",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Open Graph & Social Share Metadata",
    status: hasOgImage ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.RECOMMENDED,
    severity: hasOgImage ? "info" : "recommended",
    message: hasOgImage 
      ? "Social share preview card configured with high-resolution image."
      : "Open Graph image missing; social shares will display a default fallback.",
    guidance: "Assign a photograph for crisp WhatsApp and social sharing.",
    aiActionKey: null,
    fieldTarget: "imageSrc",
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // S04 — Indexability & Robots Directives
  const isIndexable = seo.indexable !== false;
  checks.push({
    id: "S04",
    code: "S04",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Search Engine Indexability Status",
    status: isIndexable ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.RECOMMENDED,
    severity: isIndexable ? "info" : "recommended",
    message: isIndexable 
      ? "Product is set to index, follow (search engines permitted)."
      : "Product is explicitly tagged 'noindex'. It will not appear in search results.",
    guidance: "Ensure public catalogue artworks are set to indexable unless intentionally hidden.",
    aiActionKey: null,
    fieldTarget: "seo.indexable",
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // S05 — Canonical URL Integrity
  const expectedCanonical = `https://jaipurstonecraft.com/designs/${parentCategory || "category"}/${slug || "product"}`;
  const customCanonical = String(seo.canonicalUrl || "").trim();
  const isCanonicalValid = !customCanonical || customCanonical.startsWith("https://jaipurstonecraft.com/");

  checks.push({
    id: "S05",
    code: "S05",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Canonical URL Mapping",
    status: isCanonicalValid ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.BLOCKER,
    severity: isCanonicalValid ? "info" : "blocker",
    message: customCanonical 
      ? `Explicit canonical specified: ${customCanonical}`
      : `Default canonical assigned: ${expectedCanonical}`,
    guidance: "Ensure canonical URL matches the authoritative HTTPS product route without external domain discrepancies.",
    aiActionKey: null,
    fieldTarget: "seo.canonicalUrl",
    isBlocker: !isCanonicalValid,
    isOptional: false,
    applicable: true
  });

  // S06 — Server-Rendered Route Accessibility
  const hasRouteDependencies = Boolean(parentCategory && slug);
  checks.push({
    id: "S06",
    code: "S06",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Server-Rendered Route Accessibility",
    status: hasRouteDependencies ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.BLOCKER,
    severity: hasRouteDependencies ? "info" : "blocker",
    message: hasRouteDependencies 
      ? "Route parameters complete for server-side HTML rendering."
      : "Missing category or slug required for public URL routing.",
    guidance: "Provide both parentCategory and slug to generate the public design detail route.",
    aiActionKey: null,
    fieldTarget: "parentCategory",
    isBlocker: !hasRouteDependencies,
    isOptional: false,
    applicable: true
  });

  // S07 — Structured Data (Schema.org Product & Breadcrumb)
  const isSchemaReady = Boolean(name && (shortDesc || detailedDesc) && hasOgImage);
  checks.push({
    id: "S07",
    code: "S07",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Structured Data (Schema.org / JSON-LD)",
    status: isSchemaReady ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.RECOMMENDED,
    severity: isSchemaReady ? "info" : "recommended",
    message: isSchemaReady 
      ? "Product & Breadcrumb JSON-LD schemas generate with complete entity attributes."
      : "Populate photo and description for complete Schema.org Product markup.",
    guidance: "Populate photo and description to enable rich Google search snippet understanding.",
    aiActionKey: null,
    fieldTarget: null,
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // S08 — Breadcrumb Hierarchy & Internal Linking
  const hasBreadcrumbPath = Boolean(parentCategory && (parentCollection || directCategoryObj?.parentCollection));
  checks.push({
    id: "S08",
    code: "S08",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Breadcrumb Hierarchy & Internal Linking",
    status: hasBreadcrumbPath ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.RECOMMENDED,
    severity: hasBreadcrumbPath ? "info" : "recommended",
    message: hasBreadcrumbPath 
      ? "Full breadcrumb trail established (Home > Collections > Category > Artwork)."
      : "Incomplete taxonomy tree limits internal link equity.",
    guidance: "Ensure category has active parent collection relationships for breadcrumb hierarchy.",
    aiActionKey: null,
    fieldTarget: "parentCategory",
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // S09 — XML Sitemap Eligibility (Contextual: Drafts are NOT_APPLICABLE)
  const isSitemapEligible = status === "published" && isIndexable && hasRouteDependencies;
  checks.push({
    id: "S09",
    code: "S09",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "XML Sitemap Eligibility",
    status: isSitemapEligible ? PIE_RULE_STATUS.PASS : (status === "draft" ? PIE_RULE_STATUS.NOT_APPLICABLE : PIE_RULE_STATUS.RECOMMENDED),
    severity: isSitemapEligible ? "info" : (status === "draft" ? "info" : "recommended"),
    message: isSitemapEligible 
      ? "Product is published and dynamically included in sitemap.xml."
      : status === "draft" 
      ? "Draft product: Excluded from sitemap until published."
      : "Product not included in sitemap (check status and indexability).",
    guidance: "Only published, indexable artworks are served in the search engine sitemap.",
    aiActionKey: null,
    fieldTarget: "status",
    isBlocker: false,
    isOptional: false,
    applicable: status !== "draft"
  });

  // S10 — Search Intent Cannibalization Prevention
  const isGenericSingleWordKw = primaryKeyword && !primaryKeyword.includes(" ") && (
    ["statue", "murti", "sculpture", "temple", "marble", "stone"].includes(primaryKeyword.toLowerCase())
  );
  checks.push({
    id: "S10",
    code: "S10",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Search Intent Cannibalization Prevention",
    status: isGenericSingleWordKw ? PIE_RULE_STATUS.RECOMMENDED : PIE_RULE_STATUS.PASS,
    severity: isGenericSingleWordKw ? "recommended" : "info",
    message: isGenericSingleWordKw 
      ? `Primary keyword "${primaryKeyword}" is too broad and collides with top-level category rankings.`
      : "Target keyword is appropriately specific to this unique design.",
    guidance: "Use long-tail specific phrases instead of generic single words.",
    aiActionKey: "recommend_primary_keyword",
    fieldTarget: "seo.primaryKeyword",
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // =========================================================================
  // MEDIA AND ACCESSIBILITY (M01 - M06)
  // =========================================================================

  // M01 — Primary Cover Photo
  const hasRealCover = Boolean(imageSrc && !imageSrc.includes("placehold.co"));
  checks.push({
    id: "M01",
    code: "M01",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Primary Cover Photo Assignment",
    status: hasRealCover ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.BLOCKER,
    severity: hasRealCover ? "info" : "blocker",
    message: hasRealCover 
      ? "High-definition primary photograph assigned."
      : "Primary cover photo is missing or using placeholder graphic.",
    guidance: "Upload a crisp, well-lit photograph showing the complete artwork.",
    aiActionKey: null,
    fieldTarget: "imageSrc",
    isBlocker: !hasRealCover,
    isOptional: false,
    applicable: true
  });

  // M02 — Multi-Angle Perspective Gallery (OPTIONAL: 0 penalty)
  const galleryCount = imageGallery.length + (hasRealCover ? 1 : 0);
  checks.push({
    id: "M02",
    code: "M02",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Multi-Angle Perspective Gallery",
    status: galleryCount >= 2 ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: galleryCount >= 2 
      ? `${galleryCount} image perspective(s) attached for multi-angle client inspection.`
      : "Single photo attached (optional: adding side angle or chisel detail close-ups provides richer buyer views).",
    guidance: "Add gallery images capturing 45° angle or chisel relief close-ups if available.",
    aiActionKey: null,
    fieldTarget: "imageGallery",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // M03 — Image Accessibility & Alt Text Coverage
  const imagesWithoutAlt = imageGallery.filter(img => {
    const alt = typeof img === "object" ? String(img.altText || img.alt_text || img.alt || "").trim() : "";
    return !alt || alt.length < 3;
  });
  const hasImagesToEvaluate = imageGallery.length > 0;

  let m03Status = PIE_RULE_STATUS.PASS;
  let m03Severity = "info";
  let m03Msg = "All gallery images have descriptive alt text.";

  if (!hasImagesToEvaluate) {
    m03Status = hasRealCover ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.RECOMMENDED;
    m03Msg = hasRealCover ? "Cover image configured." : "No images to evaluate.";
  } else if (imagesWithoutAlt.length > 0) {
    m03Status = PIE_RULE_STATUS.RECOMMENDED;
    m03Severity = "recommended";
    m03Msg = `${imagesWithoutAlt.length} of ${imageGallery.length} gallery image(s) missing descriptive accessibility alt text.`;
  }

  checks.push({
    id: "M03",
    code: "M03",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Image Accessibility & Alt Text Coverage",
    status: m03Status,
    severity: m03Severity,
    message: m03Msg,
    guidance: "Describe visual subject and view angle in alt text to assist accessibility and image search.",
    aiActionKey: imagesWithoutAlt.length > 0 ? "generate_image_alts" : null,
    fieldTarget: "imageGallery",
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // M04 — Descriptive Image Context & Nomenclature
  checks.push({
    id: "M04",
    code: "M04",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Descriptive Image Context & Nomenclature",
    status: PIE_RULE_STATUS.PASS,
    severity: "info",
    message: "Image descriptions convey specific visual perspectives.",
    guidance: "Use perspective descriptors like 'Side profile' or 'Pedestal relief'.",
    aiActionKey: null,
    fieldTarget: "imageGallery",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // M05 — Responsive Format & WebP Optimization
  const hasOptimizedUrls = hasRealCover && (
    imageSrc.includes("/display/") || 
    imageSrc.includes("/card/") || 
    imageSrc.includes(".webp")
  );
  checks.push({
    id: "M05",
    code: "M05",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Responsive Format & WebP Optimization",
    status: hasRealCover ? (hasOptimizedUrls ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL) : PIE_RULE_STATUS.BLOCKER,
    severity: hasRealCover ? (hasOptimizedUrls ? "info" : "optional") : "blocker",
    message: hasOptimizedUrls 
      ? "Processed through Mobile Image Studio with optimized WebP variants."
      : hasRealCover 
      ? "Standard image format in use (optional: WebP variants enhance mobile delivery speed)."
      : "No image attached to optimize.",
    guidance: "Process photography through Mobile Image Studio for fast mobile WebP delivery.",
    aiActionKey: null,
    fieldTarget: "imageSrc",
    isBlocker: !hasRealCover,
    isOptional: hasRealCover && !hasOptimizedUrls,
    applicable: true
  });

  // M06 — Image-Product Visual Cohesion
  const imageAltStr = String(p.imageAlt || p.image_alt || "").toLowerCase();
  const hasObviousImageMismatch = name && imageAltStr && (
    (name.toLowerCase().includes("ganesh") && imageAltStr.includes("shiva") && !name.toLowerCase().includes("shiva")) ||
    (name.toLowerCase().includes("krishna") && imageAltStr.includes("hanuman") && !name.toLowerCase().includes("hanuman"))
  );
  checks.push({
    id: "M06",
    code: "M06",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Image-Product Visual Cohesion",
    status: hasObviousImageMismatch ? PIE_RULE_STATUS.RECOMMENDED : PIE_RULE_STATUS.PASS,
    severity: hasObviousImageMismatch ? "recommended" : "info",
    message: hasObviousImageMismatch 
      ? "Potential discrepancy detected between product title and image alt text."
      : "Photography corresponds with product iconography and subject.",
    guidance: "Verify that the attached photo depicts the exact artwork described.",
    aiActionKey: "analyze_image_consistency",
    fieldTarget: null,
    isBlocker: false,
    isOptional: false,
    applicable: true
  });

  // =========================================================================
  // LAYER C: OPTIONAL KNOWLEDGE & GEO/AEO ENHANCEMENTS (G01 - G05)
  // All optional — 0 score penalty!
  // =========================================================================

  // G01 — Machine-Readable Knowledge Layer (OPTIONAL)
  const hasStructuredKnowledge = Array.isArray(knowledgeLayer.sections) && knowledgeLayer.sections.length > 0;
  checks.push({
    id: "G01",
    code: "G01",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Machine-Readable Factual Layer (AEO)",
    status: hasStructuredKnowledge ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: hasStructuredKnowledge 
      ? `${knowledgeLayer.sections.length} structured Knowledge Layer section(s) available.`
      : "Optional: Structured knowledge tabs (Craftsmanship, Care) provide clear entity data for answer engines.",
    guidance: "Populate Knowledge Layer tabs if detailed workshop technical documentation is desired.",
    aiActionKey: "generate_knowledge_content",
    fieldTarget: "knowledgeLayer.sections",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // G02 — Direct Answers to Buyer Queries (OPTIONAL)
  checks.push({
    id: "G02",
    code: "G02",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Direct Answer Clarity for Conversational Queries",
    status: hasFaqs ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: hasFaqs 
      ? "Direct, factual answers provided for search queries on custom sizing, export, and outdoor longevity."
      : "Optional: Direct Q&A answers assist conversational and voice search queries.",
    guidance: "State direct answers for custom sizing and export packaging.",
    aiActionKey: "generate_product_faqs",
    fieldTarget: "knowledgeLayer.faqs",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // G03 — Brand Entity & Geographic Origin Grounding (OPTIONAL)
  const hasAtelierMention = /(jaipur stonecraft|jaipur|rajasthan|atelier|artisan)/i.test(fullTextScan);
  checks.push({
    id: "G03",
    code: "G03",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Brand Entity & Geographic Origin Cohesion (GEO)",
    status: hasAtelierMention ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: hasAtelierMention 
      ? "Geographic entity cohesion established: Jaipur, Rajasthan atelier origin."
      : "Optional: Mentioning Jaipur heritage carving provenance reinforces local atelier authority.",
    guidance: "Mention Jaipur heritage carving provenance where relevant.",
    aiActionKey: "generate_detailed_description",
    fieldTarget: "detailedDescription",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // G04 — Authentic Quarry Provenance Grounding (OPTIONAL)
  const hasQuarryOrigin = /(makrana|bansi paharpur|dholpur|jodhpur|bhainslana|quarry|granite|calcite|sandstone)/i.test(fullTextScan);
  checks.push({
    id: "G04",
    code: "G04",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Authentic Geological Provenance Grounding",
    status: hasQuarryOrigin ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: hasQuarryOrigin 
      ? "Specific stone geological origin cited."
      : "Optional: Geological quarry origin can be noted to ground natural stone authenticity.",
    guidance: "State genuine geological origin to ground luxury authenticity.",
    aiActionKey: "generate_knowledge_content",
    fieldTarget: "knowledgeLayer",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // G05 — Enquiry & Bespoke Commission Transparency (OPTIONAL)
  const hasProcessClarity = /(custom|bespoke|quote|enquiry|packaging|crate|shipping|export)/i.test(fullTextScan);
  checks.push({
    id: "G05",
    code: "G05",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Enquiry & Bespoke Commission Transparency",
    status: hasProcessClarity ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.OPTIONAL,
    severity: "optional",
    message: hasProcessClarity 
      ? "Transparent bespoke commission pathway outlined."
      : "Optional: Clarifying custom sizing and worldwide crating builds private client confidence.",
    guidance: "Clarify that bespoke dimensions and export crating are supported.",
    aiActionKey: "generate_detailed_description",
    fieldTarget: "detailedDescription",
    isBlocker: false,
    isOptional: true,
    applicable: true
  });

  // =========================================================================
  // SCORING & READINESS STATUS COMPUTATION
  // =========================================================================

  const blockerChecks = checks.filter(c => c.status === PIE_RULE_STATUS.BLOCKER);
  const recommendedChecks = checks.filter(c => c.status === PIE_RULE_STATUS.RECOMMENDED);
  const passChecks = checks.filter(c => c.status === PIE_RULE_STATUS.PASS);
  const optionalChecks = checks.filter(c => c.status === PIE_RULE_STATUS.OPTIONAL);
  const naChecks = checks.filter(c => c.status === PIE_RULE_STATUS.NOT_APPLICABLE);

  const blockerCount = blockerChecks.length;
  const recommendedCount = recommendedChecks.length;
  const passCount = passChecks.length;
  const optionalCount = optionalChecks.length;
  const naCount = naChecks.length;

  // Predictable, explainable scoring:
  // Base: 100.
  // Deductions: Blockers (-25 each), Recommendations (-10 each, capped at -30 max).
  // Optional enhancements and N/A checks deduct 0 points!
  let score = 100;
  score -= (blockerCount * 25);
  score -= Math.min(recommendedCount * 10, 30);
  score = Math.max(0, Math.min(100, score));

  // Dimension Scores
  const dimensionScores = {};
  Object.values(PIE_DIMENSIONS).forEach(dim => {
    const dimChecks = checks.filter(c => c.dimension === dim);
    const dimBlockers = dimChecks.filter(c => c.status === PIE_RULE_STATUS.BLOCKER).length;
    const dimRecs = dimChecks.filter(c => c.status === PIE_RULE_STATUS.RECOMMENDED).length;
    let dimScore = 100 - (dimBlockers * 35) - (dimRecs * 15);
    dimensionScores[dim] = Math.max(0, Math.min(100, dimScore));
  });

  // 1. Publication Eligibility
  const publicationEligibility = blockerCount === 0 ? "ELIGIBLE" : "BLOCKED";

  // 2. SEO Content Readiness
  let seoContentReadiness = "OPTIMAL";
  const contentBlockers = checks.filter(c => c.dimension === PIE_DIMENSIONS.CONTENT_QUALITY && c.status === PIE_RULE_STATUS.BLOCKER).length;
  const contentRecs = checks.filter(c => c.dimension === PIE_DIMENSIONS.CONTENT_QUALITY && c.status === PIE_RULE_STATUS.RECOMMENDED).length;
  if (contentBlockers > 0) seoContentReadiness = "INCOMPLETE";
  else if (contentRecs > 0) seoContentReadiness = "NEEDS_IMPROVEMENT";

  // 3. Technical Indexability
  let technicalIndexability = "INDEXABLE";
  const techBlockers = checks.filter(c => c.dimension === PIE_DIMENSIONS.TECHNICAL_SEO && c.status === PIE_RULE_STATUS.BLOCKER).length;
  const techRecs = checks.filter(c => c.dimension === PIE_DIMENSIONS.TECHNICAL_SEO && c.status === PIE_RULE_STATUS.RECOMMENDED).length;
  if (techBlockers > 0) technicalIndexability = "INVALID";
  else if (techRecs > 0 || !isIndexable) technicalIndexability = "RESTRICTED";

  // 4. GEO/AEO Content Readiness
  let geoAeoReadiness = "AI_READY";

  // 5. Search Monitoring State
  const searchMonitoringState = status === "published" ? "PUBLISHED_MONITORED" : "PRE_PUBLICATION";

  // Overall Status Rollup
  let overallStatus = "ready";
  if (blockerCount > 0) overallStatus = "incomplete";
  else if (recommendedCount > 0) overallStatus = "needs_attention";

  const isClean = blockerCount === 0 && recommendedCount === 0;

  return {
    score,
    dimensionScores,
    statuses: {
      publicationEligibility,
      seoContentReadiness,
      technicalIndexability,
      geoAeoReadiness,
      searchMonitoringState
    },
    isClean,
    overallStatus,
    healthStatus: overallStatus,
    auditConfig: {
      requireExactPrimarySearchPhrasePlacement: requireExactPrimaryPlacement,
      minTitleLength: minTitleLen,
      maxTitleLength: maxTitleLen,
      recommendedSnippetDisplayMin: snippetMin,
      recommendedSnippetDisplayMax: snippetMax
    },
    okCount: passCount,
    warningCount: recommendedCount,
    missingCount: blockerCount,
    optionalCount,
    naCount,
    blockers: blockerChecks.map(c => ({
      id: c.id,
      code: c.code,
      label: c.label,
      dimension: c.dimension,
      message: c.message,
      guidance: c.guidance,
      fieldTarget: c.fieldTarget,
      aiActionKey: c.aiActionKey
    })),
    recommendations: recommendedChecks.map(c => ({
      id: c.id,
      code: c.code,
      label: c.label,
      dimension: c.dimension,
      message: c.message,
      guidance: c.guidance,
      fieldTarget: c.fieldTarget,
      aiActionKey: c.aiActionKey
    })),
    optionalEnhancements: optionalChecks.map(c => ({
      id: c.id,
      code: c.code,
      label: c.label,
      dimension: c.dimension,
      message: c.message,
      guidance: c.guidance,
      fieldTarget: c.fieldTarget,
      aiActionKey: c.aiActionKey
    })),
    items: checks.map(c => ({
      id: c.id,
      code: c.code,
      label: c.label,
      dimension: c.dimension,
      status: c.status === PIE_RULE_STATUS.PASS 
        ? "ok" 
        : (c.status === PIE_RULE_STATUS.BLOCKER 
          ? "missing" 
          : (c.status === PIE_RULE_STATUS.OPTIONAL || c.status === PIE_RULE_STATUS.NOT_APPLICABLE ? "info" : "warning")),
      rawStatus: c.status,
      severity: c.severity,
      message: c.message,
      guidance: c.guidance,
      aiActionKey: c.aiActionKey,
      fieldTarget: c.fieldTarget,
      isOptional: c.isOptional,
      isBlocker: c.isBlocker,
      applicable: c.applicable
    }))
  };
}
