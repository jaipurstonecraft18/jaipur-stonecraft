/**
 * Jaipur Stonecraft — Central Knowledge & Craftsmanship Content Database
 * 
 * STRICT ACCURACY REVIEW:
 * - Factual, non-exaggerated stone descriptions
 * - No structural or engineering guarantees (recommends qualified architectural/engineering review)
 * - Safe, non-abrasive care guidelines without DIY chemical poultice recipes
 * - Factual export packing and material references
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
    summary: "An overview of how single-block Makrana white marble is selected, chiseled, detailed, and hand-finished following traditional Shilpa Shastra proportions.",
    readTimeMinutes: 6,
    lastUpdated: "2026-10-26",

    relatedMaterialIds: ["makrana-pure-white", "sangemarmar-white"],
    relatedCategorySlugs: ["ganesh-ji", "krishna-ji", "shiva-ji", "buddha-statues"],
    relatedProductSlugs: ["seated-ganesh-with-modak", "flute-playing-krishna", "meditating-shiva-statue"],

    sections: [
      {
        heading: "1. Raw Block Selection & Soundness Inspection",
        content: "Every marble statue begins with careful block selection from reputable quarries in Makrana, Rajasthan. Experienced carvers inspect natural marble blocks for structural continuity, checking for hidden fractures or soft veins using traditional acoustic hammer-tapping methods to ensure the stone is sound before carving begins."
      },
      {
        heading: "2. Traditional Proportion Guidelines (Rekha & Tala Measurement)",
        content: "Before carving, artisans mark proportional guidelines directly onto the dressed stone block using natural pigment. Iconographic dimensions draw from traditional Shilpa Shastra guidelines, applying standard proportional ratios (Tala measurements) to balance facial features, crown heights, and posture alignment."
      },
      {
        heading: "3. Rough Chiseling & Form Roughing",
        content: "Using heavy steel chisels and mallets, excess stone is systematically removed to establish the primary sculptural silhouette. Artisans work progressively around the stone, keeping the sculpture balanced on its integrated base."
      },
      {
        heading: "4. Fine Detailing & Facial Expression",
        content: "Finer hand chisels and specialist files are used to sculpt drapery folds, jewelry ornamentation, and sacred attributes. Particular attention is devoted to the facial features, where the master sculptor refines the eye contours and gentle expression characteristic of traditional sacred imagery."
      },
      {
        heading: "5. Multi-Stage Hand Polishing",
        content: "The smooth finish of traditional marble statuary is developed through successive stages of manual abrasive rubbing using water and increasingly fine emery stones, followed by dry cloth buffing to highlight the stone's natural crystalline luster without reliance on artificial surface coatings."
      }
    ]
  },
  {
    id: "selecting-marble-for-home-mandir",
    slug: "selecting-marble-for-home-mandir",
    title: "Planning & Sizing a Natural Marble Mandir for Homes & Pooja Rooms",
    type: KnowledgeTypeEnum.BUYING_GUIDE,
    authorRole: "Sanctuary Stone Consultant",
    summary: "Design considerations for choosing white marble home mandirs, spatial planning, weight awareness, and everyday pooja room care.",
    readTimeMinutes: 5,
    lastUpdated: "2026-10-26",

    relatedMaterialIds: ["makrana-pure-white", "ambaji-white-marble"],
    relatedCategorySlugs: ["marble-home-temples", "compact-wall-mandirs", "carved-mandir-arches"],
    relatedProductSlugs: ["seated-ganesh-with-modak"],

    sections: [
      {
        heading: "1. Spatial Planning & Clearances",
        content: "When selecting a home mandir, consider overall room proportions, ceiling height, and orientation. Providing several inches of clearance around the structure allows for comfortable maintenance, ventilation during prayer, and safe placement of lighting fixtures."
      },
      {
        heading: "2. Weight Awareness & Structural Considerations",
        content: "Natural stone carries significant mass: small wall-mounted or shelf shrines may weigh under 50 kg, whereas large freestanding multi-pillared temple structures can weigh several hundred kilograms. Always review the anticipated weight with your architect, interior designer, or building engineer to confirm floor and wall structural suitability, particularly for upper-floor apartment installations. Jaipur Stonecraft typically fabricates freestanding mandirs in modular, interlocking sections to facilitate transport, handling, and on-site assembly, but does not provide structural engineering certifications."
      },
      {
        heading: "3. Marble Performance in Everyday Pooja Use",
        content: "High-grade Makrana calcite marble has a dense crystalline structure with low natural porosity compared to softer sedimentary limestones or composite materials. While it offers superior natural resistance to sacred liquids and pooja oils, any spills (such as heated ghee, turmeric, or vermilion) should still be wiped promptly with a clean, damp cloth to preserve the stone's natural clarity."
      },
      {
        heading: "4. Mandir Canopy & Height Proportions",
        content: "Proportion is essential for a balanced shrine. Harmonizing the pedestal base height, sanctum opening, and decorative canopy or shikhara ensures the mandir fits gracefully within residential rooms without feeling crowded against ceilings."
      }
    ]
  },
  {
    id: "differences-between-makrana-marble-and-artificial-stone",
    slug: "differences-between-makrana-marble-and-artificial-stone",
    title: "Natural Makrana Marble vs Engineered & Cultured Stone for Sacred Art",
    type: KnowledgeTypeEnum.MATERIAL_GUIDE,
    authorRole: "Stone Specialist",
    summary: "An overview comparing natural quarried calcite marble with synthetic resin-bound cultured stone regarding heat behavior, optical depth, and longevity.",
    readTimeMinutes: 5,
    lastUpdated: "2026-10-26",

    relatedMaterialIds: ["makrana-pure-white", "sangemarmar-white"],
    relatedCategorySlugs: ["sculptures-statues", "temples-architectural-stonework"],
    relatedProductSlugs: ["seated-ganesh-with-modak", "meditating-shiva-statue"],

    sections: [
      {
        heading: "1. Geological Origin vs Manufactured Composites",
        content: "Natural Makrana marble is a metamorphic crystalline limestone composed predominantly of recrystallized calcite, formed naturally under geological heat and pressure. In contrast, 'cultured marble' or 'engineered stone' is an artificial composite typically made by binding crushed stone aggregate or mineral fillers with synthetic polymer resins and pigments."
      },
      {
        heading: "2. Thermal Behavior Around Open Flames",
        content: "Devotional worship often involves burning camphor and open diya flames. Natural calcite marble is naturally non-combustible and thermally durable under standard pooja use. In contrast, resin-bound artificial stones can soften, scorch, or discolor when exposed directly to open flames or hot metal lamps."
      },
      {
        heading: "3. Optical Depth & Natural Surface Qualities",
        content: "High-quality natural white marble exhibits subtle sub-surface translucency: ambient light penetrates slightly into the calcite crystal boundaries before reflecting, giving sacred sculptures their characteristic depth and soft luminescence. Artificial composites, by contrast, rely on surface pigments and typically lack the natural depth and mineral variation of genuine quarried stone."
      },
      {
        heading: "4. Material Longevity & Hand-Carved Authenticity",
        content: "Authentic natural stone sculptures can be carefully cleaned, conserved, and refinished over generations. Each piece reflects individual hand chiseling into a unique monolithic block of stone rather than being poured into a mass-produced mold."
      }
    ]
  },
  {
    id: "choosing-stone-jali-screens-guide",
    slug: "choosing-stone-jali-screens-guide",
    title: "Architectural Guide to Stone Jali Screens: Patterns, Thickness & Applications",
    type: KnowledgeTypeEnum.BUYING_GUIDE,
    authorRole: "Architectural Stone Consultant",
    summary: "Practical considerations for selecting carved natural stone jalis for interior partitions, balcony railings, daylight filtration, and privacy.",
    readTimeMinutes: 5,
    lastUpdated: "2026-10-26",

    relatedMaterialIds: ["pink-bansi-paharpur", "dholpur-beige", "makrana-pure-white"],
    relatedCategorySlugs: ["jali", "architectural-elements"],
    relatedProductSlugs: [],

    sections: [
      {
        heading: "1. Panel Thickness & Application Guidelines",
        content: "Stone jali thickness varies based on overall panel dimensions, pattern delicacy, and whether the installation is interior or exterior. Interior decorative screens and partitions are commonly carved from 25mm to 35mm thick stone slabs, while exterior balconies, parapets, or window facades often utilize 40mm to 50mm slabs with peripheral framing. For all external or elevated architectural installations, exact panel thickness, wind-load requirements, and steel anchoring details must be reviewed and approved by the project architect or structural engineer."
      },
      {
        heading: "2. Pattern Geometry: Traditional & Contemporary Styles",
        content: "Traditional Rajasthani floral jalis feature intertwined leaf and floral motifs that soften intense daylight into pleasing dappled shade. Geometric and star-lattice patterns distribute structural load evenly across the openwork, while contemporary linear and parametric lattices complement modern architectural interiors."
      },
      {
        heading: "3. Daylight Transmission vs Visual Privacy",
        content: "The balance between cut-out area and solid stone determines both air circulation and privacy. Moderate open ratios filter harsh glare and provide natural airflow while obscuring direct views from outside, making jalis effective for courtyard screens and balcony enclosures."
      },
      {
        heading: "4. Material Selection Considerations",
        content: "Sandstones like Pink Bansi Paharpur and Dholpur Beige are well-suited for exterior facades, courtyard screens, and garden enclosures due to their warm earthy tones and natural durability. White marble offers a refined aesthetic ideal for interior luxury partitions, mandir enclosures, and decorative feature walls."
      }
    ]
  },
  {
    id: "architect-specification-guide-custom-stonework",
    slug: "architect-specification-guide-custom-stonework",
    title: "Guidelines for Specifying Custom Architectural Stonework & Temple Commissions",
    type: KnowledgeTypeEnum.CRAFTSMANSHIP_GUIDE,
    authorRole: "Technical Project Director",
    summary: "Checklist for architects, designers, and committees: drawings, stone selection, artisanal tolerances, and production scheduling.",
    readTimeMinutes: 6,
    lastUpdated: "2026-10-26",

    relatedMaterialIds: ["makrana-pure-white", "pink-bansi-paharpur", "jodhpur-red"],
    relatedCategorySlugs: ["custom-bespoke-creations", "temples-architectural-stonework"],
    relatedProductSlugs: [],

    sections: [
      {
        heading: "1. Design Documentation & Scope Definition",
        content: "To facilitate accurate quotation and fabrication scheduling, provide overall dimensional constraints, elevations, and sectional details indicating desired relief depth. Clear indication of structural backing (e.g. concrete frame, steel sub-structure, or masonry) ensures accurate planning."
      },
      {
        heading: "2. Specific Material Identification",
        content: "Specify the exact natural stone material required, such as Makrana Pure White Marble, Ambaji White Marble, Pink Bansi Paharpur Sandstone, Jodhpur Red Sandstone, Dholpur Beige Sandstone, or Granite. The atelier works predominantly with natural marbles, sandstones, limestones, and onyx, and provides granite where suitable and available. Clients should confirm specific stone availability, finish, and suitability with the studio before finalizing architectural schedules."
      },
      {
        heading: "3. Artisanal Tolerances & Joint Details",
        content: "Hand-carved architectural stonework inherently reflects artisanal craftsmanship, with typical dimensional tolerances varying depending on component scale (commonly within ±2mm to ±4mm). For architectural pillars, arches, and cladding elements, required dowel holes, rebated joints, or anchoring points should be clearly specified in joint shop drawings approved prior to carving."
      },
      {
        heading: "4. Production Timelines & Coordination",
        content: "Jaipur Stonecraft prioritizes efficient production and responsive project coordination. Turnaround times depend on the design, dimensions, customization, material availability, and special requirements. Rather than applying unverified fixed estimates, production schedules and delivery milestones are confirmed individually after reviewing the project's detailed specifications. Contact our atelier to discuss your scope and receive a project-specific timeline."
      }
    ]
  },
  {
    id: "marble-statue-care-and-maintenance",
    slug: "marble-statue-care-and-maintenance",
    title: "Care & Maintenance Guidelines for Natural Marble Sculptures",
    type: KnowledgeTypeEnum.MATERIAL_GUIDE,
    authorRole: "Conservation & Stone Specialist",
    summary: "Recommended practices for cleaning natural white marble murtis safely, preserving surface sheen, and avoiding acidic damage.",
    readTimeMinutes: 5,
    lastUpdated: "2026-10-26",

    relatedMaterialIds: ["makrana-pure-white", "sangemarmar-white"],
    relatedCategorySlugs: ["sculptures-statues", "decorative-stone-art"],
    relatedProductSlugs: ["seated-ganesh-with-modak", "flute-playing-krishna"],

    sections: [
      {
        heading: "1. Avoiding Acidic & Harsh Cleaners",
        content: "Natural marble consists primarily of calcium carbonate, which reacts unfavorably with acidic substances. Avoid using vinegar, citrus-based cleaners, bleach, chemical descalers, or harsh multi-surface sprays on marble sculptures, as acids can etch and dull the surface finish."
      },
      {
        heading: "2. Routine Cleaning Practices",
        content: "For regular upkeep, wipe the statue gently using a soft, clean cotton or microfiber cloth dampened with clean lukewarm water. For routine cleaning, a mild, pH-neutral soap formulated for natural stone can be used with a soft-bristled brush to reach recessed carved details without scratching the surface."
      },
      {
        heading: "3. Managing Pooja Residues Promptly",
        content: "Avoid abrasive household powders, scouring pads, and aggressive chemical cleaners. If organic devotional substances like oil or kumkum remain on the stone, blot gently with clean water and a neutral stone cleaner as soon as possible. For persistent stains or heritage pieces, consult a professional stone conservator or contact the atelier for specific guidance to avoid damaging the polished marble surface."
      },
      {
        heading: "4. Maintaining Surface Luster",
        content: "Natural marble maintains its characteristic soft luster without synthetic coatings or surface lacquers. Occasional gentle buffing with a dry, clean cotton cloth helps keep the stone looking its best."
      }
    ]
  },
  {
    id: "international-export-packing-care",
    slug: "international-export-packing-care",
    title: "Packaging & Worldwide Freight Transport for Stone Artworks",
    type: KnowledgeTypeEnum.MATERIAL_GUIDE,
    authorRole: "Export Logistics Specialist",
    summary: "An overview of crating standards, shock absorption packaging, and international freight transport for heavy stone statuary.",
    readTimeMinutes: 5,
    lastUpdated: "2026-10-26",

    relatedMaterialIds: ["makrana-pure-white", "pink-bansi-paharpur", "black-bhainslana"],
    relatedCategorySlugs: ["sculptures-statues", "fountains-water-features", "architectural-elements"],
    relatedProductSlugs: ["seated-ganesh-with-modak", "three-tier-lotus-fountain"],

    sections: [
      {
        heading: "1. Heat-Treated Wooden Crating",
        content: "International shipments are packed in custom wooden crates fabricated from heat-treated timber conforming to ISPM-15 phytosanitary standards. Internal timber framing supports the weight and secures the piece against movement during transit."
      },
      {
        heading: "2. Shock-Absorbing Buffers & Protection",
        content: "Sculptures are padded with high-density shock-absorbing foam lining, and delicate features such as hands, crowns, or projecting ornaments receive tailored cushioning and protective wrapping."
      },
      {
        heading: "3. Freight Coordination & Documentation",
        content: "Jaipur Stonecraft coordinates domestic and international freight with established shipping agents, utilizing standard commercial documentation (such as HS Code classifications under Chapter 68 for worked stone or Chapter 97 for original sculptures). Transit insurance and customs clearance options are reviewed and confirmed with the buyer based on destination port and local import regulations."
      },
      {
        heading: "4. Uncrating & Handling On Site",
        content: "Export crates are marked with handling indicators and uncrating guidance. For multi-part mandirs or fountains, components are individually marked and accompanied by assembly references. Final on-site handling, rigging, and structural installation must be carried out by qualified local building contractors."
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
