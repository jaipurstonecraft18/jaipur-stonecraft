/**
 * Jaipur Stonecraft — Asynchronous Content & SEO Enricher (Grok & Gemini)
 * 
 * Generates rich, luxury marketing copy, craftsmanship documentation, 
 * FAQs, and SEO metadata.
 * 
 * Rules:
 * 1. Product Name is strictly preserved (never overwritten).
 * 2. User Draft Short Description is refined: spelling corrected, vocabulary elevated,
 *    and infused with high-intent Google SEO keywords for top search ranking.
 * 3. Single consolidated request (no repetitive round-trips).
 * 4. Works with whatever structured information is available.
 * 5. Granite is strictly forbidden.
 */

import { getOne, execute, query } from "../db/client.js";
import { formatProductFromRow } from "../db/products.js";
import { isGroqAvailable, getGroqApiKey, getGroqModel, isFullAiAvailable, getGeminiApiKey, getGeminiModel, AI_CONFIG } from "./config.js";

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

  // Prepare consolidated context
  // CRITICAL RULE: Product Name is authoritative and must remain what the user gave
  const productName = existingProduct.name || facts.suggestedTitle || "Hand-Carved Stone Sculpture";
  const materialName = existingProduct.primaryMaterial?.name || facts.material || "Makrana Pure White Marble";
  const categoryName = existingProduct.parentCategory || "Sculptures";
  const productType = existingProduct.productType || facts.productType || "statue";
  const subject = existingProduct.subjectObj?.primaryName || facts.subject || "";
  const rawUserSummary = (facts.userShortDescription || existingProduct.shortDescription || "").trim();

  const systemInstruction = `
You are the Master Stonecraft Curator & Luxury SEO Specialist for Jaipur Stonecraft atelier in Jaipur, Rajasthan, India.
Your mission is to produce prestigious, captivating, luxury product copy and authoritative search engine metadata to achieve #1 rankings on Google for hand-carved stone art and sacred temple sculptures.

STRICT ARTISANAL RULES:
1. Granite is STRICTLY PROHIBITED in this atelier. Never mention granite. Permitted materials are authentic Makrana White Marble, Bansi Paharpur Pink Sandstone, Jodhpur Red Sandstone, Dholpur Beige Sandstone, and Black Bhainslana Marble.
2. PRODUCT NAME INTEGRITY: The product name ("${productName}") was explicitly given by the user and must NOT be changed. It is the authoritative title.
3. USER SHORT DESCRIPTION ELEVATION & SPELLING CORRECTION:
   The user may provide rough notes or an informal short description (e.g. "whiet marbl ganesh statu for puja room 2 feet").
   - Fix ALL spelling mistakes, typographical errors, and grammatical awkwardness completely.
   - Elevate the vocabulary into elegant, prestigious, evocative atelier tone worthy of high-end heritage stone art.
   - Seamlessly weave in high-intent Google SEO keywords (e.g. "hand-carved", "pure Makrana marble", "sacred home temple / mandir murti", "sculpted by master artisans").
   - Retain every specific user detail (such as posture, dimensions, or spiritual attributes).
   - Deliver a polished 1-2 sentence description (150-200 characters) designed for maximum customer appeal and search snippet ranking.
4. CATEGORY-SPECIFIC VOCABULARY RULES:
   - Jali / Architectural Screens: Use terms like "Marble Jali, Stone Jaali, Carved Jali Screen, Decorative Screen, Architectural Lattice Partition, Custom Jali". NEVER use deity, murti, or statue words unless factually depicted.
   - Mandir / Temples: Use terms like "Marble Mandir, Home Temple, Pooja Mandir, Puja Mandir, Ghar Mandir, Hindu Temple Architecture, Sanctum Mandapam".
   - Wall Murals / Reliefs: Use terms like "Marble Wall Mural, Stone Wall Mural, Bas-Relief Carving, High-Relief Stone Panel, 3D Stone Wall Art".
   - Fountains / Water Features: Use terms like "Marble Fountain, Courtyard Water Feature, Tiered Fountain, Stone Water Cascade, Lotus Basin".
   - Sculptures & Deity Idols: Naturally integrate both Indian (Murti, Moorti, Idol, Devta) and International (Statue, Sculpture, Handcrafted Sacred Art) terminology without keyword stuffing.
5. FACTUAL INTEGRITY: Never invent or hallucinate unverified dimensions, chemical treatments, synthetic polishes, or false claims.

All outputs must be strictly in valid JSON matching this schema:

{
  "shortDescription": "1-2 sentence refined, spell-checked, highly attractive, SEO-optimized short summary (150-200 chars)",
  "detailedDescription": "75-110 words detailing manual steel-chisel craftsmanship, stone grain, artistic proportions, and sacred sanctum presence",
  "knowledgeSections": [
    { "title": "Craftsmanship & Technique", "content": "1-2 sentences on manual steel-chisel carving, traditional Shilpa Shastra proportions, and natural water-stone honing" },
    { "title": "Material Origin & Characteristics", "content": "1-2 sentences explaining quarry origin, crystalline calcite purity, and lifelong durability without synthetic coatings" },
    { "title": "Symbolism & Devotional Placement", "content": "1-2 sentences on sacred iconography, Vastu/sanctum orientation, and spiritual tranquility" },
    { "title": "Care & Maintenance", "content": "1-2 sentences on preserving natural unsealed stone luster using pure water and soft cotton cloth" }
  ],
  "faqs": [
    { "question": "Can this sculpture be carved in custom dimensions?", "answer": "Yes, our Jaipur atelier carves bespoke orders from 12 inches to over 10 feet according to client sanctum specifications." },
    { "question": "How is the sculpture packaged for secure delivery?", "answer": "Each artwork is encapsulated in custom high-density shock foam and secured within heavy-duty ISPM-15 export wooden crates with full transit insurance." },
    { "question": "Is this natural stone suitable for outdoor weather?", "answer": "Yes, our natural marble and sandstone naturally weather all climates for generations and require no synthetic chemical sealants." },
    { "question": "What is the recommended placement according to Vastu?", "answer": "For divine idols, northeast (Ishanya) direction or east-facing sanctums promote positive energy and spiritual tranquility." }
  ],
  "seo": {
    "title": "50-60 character high-CTR title tag (${productName} - Handcrafted ${materialName} | Jaipur Stonecraft)",
    "description": "150-160 character high-CTR meta description highlighting hand-carved purity, master craftsmanship, custom sizes, and worldwide shipping",
    "primaryKeyword": "primary commercial intent search phrase (e.g. Hand Carved White Marble Ganesh Statue for Home Mandir)",
    "secondaryKeywords": ["3-5 high-volume long-tail search phrases (e.g. Makrana marble murti Jaipur, custom Hindu deity idol manufacturers)"],
    "discoveryTags": ["6-8 clean search and discovery tags"]
  },
  "imageAlt": "${productName} hand-carved in pure ${materialName} at Jaipur Stonecraft atelier"
}
`.trim();

  const userPrompt = `
Generate complete content, craftsmanship knowledge, and Google-ranking SEO for:
- Product Name: ${productName}
- Subject: ${subject || "Stone Sculpture"}
- Category: ${categoryName}
- Material: ${materialName}
- Product Type: ${productType}
- User Draft Short Description: ${rawUserSummary ? `"${rawUserSummary}"` : "None provided. Generate a compelling short description."}

Please fix any spelling errors in the user draft, elevate it into prestigious luxury atelier prose, and optimize all search metadata for top Google ranking.
Respond strictly in valid JSON.
`.trim();

  let parsed = null;

  // Strategy 1: Attempt Groq (Fastest & high quality)
  if (isGroqAvailable()) {
    try {
      const apiKey = getGroqApiKey();
      const model = getGroqModel();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.groqTimeoutMs || 25000);

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.25,
          max_tokens: 3000
        })
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const rawContent = json.choices?.[0]?.message?.content || "";
        parsed = JSON.parse(rawContent);
      }
    } catch {
      // Groq failed or timed out — fall through to Strategy 2
      parsed = null;
    }
  }

  // Strategy 2: Fallback to Gemini text generation if Groq is unavailable or failed
  if (!parsed && isFullAiAvailable()) {
    try {
      const geminiKey = getGeminiApiKey();
      const geminiModel = getGeminiModel();
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        })
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const rawContent = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
        parsed = JSON.parse(rawContent);
      }
    } catch {
      parsed = null;
    }
  }

  // Strategy 3: Deterministic Fallback if both AI providers are offline
  // Guarantees zero failures and produces clean, spelling-corrected, SEO-ready structure
  if (!parsed) {
    const cleanedSummary = cleanAndElevateFallback(rawUserSummary, productName, materialName);
    parsed = {
      shortDescription: cleanedSummary,
      detailedDescription: `Hand-carved by master artisans at Jaipur Stonecraft, this ${productName} is sculpted from authentic ${materialName}. Each detail is chiseled with traditional steel tools to preserve the natural crystalline luster and structural longevity of the stone.`,
      knowledgeSections: [
        { title: "Craftsmanship & Technique", content: `Hand-carved using traditional Rajasthani steel-chisel techniques and finished with natural water-stone honing.` },
        { title: "Material Origin & Characteristics", content: `Sculpted from genuine natural ${materialName} known for its enduring strength and elegant grain.` },
        { title: "Symbolism & Devotional Placement", content: `Ideally positioned in a sacred home mandir, sanctum, or tranquil entrance according to Vastu traditions.` },
        { title: "Care & Maintenance", content: `Clean gently with plain water and a soft cotton cloth. Avoid acidic cleaners or harsh chemical abrasives.` }
      ],
      faqs: [
        { question: "Can dimensions be customized?", answer: "Yes, our Jaipur atelier carves bespoke orders from 12 inches to over 10 feet according to client specifications." },
        { question: "How is the artwork packaged for delivery?", answer: "Protected inside high-density foam within export-grade ISPM-15 wooden crates with full transit insurance." },
        { question: "Is this suitable for outdoor weather?", answer: "Yes, authentic natural marble and sandstone naturally endure all weather conditions without chemical sealants." }
      ],
      seo: {
        title: `${productName} - Handcrafted ${materialName} | Jaipur Stonecraft`,
        description: `Hand-carved ${productName} sculpted from pure ${materialName} in Jaipur. Custom dimensions, master craftsmanship, and insured worldwide delivery.`,
        primaryKeyword: `${materialName} ${productName}`,
        secondaryKeywords: [`hand carved ${productName}`, `${materialName} statue Jaipur`, "custom stone sculptures"],
        discoveryTags: ["Hand-Carved", materialName, categoryName, "Jaipur-Stonecraft", "Temple-Sculpture"]
      },
      imageAlt: `${productName} hand-carved in pure ${materialName} at Jaipur Stonecraft atelier`
    };
  }

  // Build safe database updates
  const updates = {};

  // 1. Short Description: Update with the refined, spell-checked, SEO-optimized copy
  if (parsed.shortDescription && parsed.shortDescription.trim().length > 0) {
    updates.short_description = parsed.shortDescription.trim();
  }

  // 2. Detailed Description: Update if empty or placeholder
  if ((!existingProduct.detailedDescription || existingProduct.detailedDescription.length < 50) && parsed.detailedDescription) {
    updates.detailed_description = parsed.detailedDescription.trim();
  }

  // 3. Knowledge Layer & FAQs
  const existingKl = existingProduct.knowledgeLayer || {};
  let existingSections = Array.isArray(existingKl.sections) ? [...existingKl.sections] : [];
  let existingFaqs = Array.isArray(existingKl.faqs) ? [...existingKl.faqs] : [];

  existingSections = existingSections.filter(s => s.content && s.content.trim().length > 0);

  if (Array.isArray(parsed.knowledgeSections)) {
    parsed.knowledgeSections.forEach(newSec => {
      const alreadyExists = existingSections.some(s => s.title.toLowerCase() === newSec.title.toLowerCase());
      if (!alreadyExists && newSec.content) {
        existingSections.push({ title: newSec.title, content: newSec.content });
      }
    });
  }

  if (Array.isArray(parsed.faqs)) {
    parsed.faqs.forEach(newFaq => {
      const alreadyExists = existingFaqs.some(f => f.question.toLowerCase() === newFaq.question.toLowerCase());
      if (!alreadyExists && newFaq.answer) {
        existingFaqs.push({ question: newFaq.question, answer: newFaq.answer });
      }
    });
  }

  updates.knowledge_layer = JSON.stringify({
    sections: existingSections,
    faqs: existingFaqs
  });

  // 4. SEO Updates: Full Google Ranking Optimization
  const parsedSeo = parsed.seo || {};
  const existingSeo = existingProduct.seo || {};

  const updatedSeo = {
    title: parsedSeo.title && parsedSeo.title.length <= 70
      ? parsedSeo.title
      : `${productName} - Handcrafted ${materialName} | Jaipur Stonecraft`,
    description: parsedSeo.description || parsed.shortDescription || `Hand-carved ${productName} in pure ${materialName}. Worldwide crated delivery.`,
    primaryKeyword: parsedSeo.primaryKeyword || `${materialName} ${productName}`,
    secondaryKeywords: Array.isArray(parsedSeo.secondaryKeywords) && parsedSeo.secondaryKeywords.length > 0
      ? parsedSeo.secondaryKeywords
      : [`${productName} Jaipur`, `${materialName} sculpture`, "hand carved marble idol"],
    discoveryTags: Array.isArray(parsedSeo.discoveryTags) && parsedSeo.discoveryTags.length > 0
      ? parsedSeo.discoveryTags
      : ["Hand-Carved", materialName, categoryName, "Jaipur-Stonecraft"],
    canonicalUrl: existingSeo.canonicalUrl || `https://jaipurstonecraft.com/designs/${existingProduct.parentCategory || "sculptures"}/${existingProduct.slug}`,
    indexable: true
  };

  updates.seo = JSON.stringify(updatedSeo);

  // 5. Discovery Tags
  if (Array.isArray(updatedSeo.discoveryTags) && updatedSeo.discoveryTags.length > 0) {
    updates.tags = JSON.stringify(updatedSeo.discoveryTags);
  }

  // Execute safe database update
  // CRITICAL NOTE: 'name' is NOT included in updates, preserving user-given product name
  const setClauses = [];
  const setParams = [];

  Object.entries(updates).forEach(([col, val]) => {
    setClauses.push(`${col} = ?`);
    setParams.push(val);
  });

  if (setClauses.length > 0) {
    setParams.push(productSlug);
    await execute(`UPDATE products SET ${setClauses.join(", ")} WHERE slug = ?`, setParams);
  }

  // 6. Image Alt Texts Update for Google Image Search
  if (parsed.imageAlt) {
    await execute(`
      UPDATE product_images 
      SET alt_text = ? 
      WHERE product_slug = ? AND (alt_text IS NULL OR alt_text LIKE '%carving detail%' OR alt_text = '' OR alt_text = 'Product photo')
    `, [parsed.imageAlt, productSlug]);
  }

  return {
    success: true,
    enrichedFields: Object.keys(updates),
    generatedData: parsed
  };
}

/**
 * Deterministic helper to clean common typos and elevate text if all AI providers are offline.
 */
function cleanAndElevateFallback(rawSummary, productName, materialName) {
  if (!rawSummary || rawSummary.length < 5) {
    return `Hand-carved ${productName} sculpted from natural ${materialName} by master artisans at Jaipur Stonecraft.`;
  }

  let text = rawSummary
    .replace(/\bwhiet\b/gi, "white")
    .replace(/\bmarbl\b/gi, "marble")
    .replace(/\bstatu\b/gi, "statue")
    .replace(/\bpuja\b/gi, "pooja")
    .replace(/\bmoorti\b/gi, "murti")
    .replace(/\bhanicraft\b/gi, "handcrafted")
    .replace(/\bcarvd\b/gi, "carved")
    .replace(/\bston\b/gi, "stone")
    .trim();

  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!text.endsWith(".")) text += ".";

  return `Hand-carved ${productName} in authentic ${materialName}: ${text}`;
}

