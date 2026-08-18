/**
 * Jaipur Stonecraft — Smart Catalogue Search Engine (MySQL-Backed)
 * 
 * Production search engine delivering:
 * 1. Query Normalization
 * 2. Exact & Prefix Matching
 * 3. Typo Tolerance (Levenshtein Distance)
 * 4. Controlled Aliases & Synonyms
 * 5. Structured Multi-Term Query Decomposition
 * 6. Ranked Result Grouping (Products, Categories, Materials, Subjects)
 * 7. No-Result Recovery & Structured Catalogue Suggestions
 * 
 * STRICT RULE: Granite is strictly excluded.
 */

import { query as mysqlQuery } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";

// Controlled Synonym Map
const SYNONYMS_MAP = {
  ganesh: ["ganesha", "ganpati", "vinayaka", "lambodara", "modak"],
  shiva: ["shiv", "mahadev", "lingam", "shiva lingam", "nandi", "bholenath"],
  krishna: ["kanha", "govinda", "gopal", "radha krishna", "flute"],
  hanuman: ["bajrangbali", "maruti", "anjaneya"],
  buddha: ["gautama", "zen", "dhyana", "meditating buddha"],
  statue: ["murti", "idol", "sculpture", "bust", "statuette", "figure"],
  marble: ["makrana", "sangemarmar", "white marble", "stone"],
  sandstone: ["bansi paharpur", "jodhpur red", "dholpur", "terracotta"],
  mandir: ["temple", "pooja ghar", "sanctuary", "shrine", "altar"],
  fountain: ["water feature", "lotus basin", "spillway", "cascade"],
  relief: ["wall art", "mural", "panel", "carved wall"]
};

// Levenshtein Distance Calculation for Typo Tolerance
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Normalize search text
function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * Execute 7-Layer Smart Search
 */
export async function executeSmartSearch({ query: searchQuery, status, category, limit = 20 }) {
  if (!searchQuery || !searchQuery.trim()) {
    let sql = "SELECT * FROM products";
    const params = [];

    if (status && status !== "all") {
      sql += " WHERE status = ?";
      params.push(status);
    }
    sql += " ORDER BY updated_at DESC LIMIT ?";
    params.push(limit);

    const rows = await mysqlQuery(sql, params);
    const products = await Promise.all(rows.map(formatProductFromRow));
    return {
      query: "",
      products,
      categories: [],
      materials: [],
      subjects: [],
      totalCount: rows.length,
      isFallback: false,
      suggestions: []
    };
  }

  const rawQuery = normalizeText(searchQuery);
  const terms = rawQuery.split(" ").filter((t) => t.length > 1);

  // Fetch reference data from MySQL
  const allMaterials = await mysqlQuery("SELECT * FROM materials WHERE is_active = 1");
  const allSubjects = await mysqlQuery("SELECT * FROM subjects WHERE is_active = 1");
  const allCategories = await mysqlQuery("SELECT * FROM categories WHERE is_active = 1");

  // 1. Synonym & Typo Mapping for terms
  const expandedTerms = new Set(terms);
  const detectedMaterials = [];
  const detectedSubjects = [];

  terms.forEach((term) => {
    // Check Synonyms
    Object.entries(SYNONYMS_MAP).forEach(([key, list]) => {
      if (key === term || list.includes(term)) {
        expandedTerms.add(key);
        list.forEach((syn) => expandedTerms.add(syn));
      }
    });

    // Check Materials with Typo Tolerance
    allMaterials.forEach((m) => {
      const mName = normalizeText(m.name);
      if (mName.includes(term) || term.includes(mName) || levenshteinDistance(term, mName) <= 2) {
        detectedMaterials.push(m);
        expandedTerms.add(m.id);
      }
    });

    // Check Subjects with Typo Tolerance
    allSubjects.forEach((s) => {
      const sName = normalizeText(s.primary_name);
      if (sName.includes(term) || term.includes(sName) || levenshteinDistance(term, sName) <= 2) {
        detectedSubjects.push(s);
        expandedTerms.add(s.id);
      }
    });
  });

  // 2. Score and Filter Products
  let sql = "SELECT * FROM products";
  const params = [];

  if (status && status !== "all") {
    sql += " WHERE status = ?";
    params.push(status);
  }

  const allProductRows = await mysqlQuery(sql, params);
  const formattedProducts = await Promise.all(allProductRows.map(formatProductFromRow));
  const scoredProducts = [];

  formattedProducts.forEach((product) => {
    const pName = normalizeText(product.name);
    const pSku = normalizeText(product.sku);
    const pSlug = normalizeText(product.slug);
    const pCat = normalizeText(product.parentCategory);
    const pType = normalizeText(product.productType);
    const pMat = normalizeText(product.primaryMaterial?.name || "");
    const pSubj = normalizeText(product.subjectObj?.primaryName || "");
    const pTags = (product.tags || []).map(normalizeText).join(" ");
    const pDesc = normalizeText(product.shortDescription);

    const fullSearchableText = [pName, pSku, pSlug, pCat, pType, pMat, pSubj, pTags, pDesc].join(" ");

    let score = 0;

    // Exact Match Bonuses
    if (pName === rawQuery) score += 200;
    else if (pSku === rawQuery || pSlug === rawQuery) score += 180;
    else if (pName.includes(rawQuery)) score += 120;

    // Term Match Scoring
    terms.forEach((term) => {
      if (pName.includes(term)) score += 40;
      if (pSku.includes(term)) score += 35;
      if (pSubj.includes(term)) score += 30;
      if (pMat.includes(term)) score += 25;
      if (pCat.includes(term) || pType.includes(term)) score += 20;
      if (pTags.includes(term)) score += 15;
      if (pDesc.includes(term)) score += 8;

      // Typo tolerance check on product name
      if (term.length >= 4) {
        const words = pName.split(" ");
        words.forEach((w) => {
          if (levenshteinDistance(term, w) <= 1) score += 25;
        });
      }
    });

    // Synonym scoring
    expandedTerms.forEach((exTerm) => {
      if (fullSearchableText.includes(exTerm)) score += 10;
    });

    if (score > 0) {
      scoredProducts.push({ product, score });
    }
  });

  scoredProducts.sort((a, b) => b.score - a.score);
  const matchedProducts = scoredProducts.slice(0, limit).map((sp) => sp.product);

  // 3. Matched Categories, Materials, Subjects
  const matchedCategories = allCategories.filter((c) =>
    terms.some((t) => normalizeText(c.name).includes(t) || levenshteinDistance(t, normalizeText(c.name)) <= 1)
  );

  const matchedMaterials = allMaterials.filter((m) =>
    terms.some((t) => normalizeText(m.name).includes(t) || levenshteinDistance(t, normalizeText(m.name)) <= 1)
  );

  const matchedSubjects = allSubjects.filter((s) =>
    terms.some((t) => normalizeText(s.primary_name).includes(t) || levenshteinDistance(t, normalizeText(s.primary_name)) <= 1)
  );

  // 4. No-Result Recovery & Suggestions
  let isFallback = false;
  let fallbackMessage = "";
  const suggestions = [];

  if (matchedProducts.length === 0) {
    isFallback = true;

    // Suggest adding unknown stone material if query contains stone terms
    if (rawQuery.includes("stone") || rawQuery.includes("marble") || rawQuery.includes("granite")) {
      const cleanTerm = rawQuery.replace(/statue|idol|sculpture|carving/g, "").trim();
      if (cleanTerm && !cleanTerm.includes("granite")) {
        suggestions.push({
          type: "add_material",
          label: `+ Add "${cleanTerm}" to Stone Materials Catalogue`,
          targetField: "primaryMaterialId",
          value: cleanTerm
        });
      }
    }

    // Fallback products (show popular published products)
    const fallbackRows = await mysqlQuery("SELECT * FROM products WHERE status = 'published' ORDER BY is_featured DESC, updated_at DESC LIMIT 6");
    const fallbackProducts = await Promise.all(fallbackRows.map(formatProductFromRow));
    matchedProducts.push(...fallbackProducts);
    fallbackMessage = `No exact product found matching "${searchQuery}". Showing featured stonecraft creations below.`;
  }

  return {
    query: searchQuery,
    products: matchedProducts,
    categories: matchedCategories,
    materials: matchedMaterials,
    subjects: matchedSubjects,
    totalCount: matchedProducts.length,
    isFallback,
    fallbackMessage,
    suggestions
  };
}
