/**
 * Jaipur Stonecraft — AI Response Schema Definition
 * 
 * Defines structured JSON schema for Gemini output and resilient,
 * field-level schema validation and normalization with graceful fallbacks.
 */

export const PRODUCT_AI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    content: {
      type: "OBJECT",
      properties: {
        shortDescription: { type: "STRING" },
        detailedDescription: { type: "STRING" },
        knowledgeSections: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              content: { type: "STRING" }
            }
          }
        },
        faqs: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              answer: { type: "STRING" }
            }
          }
        }
      }
    },
    seo: {
      type: "OBJECT",
      properties: {
        seoTitle: { type: "STRING" },
        metaDescription: { type: "STRING" },
        primaryKeyword: { type: "STRING" },
        secondaryKeywords: { type: "ARRAY", items: { type: "STRING" } },
        longTailKeywords: { type: "ARRAY", items: { type: "STRING" } }
      }
    },
    imageSeo: {
      type: "OBJECT",
      properties: {
        altText: { type: "STRING" },
        imageTitle: { type: "STRING" },
        imageCaption: { type: "STRING" }
      }
    },
    readiness: {
      type: "OBJECT",
      properties: {
        score: { type: "INTEGER" },
        status: { type: "STRING" },
        observations: { type: "ARRAY", items: { type: "STRING" } },
        flaggedInconsistencies: { type: "ARRAY", items: { type: "STRING" } }
      }
    }
  }
};

/**
 * Validates and normalizes raw AI response object with resilient field-level recovery.
 * Provides full backward compatibility for top-level accessors used by the UI.
 * 
 * @param {Object} raw 
 * @param {Object} [fallbackProduct]
 * @returns {Object} normalized response with top-level and grouped properties
 */
export function normalizeAiResponse(raw, fallbackProduct = {}) {
  if (!raw || typeof raw !== "object") {
    raw = {};
  }

  // Extract content block (supporting both grouped 'content' and top-level fields)
  const contentObj = raw.content || {};
  const short_description = String(
    contentObj.shortDescription || raw.short_description || contentObj.short_description || fallbackProduct.shortDescription || ""
  ).trim();

  const detailed_description = String(
    contentObj.detailedDescription || raw.detailed_description || contentObj.detailed_description || fallbackProduct.detailedDescription || ""
  ).trim();

  const rawKnowledge = contentObj.knowledgeSections || raw.suggested_knowledge_sections || contentObj.suggested_knowledge_sections || [];
  const suggested_knowledge_sections = Array.isArray(rawKnowledge)
    ? rawKnowledge.map(s => ({
        title: String(s?.title || "Overview").trim(),
        content: String(s?.content || "").trim()
      })).filter(s => s.content.length > 0)
    : [];

  const rawFaqs = contentObj.faqs || raw.suggested_faqs || contentObj.suggested_faqs || [];
  const suggested_faqs = Array.isArray(rawFaqs)
    ? rawFaqs.map(f => ({
        question: String(f?.question || f?.q || "").trim(),
        answer: String(f?.answer || f?.a || "").trim()
      })).filter(f => f.question.length > 0 && f.answer.length > 0)
    : [];

  // Extract SEO block
  const seoObj = raw.seo || {};
  const seo_title = String(
    seoObj.seoTitle || raw.seo_title || seoObj.seo_title || fallbackProduct.name || ""
  ).trim();

  const meta_description = String(
    seoObj.metaDescription || raw.meta_description || seoObj.meta_description || short_description || ""
  ).trim();

  const primaryKw = String(seoObj.primaryKeyword || raw.primary_keyword || "").trim();
  const secondaryKws = Array.isArray(seoObj.secondaryKeywords) ? seoObj.secondaryKeywords.map(k => String(k).trim()).filter(Boolean) : [];
  const longTailKws = Array.isArray(seoObj.longTailKeywords) ? seoObj.longTailKeywords.map(k => String(k).trim()).filter(Boolean) : [];
  const topKws = Array.isArray(raw.search_intent_keywords) ? raw.search_intent_keywords.map(k => String(k).trim()).filter(Boolean) : [];

  const rawTags = seoObj.discoveryTags || seoObj.tags || raw.discovery_tags || raw.tags || [];
  const discovery_tags = Array.isArray(rawTags) ? rawTags.map(t => String(t).trim()).filter(Boolean) : [];

  const combinedKeywords = Array.from(new Set([...topKws, primaryKw, ...secondaryKws, ...longTailKws])).filter(Boolean);

  // Extract Image SEO block
  const imageSeoObj = raw.imageSeo || {};
  const rawAltTexts = raw.image_alt_texts || [];
  let image_alt_texts = [];

  if (Array.isArray(rawAltTexts) && rawAltTexts.length > 0) {
    image_alt_texts = rawAltTexts.map(i => ({
      image_url: String(i?.image_url || "").trim(),
      suggested_alt: String(i?.suggested_alt || "").trim()
    })).filter(i => i.suggested_alt.length > 0);
  } else if (imageSeoObj.altText) {
    image_alt_texts = [{
      image_url: "",
      suggested_alt: String(imageSeoObj.altText).trim()
    }];
  }

  // Extract Readiness block
  const readinessObj = raw.readiness || raw.content_readiness || {};
  const rawScore = typeof readinessObj.score === "number" ? readinessObj.score : 85;
  const score = Math.max(0, Math.min(100, rawScore));
  const status = String(readinessObj.status || (score >= 80 ? "Good" : "Incomplete")).trim();

  const observations = Array.isArray(readinessObj.observations)
    ? readinessObj.observations.map(o => String(o).trim()).filter(Boolean)
    : [];

  const possible_inconsistencies = Array.isArray(raw.possible_inconsistencies)
    ? raw.possible_inconsistencies.map(inc => String(inc).trim()).filter(Boolean)
    : Array.isArray(readinessObj.flaggedInconsistencies)
      ? readinessObj.flaggedInconsistencies.map(inc => String(inc).trim()).filter(Boolean)
      : [];

  const product_summary = String(
    raw.product_summary || short_description.slice(0, 180) || "Exquisite artisan stonecraft piece from Jaipur Stonecraft."
  ).trim();

  return {
    // Top-level fields for direct UI access
    product_summary,
    short_description,
    detailed_description,
    suggested_knowledge_sections,
    suggested_faqs,
    seo_title,
    meta_description,
    primary_keyword: primaryKw || (combinedKeywords[0] || ""),
    secondary_keywords: secondaryKws.length > 0 ? secondaryKws : combinedKeywords.slice(1, 5),
    search_intent_keywords: combinedKeywords,
    discovery_tags,
    image_alt_texts,
    content_readiness: {
      score,
      status,
      observations
    },
    possible_inconsistencies,

    // Grouped schema structure
    content: {
      shortDescription: short_description,
      detailedDescription: detailed_description,
      knowledgeSections: suggested_knowledge_sections,
      faqs: suggested_faqs
    },
    seo: {
      seoTitle: seo_title,
      metaDescription: meta_description,
      primaryKeyword: primaryKw || combinedKeywords[0] || "",
      secondaryKeywords: secondaryKws,
      longTailKeywords: longTailKws
    },
    imageSeo: {
      altText: image_alt_texts[0]?.suggested_alt || "",
      imageTitle: String(imageSeoObj.imageTitle || "").trim(),
      imageCaption: String(imageSeoObj.imageCaption || "").trim()
    },
    readiness: {
      score,
      status,
      observations,
      flaggedInconsistencies: possible_inconsistencies
    }
  };
}
