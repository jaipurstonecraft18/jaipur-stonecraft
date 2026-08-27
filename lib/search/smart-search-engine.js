import { buildSearchIndex } from "./search-index";
import { resolvePhoneticCorrection } from "./phonetic";
import { projectsData } from "@/content/projects";

// 1. Domain Synonyms Map
const DOMAIN_SYNONYMS = {
  "krisna": ["krishna"],
  "krishn": ["krishna"],
  "krshna": ["krishna"],
  "krishnaa": ["krishna"],
  "ganeshh": ["ganesh"],
  "murti": ["statue", "sculpture", "idol", "deity", "figure"],
  "statue": ["murti", "sculpture", "idol", "deity"],
  "sculpture": ["murti", "statue", "carving", "artwork"],
  "idol": ["murti", "statue", "sculpture", "deity"],
  "mandir": ["temple", "shrine", "pooja ghar", "mandapam", "sanctum"],
  "temple": ["mandir", "shrine", "pooja ghar", "sanctum"],
  "shrine": ["mandir", "temple", "pooja ghar"],
  "marbel": ["marble"],
  "mable": ["marble"],
  "marble": ["marbel", "makrana"],
  "fountan": ["fountain"],
  "fountain": ["fountan", "water feature", "waterfall", "basin"],
  "water feature": ["fountain", "waterfall"],
  "wall carving": ["wall relief", "mural", "panel", "jharokha"],
  "relief": ["wall carving", "mural", "reliefs"],
  "hand carved": ["hand-carved", "chiseling", "handcrafted", "artisanal"],
  "god": ["deity", "statue", "murti", "idol", "hindu"],
  "scultpure": ["sculpture"],
  "templee": ["temple"],
};

// 2. Levenshtein Distance for Typo Correction
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

// Check if token matches target with controlled typo tolerance
function matchTokenFuzzy(token, targetWord) {
  if (!token || !targetWord) return false;
  if (targetWord.includes(token) || token.includes(targetWord)) return true;

  const maxDistance = token.length > 5 ? 2 : token.length >= 3 ? 1 : 0;
  if (maxDistance === 0) return false;

  return levenshteinDistance(token, targetWord) <= maxDistance;
}

// Expand tokens with domain synonyms AND phonetic matching
function expandTokensWithSynonyms(tokens) {
  const expanded = new Set(tokens);
  
  tokens.forEach((t) => {
    // 1. Direct Synonyms
    if (DOMAIN_SYNONYMS[t]) {
      DOMAIN_SYNONYMS[t].forEach((syn) => expanded.add(syn));
    }
    // 2. Phonetic Resolution
    const phoneticMatch = resolvePhoneticCorrection(t);
    if (phoneticMatch) {
      expanded.add(phoneticMatch.toLowerCase());
    }
  });

  return Array.from(expanded);
}

// Check typo suggestion
export function checkTypoSuggestion(rawQuery) {
  if (!rawQuery) return null;
  const words = rawQuery.toLowerCase().trim().split(/\s+/);
  let hasCorrection = false;

  const correctedWords = words.map((w) => {
    // Check known typo map
    if (DOMAIN_SYNONYMS[w] && DOMAIN_SYNONYMS[w][0]) {
      if (["marbel", "mable", "krisna", "krishn", "krshna", "krishnaa", "fountan", "ganeshh", "scultpure", "templee"].includes(w)) {
        hasCorrection = true;
        return DOMAIN_SYNONYMS[w][0];
      }
    }
    // Check phonetic resolution
    const phoneticCorr = resolvePhoneticCorrection(w);
    if (phoneticCorr && phoneticCorr.toLowerCase() !== w) {
      hasCorrection = true;
      return phoneticCorr;
    }
    return w;
  });

  return hasCorrection ? correctedWords.join(" ") : null;
}

// 3. MAIN SMART SEARCH FUNCTION (Supports Products & Projects)
export async function performSmartSearch(rawQuery, options = {}) {
  const limit = options.limit || 100;
  const targetScope = options.scope || "all"; // 'all' | 'products' | 'projects'

  if (!rawQuery || !rawQuery.trim()) {
    return {
      products: [],
      categories: [],
      collections: [],
      projects: [],
      typoSuggestion: null,
      totalCount: 0,
    };
  }

  const searchData = await buildSearchIndex();
  const cleanQuery = rawQuery.toLowerCase().trim();
  const rawTokens = cleanQuery.split(/\s+/).filter(Boolean);
  const expandedTokens = expandTokensWithSynonyms(rawTokens);
  const typoSuggestion = checkTypoSuggestion(rawQuery);

  // A. SCORE PRODUCTS
  let matchingProducts = [];
  if (targetScope === "all" || targetScope === "products") {
    const scoredProducts = searchData.products.map((p) => {
      let score = 0;
      const pName = p.searchTokens.name;
      const pCat = p.searchTokens.category;
      const pCol = p.searchTokens.collection;
      const pMat = p.searchTokens.material;
      const pDesc = p.searchTokens.description;

      // 1. Direct / Exact Name Match (Score: +100)
      if (pName === cleanQuery) {
        score += 100;
      } else if (pName.includes(cleanQuery)) {
        score += 70;
      }

      // 2. Token Matching across Priority Fields
      expandedTokens.forEach((token) => {
        // Name Match (Priority 1: Weight +40)
        if (pName.includes(token)) {
          score += 40;
        } else if (matchTokenFuzzy(token, pName)) {
          score += 25;
        }

        // Category / Subcategory Match (Priority 2: Weight +30)
        if (pCat.includes(token)) {
          score += 30;
        }

        // Collection Match (Priority 3: Weight +25)
        if (pCol.includes(token)) {
          score += 25;
        }

        // Core Attributes / Material Match (Priority 4: Weight +20)
        if (pMat.includes(token)) {
          score += 20;
        }

        // Description Match (Priority 5: Weight +5)
        if (pDesc.includes(token)) {
          score += 5;
        }
      });

      return { product: p, score };
    });

    matchingProducts = scoredProducts
      .filter((sp) => sp.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((sp) => sp.product);
  }

  // B. SCORE PROJECTS (Step 3: Reusing Same Engine for Projects)
  let matchingProjects = [];
  if (targetScope === "all" || targetScope === "projects") {
    const projectsList = Object.values(projectsData);
    const scoredProjects = projectsList.map((proj) => {
      let score = 0;
      const name = (proj.name || "").toLowerCase();
      const type = (proj.type || "").toLowerCase();
      const desc = (proj.description || "").toLowerCase();
      const mat = (proj.materials || "").toLowerCase();

      if (name.includes(cleanQuery)) score += 80;

      expandedTokens.forEach((token) => {
        if (name.includes(token)) score += 40;
        else if (matchTokenFuzzy(token, name)) score += 20;

        if (type.includes(token)) score += 30;
        if (mat.includes(token)) score += 20;
        if (desc.includes(token)) score += 5;
      });

      return {
        project: {
          slug: proj.slug,
          name: proj.name,
          type: proj.type,
          description: proj.description,
          imageSrc: proj.imageSrc,
          href: `/projects/${proj.slug}`,
        },
        score,
      };
    });

    matchingProjects = scoredProjects
      .filter((sp) => sp.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((sp) => sp.project);
  }

  // C. MATCH CATEGORIES & COLLECTIONS
  const matchingCategories = searchData.categories.filter((cat) => {
    const cName = cat.searchTokens.name;
    return expandedTokens.some((t) => cName.includes(t) || matchTokenFuzzy(t, cName));
  });

  const matchingCollections = searchData.collections.filter((col) => {
    const colName = col.searchTokens.name;
    return expandedTokens.some((t) => colName.includes(t) || matchTokenFuzzy(t, colName));
  });

  return {
    products: matchingProducts.slice(0, limit),
    categories: matchingCategories.slice(0, 4),
    collections: matchingCollections.slice(0, 3),
    projects: matchingProjects.slice(0, limit),
    typoSuggestion,
    totalCount: matchingProducts.length + matchingProjects.length,
  };
}
