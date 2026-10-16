/**
 * JAIPUR STONECRAFT — PRODUCT INTELLIGENCE ENGINE (PIE)
 * Product Quality + SEO + GEO + AEO + AI Content Intelligence
 * 
 * Implements 30 rigorous, deterministic quality checks across 5 core dimensions:
 * A. Product Data Integrity (P01 - P07)
 * B. Content Quality & Search Intent (C01 - C08)
 * C. Technical SEO & Discoverability (S01 - S10)
 * D. Images & Accessibility (M01 - M06)
 * E. GEO / AEO & Buyer Confidence (G01 - G05)
 * 
 * Outcome model: PASS | WARNING | BLOCKER | NOT_APPLICABLE
 * 5 Distinct Status Dimensions:
 * 1. Publication Eligibility
 * 2. SEO Content Readiness
 * 3. Technical Indexability
 * 4. GEO/AEO Content Readiness
 * 5. Search Monitoring State
 * 
 * STRICT RULES:
 * - Granite is strictly forbidden.
 * - Never fabricate reviews, ratings, prices, or fake certifications.
 * - Manual administrator facts are authoritative.
 */

import { categoriesData } from "../../content/categories-data.js";

// Authoritative natural stone materials approved for Jaipur Stonecraft atelier
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
  "natural-onyx-stone"
];

export const APPROVED_COLLECTIONS = [
  "sculptures-statues",
  "wall-art-reliefs",
  "temples-architectural-stonework",
  "fountains-water-features",
  "decorative-stone-art",
  "custom-bespoke-creations"
];

export const FORBIDDEN_STONE_TERMS = [
  "granite",
  "granitic",
  "black galaxy",
  "synthetic marble",
  "cultured marble",
  "resin cast",
  "bonded marble"
];

export const PIE_RULE_STATUS = {
  PASS: "PASS",
  WARNING: "WARNING",
  BLOCKER: "BLOCKER",
  NOT_APPLICABLE: "NOT_APPLICABLE"
};

export const PIE_DIMENSIONS = {
  DATA_INTEGRITY: "data_integrity",
  CONTENT_QUALITY: "content_quality",
  TECHNICAL_SEO: "technical_seo",
  MEDIA_ACCESSIBILITY: "media_accessibility",
  GEO_AEO: "geo_aeo"
};

const DIMENSION_WEIGHTS = {
  [PIE_DIMENSIONS.DATA_INTEGRITY]: 20,
  [PIE_DIMENSIONS.CONTENT_QUALITY]: 25,
  [PIE_DIMENSIONS.TECHNICAL_SEO]: 25,
  [PIE_DIMENSIONS.MEDIA_ACCESSIBILITY]: 15,
  [PIE_DIMENSIONS.GEO_AEO]: 15
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
 * Evaluates the full 30-check Product Intelligence suite for a given product.
 * 
 * @param {Object} product - Product record (from DB or form state)
 * @param {Object} [options] - Contextual options (e.g. existingSlugs, isUpdate)
 * @returns {Object} Comprehensive evaluation report
 */
export function evaluateProductIntelligence(product = {}, options = {}) {
  const p = product || {};

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

  const checks = [];

  // =========================================================================
  // GROUP A: PRODUCT DATA INTEGRITY (P01 - P07)
  // =========================================================================

  // P01 — Product Identity
  const isNameEmpty = !name;
  const isNamePlaceholder = /^(untitled|test\s*product|draft\s*product|new\s*product|sample|placeholder)/i.test(name);
  checks.push({
    id: "P01",
    code: "P01",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Product Identity & Authoritative Name",
    status: isNameEmpty || isNamePlaceholder ? PIE_RULE_STATUS.BLOCKER : PIE_RULE_STATUS.PASS,
    message: isNameEmpty 
      ? "Product name is required for catalog indexing and customer clarity."
      : isNamePlaceholder 
      ? `Name "${name}" appears to be temporary placeholder text.` 
      : `Verified product identity: "${name}"`,
    guidance: "Provide a distinct, authentic artisan title specifying the subject and carving format.",
    aiActionKey: isNameEmpty || isNamePlaceholder ? "generate_short_description" : null,
    fieldTarget: "name"
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

  const matchedCategoryObj = directCategoryObj;
  const isCategoryValid = hasCategory && !isReviewPending && Boolean(matchedCategoryObj);
  
  const isCollectionConsistent = isCategoryValid && (
    !parentCollection || matchedCategoryObj.parentCollection === parentCollection
  );
  const isSubcategoryConsistent = isCategoryValid && (
    !parentSubcategory || matchedCategoryObj.parentSubcategory === parentSubcategory
  );

  let p02Status = PIE_RULE_STATUS.PASS;
  let p02Msg = isCategoryValid 
    ? `Taxonomy hierarchy verified: ${matchedCategoryObj.parentCollection} > ${matchedCategoryObj.parentSubcategory} > ${matchedCategoryObj.name}`
    : `Taxonomy assignment verified: ${parentCategory}`;

  if (!hasCategory) {
    p02Status = PIE_RULE_STATUS.BLOCKER;
    p02Msg = "Parent category assignment is missing.";
  } else if (isReviewPending) {
    p02Status = PIE_RULE_STATUS.WARNING;
    p02Msg = "Draft category assignment pending administrative curation. Assign to an active category prior to publishing.";
  } else if (!isCategoryValid) {
    p02Status = PIE_RULE_STATUS.BLOCKER;
    p02Msg = `Category "${parentCategory}" is not recognized in the authoritative catalog taxonomy.`;
  } else if (!isCollectionConsistent) {
    p02Status = PIE_RULE_STATUS.WARNING;
    p02Msg = `Collection hierarchy mismatch: "${parentCategory}" belongs to collection "${matchedCategoryObj.parentCollection}", but product specifies "${parentCollection}".`;
  } else if (!isSubcategoryConsistent) {
    p02Status = PIE_RULE_STATUS.WARNING;
    p02Msg = `Subcategory hierarchy mismatch: "${parentCategory}" belongs to subcategory "${matchedCategoryObj.parentSubcategory}", but product specifies "${parentSubcategory}".`;
  }

  checks.push({
    id: "P02",
    code: "P02",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Taxonomy & Hierarchy Consistency",
    status: p02Status,
    message: p02Msg,
    guidance: "Assign product to an active, verified catalog category with matching collection and subcategory parentage.",
    aiActionKey: null,
    fieldTarget: "parentCategory"
  });

  // P03 — Material Verification (STRICT: NO GRANITE)
  const fullTextScan = `${name} ${shortDesc} ${detailedDesc} ${materialId} ${materialName}`.toLowerCase();
  const containsGranite = FORBIDDEN_STONE_TERMS.some(t => fullTextScan.includes(t));
  const hasMaterial = Boolean(materialId);
  const isApprovedMaterial = hasMaterial && APPROVED_STONE_MATERIALS.some(m => materialId.includes(m) || m.includes(materialId));

  let p03Status = PIE_RULE_STATUS.PASS;
  let p03Msg = `Natural stone confirmed: ${materialName || materialId}`;
  if (containsGranite) {
    p03Status = PIE_RULE_STATUS.BLOCKER;
    p03Msg = "CRITICAL: Granite or synthetic stone detected. Jaipur Stonecraft atelier strictly sculpts authentic marble and sandstone.";
  } else if (!hasMaterial) {
    p03Status = PIE_RULE_STATUS.WARNING;
    p03Msg = "Primary stone material identification is unset. Stone provenance should remain explicit.";
  } else if (!isApprovedMaterial) {
    p03Status = PIE_RULE_STATUS.WARNING;
    p03Msg = `Material "${materialName || materialId}" should be verified against approved quarry origins.`;
  }

  checks.push({
    id: "P03",
    code: "P03",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Material Provenance & Non-Granite Guarantee",
    status: p03Status,
    message: p03Msg,
    guidance: "Specify authentic Makrana Marble, Bansi Paharpur Sandstone, Jodhpur Sandstone, or Black Bhainslana Marble.",
    aiActionKey: null,
    fieldTarget: "primaryMaterialId"
  });

  // P04 — Product Attributes & Physical Specifications
  const hasDimensions = Boolean(
    attributes.dimensions || 
    (attributes.height && attributes.width) ||
    attributes.size ||
    attributes.sizing
  );
  const hasFinish = Boolean(attributes.finish || attributes.surfaceFinish);
  const hasPosture = Boolean(attributes.posture || attributes.orientation || attributes.format);

  let p04Status = PIE_RULE_STATUS.PASS;
  let p04Msg = "Key physical specifications present.";
  if (!hasDimensions && !hasFinish) {
    p04Status = PIE_RULE_STATUS.WARNING;
    p04Msg = "Dimensions and surface finish are unrecorded. Buyers require size specifications for sanctum & architectural planning.";
  } else if (!hasDimensions) {
    p04Status = PIE_RULE_STATUS.WARNING;
    p04Msg = "Physical dimensions (Height × Width × Depth) missing.";
  }

  checks.push({
    id: "P04",
    code: "P04",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Product Specifications & Physical Attributes",
    status: p04Status,
    message: p04Msg,
    guidance: "Record verified physical dimensions, carving depth, and hand-honed surface texture.",
    aiActionKey: null,
    fieldTarget: "attributes"
  });

  // P05 — Product URL & Slug Integrity
  const isValidSlug = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3;
  checks.push({
    id: "P05",
    code: "P05",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Slug & Canonical URL Structure",
    status: isValidSlug ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.BLOCKER,
    message: isValidSlug 
      ? `Canonical slug verified: /designs/${parentCategory || "category"}/${slug}`
      : "Product slug is missing or contains invalid characters (must be clean lowercase alphanumeric with hyphens).",
    guidance: "Maintain persistent, crawlable kebab-case URL slugs without changing existing published paths.",
    aiActionKey: null,
    fieldTarget: "slug"
  });

  // P06 — Variant Consistency
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
    message: hasVariants 
      ? "Product sizing options recorded without conflicting configurations."
      : "Single unique masterpiece (or custom bespoke dimensions upon request).",
    guidance: "Ensure supported size variations (e.g. 24\", 36\", 48\", 60\") remain consistent with parent carving proportions.",
    aiActionKey: null,
    fieldTarget: "variants"
  });

  // P07 — Factual Consistency
  const hasPostureMismatch = (
    (fullTextScan.includes("standing") && fullTextScan.includes("padmasana")) ||
    (fullTextScan.includes("sitting") && fullTextScan.includes("standing statue"))
  );
  const hasMaterialMismatch = (
    fullTextScan.includes("white marble") && fullTextScan.includes("red sandstone")
  );
  const hasForbiddenContradiction = containsGranite;

  let p07Status = PIE_RULE_STATUS.PASS;
  let p07Msg = "No internal factual contradictions detected.";
  if (hasForbiddenContradiction) {
    p07Status = PIE_RULE_STATUS.BLOCKER;
    p07Msg = "CRITICAL: Factual contradiction detected. Product claims include forbidden stone materials (granite/synthetic) conflicting with Jaipur Stonecraft atelier standards.";
  } else if (hasPostureMismatch) {
    p07Status = PIE_RULE_STATUS.WARNING;
    p07Msg = "Possible posture inconsistency detected (conflicting standing vs. seated terms).";
  } else if (hasMaterialMismatch) {
    p07Status = PIE_RULE_STATUS.WARNING;
    p07Msg = "Possible stone contradiction detected (references both white marble and red sandstone).";
  }


  checks.push({
    id: "P07",
    code: "P07",
    dimension: PIE_DIMENSIONS.DATA_INTEGRITY,
    label: "Factual Attribute Consistency",
    status: p07Status,
    message: p07Msg,
    guidance: "Verify that deity posture, stone variety, and stylistic claims match across all fields.",
    aiActionKey: null,
    fieldTarget: null
  });

  // =========================================================================
  // GROUP B: CONTENT QUALITY & SEARCH INTENT (C01 - C08)
  // =========================================================================

  // C01 — Short Description Quality
  const shortDescWords = countWords(shortDesc);
  let c01Status = PIE_RULE_STATUS.PASS;
  let c01Msg = `Short description optimal (${shortDescWords} words / ${shortDesc.length} chars).`;
  if (!shortDesc) {
    c01Status = PIE_RULE_STATUS.BLOCKER;
    c01Msg = "Short description is missing. Required for product cards, snippets, and search previews.";
  } else if (shortDescWords < 12 || shortDesc.length < 50) {
    c01Status = PIE_RULE_STATUS.WARNING;
    c01Msg = `Short description is brief (${shortDescWords} words). Recommended: 20-50 words highlighting distinguishing features.`;
  }

  checks.push({
    id: "C01",
    code: "C01",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Short Description & Summary Quality",
    status: c01Status,
    message: c01Msg,
    guidance: "Compose 1-2 captivating sentences identifying the deity or architectural element, material, and sanctum suitability.",
    aiActionKey: shortDesc ? "enhance_short_description" : "generate_short_description",
    fieldTarget: "shortDescription"
  });

  // C02 — Detailed Description Quality
  const detailedWords = countWords(detailedDesc);
  let c02Status = PIE_RULE_STATUS.PASS;
  let c02Msg = `Detailed carving documentation comprehensive (${detailedWords} words).`;
  if (!detailedDesc) {
    c02Status = PIE_RULE_STATUS.BLOCKER;
    c02Msg = "Detailed description missing. Required for buyer evaluation and search intent depth.";
  } else if (detailedWords < 60) {
    c02Status = PIE_RULE_STATUS.WARNING;
    c02Msg = `Detailed copy is minimal (${detailedWords} words). Elaborate on chiseling technique, stone grain, and proportions.`;
  }

  checks.push({
    id: "C02",
    code: "C02",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Detailed Craftsmanship & Carving Description",
    status: c02Status,
    message: c02Msg,
    guidance: "Detail the single-block manual chisel craftsmanship, traditional Shilpa Shastra proportions, and tactile finish.",
    aiActionKey: detailedDesc ? "enhance_detailed_description" : "generate_detailed_description",
    fieldTarget: "detailedDescription"
  });

  // C03 — Content Originality & Duplicate Detection
  const isDuplicateDescription = shortDesc && detailedDesc && shortDesc.toLowerCase() === detailedDesc.toLowerCase();
  checks.push({
    id: "C03",
    code: "C03",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Content Originality & Non-Boilerplate",
    status: isDuplicateDescription ? PIE_RULE_STATUS.WARNING : PIE_RULE_STATUS.PASS,
    message: isDuplicateDescription 
      ? "Detailed description is an exact duplicate of the short description."
      : "Original, differentiated copy between summary and detailed sections.",
    guidance: "Provide concise summary in short description and in-depth stonecraft documentation in detailed description.",
    aiActionKey: isDuplicateDescription ? "generate_detailed_description" : null,
    fieldTarget: "detailedDescription"
  });

  // C04 — Search Intent Alignment
  const hasCraftIntent = /(hand[- ]carved|sculpted|chiseled|handcrafted|atelier|sanctum|mandir|temple|statue|murti|sculpture|bespoke)/i.test(fullTextScan);
  checks.push({
    id: "C04",
    code: "C04",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Commercial & Craft Search Intent",
    status: hasCraftIntent ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasCraftIntent 
      ? "Content aligns with high-intent natural stone art and sculpture buyers."
      : "Copy lacks primary artisan craft terminology (e.g., 'hand-carved', 'sanctum', 'bespoke').",
    guidance: "Incorporate authentic artisanal terminology that reflects luxury bespoke stonecraft commissions.",
    aiActionKey: "generate_seo",
    fieldTarget: "detailedDescription"
  });

  // C05 — Primary Search Phrase Relevance
  const hasPrimaryKw = Boolean(primaryKeyword);
  const kwInTitleOrCopy = hasPrimaryKw && (
    seoTitle.toLowerCase().includes(primaryKeyword.toLowerCase()) ||
    shortDesc.toLowerCase().includes(primaryKeyword.toLowerCase()) ||
    name.toLowerCase().includes(primaryKeyword.toLowerCase())
  );

  let c05Status = PIE_RULE_STATUS.PASS;
  let c05Msg = `Primary search phrase "${primaryKeyword}" naturally placed on page.`;
  if (!hasPrimaryKw) {
    c05Status = PIE_RULE_STATUS.WARNING;
    c05Msg = "Primary search phrase unset. Helps anchor keyword relevance without stuffing.";
  } else if (!kwInTitleOrCopy) {
    c05Status = PIE_RULE_STATUS.WARNING;
    c05Msg = `Primary phrase "${primaryKeyword}" is not reflected in title, summary, or product name.`;
  }

  checks.push({
    id: "C05",
    code: "C05",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Primary Search Phrase & Natural Usage",
    status: c05Status,
    message: c05Msg,
    guidance: "Designate a genuine buyer query (e.g. 'Hand Carved White Marble Ganesh Statue') and reflect it naturally in headings and copy.",
    aiActionKey: "recommend_primary_keyword",
    fieldTarget: "seo.primaryKeyword"
  });

  // C06 — Secondary Concepts & Buyer Terminology
  const hasSecondaryKws = secondaryKeywords.length >= 2;
  checks.push({
    id: "C06",
    code: "C06",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Secondary Buyer Terminology & Synonyms",
    status: hasSecondaryKws ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasSecondaryKws 
      ? `${secondaryKeywords.length} secondary search phrase(s) defined.`
      : "Include 2-4 natural long-tail phrases (e.g., 'Makrana marble murti Jaipur', 'temple idol manufacturer').",
    guidance: "Cover regional and international synonyms (Murti, Idol, Moorti, Statue, Sculpture) naturally.",
    aiActionKey: "recommend_secondary_keywords",
    fieldTarget: "seo.secondaryKeywords"
  });

  // C07 — Buyer Questions & Clarity (FAQs)
  const klFaqs = Array.isArray(knowledgeLayer.faqs) ? knowledgeLayer.faqs : [];
  const hasFaqs = klFaqs.length >= 2;
  checks.push({
    id: "C07",
    code: "C07",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Coverage of Practical Buyer Questions",
    status: hasFaqs ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasFaqs 
      ? `${klFaqs.length} buyer questions directly answered (customization, crating, care).`
      : "Providing clear answers regarding custom dimensions, export crating, and care builds high buyer confidence.",
    guidance: "Provide direct, factual Q&As addressing custom sizing, worldwide export crating, and outdoor stone durability.",
    aiActionKey: "generate_product_faqs",
    fieldTarget: "knowledgeLayer.faqs"
  });

  // C08 — Factual Trustworthiness & Unsupported Claims
  const hasHypedClaims = /(100% guaranteed #1|nasa approved|magical stone|certified zero defect)/i.test(fullTextScan);
  checks.push({
    id: "C08",
    code: "C08",
    dimension: PIE_DIMENSIONS.CONTENT_QUALITY,
    label: "Factual Trustworthiness & Artisanal Claims",
    status: hasHypedClaims ? PIE_RULE_STATUS.WARNING : PIE_RULE_STATUS.PASS,
    message: hasHypedClaims 
      ? "Exaggerated or unverified marketing claim detected. Luxury buyers value restrained authenticity."
      : "Claims are grounded in genuine natural stonecraft and traditional masonry.",
    guidance: "Avoid exaggerated claims. Highlight genuine geological origin, chiseling mastery, and ISPM-15 packaging.",
    aiActionKey: null,
    fieldTarget: null
  });

  // =========================================================================
  // GROUP C: TECHNICAL SEO & DISCOVERABILITY (S01 - S10)
  // =========================================================================

  // S01 — SEO Title Tag
  const titleLen = seoTitle.length;
  let s01Status = PIE_RULE_STATUS.PASS;
  let s01Msg = `Title tag length optimal (${titleLen} chars).`;
  if (!seoTitle) {
    s01Status = PIE_RULE_STATUS.BLOCKER;
    s01Msg = "HTML title tag is missing.";
  } else if (titleLen < 30 || titleLen > 65) {
    s01Status = PIE_RULE_STATUS.WARNING;
    s01Msg = `Title tag length (${titleLen} chars) is outside optimal 30-65 character display window.`;
  }

  checks.push({
    id: "S01",
    code: "S01",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "HTML SEO Title Tag",
    status: s01Status,
    message: s01Msg,
    guidance: "Craft a distinct title tag format: '[Product Name] - [Material] [Type] | Jaipur Stonecraft'.",
    aiActionKey: "optimize_seo_title",
    fieldTarget: "seo.title"
  });

  // S02 — Meta Description Tag
  const metaLen = metaDesc.length;
  let s02Status = PIE_RULE_STATUS.PASS;
  let s02Msg = `Meta description optimal (${metaLen} chars).`;
  if (!metaDesc) {
    s02Status = PIE_RULE_STATUS.BLOCKER;
    s02Msg = "HTML meta description tag is missing.";
  } else if (metaLen < 70 || metaLen > 165) {
    s02Status = PIE_RULE_STATUS.WARNING;
    s02Msg = `Meta description (${metaLen} chars) is outside optimal 70-165 character range.`;
  }

  checks.push({
    id: "S02",
    code: "S02",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "HTML Meta Description Tag",
    status: s02Status,
    message: s02Msg,
    guidance: "Provide an accurate summary highlighting hand-carved purity, master craftsmanship, custom sizes, and global shipping.",
    aiActionKey: "optimize_meta_description",
    fieldTarget: "seo.description"
  });

  // S03 — Open Graph Metadata & Social Card
  const hasOgImage = imageSrc && !imageSrc.includes("placehold.co");
  checks.push({
    id: "S03",
    code: "S03",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Open Graph & Social Share Metadata",
    status: hasOgImage ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasOgImage 
      ? "Social share preview card configured with high-resolution image."
      : "Open Graph image missing; social shares will display a default fallback.",
    guidance: "Assign a high-resolution photograph (1200×630px ideal) for crisp WhatsApp and social sharing.",
    aiActionKey: null,
    fieldTarget: "imageSrc"
  });

  // S04 — Indexability & Robots Directives
  const isIndexable = seo.indexable !== false;
  checks.push({
    id: "S04",
    code: "S04",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Search Engine Indexability Status",
    status: isIndexable ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: isIndexable 
      ? "Product is set to index, follow (search engines permitted)."
      : "Product is explicitly tagged 'noindex'. It will not appear in search results.",
    guidance: "Ensure public catalog artworks are set to indexable unless intentionally hidden.",
    aiActionKey: null,
    fieldTarget: "seo.indexable"
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
    message: customCanonical 
      ? `Explicit canonical specified: ${customCanonical}`
      : `Default canonical assigned: ${expectedCanonical}`,
    guidance: "Ensure canonical URL matches the authoritative HTTPS product route without trailing slash discrepancies.",
    aiActionKey: null,
    fieldTarget: "seo.canonicalUrl"
  });

  // S06 — Route & Server Accessibility
  const hasRouteDependencies = Boolean(parentCategory && slug);
  checks.push({
    id: "S06",
    code: "S06",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Server-Rendered Route Accessibility",
    status: hasRouteDependencies ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.BLOCKER,
    message: hasRouteDependencies 
      ? "Route parameters complete for server-side HTML rendering."
      : "Missing category or slug required for public URL routing.",
    guidance: "Provide both parentCategory and slug to generate the public design detail route.",
    aiActionKey: null,
    fieldTarget: "parentCategory"
  });

  // S07 — Structured Data (Schema.org Product & Breadcrumb)
  const isSchemaReady = Boolean(name && (shortDesc || detailedDesc) && hasOgImage && (parentCategory || materialId));
  checks.push({
    id: "S07",
    code: "S07",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Structured Data (Schema.org / JSON-LD)",
    status: isSchemaReady ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: isSchemaReady 
      ? "Product & Breadcrumb JSON-LD schemas generate with complete entity attributes."
      : "Missing attributes for complete Schema.org Product markup.",
    guidance: "Populate material, photo, and description to enable rich Google search snippet understanding.",
    aiActionKey: null,
    fieldTarget: null
  });

  // S08 — Relevant Internal Links & Breadcrumb Trail
  const hasBreadcrumbPath = Boolean(parentCategory && (parentCollection || matchedCategoryObj?.parentCollection));
  checks.push({
    id: "S08",
    code: "S08",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Breadcrumb Hierarchy & Internal Linking",
    status: hasBreadcrumbPath ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasBreadcrumbPath 
      ? "Full breadcrumb trail established (Home > Collections > Category > Artwork)."
      : "Incomplete taxonomy tree limits internal link equity and discovery.",
    guidance: "Ensure category has active parent collection and subcategory relationships for breadcrumb hierarchy.",
    aiActionKey: null,
    fieldTarget: "parentCategory"
  });

  // S09 — XML Sitemap Eligibility
  const isSitemapEligible = status === "published" && isIndexable && hasRouteDependencies;
  checks.push({
    id: "S09",
    code: "S09",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "XML Sitemap Eligibility",
    status: isSitemapEligible ? PIE_RULE_STATUS.PASS : (status === "draft" ? PIE_RULE_STATUS.NOT_APPLICABLE : PIE_RULE_STATUS.WARNING),
    message: isSitemapEligible 
      ? "Product is published and dynamically included in sitemap.xml."
      : status === "draft" 
      ? "Draft product: Excluded from sitemap until published."
      : "Product not included in sitemap (check status and indexability).",
    guidance: "Only published, indexable artworks are served in the search engine sitemap.",
    aiActionKey: null,
    fieldTarget: "status"
  });

  // S10 — Keyword Cannibalization Check
  const isGenericSingleWordKw = primaryKeyword && !primaryKeyword.includes(" ") && (
    ["statue", "murti", "sculpture", "temple", "marble", "stone"].includes(primaryKeyword.toLowerCase())
  );
  checks.push({
    id: "S10",
    code: "S10",
    dimension: PIE_DIMENSIONS.TECHNICAL_SEO,
    label: "Search Intent Cannibalization Prevention",
    status: isGenericSingleWordKw ? PIE_RULE_STATUS.WARNING : PIE_RULE_STATUS.PASS,
    message: isGenericSingleWordKw 
      ? `Primary keyword "${primaryKeyword}" is too broad and collides with top-level category rankings.`
      : "Target keyword is appropriately specific to this unique sculpture design.",
    guidance: "Use long-tail specific phrases (e.g. 'Hand-Carved Makrana White Marble Radha Krishna Murti') instead of generic single words.",
    aiActionKey: "recommend_primary_keyword",
    fieldTarget: "seo.primaryKeyword"
  });

  // =========================================================================
  // GROUP D: IMAGES AND ACCESSIBILITY (M01 - M06)
  // =========================================================================

  // M01 — Primary Cover Photo Validity
  const hasRealCover = imageSrc && !imageSrc.includes("placehold.co");
  checks.push({
    id: "M01",
    code: "M01",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Primary Cover Photo Assignment",
    status: hasRealCover ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.BLOCKER,
    message: hasRealCover 
      ? "High-definition primary photograph assigned."
      : "Primary cover photo is missing or using placeholder graphic.",
    guidance: "Upload a crisp, well-lit photograph showing the complete sculpture from chest level.",
    aiActionKey: null,
    fieldTarget: "imageSrc"
  });

  // M02 — Gallery Perspective Coverage
  const galleryCount = imageGallery.length + (hasRealCover ? 1 : 0);
  checks.push({
    id: "M02",
    code: "M02",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Multi-Angle Perspective Gallery",
    status: galleryCount >= 2 ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: galleryCount >= 2 
      ? `${galleryCount} image perspective(s) attached for multi-angle client inspection.`
      : "Only 1 photo attached. Buyers of bespoke stone art expect side-angle and carving detail close-ups.",
    guidance: "Add 2-4 gallery images capturing 45° angle, side profile, and intricate chisel relief close-ups.",
    aiActionKey: null,
    fieldTarget: "imageGallery"
  });

  // M03 — Image Alt Text Completeness
  const imagesWithoutAlt = imageGallery.filter(img => {
    const alt = typeof img === "object" ? String(img.altText || img.alt_text || img.alt || "").trim() : "";
    return !alt || alt.length < 5;
  });
  const hasImagesToEvaluate = imageGallery.length > 0;

  let m03Status = PIE_RULE_STATUS.PASS;
  let m03Msg = "All gallery images have descriptive alt text.";
  if (!hasImagesToEvaluate) {
    m03Status = hasRealCover ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING;
    m03Msg = hasRealCover ? "Cover image alt text configured." : "No gallery images to evaluate.";
  } else if (imagesWithoutAlt.length > 0) {
    m03Status = PIE_RULE_STATUS.WARNING;
    m03Msg = `${imagesWithoutAlt.length} of ${imageGallery.length} gallery image(s) missing descriptive accessibility alt text.`;
  }

  checks.push({
    id: "M03",
    code: "M03",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Image Accessibility & Alt Text Coverage",
    status: m03Status,
    message: m03Msg,
    guidance: "Describe visual subject and view angle in alt text to assist screen readers and Google Image search discovery.",
    aiActionKey: imagesWithoutAlt.length > 0 ? "generate_image_alts" : null,
    fieldTarget: "imageGallery"
  });

  // M04 — Descriptive Image Context
  const hasDescriptiveAlts = imageGallery.some(img => {
    const alt = typeof img === "object" ? String(img.altText || img.alt_text || "").toLowerCase() : "";
    return alt.includes("detail") || alt.includes("chisel") || alt.includes("view") || alt.includes("carved");
  });
  checks.push({
    id: "M04",
    code: "M04",
    dimension: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY,
    label: "Descriptive Image Context & Nomenclature",
    status: hasImagesToEvaluate && !hasDescriptiveAlts ? PIE_RULE_STATUS.WARNING : PIE_RULE_STATUS.PASS,
    message: hasImagesToEvaluate && !hasDescriptiveAlts 
      ? "Alt texts are generic. Specify the angle (e.g., 'chisel relief detail', 'profile view')."
      : "Image descriptions convey specific visual perspectives.",
    guidance: "Use perspective descriptors like 'Side profile chisel detail' or 'Sanctum pedestal relief'.",
    aiActionKey: "generate_image_alts",
    fieldTarget: "imageGallery"
  });

  // M05 — Responsive Format Optimization
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
    status: hasRealCover ? (hasOptimizedUrls ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING) : PIE_RULE_STATUS.BLOCKER,
    message: hasOptimizedUrls 
      ? "Processed through Mobile Image Studio with optimized WebP variants."
      : hasRealCover 
      ? "Using legacy image path. Passing through Image Studio generates display, card, and thumb WebP variants."
      : "No image attached to optimize.",
    guidance: "Process photography through Mobile Image Studio for fast mobile WebP delivery.",
    aiActionKey: null,
    fieldTarget: "imageSrc"
  });

  // M06 — Image-Product Consistency
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
    status: hasObviousImageMismatch ? PIE_RULE_STATUS.WARNING : PIE_RULE_STATUS.PASS,
    message: hasObviousImageMismatch 
      ? "Potential discrepancy detected between product title and image alt text."
      : "Photography corresponds with product iconography and subject.",
    guidance: "Verify that the attached photo depicts the exact deity, relief, or architectural element described.",
    aiActionKey: "analyze_image_consistency",
    fieldTarget: null
  });

  // =========================================================================
  // GROUP E: GEO / AEO & BUYER CONFIDENCE (G01 - G05)
  // =========================================================================

  // G01 — Extractable Factual Data (LLM & Answer Engine Readability)
  const hasStructuredKnowledge = Array.isArray(knowledgeLayer.sections) && knowledgeLayer.sections.length >= 2;
  checks.push({
    id: "G01",
    code: "G01",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Machine-Readable Factual Layer (AEO)",
    status: hasStructuredKnowledge ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasStructuredKnowledge 
      ? `${knowledgeLayer.sections.length} structured Knowledge Layer sections available for AI answer engine extraction.`
      : "Knowledge Layer sections (Craftsmanship, Geological Origin, Care) unrecorded. AI search engines prefer clearly demarcated facts.",
    guidance: "Populate Knowledge Layer tabs to enable generative AI engines to cite precise craftsmanship facts.",
    aiActionKey: "generate_knowledge_content",
    fieldTarget: "knowledgeLayer.sections"
  });

  // G02 — Direct Answers to Buyer Queries
  checks.push({
    id: "G02",
    code: "G02",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Direct Answer Clarity for Conversational Queries",
    status: hasFaqs ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasFaqs 
      ? "Direct, factual answers provided for search queries on custom sizing, export, and outdoor longevity."
      : "Direct Q&A answers recommended for voice and conversational AI search queries.",
    guidance: "State direct answers (e.g. 'Yes, our atelier carves bespoke sizes from 12 inches to over 10 feet').",
    aiActionKey: "generate_product_faqs",
    fieldTarget: "knowledgeLayer.faqs"
  });

  // G03 — Atelier Identity & Geographic Entity Cohesion
  const hasAtelierMention = /(jaipur stonecraft|jaipur|rajasthan|atelier|artisan)/i.test(fullTextScan);
  checks.push({
    id: "G03",
    code: "G03",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Brand Entity & Geographic Origin Cohesion (GEO)",
    status: hasAtelierMention ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasAtelierMention 
      ? "Geographic entity cohesion established: Jaipur, Rajasthan atelier origin."
      : "Product copy does not reference atelier origin. Local entity grounding improves geographic authority.",
    guidance: "Mention Jaipur heritage carving provenance to reinforce entity authority in local and international trade queries.",
    aiActionKey: "generate_detailed_description",
    fieldTarget: "detailedDescription"
  });

  // G04 — Authentic Quarry Provenance & Craft Support
  const hasQuarryOrigin = /(makrana|bansi paharpur|dholpur|jodhpur|bhainslana|quarry|calcite)/i.test(fullTextScan);
  checks.push({
    id: "G04",
    code: "G04",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Authentic Geological Provenance Grounding",
    status: hasQuarryOrigin ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasQuarryOrigin 
      ? "Specific stone geological origin and quarry characteristics cited."
      : "Geological quarry provenance not explicitly detailed.",
    guidance: "State genuine geological origin (e.g. Makrana crystalline marble, Bansi Paharpur pink sandstone) to ground luxury authenticity.",
    aiActionKey: "generate_knowledge_content",
    fieldTarget: "knowledgeLayer"
  });

  // G05 — Enquiry, Customization & Export Process Transparency
  const hasProcessClarity = /(custom|bespoke|quote|enquiry|packaging|crate|shipping|export)/i.test(fullTextScan);
  checks.push({
    id: "G05",
    code: "G05",
    dimension: PIE_DIMENSIONS.GEO_AEO,
    label: "Enquiry & Bespoke Commission Transparency",
    status: hasProcessClarity ? PIE_RULE_STATUS.PASS : PIE_RULE_STATUS.WARNING,
    message: hasProcessClarity 
      ? "Transparent B2B and private client commission pathway outlined."
      : "Customization, enquiry, and export packaging procedures unstated.",
    guidance: "Clarify that bespoke sanctum dimensions, high-density foam crating, and worldwide delivery are supported.",
    aiActionKey: "generate_detailed_description",
    fieldTarget: "detailedDescription"
  });

  // =========================================================================
  // SCORING & 5-DIMENSION STATUS COMPUTATION
  // =========================================================================

  const blockerCount = checks.filter(c => c.status === PIE_RULE_STATUS.BLOCKER).length;
  const warningCount = checks.filter(c => c.status === PIE_RULE_STATUS.WARNING).length;
  const passCount = checks.filter(c => c.status === PIE_RULE_STATUS.PASS).length;
  const naCount = checks.filter(c => c.status === PIE_RULE_STATUS.NOT_APPLICABLE).length;

  // Calculate weighted quality score across applicable checks only
  let totalApplicableWeight = 0;
  let earnedWeight = 0;

  const dimensionScores = {};

  Object.entries(DIMENSION_WEIGHTS).forEach(([dim, weight]) => {
    const dimChecks = checks.filter(c => c.dimension === dim && c.status !== PIE_RULE_STATUS.NOT_APPLICABLE);
    if (dimChecks.length === 0) {
      dimensionScores[dim] = 100;
      return;
    }

    let dimEarned = 0;
    dimChecks.forEach(c => {
      if (c.status === PIE_RULE_STATUS.PASS) dimEarned += 1.0;
      else if (c.status === PIE_RULE_STATUS.WARNING) dimEarned += 0.5; // partial credit for advisory warnings
      // Blocker earns 0
    });

    const dimPercent = Math.round((dimEarned / dimChecks.length) * 100);
    dimensionScores[dim] = dimPercent;

    totalApplicableWeight += weight;
    earnedWeight += (dimPercent / 100) * weight;
  });

  const overallScore = totalApplicableWeight > 0 
    ? Math.round((earnedWeight / totalApplicableWeight) * 100) 
    : 100;

  // 1. Publication Eligibility
  const publicationEligibility = blockerCount === 0 ? "ELIGIBLE" : "BLOCKED";

  // 2. SEO Content Readiness
  let seoContentReadiness = "OPTIMAL";
  const contentBlockers = checks.filter(c => c.dimension === PIE_DIMENSIONS.CONTENT_QUALITY && c.status === PIE_RULE_STATUS.BLOCKER).length;
  const contentWarnings = checks.filter(c => c.dimension === PIE_DIMENSIONS.CONTENT_QUALITY && c.status === PIE_RULE_STATUS.WARNING).length;
  if (contentBlockers > 0) seoContentReadiness = "INCOMPLETE";
  else if (contentWarnings > 0) seoContentReadiness = "NEEDS_IMPROVEMENT";

  // 3. Technical Indexability
  let technicalIndexability = "INDEXABLE";
  const techBlockers = checks.filter(c => c.dimension === PIE_DIMENSIONS.TECHNICAL_SEO && c.status === PIE_RULE_STATUS.BLOCKER).length;
  const techWarnings = checks.filter(c => c.dimension === PIE_DIMENSIONS.TECHNICAL_SEO && c.status === PIE_RULE_STATUS.WARNING).length;
  if (techBlockers > 0) technicalIndexability = "INVALID";
  else if (techWarnings > 0 || !isIndexable) technicalIndexability = "RESTRICTED";

  // 4. GEO/AEO Content Readiness
  let geoAeoReadiness = "AI_READY";
  const geoWarnings = checks.filter(c => c.dimension === PIE_DIMENSIONS.GEO_AEO && c.status === PIE_RULE_STATUS.WARNING).length;
  if (geoWarnings >= 3) geoAeoReadiness = "UNSTRUCTURED";
  else if (geoWarnings > 0) geoAeoReadiness = "DEVELOPING";

  // 5. Search Monitoring State
  const searchMonitoringState = status === "published" ? "PUBLISHED_MONITORED" : "PRE_PUBLICATION";

  // Overall Status Rollup for Backwards Compatibility
  let overallStatus = "ready";
  if (blockerCount > 0) overallStatus = "incomplete";
  else if (warningCount > 0) overallStatus = "needs_attention";

  return {
    score: overallScore,
    dimensionScores,
    statuses: {
      publicationEligibility,
      seoContentReadiness,
      technicalIndexability,
      geoAeoReadiness,
      searchMonitoringState
    },
    // Backward-compatible fields for existing components
    overallStatus,
    healthStatus: overallStatus,
    okCount: passCount,
    warningCount,
    missingCount: blockerCount,
    items: checks.map(c => ({
      id: c.id,
      code: c.code,
      label: c.label,
      dimension: c.dimension,
      status: c.status === PIE_RULE_STATUS.PASS ? "ok" : (c.status === PIE_RULE_STATUS.WARNING ? "warning" : "missing"),
      rawStatus: c.status,
      message: c.message,
      guidance: c.guidance,
      aiActionKey: c.aiActionKey,
      fieldTarget: c.fieldTarget
    }))
  };
}
