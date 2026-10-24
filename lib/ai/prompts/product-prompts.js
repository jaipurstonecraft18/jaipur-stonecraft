/**
 * JAIPUR STONECRAFT — PRODUCT INTELLIGENCE ENGINE (PIE)
 * Versioned Prompt Architecture & Strict Output Schemas
 * 
 * Implements 15 distinct, versioned prompts with field-specific schemas,
 * strict fact-grounding, explicit granite prohibition, and zero hallucinations.
 * Version: 2.0.0
 */

import { FORBIDDEN_STONE_TERMS } from "../../seo/product-intelligence-engine.js";

export const PROMPT_SYSTEM_VERSION = "2.0.0";

/**
 * Shared foundational system instruction enforced across all prompts.
 */
export const SHARED_PIE_SYSTEM_INSTRUCTION = `
You are a senior SEO strategist, product-content editor, accessibility specialist, and GEO/AEO information architect for Jaipur Stonecraft.

Produce original, useful, factually grounded product content that improves relevance to genuine buyer queries.

Treat verified product records and administrator-confirmed information as the source of truth. Never invent material composition, dimensions, prices, availability, provenance, certifications, delivery estimates, manufacturing techniques, religious details, or guarantees.

Visual analysis may describe observable features but cannot independently prove material identity, hidden specifications, authenticity, or exact dimensions.

Use natural, product-specific terminology. Avoid keyword stuffing, repetitive templates, fabricated keyword metrics, and unsupported superlatives.

Do not promise search rankings or AI citations.

Return only the requested output in the exact schema defined by the task. Preserve verified existing content and identify unknown information rather than guessing.

STRICT BUSINESS POLICIES & CONSTRAINTS:
1. NATURAL STONE AUTHENTICITY: Jaipur Stonecraft atelier sculpts and crafts authentic natural stones including Makrana White Marble, Sangemarmar, Bansi Paharpur Pink Sandstone, Jodhpur Red Sandstone, Dholpur Beige Sandstone, Black Bhainslana Marble, Onyx, Soapstone, and Granite. Strictly forbid synthetic composites (resin cast, cultured marble, synthetic marble, bonded marble). Never substitute or overwrite the user's verified stone material.
2. NO HALLUCINATIONS: If dimensions, weight, posture, or material provenance are not provided in the confirmed data, do NOT fabricate them.
3. OUTPUT FORMAT: Return strictly valid JSON adhering to the specified schema without Markdown fences, commentary, or conversational preambles.
`.trim();

import { materialsDB } from "../../../content/products-db/materials-db.js";

/**
 * Normalizes product context for prompt injection.
 */
export function formatVerifiedProductFacts(product = {}) {
  const p = product || {};
  const name = String(p.name || "").trim() || "Untitled Product";
  const sku = String(p.sku || "").trim() || "N/A";
  
  const rawMat = String(p.primaryMaterialName || p.primaryMaterial?.name || p.materialName || p.primaryMaterialId || p.primary_material_id || p.material || "Makrana Pure White Marble").trim();
  const matchedMat = materialsDB.find(m => m.id === rawMat || m.id === rawMat.toLowerCase() || m.name.toLowerCase() === rawMat.toLowerCase());
  const material = matchedMat ? matchedMat.name : rawMat;

  const category = String(p.parentCategory || p.parent_category || "").trim();
  const subcategory = String(p.parentSubcategory || p.parent_subcategory || "").trim();
  const collection = String(p.parentCollection || p.parent_collection || "").trim();
  const productType = String(p.productType || p.product_type || "statue").trim();

  // Attributes
  const attributes = typeof p.attributes === "string"
    ? safeJson(p.attributes, {})
    : (p.attributes || {});

  const formattedAttrs = Object.entries(attributes)
    .filter(([_, v]) => v !== null && v !== undefined && String(v).trim().length > 0)
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join("\n") || "  - (No additional specifications confirmed)";

  return `
[VERIFIED PRODUCT FACTS]
- Product Name: ${name}
- SKU: ${sku}
- Product Type: ${productType}
- Taxonomy Hierarchy: ${[collection, subcategory, category].filter(Boolean).join(" > ") || "Stonecraft"}
- Verified Primary Material: ${material}
- Confirmed Specifications:
${formattedAttrs}
- Current Short Description: ${p.shortDescription || p.short_description || "(empty)"}
- Current Detailed Description: ${p.detailedDescription || p.detailed_description || "(empty)"}
- Current SEO Title: ${p.seo?.title || "(empty)"}
- Current Meta Description: ${p.seo?.description || "(empty)"}
- Current Primary Keyword: ${p.seo?.primaryKeyword || "(empty)"}
- CRITICAL MATERIAL RULE: All generated descriptions, craftsmanship details, and SEO copy MUST be written specifically for ${material}. Never refer to a different stone (e.g. do not call it white marble if it is Sandstone, Granite, or Black Marble).
`.trim();
}

function safeJson(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * 15 Versioned Prompts Definition Table
 */
export const PIE_PROMPTS = {
  // 1. generate_short_description
  generate_short_description: {
    id: "generate_short_description",
    version: "2.0.0",
    name: "Generate Short Description",
    fieldTarget: "shortDescription",
    schema: {
      type: "object",
      required: ["shortDescription"],
      properties: {
        shortDescription: { type: "string" }
      }
    },
    buildUserPrompt: (product) => `
Task: Generate a concise, informative short description for this product.
${formatVerifiedProductFacts(product)}

Requirements:
- Length: 1-2 useful sentences, normally around 25-50 words (approximately 140-220 characters).
- Identify the product and its most meaningful verified distinguishing features (material, carving nature, intended placement).
- Avoid generic filler ("introducing our magnificent...", "stunning masterpiece").
- Do not invent unconfirmed dimensions or guarantees.

Return JSON:
{
  "shortDescription": "string"
}
`.trim()
  },

  // 2. enhance_short_description
  enhance_short_description: {
    id: "enhance_short_description",
    version: "2.0.0",
    name: "Enhance Short Description",
    fieldTarget: "shortDescription",
    schema: {
      type: "object",
      required: ["shortDescription", "changesMade"],
      properties: {
        shortDescription: { type: "string" },
        changesMade: { type: "string" }
      }
    },
    buildUserPrompt: (product) => `
Task: Improve and polish the existing short description.
${formatVerifiedProductFacts(product)}

Current Text to Improve:
"${product.shortDescription || product.short_description || ""}"

Requirements:
- Preserve all verified facts and specific details from the existing text.
- Correct grammatical awkwardness, spelling errors, or repetitive phrasing.
- Ensure natural search intent alignment for luxury stonecraft buyers.
- Length: 1-2 clear sentences, 25-50 words.

Return JSON:
{
  "shortDescription": "string",
  "changesMade": "summary of edits applied"
}
`.trim()
  },

  // 3. generate_detailed_description
  generate_detailed_description: {
    id: "generate_detailed_description",
    version: "2.0.0",
    name: "Generate Detailed Description",
    fieldTarget: "detailedDescription",
    schema: {
      type: "object",
      required: ["detailedDescription"],
      properties: {
        detailedDescription: { type: "string" }
      }
    },
    buildUserPrompt: (product) => `
Task: Generate a thorough, factual, engaging detailed product description.
${formatVerifiedProductFacts(product)}

Requirements:
- Explain the product, verified stone material characteristics, design motifs, and relevant architectural or devotional placement considerations.
- Reference verified dimensions or specifications only if confirmed in the facts above.
- Mention custom bespoke sizing only as an atelier service capability ("available in custom dimensions upon enquiry"), without fabricating set sizes.
- Target approximately 80-140 words organized into 1-2 readable paragraphs.
- Avoid hyperbole, fake awards, and keyword stuffing.

Return JSON:
{
  "detailedDescription": "string"
}
`.trim()
  },

  // 4. enhance_detailed_description
  enhance_detailed_description: {
    id: "enhance_detailed_description",
    version: "2.0.0",
    name: "Enhance Detailed Description",
    fieldTarget: "detailedDescription",
    schema: {
      type: "object",
      required: ["detailedDescription", "changesMade"],
      properties: {
        detailedDescription: { type: "string" },
        changesMade: { type: "string" }
      }
    },
    buildUserPrompt: (product) => `
Task: Refine and elevate the existing detailed description.
${formatVerifiedProductFacts(product)}

Current Detailed Description:
"${product.detailedDescription || product.detailed_description || ""}"

Requirements:
- Preserve confirmed facts, iconographic descriptions, and material references.
- Elevate prose to an authoritative, respectful atelier voice.
- Improve paragraph structure and flow for both human buyers and generative AI extractors.
- Remove redundant boilerplate.

Return JSON:
{
  "detailedDescription": "string",
  "changesMade": "brief summary of improvements made"
}
`.trim()
  },

  // 5. generate_seo
  generate_seo: {
    id: "generate_seo",
    version: "2.0.0",
    name: "Generate Full SEO Package",
    fieldTarget: "seo",
    schema: {
      type: "object",
      required: ["seo_title", "meta_description", "primary_keyword", "secondary_keywords", "discovery_tags"],
      properties: {
        seo_title: { type: "string" },
        meta_description: { type: "string" },
        primary_keyword: { type: "string" },
        secondary_keywords: { type: "array", items: { type: "string" } },
        discovery_tags: { type: "array", items: { type: "string" } }
      }
    },
    buildUserPrompt: (product) => `
Task: Generate a complete, high-intent SEO metadata package for this product.
${formatVerifiedProductFacts(product)}

Requirements:
1. "seo_title": Descriptive title up to 120 characters (format: [Product Name] - [Verified Stone / Trait] | Jaipur Stonecraft). Distinctive, authentic, and not artificially truncated.
2. "meta_description": 120-160 characters. Accurate summary of the sculpture/piece, stone origin, and enquiry clarity. No fake pricing or guarantees.
3. "primary_keyword": Exactly ONE high-relevance search phrase (2-4 words) matching genuine buyer search intent (e.g. "Makrana Marble Ganesh Statue").
4. "secondary_keywords": 3-5 relevant secondary terms reflecting architectural or devotional variations (no keyword stuffing).
5. "discovery_tags": 5-8 clean categorization tags compatible with Jaipur Stonecraft taxonomy.

Return JSON:
{
  "seo_title": "string",
  "meta_description": "string",
  "primary_keyword": "string",
  "secondary_keywords": ["string"],
  "discovery_tags": ["string"]
}
`.trim()
  },

  // 6. optimize_seo_title
  optimize_seo_title: {
    id: "optimize_seo_title",
    version: "2.0.0",
    name: "Optimize SEO Title Tag",
    fieldTarget: "seo.title",
    schema: {
      type: "object",
      required: ["seo_title", "characterCount", "rationale"],
      properties: {
        seo_title: { type: "string" },
        characterCount: { type: "number" },
        rationale: { type: "string" }
      }
    },
    buildUserPrompt: (product) => `
Task: Optimize the HTML page title tag to meet search engine display best practices.
${formatVerifiedProductFacts(product)}

Current Title: "${product.seo?.title || product.name || ""}"

Requirements:
- Target length: Descriptive title up to 120 characters (typically 50-100 characters).
- Must include the exact product identity and primary stone or distinguishing characteristic.
- End with "| Jaipur Stonecraft" brand suffix where length permits.
- Do not sacrifice meaning or authenticity merely to hit a restrictive short character count.

Return JSON:
{
  "seo_title": "string",
  "characterCount": 55,
  "rationale": "why this title improves search clarity and CTR"
}
`.trim()
  },

  // 7. optimize_meta_description
  optimize_meta_description: {
    id: "optimize_meta_description",
    version: "2.0.0",
    name: "Optimize Meta Description Tag",
    fieldTarget: "seo.description",
    schema: {
      type: "object",
      required: ["meta_description", "characterCount", "rationale"],
      properties: {
        meta_description: { type: "string" },
        characterCount: { type: "number" },
        rationale: { type: "string" }
      }
    },
    buildUserPrompt: (product) => `
Task: Optimize the HTML meta description tag for search snippet CTR and clarity.
${formatVerifiedProductFacts(product)}

Current Meta Description: "${product.seo?.description || ""}"

Requirements:
- Target length: 120-160 characters.
- Accurately describe what the customer will find on the page.
- Highlight master craftsmanship, verified stone type, and bespoke consultation availability.
- Avoid fabricated free shipping, fake discounts, or fabricated review stars.

Return JSON:
{
  "meta_description": "string",
  "characterCount": 145,
  "rationale": "explanation of intent alignment"
}
`.trim()
  },

  // 8. recommend_primary_keyword
  recommend_primary_keyword: {
    id: "recommend_primary_keyword",
    version: "2.0.0",
    name: "Recommend Primary Search Phrase",
    fieldTarget: "seo.primaryKeyword",
    schema: {
      type: "object",
      required: ["primary_keyword", "search_intent", "reasoning"],
      properties: {
        primary_keyword: { type: "string" },
        search_intent: { type: "string" },
        reasoning: { type: "string" }
      }
    },
    buildUserPrompt: (product) => `
Task: Recommend the single most appropriate primary search phrase for this stonecraft product.
${formatVerifiedProductFacts(product)}

Requirements:
- 2-4 natural words representing commercial or transactional search intent.
- Directly aligned with the verified product category and stone type.
- Do not invent artificial search volume figures.

Return JSON:
{
  "primary_keyword": "string",
  "search_intent": "commercial_investigation | transactional",
  "reasoning": "why this matches real buyer inquiries"
}
`.trim()
  },

  // 9. recommend_secondary_keywords
  recommend_secondary_keywords: {
    id: "recommend_secondary_keywords",
    version: "2.0.0",
    name: "Recommend Secondary Search Phrases",
    fieldTarget: "seo.secondaryKeywords",
    schema: {
      type: "object",
      required: ["secondary_keywords"],
      properties: {
        secondary_keywords: { type: "array", items: { type: "string" } }
      }
    },
    buildUserPrompt: (product) => `
Task: Recommend 3-5 high-relevance secondary search phrases for this product.
${formatVerifiedProductFacts(product)}

Requirements:
- Capture complementary buyer searches (e.g., placement terms like "home mandir murti", architectural terms, artisan terms).
- Do not repeat the exact primary phrase with minor stop-word changes.
- Ensure natural phrasing that real architects, temple trustees, or homeowners search.

Return JSON:
{
  "secondary_keywords": ["phrase 1", "phrase 2", "phrase 3", "phrase 4"]
}
`.trim()
  },

  // 10. recommend_discovery_tags
  recommend_discovery_tags: {
    id: "recommend_discovery_tags",
    version: "2.0.0",
    name: "Recommend Discovery Tags",
    fieldTarget: "tags",
    schema: {
      type: "object",
      required: ["discovery_tags"],
      properties: {
        discovery_tags: { type: "array", items: { type: "string" } }
      }
    },
    buildUserPrompt: (product) => `
Task: Recommend 5-8 discovery tags for internal navigation, faceted filtering, and related product mapping.
${formatVerifiedProductFacts(product)}

Requirements:
- Clean, kebab-case or title-case category and theme tags (e.g. "Marble Murtis", "Hand Carved", "Temple Decor", "White Sangemarmar").
- Must be strictly compatible with natural stone and Jaipur Stonecraft's catalogue.

Return JSON:
{
  "discovery_tags": ["tag 1", "tag 2", "tag 3", "tag 4", "tag 5"]
}
`.trim()
  },

  // 11. generate_image_alts
  generate_image_alts: {
    id: "generate_image_alts",
    version: "2.0.0",
    name: "Generate Image Alt Texts",
    fieldTarget: "images.alt",
    schema: {
      type: "object",
      required: ["image_alt_texts"],
      properties: {
        image_alt_texts: {
          type: "array",
          items: {
            type: "object",
            required: ["image_url", "suggested_alt"],
            properties: {
              image_url: { type: "string" },
              suggested_alt: { type: "string" }
            }
          }
        }
      }
    },
    buildUserPrompt: (product, context = {}) => {
      const images = context.images || product.images || [];
      const imageList = Array.isArray(images)
        ? images.map((img, i) => `Image ${i + 1}: ${typeof img === "string" ? img : img.url || img.src}`).join("\n")
        : "None";

      return `
Task: Generate descriptive, unique alt text for each product image.
${formatVerifiedProductFacts(product)}

Image List:
${imageList}

Requirements:
- Describe each image independently based on its role (e.g. full front view, chisel detail, plinth base, profile angle).
- Include product identity and verified material naturally without keyword stuffing.
- Keep alt texts between 40-100 characters per image.
- Preserve mapping to each image URL.

Return JSON:
{
  "image_alt_texts": [
    {
      "image_url": "url_string",
      "suggested_alt": "descriptive alt text"
    }
  ]
}
`.trim();
    }
  },

  // 12. analyze_image_consistency
  analyze_image_consistency: {
    id: "analyze_image_consistency",
    version: "2.0.0",
    name: "Analyze Image-Product Consistency",
    fieldTarget: "inconsistencies",
    schema: {
      type: "object",
      required: ["findings"],
      properties: {
        findings: {
          type: "array",
          items: {
            type: "object",
            required: ["issue_type", "affected_image", "observed_evidence", "confidence", "severity", "recommended_verification_action"],
            properties: {
              issue_type: { type: "string" },
              affected_image: { type: "string" },
              observed_evidence: { type: "string" },
              confidence: { type: "number" },
              severity: { type: "string", enum: ["WARNING", "BLOCKER"] },
              recommended_verification_action: { type: "string" }
            }
          }
        }
      }
    },
    buildUserPrompt: (product, context = {}) => `
Task: Review image content against verified product records and detect possible contradictions.
${formatVerifiedProductFacts(product)}

Visual Observations Provided:
${context.visualNotes || "Standard atelier photograph"}

Requirements:
- Flag genuine discrepancies between observable image features and product claims (e.g. product labeled pink sandstone but image shows white marble; product labeled Ganesh but image shows Shiva).
- Flag uncertain claims for human review rather than asserting them as unquestionable facts.
- If no contradictions are observed, return an empty findings array.

Return JSON:
{
  "findings": [
    {
      "issue_type": "material_mismatch | subject_mismatch | dimension_drift",
      "affected_image": "image url or identifier",
      "observed_evidence": "what was observed in the image vs what is claimed",
      "confidence": 0.85,
      "severity": "WARNING",
      "recommended_verification_action": "Verify material with atelier master artisan"
    }
  ]
}
`.trim()
  },

  // 13. generate_knowledge_content
  generate_knowledge_content: {
    id: "generate_knowledge_content",
    version: "2.0.0",
    name: "Generate Product Knowledge Content",
    fieldTarget: "knowledgeLayer",
    schema: {
      type: "object",
      required: ["knowledgeSections"],
      properties: {
        knowledgeSections: {
          type: "array",
          items: {
            type: "object",
            required: ["title", "content"],
            properties: {
              title: { type: "string" },
              content: { type: "string" }
            }
          }
        }
      }
    },
    buildUserPrompt: (product) => `
Task: Generate structured craftsmanship and stone knowledge sections for this product.
${formatVerifiedProductFacts(product)}

Requirements:
- Create 2-4 factual, educational knowledge sections relevant to natural stonecraft (e.g. "Craftsmanship & Traditional Chiseling", "Stone Origin & Natural Veining", "Vastu & Placement Considerations", "Preservation & Natural Care").
- Keep each section to 1-2 informative sentences (30-50 words).
- Must reflect authentic Rajasthani hand-carving heritage without fabricating unverified certifications.

Return JSON:
{
  "knowledgeSections": [
    {
      "title": "Craftsmanship & Traditional Chiseling",
      "content": "Hand-sculpted in Jaipur using single-block natural stone with traditional steel chisels, following classical iconometric proportions."
    }
  ]
}
`.trim()
  },

  // 14. generate_faqs
  generate_faqs: {
    id: "generate_faqs",
    version: "2.0.0",
    name: "Generate Buyer FAQs",
    fieldTarget: "faqs",
    schema: {
      type: "object",
      required: ["faqs"],
      properties: {
        faqs: {
          type: "array",
          items: {
            type: "object",
            required: ["question", "answer"],
            properties: {
              question: { type: "string" },
              answer: { type: "string" }
            }
          }
        }
      }
    },
    buildUserPrompt: (product) => `
Task: Generate 3-4 factual, reassuring buyer FAQs specifically relevant to purchasing this stonecraft artwork.
${formatVerifiedProductFacts(product)}

Requirements:
- Address common B2B and private buyer questions: bespoke custom sizing, international wooden-crate transit packing, outdoor climate weather resistance, and temple placement.
- Answers must be direct, concise, and grounded in verified atelier policies.
- Do not fabricate return guarantees or specific delivery timeframes.

Return JSON:
{
  "faqs": [
    {
      "question": "Can this design be carved in custom dimensions?",
      "answer": "Yes, Jaipur Stonecraft atelier sculpts custom orders from sacred home mandir sizes to monumental temple scale."
    }
  ]
}
`.trim()
  },

  // 15. recommend_product_improvements
  recommend_product_improvements: {
    id: "recommend_product_improvements",
    version: "2.0.0",
    name: "Product Improvement Recommendations",
    fieldTarget: "recommendations",
    schema: {
      type: "object",
      required: ["recommendations"],
      properties: {
        needsChanges: { type: "boolean" },
        summary: { type: "string" },
        recommendations: {
          type: "array",
          items: {
            type: "object",
            required: [
              "issue_id",
              "affected_field",
              "observed_problem",
              "why_it_matters",
              "recommended_action",
              "expected_benefit",
              "priority",
              "evidence_source",
              "confidence",
              "requires_human_verification"
            ],
            properties: {
              issue_id: { type: "string" },
              affected_field: { type: "string" },
              observed_problem: { type: "string" },
              why_it_matters: { type: "string" },
              recommended_action: { type: "string" },
              expected_benefit: { type: "string" },
              priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
              evidence_source: { type: "string" },
              confidence: { type: "number" },
              requires_human_verification: { type: "boolean" }
            }
          }
        }
      }
    },
    buildUserPrompt: (product) => `
Task: Audit this product's data and content to generate actionable, evidence-based improvement recommendations.
${formatVerifiedProductFacts(product)}

Requirements:
- Identify genuine weaknesses only (e.g. missing product summary, broken slug, contradictory stone claims, missing cover image).
- DO NOT force artificial enhancements: A good product with core facts present requires no mandatory changes.
- Explain WHY the problem matters commercially and technically.
- Provide a concrete correction proposal for each recommendation.
- Prioritize factual accuracy, technical indexability, and genuine buyer clarity.
- Never invent unverified dimensions, stone varieties, or fake certifications.
- If the product data is already adequate, accurate, and publishable, return:
  {
    "needsChanges": false,
    "summary": "Product data is accurate, well-described, and ready for publication without modifications.",
    "recommendations": []
  }

Return JSON matching the schema.
`.trim()
  }
};

/**
 * Validates AI output against strict PIE rules:
 * - Ensures JSON parseability
 * - Validates required keys
 * - Strictly strips/flags any forbidden granite mentions
 * - Prevents empty placeholder outputs
 */
export function validateAndCleanPieOutput(promptId, rawOutput) {
  const promptDef = PIE_PROMPTS[promptId];
  if (!promptDef) {
    throw new Error(`Unknown PIE prompt ID: ${promptId}`);
  }

  let data = rawOutput;
  if (typeof rawOutput === "string") {
    try {
      // Remove any unintentional markdown code fences if present
      const cleaned = rawOutput.replace(/```json/gi, "").replace(/```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch (err) {
      throw new Error(`Failed to parse AI output as JSON: ${err.message}. Raw: ${rawOutput.slice(0, 150)}`);
    }
  }

  if (!data || typeof data !== "object") {
    throw new Error("AI output must be a valid JSON object.");
  }

  // Check required keys from schema
  if (promptDef.schema?.required) {
    for (const key of promptDef.schema.required) {
      if (data[key] === undefined || data[key] === null) {
        throw new Error(`AI response missing required schema field: '${key}'`);
      }
    }
  }

  // Deep scan and sanitize forbidden terms (e.g. granite)
  const sanitizeValue = (val) => {
    if (typeof val === "string") {
      let str = val;
      FORBIDDEN_STONE_TERMS.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, "gi");
        str = str.replace(regex, "Natural Stone");
      });
      return str;
    }
    if (Array.isArray(val)) {
      return val.map(sanitizeValue);
    }
    if (val && typeof val === "object") {
      const sanitizedObj = {};
      Object.keys(val).forEach(k => {
        sanitizedObj[k] = sanitizeValue(val[k]);
      });
      return sanitizedObj;
    }
    return val;
  };

  return sanitizeValue(data);
}
