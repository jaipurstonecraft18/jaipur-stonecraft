/**
 * Jaipur Stonecraft — Product Data Model & Taxonomy Definition Schema (Stage 1)
 * 
 * This file serves as the canonical schema specification for the product database architecture.
 * It defines entity shapes, enums, subjects, material taxonomy, attributes, and relationship rules.
 * 
 * STRICT RULE: Granite is strictly excluded from all materials, enums, attributes, and content.
 */

// ============================================================================
// 1. ENUMS & CONSTANTS
// ============================================================================

/**
 * Genuine Product Types manufactured by Jaipur Stonecraft
 */
export const ProductTypeEnum = {
  STATUE: "statue",                     // Sacred deity statue / idol
  IDOL: "idol",                         // Devotional murti / moorti
  SCULPTURE: "sculpture",               // Artistic, classical, or modern sculpture
  BUST: "bust",                         // Portrait bust / head carving
  FIGURINE: "figurine",                 // Tabletop statuette / small art accent
  RELIEF: "relief",                     // Carved wall relief panel / mural
  MANDIR: "mandir",                     // Home temple / pooja room architecture
  FOUNTAIN: "fountain",                 // Tiered water fountain / lotus basin
  ARCHITECTURAL_ELEMENT: "architectural_element", // Jali, column, pillar, arch, jharokha
  DECORATIVE_OBJECT: "decorative_object", // Urn, planter, pedestal, plinth, table
  CUSTOM_ARTWORK: "custom_artwork"      // Bespoke commissioned artwork / tribute
};

/**
 * Status Lifecycle Enum
 */
export const ProductStatusEnum = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived"
};

/**
 * Color Family Attribute Enum
 */
export const ColorFamilyEnum = {
  WHITE: "White",
  PINK: "Pink",
  RED: "Red",
  BEIGE: "Beige",
  BLACK: "Black",
  GOLDEN_YELLOW: "Golden Yellow",
  HONEY_AMBER: "Honey/Amber",
  MULTI_TONE: "Multi-Tone"
};

/**
 * Surface Finishing Enum
 */
export const FinishTypeEnum = {
  HAND_HONED: "Hand Honed (Natural Matte)",
  MIRROR_POLISHED: "Mirror Polished (High Gloss)",
  ANTIQUE_WEATHERED: "Antique Weathered",
  NATURAL_CHISELED: "Natural Masonic Chiseled"
};

/**
 * Environment / Placement Enum
 */
export const EnvironmentEnum = {
  INDOOR_SANCTUARY: "Indoor Sanctuary",
  COVERED_OUTDOOR: "Covered Outdoor",
  ALL_WEATHER_EXTERIOR: "All-Weather Exterior Landscape"
};

/**
 * Posture / Pose Enum
 */
export const PostureEnum = {
  SEATED_LALITASANA: "Seated (Lalitasana)",
  SEATED_PADMASANA: "Seated (Padmasana)",
  STANDING_SAMABHANGA: "Standing (Samabhanga)",
  STANDING_TRIBHANGA: "Standing (Tribhanga)",
  DANCING_NATARAJA: "Dancing (Nataraja)",
  MEDITATING_DHYANA: "Meditating (Dhyana)",
  WALL_PANEL: "Wall Relief Panel",
  ARCHITECTURAL: "Architectural Structure"
};

// ============================================================================
// 2. MATERIAL TAXONOMY (Zero Granite)
// ============================================================================

export const MaterialTaxonomy = {
  "makrana-pure-white": {
    id: "makrana-pure-white",
    name: "Makrana Pure White Marble",
    category: "Marble",
    origin: "Makrana, Rajasthan, India",
    colorFamily: ColorFamilyEnum.WHITE,
    durability: EnvironmentEnum.ALL_WEATHER_EXTERIOR,
    isSacredGrade: true,
    description: "World-renowned marble quarried from Makrana. Pure white crystalline structure with natural luminosity. Zero artificial sealants required."
  },
  "sangemarmar-white": {
    id: "sangemarmar-white",
    name: "Sangemarmar White Marble",
    category: "Marble",
    origin: "Rajasthan, India",
    colorFamily: ColorFamilyEnum.WHITE,
    durability: EnvironmentEnum.INDOOR_SANCTUARY,
    isSacredGrade: true,
    description: "Traditional Indian white marble with soft graining, prized for delicate masonic facial carving."
  },
  "black-bhainslana": {
    id: "black-bhainslana",
    name: "Black Bhainslana Marble",
    category: "Marble",
    origin: "Bhainslana, Rajasthan, India",
    colorFamily: ColorFamilyEnum.BLACK,
    durability: EnvironmentEnum.ALL_WEATHER_EXTERIOR,
    isSacredGrade: true,
    description: "Dense obsidian black marble with faint slate veining, ideal for Shiva idols and high-contrast art."
  },
  "pink-bansi-paharpur": {
    id: "pink-bansi-paharpur",
    name: "Pink Bansi Paharpur Sandstone",
    category: "Sandstone",
    origin: "Bansi Paharpur, Rajasthan, India",
    colorFamily: ColorFamilyEnum.PINK,
    durability: EnvironmentEnum.ALL_WEATHER_EXTERIOR,
    isSacredGrade: true,
    description: "Revered blush-pink sandstone used in historical Rajasthani royal palaces and grand temple shrines."
  },
  "jodhpur-red-sandstone": {
    id: "jodhpur-red-sandstone",
    name: "Jodhpur Royal Red Sandstone",
    category: "Sandstone",
    origin: "Jodhpur, Rajasthan, India",
    colorFamily: ColorFamilyEnum.RED,
    durability: EnvironmentEnum.ALL_WEATHER_EXTERIOR,
    isSacredGrade: false,
    description: "Terracotta-red sandstone for structural columns, lattice jalis, and fort-inspired architecture."
  },
  "dholpur-beige-sandstone": {
    id: "dholpur-beige-sandstone",
    name: "Dholpur Beige Sandstone",
    category: "Sandstone",
    origin: "Dholpur, Rajasthan, India",
    colorFamily: ColorFamilyEnum.BEIGE,
    durability: EnvironmentEnum.ALL_WEATHER_EXTERIOR,
    isSacredGrade: false,
    description: "Cream-beige sandstone providing soft warm aesthetics for relief wall murals and landscape art."
  },
  "jaisalmer-yellow-limestone": {
    id: "jaisalmer-yellow-limestone",
    name: "Jaisalmer Golden Yellow Limestone",
    category: "Limestone",
    origin: "Jaisalmer, Rajasthan, India",
    colorFamily: ColorFamilyEnum.GOLDEN_YELLOW,
    durability: EnvironmentEnum.COVERED_OUTDOOR,
    isSacredGrade: false,
    description: "Golden honey yellow stone evoking Thar desert heritage, used for decorative urns and relief panels."
  },
  "natural-translucent-onyx": {
    id: "natural-translucent-onyx",
    name: "Natural Translucent Onyx",
    category: "Natural Onyx",
    origin: "Rajasthan / Regional Quarries",
    colorFamily: ColorFamilyEnum.HONEY_AMBER,
    durability: EnvironmentEnum.INDOOR_SANCTUARY,
    isSacredGrade: false,
    description: "Exotic translucent natural onyx stone ideal for illuminated relief panels and luxury decor accents."
  }
};

// ============================================================================
// 3. SUBJECT SYSTEM (Deities & Art Entities)
// ============================================================================

export const SubjectTaxonomy = {
  "ganesh": {
    id: "ganesh",
    primaryName: "Lord Ganesha",
    synonyms: ["Ganesha", "Ganpati", "Ganesh Ji", "Vighnaharta", "Vinayaka"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Modak", "Trunk Curvature (Left/Right)", "Crown (Mukut)", "Mouse (Mooshak)", "Four Arms"],
    defaultCategorySlug: "ganesh-ji"
  },
  "krishna": {
    id: "krishna",
    primaryName: "Lord Krishna",
    synonyms: ["Krishna", "Krishna Ji", "Muralidhar", "Bal Krishna", "Govinda"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Flute (Bansi)", "Peacock Feather (Mor Pankh)", "Sacred Cow (Kamadhenu)", "Kadamba Tree"],
    defaultCategorySlug: "krishna-ji"
  },
  "shiva": {
    id: "shiva",
    primaryName: "Lord Shiva",
    synonyms: ["Shiva", "Shiva Ji", "Mahadev", "Nataraja", "Shiva Lingam", "Adiyogi"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Trishul", "Damru", "Crescent Moon", "Cobra (Vasuki)", "Third Eye", "Tiger Skin"],
    defaultCategorySlug: "shiva-ji"
  },
  "hanuman": {
    id: "hanuman",
    primaryName: "Lord Hanuman",
    synonyms: ["Hanuman", "Hanuman Ji", "Bajrangbali", "Pavanputra", "Sankat Mochan"],
    tradition: "Hindu Sacred Iconography",
    iconographyElements: ["Mace (Gada)", "Dronagiri Mountain", "Devotional Masonic Stance"],
    defaultCategorySlug: "hanuman-ji"
  },
  "buddha": {
    id: "buddha",
    primaryName: "Lord Buddha",
    synonyms: ["Buddha", "Gautama Buddha", "Siddhartha", "Dhyani Buddha"],
    tradition: "Buddhist Sacred Art",
    iconographyElements: ["Dhyana Mudra", "Bhumisparsha Mudra", "Ushnisha", "Lotus Pedestal"],
    defaultCategorySlug: "buddha-statues"
  },
  "jali-lattice": {
    id: "jali-lattice",
    primaryName: "Jali Lattice Pattern",
    synonyms: ["Carved Jali", "Stone Lattice", "Geometric Screen", "Perforated Screen"],
    tradition: "Rajasthani Architectural Craftsmanship",
    iconographyElements: ["Geometric Stars", "Floral Lotus Petals", "Arched Borders"],
    defaultCategorySlug: "jali-screens"
  }
};

// ============================================================================
// 4. TAXONOMY SEPARATION & RECONCILIATION MODEL
// ============================================================================

/**
 * RECONCILIATION WITH LIVE SITE HIERARCHY:
 * 
 * 1. CATEGORIES (Major Site Architecture - 5 Levels):
 *    Collection -> Subcategory -> Category -> Design -> Variants
 *    Example:
 *    sculptures-statues -> hindu-sculptures -> ganesh-ji -> seated-ganesh-with-modak
 * 
 * 2. CURATED COLLECTIONS (Cross-Cutting Groupings):
 *    Can group products across different categories/subcategories based on theme.
 *    Examples: "Sacred Pooja Room Essentials", "Makrana White Masterpieces", "Palace Courtyard Architecture".
 * 
 * 3. ATTRIBUTES (Structured Technical Characteristics):
 *    Material, Color, Finish, Environment, Posture, Dimensions.
 * 
 * 4. TAGS (Flexible Discovery Tags):
 *    "Single-Block-Carving", "Shilpa-Shastra-Proportioned", "Export-Ready", "Custom-Dimension".
 * 
 * 5. SUBJECTS (Semantic Entities):
 *    Ganesha, Krishna, Shiva, Buddha, Jali Lattice.
 */

// ============================================================================
// 5. SAMPLE PRODUCT SCHEMA INSTANCE (Concrete Verification)
// ============================================================================

export const SampleProductInstance = {
  // Identity Fields
  id: "seated-ganesh-with-modak",
  sku: "JSC-STAT-GAN-001",
  name: "Seated Ganesh with Modak",
  slug: "seated-ganesh-with-modak",
  status: ProductStatusEnum.PUBLISHED,
  isFeatured: true,
  isNewArrival: false,
  isCustomOnly: false,

  // Taxonomy & Classification Fields
  productType: ProductTypeEnum.IDOL,
  primaryCollectionSlug: "sculptures-statues",
  primarySubcategorySlug: "hindu-sculptures",
  primaryCategorySlug: "ganesh-ji",
  secondaryCategorySlugs: ["custom-sculptures", "interior-stone-decor"],
  curatedCollectionSlugs: ["pooja-room-essentials", "makrana-white-masterpieces"],

  // Subject Entity Relationship
  subjectId: "ganesh",
  subSubject: "Blessing Seated Posture (Lalitasana) with Left-Trunk Modak",

  // Material Taxonomy
  primaryMaterialId: "makrana-pure-white",
  compatibleMaterialIds: ["makrana-pure-white", "sangemarmar-white", "black-bhainslana"],

  // Structured Attributes
  attributes: {
    colorFamily: ColorFamilyEnum.WHITE,
    posture: PostureEnum.SEATED_LALITASANA,
    finish: FinishTypeEnum.MIRROR_POLISHED,
    environment: EnvironmentEnum.INDOOR_SANCTUARY,
    customizable: true,
    inquiryOnly: true,
    availableDimensions: [
      { heightInches: 24, heightFeetLabel: "2.0 Feet", widthInches: 16, depthInches: 10, customizable: true },
      { heightInches: 42, heightFeetLabel: "3.5 Feet", widthInches: 28, depthInches: 18, customizable: true },
      { heightInches: 60, heightFeetLabel: "5.0 Feet", widthInches: 40, depthInches: 24, customizable: true }
    ]
  },

  // Flexible Discovery Tags
  tags: [
    "Single-Block-Marble",
    "Shilpa-Shastra-Proportioned",
    "Pooja-Room-Idol",
    "Export-Packing-Ready",
    "Hand-Polished"
  ],

  // Storytelling & Craftsmanship
  craftsmanshipNotes: "Hand-chiseled from a single block of high-purity Makrana white marble by master masonic carvers in Jaipur.",
  iconographyProportions: "Crafted following traditional Shilpa Shastra proportions, featuring delicate crown filigree and smooth contouring.",

  // SEO & Media Specs
  seo: {
    title: "Seated Makrana White Marble Ganesh Idol | Jaipur Stonecraft",
    description: "Hand-carved Makrana white marble Lord Ganesha statue seated in Lalitasana with modak. Hand-polished by Jaipur master stone artisans.",
    keywords: ["Makrana Marble Ganesh Statue", "Marble Ganesha Idol Jaipur", "White Marble Modak Ganesh", "Hand Carved Deity Statue"]
  }
};
