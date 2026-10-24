/**
 * Jaipur Stonecraft — Asynchronous Content & SEO Enricher
 * 
 * Generates authoritative product copy, craftsmanship documentation,
 * AEO intelligence, and Google-ranking SEO metadata.
 * 
 * Rules:
 * 1. Product Name is strictly preserved (never overwritten).
 * 2. Short description is elevated with natural search keywords and spelling correction.
 * 3. Complete long description is generated for publication.
 * 4. High-CTR SEO title, meta description, and keywords are generated.
 * 5. AEO summary and factual attributes are populated in knowledge_layer.
 * 6. NO artificial or repetitive FAQs are generated. Existing product FAQs are preserved.
 */

import { getOne, execute } from "../db/client.js";
import { formatProductFromRow } from "../db/products.js";
import { executeDualModeAiAnalysis } from "./ai-service-router.js";

/**
 * Executes background content enrichment for a product.
 * 
 * @param {string} productSlug - Slug of product in DB
 * @param {Object} [facts] - Visual or user facts { subject, material, productType, userShortDescription, ... }
 * @param {Object} [options] - Optional overrides or custom instructions
 * @returns {Promise<Object>} { success, enrichedFields, error }
 */
export async function enrichProductContent(productSlug, facts = {}, options = {}) {
  const row = await getOne("SELECT * FROM products WHERE slug = ?", [productSlug]);
  if (!row) {
    return { success: false, error: `Product with slug '${productSlug}' not found.` };
  }

  const existingProduct = await formatProductFromRow(row);

  const productData = {
    ...existingProduct,
    shortDescription: facts.userShortDescription || existingProduct.shortDescription || "",
    primaryMaterial: facts.material ? { name: facts.material } : existingProduct.primaryMaterial
  };

  const aiResult = await executeDualModeAiAnalysis(productData, {
    mode: options.mode || "TEXT_OPTIMIZATION",
    manualNotes: options.manualNotes || facts.manualNotes || ""
  });

  if (!aiResult.success || !aiResult.data) {
    return {
      success: false,
      errorCode: aiResult.errorCode || "AI_FAILED",
      error: aiResult.error || "Failed to generate AI content enrichment."
    };
  }

  const generated = aiResult.data;
  const updates = {};

  // 1. Short Description
  if (generated.short_description) {
    updates.short_description = generated.short_description;
  }

  // 2. Complete Long Description
  if (generated.long_description) {
    updates.detailed_description = generated.long_description;
  }

  // 3. Knowledge Layer & AEO (Preserve existing FAQs & sections, add/update aeoSummary)
  const existingKl = existingProduct.knowledgeLayer || {};
  const existingSections = Array.isArray(existingKl.sections) ? existingKl.sections : [];
  const existingFaqs = Array.isArray(existingKl.faqs) ? existingKl.faqs : (Array.isArray(existingProduct.faqs) ? existingProduct.faqs : []);

  updates.knowledge_layer = JSON.stringify({
    ...existingKl,
    aeoSummary: generated.aeo_summary || existingKl.aeoSummary || "",
    sections: existingSections,
    faqs: existingFaqs
  });

  // 4. SEO Metadata
  const existingSeo = existingProduct.seo || {};
  const updatedSeo = {
    ...existingSeo,
    title: generated.seo_title || existingSeo.title || `${existingProduct.name} | Jaipur Stonecraft`,
    description: generated.meta_description || existingSeo.description || generated.short_description,
    primaryKeyword: generated.primary_keyword || existingSeo.primaryKeyword || "",
    secondaryKeywords: generated.secondary_keywords?.length > 0 ? generated.secondary_keywords : (existingSeo.secondaryKeywords || []),
    longTailKeywords: generated.long_tail_keywords?.length > 0 ? generated.long_tail_keywords : (existingSeo.longTailKeywords || []),
    keywords: generated.search_intent_keywords || existingSeo.keywords || []
  };
  updates.seo = JSON.stringify(updatedSeo);

  // 5. Tags
  if (Array.isArray(generated.discovery_tags) && generated.discovery_tags.length > 0) {
    updates.tags = JSON.stringify(generated.discovery_tags);
  }

  // 6. Attributes (Merge factual attributes)
  if (generated.factual_attributes) {
    const existingAttrs = existingProduct.attributes || {};
    const mergedAttrs = {
      ...existingAttrs,
      stoneVariety: generated.factual_attributes.stoneVariety || existingAttrs.stoneVariety,
      finish: generated.factual_attributes.finish || existingAttrs.finish,
      intendedApplication: generated.factual_attributes.intendedApplication || existingAttrs.intendedApplication
    };
    updates.attributes = JSON.stringify(mergedAttrs);
  }

  // Perform database update
  const setClauses = [];
  const values = [];

  for (const [col, val] of Object.entries(updates)) {
    setClauses.push(`${col} = ?`);
    values.push(val);
  }

  if (setClauses.length > 0) {
    values.push(row.id);
    await execute(`UPDATE products SET ${setClauses.join(", ")} WHERE id = ?`, values);
  }

  return {
    success: true,
    generatedData: generated,
    enrichedFields: Object.keys(updates)
  };
}
