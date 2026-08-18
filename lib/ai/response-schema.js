/**
 * Jaipur Stonecraft — AI Response Schema Definition
 * 
 * Defines structured JSON schema for Gemini structured output.
 */

export const PRODUCT_AI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    product_summary: {
      type: "STRING",
      description: "Concise 1-2 sentence summary of the product identity and artisanal stonecraft value."
    },
    short_description: {
      type: "STRING",
      description: "Refined short product description suitable for catalogue previews and cards."
    },
    detailed_description: {
      type: "STRING",
      description: "Comprehensive product description covering craftsmanship, material characteristics, architectural/devotional suitability, and artistic heritage."
    },
    suggested_knowledge_sections: {
      type: "ARRAY",
      description: "Suggested structured knowledge sections (e.g. Symbolism & Iconography, Stone Care & Maintenance, Crafting Process).",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          content: { type: "STRING" }
        },
        required: ["title", "content"]
      }
    },
    seo_title: {
      type: "STRING",
      description: "Optimized HTML page title tag (50-60 characters maximum, including Jaipur Stonecraft brand context where natural)."
    },
    meta_description: {
      type: "STRING",
      description: "Compelling HTML meta description tag (140-160 characters maximum)."
    },
    search_intent_keywords: {
      type: "ARRAY",
      description: "Natural language search intent terms and semantic queries users search for.",
      items: { type: "STRING" }
    },
    image_alt_texts: {
      type: "ARRAY",
      description: "Descriptive alt text suggestions for analyzed images.",
      items: {
        type: "OBJECT",
        properties: {
          image_url: { type: "STRING" },
          suggested_alt: { type: "STRING" }
        },
        required: ["image_url", "suggested_alt"]
      }
    },
    content_readiness: {
      type: "OBJECT",
      description: "Content completeness and SEO readiness evaluation.",
      properties: {
        score: { type: "INTEGER", description: "Score out of 100" },
        status: { type: "STRING", description: "Incomplete | Good | Excellent" },
        observations: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      },
      required: ["score", "status", "observations"]
    },
    possible_inconsistencies: {
      type: "ARRAY",
      description: "Items flagged for manual verification (e.g., missing weight/dimensions, ambiguous stone origin).",
      items: { type: "STRING" }
    }
  },
  required: [
    "product_summary",
    "short_description",
    "detailed_description",
    "suggested_knowledge_sections",
    "seo_title",
    "meta_description",
    "search_intent_keywords",
    "image_alt_texts",
    "content_readiness",
    "possible_inconsistencies"
  ]
};

/**
 * Validates and normalizes raw AI response object to guarantee all required fields exist cleanly.
 * @param {Object} raw 
 * @returns {Object} normalized response
 */
export function normalizeAiResponse(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI provider returned invalid non-object response.");
  }

  return {
    product_summary: String(raw.product_summary || "").trim(),
    short_description: String(raw.short_description || "").trim(),
    detailed_description: String(raw.detailed_description || "").trim(),
    suggested_knowledge_sections: Array.isArray(raw.suggested_knowledge_sections)
      ? raw.suggested_knowledge_sections.map(s => ({
          title: String(s?.title || "Overview").trim(),
          content: String(s?.content || "").trim()
        })).filter(s => s.content.length > 0)
      : [],
    seo_title: String(raw.seo_title || "").trim(),
    meta_description: String(raw.meta_description || "").trim(),
    search_intent_keywords: Array.isArray(raw.search_intent_keywords)
      ? raw.search_intent_keywords.map(k => String(k).trim()).filter(Boolean)
      : [],
    image_alt_texts: Array.isArray(raw.image_alt_texts)
      ? raw.image_alt_texts.map(i => ({
          image_url: String(i?.image_url || "").trim(),
          suggested_alt: String(i?.suggested_alt || "").trim()
        })).filter(i => i.suggested_alt.length > 0)
      : [],
    content_readiness: {
      score: typeof raw.content_readiness?.score === "number" ? raw.content_readiness.score : 70,
      status: String(raw.content_readiness?.status || "Good").trim(),
      observations: Array.isArray(raw.content_readiness?.observations)
        ? raw.content_readiness.observations.map(o => String(o).trim()).filter(Boolean)
        : []
    },
    possible_inconsistencies: Array.isArray(raw.possible_inconsistencies)
      ? raw.possible_inconsistencies.map(inc => String(inc).trim()).filter(Boolean)
      : []
  };
}
