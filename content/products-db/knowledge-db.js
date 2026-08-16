/**
 * Jaipur Stonecraft — Central Knowledge & Craftsmanship Content Database
 * 
 * STRICT RULE: No fabricated claims or generic AI filler articles.
 * Uses genuine masonic principles and flags first-hand details needing owner review with [NEEDS REAL FIRST-HAND CONTENT].
 */

export const KnowledgeTypeEnum = {
  BUYING_GUIDE: "buying_guide",
  CRAFTSMANSHIP_GUIDE: "craftsmanship_guide",
  MATERIAL_GUIDE: "material_guide",
  FAQ: "faq"
};

export const knowledgeArticlesStore = [
  {
    id: "how-makrana-marble-statues-are-carved",
    slug: "how-makrana-marble-statues-are-carved",
    title: "How Makrana White Marble Statues Are Hand-Carved in Jaipur",
    type: KnowledgeTypeEnum.CRAFTSMANSHIP_GUIDE,
    authorRole: "Jaipur Master Stone Artisan",
    summary: "A step-by-step insight into how single-block Makrana white marble is selected, chiseled, detailed, and hand-polished following sacred Shilpa Shastra proportions.",
    readTimeMinutes: 6,
    lastUpdated: "2026-08-01",

    relatedMaterialIds: ["makrana-pure-white", "sangemarmar-white"],
    relatedCategorySlugs: ["ganesh-ji", "krishna-ji", "shiva-ji", "buddha-statues"],
    relatedProductSlugs: ["seated-ganesh-with-modak", "flute-playing-krishna", "meditating-shiva-statue"],

    sections: [
      {
        heading: "1. Raw Block Selection & Soundness Verification",
        content: "Every marble statue begins at the quarry. Master carvers inspect Makrana white marble blocks for hidden hairline fractures using traditional hammer tapping sound tests. Only non-porous single-grain blocks with pure white resonance are selected for sacred deity iconography."
      },
      {
        heading: "2. Shilpa Shastra Proportion Grid (Rekha Measurement)",
        content: "Before chiseling, traditional masonic artisans draw grid lines (Rekha) using red oxide pigment on the stone block. Proportions of facial features, trunk angles, and crown heights strictly follow traditional Shilpa Shastra guidelines."
      },
      {
        heading: "3. Rough Masonic Chiseling & Form Emergence",
        content: "Using heavy steel chisels and iron hammers, excess stone is steadily removed to reveal the primary posture (Lalitasana, Samabhanga, or Dhyana). Artisans work from front to back, ensuring structural balance."
      },
      {
        heading: "4. Fine Feature Detailing & Facial Chiseling",
        content: "Slender hand chisels are used for crown filigree, flowing drapery, and divine facial expressions. Eye opening (Netra Unmilan) is performed as the final artistic carving step. [NEEDS REAL FIRST-HAND CONTENT: Specific proprietary chisel tool names and family workshop technique details to be verified by atelier owners]."
      },
      {
        heading: "5. Multi-Stage Hand Polishing (Zero Chemical Sealants)",
        content: "The statue is smoothed using natural emery stones of progressively finer grit, followed by natural buffing. Pure Makrana marble achieves a perpetual glow without synthetic varnishes or sealants."
      }
    ]
  },
  {
    id: "selecting-marble-for-home-mandir",
    slug: "selecting-marble-for-home-mandir",
    title: "Selecting White Marble for Custom Home Temples & Pooja Rooms",
    type: KnowledgeTypeEnum.BUYING_GUIDE,
    authorRole: "Sanctuary Stone Consultant",
    summary: "Architectural and devotional guidelines for choosing non-porous Makrana marble, mandir arch proportions, and pooja sanctuary stone panels.",
    readTimeMinutes: 5,
    lastUpdated: "2026-08-05",

    relatedMaterialIds: ["makrana-pure-white", "ambaji-white-marble"],
    relatedCategorySlugs: ["marble-home-temples", "compact-wall-mandirs", "carved-mandir-arches"],
    relatedProductSlugs: ["seated-ganesh-with-modak"],

    sections: [
      {
        heading: "Purity & Non-Porous Durability",
        content: "Home mandir stone must withstand daily oil lamps (diyas), sacred water (charanamrit), and incense residue. Pure Makrana white marble is non-porous, preventing stain absorption over decades of daily worship."
      },
      {
        heading: "Integration with Interior Floorplans",
        content: "Bespoke home mandirs can be designed as free-standing pillared temples or wall-mounted carved toran arches tailored to specific sanctuary dimensions. [NEEDS REAL FIRST-HAND CONTENT: Recommended minimum weight load specifications for upper floor residential pooja rooms]."
      }
    ]
  },
  {
    id: "international-export-packing-care",
    slug: "international-export-packing-care",
    title: "Packaging & Worldwide Export Transport of Heavy Stone Statuary",
    type: KnowledgeTypeEnum.MATERIAL_GUIDE,
    authorRole: "Export Logistics Specialist",
    summary: "How heavy white marble idols, stone fountains, and carved jali screens are secured in custom fumigated wooden crates for international sea & air freight.",
    readTimeMinutes: 4,
    lastUpdated: "2026-08-08",

    relatedMaterialIds: ["makrana-pure-white", "pink-bansi-paharpur", "black-bhainslana"],
    relatedCategorySlugs: ["sculptures-statues", "fountains-water-features", "architectural-elements"],
    relatedProductSlugs: ["seated-ganesh-with-modak", "three-tier-lotus-fountain"],

    sections: [
      {
        heading: "Fumigated ISPM-15 Wooden Crating",
        content: "All international shipments are encased in custom-built ISPM-15 certified heat-treated wooden crates with shock-absorbing high-density foam buffers, protecting delicate crown and hand details during transit."
      },
      {
        heading: "Global Delivery & Port Handling",
        content: "Jaipur Stonecraft handles door-to-door and port-to-port shipments across the US, UK, UAE, Australia, and Europe with insured sea container packaging. [NEEDS REAL FIRST-HAND CONTENT: Specific insurance carrier and customs documentation checklist]."
      }
    ]
  }
];

export function getKnowledgeArticle(slug) {
  return knowledgeArticlesStore.find((a) => a.slug === slug) || null;
}

export function getAllKnowledgeArticles() {
  return knowledgeArticlesStore;
}

export function getKnowledgeArticlesForProduct(product) {
  if (!product) return [];
  return knowledgeArticlesStore.filter((article) => {
    const matchProduct = article.relatedProductSlugs.includes(product.slug);
    const matchCat = article.relatedCategorySlugs.includes(product.parentCategory);
    const matchMat = product.primaryMaterialId && article.relatedMaterialIds.includes(product.primaryMaterialId);
    return matchProduct || matchCat || matchMat;
  });
}
