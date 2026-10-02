/**
 * Jaipur Stonecraft — Deterministic Taxonomy Matcher
 * 
 * Maps visual/physical facts to the atelier's catalogue architecture:
 * Visual Facts (Gemini or User) -> Application Taxonomy Rules -> Database Entities
 * 
 * Determines:
 * - primaryMaterialId (from materials table; Granite strictly excluded)
 * - subjectId (from subjects table)
 * - parentCategory (from categories table)
 * - parentCollection (from collections table)
 * - parentSubcategory (from subcategories table)
 * - productType
 */

import { query, getOne } from "../db/client.js";

/**
 * Resolves full taxonomy identifiers from high-level product facts.
 * 
 * @param {Object} facts - { subject, material, productType, color }
 * @returns {Promise<Object>} resolved taxonomy identifiers
 */
export async function matchTaxonomyFromFacts(facts = {}) {
  const rawSubject = (facts.subject || "").trim();
  const rawMaterial = (facts.material || "").trim();
  const rawProductType = (facts.productType || "statue").toLowerCase().trim();

  // 1. Resolve Primary Material
  const resolvedMaterial = await resolveMaterial(rawMaterial, facts.color);

  // 2. Resolve Sacred Subject
  const resolvedSubject = await resolveSubject(rawSubject);

  // 3. Resolve Category, Collection & Subcategory
  const resolvedHierarchy = await resolveHierarchy(resolvedSubject, rawProductType);

  // 4. Resolve Product Type
  const resolvedProductType = await resolveProductType(rawProductType);

  return {
    primaryMaterialId: resolvedMaterial.id,
    primaryMaterial: resolvedMaterial,
    subjectId: resolvedSubject ? resolvedSubject.id : null,
    subjectObj: resolvedSubject,
    parentCategory: resolvedHierarchy.parentCategory,
    parentCollection: resolvedHierarchy.parentCollection,
    parentSubcategory: resolvedHierarchy.parentSubcategory,
    productType: resolvedProductType
  };
}

/**
 * Resolves material from name, keywords, or color family.
 * STRICT ATELIER RULE: Granite is strictly excluded.
 */
async function resolveMaterial(rawMaterialName = "", color = "") {
  try {
    const allMaterials = await query("SELECT * FROM materials WHERE is_active = 1");

    if (rawMaterialName) {
      const lower = rawMaterialName.toLowerCase();
      // Exact ID match
      const exactId = allMaterials.find(m => m.id === lower || m.id === lower.replace(/[^a-z0-9]+/g, "-"));
      if (exactId) return exactId;

      // Name or short name match
      const nameMatch = allMaterials.find(m => 
        lower.includes(m.name.toLowerCase()) || 
        m.name.toLowerCase().includes(lower)
      );
      if (nameMatch) return nameMatch;

      // Keyword match (e.g. "makrana", "sandstone", "black", "pink")
      if (lower.includes("makrana") || lower.includes("white marble") || lower.includes("pure white")) {
        const makrana = allMaterials.find(m => m.id === "makrana-pure-white");
        if (makrana) return makrana;
      }
      if (lower.includes("black")) {
        const black = allMaterials.find(m => m.id === "black-bhainslana");
        if (black) return black;
      }
      if (lower.includes("pink") || (lower.includes("sandstone") && lower.includes("pink"))) {
        const pink = allMaterials.find(m => m.id === "pink-bansi-paharpur");
        if (pink) return pink;
      }
      if (lower.includes("red") || (lower.includes("sandstone") && lower.includes("red"))) {
        const red = allMaterials.find(m => m.id === "jodhpur-red-sandstone");
        if (red) return red;
      }
      if (lower.includes("beige") || lower.includes("dholpur")) {
        const beige = allMaterials.find(m => m.id === "dholpur-beige-sandstone");
        if (beige) return beige;
      }
      if (lower.includes("yellow") || lower.includes("jaisalmer") || lower.includes("limestone")) {
        const yellow = allMaterials.find(m => m.id === "jaisalmer-yellow-limestone");
        if (yellow) return yellow;
      }
      if (lower.includes("onyx")) {
        const onyx = allMaterials.find(m => m.id === "natural-onyx");
        if (onyx) return onyx;
      }
    }

    // Color match fallback
    if (color) {
      const colorLower = color.toLowerCase();
      const colorMatch = allMaterials.find(m => (m.color_family || "").toLowerCase().includes(colorLower));
      if (colorMatch) return colorMatch;
    }

    // Default Atelier Standard: Makrana Pure White Marble
    const defaultMat = allMaterials.find(m => m.id === "makrana-pure-white");
    return defaultMat || allMaterials[0] || { id: "makrana-pure-white", name: "Makrana Pure White Marble" };
  } catch {
    return { id: "makrana-pure-white", name: "Makrana Pure White Marble" };
  }
}

/**
 * Resolves deity or sacred subject from primary name or synonyms.
 */
async function resolveSubject(rawSubjectName = "") {
  if (!rawSubjectName) return null;

  try {
    const allSubjects = await query("SELECT * FROM subjects WHERE is_active = 1");
    const lower = rawSubjectName.toLowerCase().trim();

    // 1. Exact ID or primary name match
    let match = allSubjects.find(s => 
      s.id === lower || 
      s.primary_name.toLowerCase() === lower
    );
    if (match) return match;

    // 2. Partial primary name match
    match = allSubjects.find(s => 
      lower.includes(s.primary_name.toLowerCase()) || 
      s.primary_name.toLowerCase().includes(lower)
    );
    if (match) return match;

    // 3. Synonym match
    for (const s of allSubjects) {
      let synonyms = [];
      try {
        synonyms = typeof s.synonyms === "string" ? JSON.parse(s.synonyms || "[]") : (s.synonyms || []);
      } catch { synonyms = []; }

      const synMatch = synonyms.some(syn => 
        lower.includes(syn.toLowerCase()) || 
        syn.toLowerCase().includes(lower)
      );
      if (synMatch) return s;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Resolves Category, Collection, and Subcategory deterministically.
 */
async function resolveHierarchy(subjectObj, productType = "statue") {
  try {
    const allCategories = await query("SELECT * FROM categories WHERE is_active = 1");

    // Case 1: Subject has default_category_slug
    if (subjectObj?.default_category_slug) {
      const matchedCat = allCategories.find(c => c.slug === subjectObj.default_category_slug);
      if (matchedCat) {
        return {
          parentCategory: matchedCat.slug,
          parentCollection: matchedCat.parent_collection_slug,
          parentSubcategory: matchedCat.parent_subcategory_slug
        };
      }
    }

    // Case 2: Subject primary name matches category slug or name
    if (subjectObj?.primary_name) {
      const subjLower = subjectObj.primary_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const matchedCat = allCategories.find(c => 
        c.slug.includes(subjLower) || 
        c.name.toLowerCase().includes(subjectObj.primary_name.toLowerCase())
      );
      if (matchedCat) {
        return {
          parentCategory: matchedCat.slug,
          parentCollection: matchedCat.parent_collection_slug,
          parentSubcategory: matchedCat.parent_subcategory_slug
        };
      }
    }

    // Case 3: Match based on Product Type
    const typeLower = productType.toLowerCase();

    if (typeLower.includes("relief") || typeLower.includes("mural") || typeLower.includes("wall")) {
      const reliefCat = allCategories.find(c => c.slug.includes("relief") || c.slug.includes("mural") || c.parent_collection_slug === "wall-art-reliefs");
      if (reliefCat) {
        return {
          parentCategory: reliefCat.slug,
          parentCollection: reliefCat.parent_collection_slug,
          parentSubcategory: reliefCat.parent_subcategory_slug
        };
      }
      return {
        parentCategory: "wall-murals",
        parentCollection: "wall-art-reliefs",
        parentSubcategory: "stone-murals"
      };
    }

    if (typeLower.includes("mandir") || typeLower.includes("temple")) {
      const mandirCat = allCategories.find(c => c.slug.includes("mandir") || c.slug.includes("temple"));
      if (mandirCat) {
        return {
          parentCategory: mandirCat.slug,
          parentCollection: mandirCat.parent_collection_slug,
          parentSubcategory: mandirCat.parent_subcategory_slug
        };
      }
      return {
        parentCategory: "home-mandirs",
        parentCollection: "temples-architectural-stonework",
        parentSubcategory: "temples"
      };
    }

    if (typeLower.includes("fountain") || typeLower.includes("water")) {
      const fountainCat = allCategories.find(c => c.slug.includes("fountain") || c.slug.includes("water"));
      if (fountainCat) {
        return {
          parentCategory: fountainCat.slug,
          parentCollection: fountainCat.parent_collection_slug,
          parentSubcategory: fountainCat.parent_subcategory_slug
        };
      }
      return {
        parentCategory: "garden-fountains",
        parentCollection: "garden-fountains-water-features",
        parentSubcategory: "fountains"
      };
    }

    if (typeLower.includes("jali") || typeLower.includes("screen") || typeLower.includes("column") || typeLower.includes("architectural")) {
      const jaliCat = allCategories.find(c => c.slug.includes("jali") || c.parent_collection_slug === "temples-architectural-stonework");
      if (jaliCat) {
        return {
          parentCategory: jaliCat.slug,
          parentCollection: jaliCat.parent_collection_slug,
          parentSubcategory: jaliCat.parent_subcategory_slug
        };
      }
      return {
        parentCategory: "jali-screens",
        parentCollection: "temples-architectural-stonework",
        parentSubcategory: "architectural-elements"
      };
    }

    // Default Sculptures & Statues fallback
    const ganeshCat = allCategories.find(c => c.slug === "ganesh-ji") || allCategories[0];
    if (ganeshCat) {
      return {
        parentCategory: ganeshCat.slug,
        parentCollection: ganeshCat.parent_collection_slug,
        parentSubcategory: ganeshCat.parent_subcategory_slug
      };
    }

    return {
      parentCategory: "ganesh-ji",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures"
    };
  } catch {
    return {
      parentCategory: "ganesh-ji",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures"
    };
  }
}

/**
 * Validates product type against database product_types table.
 */
async function resolveProductType(rawType = "statue") {
  try {
    const types = await query("SELECT id FROM product_types WHERE is_active = 1");
    const validIds = types.map(t => t.id);
    const lower = rawType.toLowerCase();

    if (validIds.includes(lower)) return lower;

    // Fuzzy matching
    if (lower.includes("statue") || lower.includes("murti")) return "statue";
    if (lower.includes("idol")) return "idol";
    if (lower.includes("sculpture")) return "sculpture";
    if (lower.includes("bust")) return "bust";
    if (lower.includes("relief") || lower.includes("mural")) return "relief";
    if (lower.includes("mandir") || lower.includes("temple")) return "mandir";
    if (lower.includes("fountain")) return "fountain";
    if (lower.includes("jali") || lower.includes("arch")) return "architectural_element";

    return "statue";
  } catch {
    return "statue";
  }
}
