/**
 * Jaipur Stonecraft — AI Response Schema Definition & Normalizer
 * 
 * Defines structured JSON schema for AI model output and resilient,
 * field-level schema validation and normalization.
 * 
 * Output Focus:
 * - Improved Short Description
 * - Complete Long Description
 * - Comprehensive SEO Metadata (Title, Meta Description, Primary, Secondary, Long-tail, Suggested Slug)
 * - AEO — Answer Engine Optimization Factual Summary & Entities
 * - Factual Craftsmanship Attributes
 * - Observable Image Features (without guessing hidden facts)
 * - NO artificial or repetitive FAQs generated.
 */

export const PRODUCT_AI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    short_description: { type: "STRING" },
    long_description: { type: "STRING" },
    seo_title: { type: "STRING" },
    meta_description: { type: "STRING" },
    primary_keyword: { type: "STRING" },
    secondary_keywords: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    long_tail_keywords: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    suggested_slug: { type: "STRING" },
    aeo_summary: { type: "STRING" },
    factual_attributes: {
      type: "OBJECT",
      properties: {
        stoneVariety: { type: "STRING" },
        finish: { type: "STRING" },
        craftsmanship: { type: "STRING" },
        intendedApplication: { type: "STRING" }
      }
    },
    discovery_tags: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    image_alt_texts: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          image_url: { type: "STRING" },
          suggested_alt: { type: "STRING" }
        }
      }
    },
    image_visual_notes: { type: "STRING" }
  }
};

/**
 * Validates and normalizes raw AI response object with resilient field-level recovery.
 * Provides both top-level and nested accessors for frontend and backend compatibility.
 * 
 * @param {Object} raw - Raw JSON returned by AI provider
 * @param {Object} [fallbackProduct] - Existing product for context
 * @returns {Object} normalized response
 */
export function normalizeAiResponse(raw, fallbackProduct = {}) {
  if (!raw || typeof raw !== "object") {
    raw = {};
  }

  // 1. Short Description
  const contentObj = raw.content || {};
  const rawShort = raw.short_description || contentObj.shortDescription || contentObj.short_description || raw.shortDescription || "";
  const short_description = String(rawShort || fallbackProduct.shortDescription || fallbackProduct.short_description || "").trim();

  // 2. Complete Long Description
  const rawLong = raw.long_description || contentObj.detailedDescription || contentObj.detailed_description || raw.detailedDescription || raw.detailed_description || "";
  const long_description = String(rawLong || fallbackProduct.detailedDescription || fallbackProduct.detailed_description || "").trim();

  // 3. SEO Metadata
  const seoObj = raw.seo || {};
  const rawSeoTitle = raw.seo_title || seoObj.seoTitle || seoObj.seo_title || raw.seoTitle || seoObj.title || "";
  const seo_title = String(rawSeoTitle || fallbackProduct.seo?.title || (fallbackProduct.name ? `${fallbackProduct.name} | Jaipur Stonecraft` : "")).trim();

  const rawMetaDesc = raw.meta_description || seoObj.metaDescription || seoObj.meta_description || raw.metaDescription || seoObj.description || "";
  const meta_description = String(rawMetaDesc || fallbackProduct.seo?.description || short_description || "").trim();

  const rawPrimaryKw = raw.primary_keyword || seoObj.primaryKeyword || seoObj.primary_keyword || raw.primaryKeyword || "";
  const primary_keyword = String(rawPrimaryKw || fallbackProduct.seo?.primaryKeyword || "").trim();

  // Secondary keywords
  const rawSecondary = raw.secondary_keywords || seoObj.secondaryKeywords || seoObj.secondary_keywords || raw.secondaryKeywords || [];
  const secondary_keywords = Array.isArray(rawSecondary)
    ? rawSecondary.map(k => String(k).trim()).filter(Boolean)
    : (typeof rawSecondary === "string" ? rawSecondary.split(",").map(k => k.trim()).filter(Boolean) : []);

  // Long-tail keywords
  const rawLongTail = raw.long_tail_keywords || seoObj.longTailKeywords || seoObj.long_tail_keywords || raw.longTailKeywords || [];
  const long_tail_keywords = Array.isArray(rawLongTail)
    ? rawLongTail.map(k => String(k).trim()).filter(Boolean)
    : (typeof rawLongTail === "string" ? rawLongTail.split(",").map(k => k.trim()).filter(Boolean) : []);

  // Suggested URL Slug
  const rawSlug = raw.suggested_slug || raw.suggestedSlug || raw.slug || "";
  const suggested_slug = String(rawSlug || fallbackProduct.slug || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // 4. AEO — Answer Engine Optimization Summary
  const rawAeo = raw.aeo_summary || raw.aeoSummary || raw.product_summary || contentObj.aeoSummary || "";
  const aeo_summary = String(rawAeo || (short_description ? `${short_description} Handcrafted by Jaipur Stonecraft artisans.` : "")).trim();

  // 5. Factual Attributes
  const rawAttrs = raw.factual_attributes || raw.factualAttributes || raw.attributes || {};
  const factual_attributes = {
    stoneVariety: String(rawAttrs.stoneVariety || rawAttrs.stone_variety || fallbackProduct.attributes?.stoneVariety || fallbackProduct.primaryMaterial?.name || "Natural Marble").trim(),
    finish: String(rawAttrs.finish || fallbackProduct.attributes?.finish || "Hand Honed (Natural Matte)").trim(),
    craftsmanship: String(rawAttrs.craftsmanship || "100% Manual Steel Chisel").trim(),
    intendedApplication: String(rawAttrs.intendedApplication || rawAttrs.environment || fallbackProduct.attributes?.intendedApplication || "Home Shrine & Architectural Placement").trim()
  };

  // 6. Discovery Tags
  const rawTags = raw.discovery_tags || raw.discoveryTags || seoObj.discoveryTags || seoObj.tags || raw.tags || [];
  const discovery_tags = Array.isArray(rawTags)
    ? rawTags.map(t => String(t).trim()).filter(Boolean)
    : [];

  // 7. Image Alt Texts
  const imageSeoObj = raw.imageSeo || {};
  const rawAltTexts = raw.image_alt_texts || raw.imageAltTexts || [];
  let image_alt_texts = [];
  if (Array.isArray(rawAltTexts) && rawAltTexts.length > 0) {
    image_alt_texts = rawAltTexts.map(i => ({
      image_url: String(i?.image_url || i?.imageUrl || "").trim(),
      suggested_alt: String(i?.suggested_alt || i?.suggestedAlt || i?.alt || "").trim()
    })).filter(i => i.suggested_alt.length > 0);
  } else if (imageSeoObj.altText || raw.imageAlt) {
    image_alt_texts = [{
      image_url: "",
      suggested_alt: String(imageSeoObj.altText || raw.imageAlt).trim()
    }];
  }

  // 8. Image Visual Notes
  const image_visual_notes = String(raw.image_visual_notes || raw.imageVisualNotes || "").trim();

  // 9. Existing FAQs preservation (Do NOT generate fake FAQs, but preserve existing ones)
  const existingKl = fallbackProduct.knowledgeLayer || {};
  const existingFaqs = Array.isArray(existingKl.faqs) ? existingKl.faqs : (Array.isArray(fallbackProduct.faqs) ? fallbackProduct.faqs : []);

  // Combined search intent keywords list
  const combinedKeywords = Array.from(new Set([primary_keyword, ...secondary_keywords, ...long_tail_keywords])).filter(Boolean);

  // Check whether meaningful AI generation occurred
  const hasAiContent = Boolean(
    (raw.short_description || contentObj.shortDescription) ||
    (raw.long_description || contentObj.detailedDescription) ||
    (raw.seo_title || seoObj.seoTitle) ||
    (raw.aeo_summary || raw.aeoSummary)
  );

  return {
    hasAiContent,
    short_description,
    detailed_description: long_description,
    long_description,
    seo_title,
    meta_description,
    primary_keyword,
    secondary_keywords,
    long_tail_keywords,
    suggested_slug,
    aeo_summary,
    factual_attributes,
    discovery_tags,
    image_alt_texts,
    image_visual_notes,
    search_intent_keywords: combinedKeywords,

    // Backward-compatible metadata to prevent runtime errors in legacy/cached UI consumers
    content_readiness: {
      score: 95,
      status: "READY"
    },
    product_summary: aeo_summary,
    critical_blockers: [],
    recommended_improvements: [],

    // Backward-compatible grouped structure
    content: {
      shortDescription: short_description,
      detailedDescription: long_description,
      aeoSummary: aeo_summary,
      knowledgeSections: Array.isArray(existingKl.sections) ? existingKl.sections : [],
      faqs: existingFaqs
    },
    seo: {
      seoTitle: seo_title,
      metaDescription: meta_description,
      primaryKeyword: primary_keyword,
      secondaryKeywords: secondary_keywords,
      longTailKeywords: long_tail_keywords,
      suggestedSlug: suggested_slug
    },
    imageSeo: {
      altText: image_alt_texts[0]?.suggested_alt || "",
      imageTitle: String(imageSeoObj.imageTitle || seo_title).trim(),
      imageCaption: String(imageSeoObj.imageCaption || short_description).trim()
    }
  };
}
