import { categoriesData } from "./categories.js";

// Template generator to ensure every Category has 3 to 6 realistic descriptive designs
const designPrefixes = [
  { prefix: "Traditional Seated", suffix: "Statue" },
  { prefix: "Classical Standing", suffix: "Sculpture" },
  { prefix: "Hand-Carved Relief", suffix: "Panel" },
  { prefix: "Ornate Royal", suffix: "Creation" },
  { prefix: "Bespoke Atelier", suffix: "Carving" },
  { prefix: "Heritage Masterpiece", suffix: "Design" }
];

export const designsData = {};

// Custom specific designs for primary highlight categories
const specificDesigns = {
  "ganesh-ji": [
    { slug: "seated-ganesh-with-modak", name: "Seated Ganesh with Modak" },
    { slug: "blessing-ganesh-statue", name: "Blessing Ganesh Statue" },
    { slug: "traditional-seated-ganesh", name: "Traditional Seated Ganesh" },
    { slug: "standing-ganesh-statue", name: "Standing Ganesh Statue" },
    { slug: "dancing-ganesh-statue", name: "Dancing Ganesh Statue" },
    { slug: "royal-ganesh-sculpture", name: "Royal Ganesh Sculpture" }
  ],
  "krishna-ji": [
    { slug: "flute-playing-krishna", name: "Flute Playing Krishna (Muralidhar)" },
    { slug: "standing-bal-krishna", name: "Standing Bal Krishna Idol" },
    { slug: "radha-krishna-pair-sculpture", name: "Radha Krishna Pair Sculpture" },
    { slug: "krishna-with-sacred-cow", name: "Krishna with Sacred Cow" }
  ],
  "shiva-ji": [
    { slug: "meditating-shiva-statue", name: "Meditating Shiva Statue" },
    { slug: "hand-carved-shiva-lingam", name: "Hand-Carved Shiva Lingam & Yoni" },
    { slug: "nataraja-cosmic-dancer", name: "Nataraja Cosmic Dancer Statue" },
    { slug: "shiva-parvati-family-statue", name: "Shiva Parvati Family Statue" }
  ],
  "tiered-water-fountains": [
    { slug: "three-tier-lotus-fountain", name: "Three-Tier Lotus Fountain" },
    { slug: "royal-courtyard-tiered-fountain", name: "Royal Courtyard Tiered Fountain" },
    { slug: "classical-pedestal-water-fountain", name: "Classical Pedestal Water Fountain" },
    { slug: "carved-scalloped-tier-fountain", name: "Carved Scalloped Tier Fountain" }
  ],
  "jali-screens": [
    { slug: "geometric-star-pattern-jali", name: "Geometric Star Pattern Jali" },
    { slug: "botanical-lotus-lattice-screen", name: "Botanical Lotus Lattice Screen" },
    { slug: "traditional-rajasthani-arch-jali", name: "Traditional Rajasthani Arch Jali" },
    { slug: "modern-slatted-stone-screen", name: "Modern Slatted Stone Screen" }
  ]
};

// Generate designs for all categories
Object.values(categoriesData).forEach((cat) => {
  const customList = specificDesigns[cat.slug];
  const designItems = customList || [
    { slug: `traditional-${cat.slug}`, name: `Traditional ${cat.name}` },
    { slug: `royal-carved-${cat.slug}`, name: `Royal Carved ${cat.name}` },
    { slug: `bespoke-${cat.slug}-sculpture`, name: `Bespoke ${cat.name} Sculpture` },
    { slug: `heritage-${cat.slug}-design`, name: `Heritage ${cat.name} Design` }
  ];

  designItems.forEach((d) => {
    designsData[d.slug] = {
      slug: d.slug,
      name: d.name,
      parentCategory: cat.slug,
      parentSubcategory: cat.parentSubcategory,
      parentCollection: cat.parentCollection,
      shortDescription: `Hand-carved ${d.name} crafted by master artisans in Jaipur.`,
      detailedDescription: `[DETAILED DESCRIPTION PLACEHOLDER: Hand-carved ${d.name} from solid stone block. Detailed masonic chiseling and finishing according to client specification.]`,
      imageSrc: `https://placehold.co/800x600/E8E4DF/1A1918?text=${encodeURIComponent(d.name)}`,
      imageGallery: [
        `https://placehold.co/800x600/E8E4DF/1A1918?text=${encodeURIComponent(d.name)}+View+1`,
        `https://placehold.co/800x600/E8E4DF/1A1918?text=${encodeURIComponent(d.name)}+View+2`,
        `https://placehold.co/800x600/E8E4DF/1A1918?text=${encodeURIComponent(d.name)}+View+3`
      ],
      variants: {
        materials: ["White Makrana Marble", "Pink Bansi Sandstone", "Black Marble", "Beige Limestone"],
        sizes: ["Small (2ft)", "Medium (3.5ft)", "Large (5ft)", "Custom Dimension"],
        finishes: ["Natural Matte", "Polished High-Gloss", "Antique Honed"],
        colours: ["Natural White", "Pink/Beige", "Black"]
      }
    };
  });
});

export function getDesign(categorySlug, designSlug) {
  const item = designsData[designSlug];
  if (item && item.parentCategory === categorySlug) {
    return item;
  }
  return null;
}

export function getDesignsByCategory(categorySlug) {
  return Object.values(designsData).filter((d) => d.parentCategory === categorySlug);
}
