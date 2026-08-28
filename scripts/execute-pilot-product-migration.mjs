import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "jaipur_stonecraft.db");
const db = new Database(dbPath);

console.log("=== EXECUTING PHASE 5 REAL PRODUCT PILOT MIGRATION ===");

const pilotProducts = [
  {
    slug: "blessing-ganesh-statue",
    name: "White Makrana Marble Blessing Ganesha Statue",
    sku: "JSC-GAN-001",
    status: "published",
    is_featured: 1,
    is_new_arrival: 1,
    is_custom_only: 0,
    product_type: "statue",
    parent_collection: "sculptures-statues",
    parent_subcategory: "hindu-sculptures",
    parent_category: "ganesh-ji",
    subject_id: "ganesh",
    primary_material_id: "makrana-pure-white",
    short_description: "Hand-carved Lord Ganesha statue sculpted from a single solid block of pure Makrana white marble by master stone artisans in Jaipur.",
    detailed_description: "Sculpted according to Shilpa Shastra proportion guidelines, this Ganesha murti features delicate mukut (crown) chiseling, intricate jewelry details, and a polished matte finish. Ideal for home mandir shrines or luxury entrance foyers.",
    attributes: JSON.stringify({
      productFamily: "Seated Ganesha",
      stoneVariety: "Makrana Pure White Marble",
      finish: "Hand Honed (Natural Matte)",
      customizationAvailable: true,
      availabilityStatus: "made_to_order",
      intendedApplication: "Home Temple & Luxury Foyer",
      dimensions: { heightInches: 24, widthInches: 16, depthInches: 10 }
    }),
    tags: JSON.stringify(["Single-Block-Marble", "Hand-Carved-Jaipur", "Makrana-White"]),
    seo: JSON.stringify({
      title: "White Makrana Marble Blessing Ganesha Statue | Jaipur Stonecraft",
      description: "Hand-carved Lord Ganesha statue sculpted from solid Makrana white marble in Jaipur. Custom sizing and worldwide delivery available.",
      primaryKeyword: "White Makrana Marble Ganesh Statue",
      secondaryKeywords: ["Marble Ganesh Murti", "Jaipur Stone Ganesha", "Hand Carved Deity Statue"],
      canonicalUrl: "https://jaipurstonecraft.com/designs/ganesh-ji/blessing-ganesh-statue",
      indexable: true
    })
  },
  {
    slug: "traditional-seated-ganesh",
    name: "Classic Seated Ganesha in Bansi Paharpur Pink Sandstone",
    sku: "JSC-GAN-002",
    status: "published",
    is_featured: 1,
    is_new_arrival: 0,
    is_custom_only: 0,
    product_type: "statue",
    parent_collection: "sculptures-statues",
    parent_subcategory: "hindu-sculptures",
    parent_category: "ganesh-ji",
    subject_id: "ganesh",
    primary_material_id: "bansi-paharpur-pink",
    short_description: "Warm blush pink sandstone Ganesha idol carved with traditional heritage motifs for sacred garden sanctuaries and courtyard altars.",
    detailed_description: "Crafted from authentic Bansi Paharpur pink sandstone sourced from Rajasthan. Features weather-resistant masonic relief carving, making it perfect for exterior landscape sanctuaries or heritage stone shrines.",
    attributes: JSON.stringify({
      productFamily: "Seated Ganesha",
      stoneVariety: "Bansi Paharpur Pink Sandstone",
      finish: "Natural Masonic Chiseled",
      customizationAvailable: true,
      availabilityStatus: "made_to_order",
      intendedApplication: "Exterior Landscape & Heritage Altar",
      dimensions: { heightInches: 36, widthInches: 22, depthInches: 14 }
    }),
    tags: JSON.stringify(["Pink-Sandstone", "Bansi-Paharpur", "Courtyard-Statue"]),
    seo: JSON.stringify({
      title: "Classic Pink Sandstone Seated Ganesha Idol | Jaipur Stonecraft",
      description: "Hand-chiseled Bansi Paharpur pink sandstone Ganesha statue for exterior landscape shrines and home gardens. Sourced and carved in Rajasthan.",
      primaryKeyword: "Pink Sandstone Ganesha Statue",
      secondaryKeywords: ["Bansi Paharpur Sandstone Idol", "Garden Ganesha Sculpture"],
      canonicalUrl: "https://jaipurstonecraft.com/designs/ganesh-ji/traditional-seated-ganesh",
      indexable: true
    })
  },
  {
    slug: "flute-playing-krishna",
    name: "Radha Krishna Jugal Jodi White Marble Sculpture",
    sku: "JSC-KRI-001",
    status: "published",
    is_featured: 1,
    is_new_arrival: 1,
    is_custom_only: 0,
    product_type: "statue",
    parent_collection: "sculptures-statues",
    parent_subcategory: "hindu-sculptures",
    parent_category: "krishna-ji",
    subject_id: "krishna",
    primary_material_id: "makrana-pure-white",
    short_description: "Exquisite divine Radha Krishna Jugal Jodi statue carved from translucent Makrana white marble depicting Muralidhar playing his flute.",
    detailed_description: "Hand-carved with fine facial expression, flowing garments, peacock feather motif, and subtle hand-painted accents. Formulated according to classical Vrindavan iconography standards.",
    attributes: JSON.stringify({
      productFamily: "Radha Krishna",
      stoneVariety: "Makrana Pure White Marble",
      finish: "Mirror Polished (High Gloss)",
      customizationAvailable: true,
      availabilityStatus: "ready_stock",
      intendedApplication: "Home Shrine & Sacred Prayer Room",
      dimensions: { heightInches: 30, widthInches: 18, depthInches: 10 }
    }),
    tags: JSON.stringify(["Radha-Krishna", "Makrana-White", "Jugal-Jodi", "Hand-Carved"]),
    seo: JSON.stringify({
      title: "Radha Krishna Jugal Jodi White Marble Sculpture | Jaipur Stonecraft",
      description: "Hand-carved divine Radha Krishna statue in pure Makrana white marble. Features intricate peacock feather chiseling and glossy mirror finish.",
      primaryKeyword: "Radha Krishna Marble Statue",
      secondaryKeywords: ["Makrana Krishna Murti", "Jugal Jodi Marble Idol"],
      canonicalUrl: "https://jaipurstonecraft.com/designs/krishna-ji/flute-playing-krishna",
      indexable: true
    })
  },
  {
    slug: "geometric-star-pattern-jali",
    name: "Hand-Carved Stone Jali & Lattice Architectural Screen",
    sku: "JSC-JAL-001",
    status: "published",
    is_featured: 1,
    is_new_arrival: 0,
    is_custom_only: 1,
    product_type: "architectural_element",
    parent_collection: "wall-art-reliefs",
    parent_subcategory: "jali-screens-panels",
    parent_category: "jali-screens",
    subject_id: null,
    primary_material_id: "bansi-paharpur-pink",
    short_description: "Traditional geometric star-pattern stone jali screen hand-pierced by master stone carvers for luxury facade ventilation and interior dividers.",
    detailed_description: "Custom geometric lattice panel carved from solid Rajasthan sandstone blocks. Filters sunlight while allowing natural air circulation for architectural courtyards, balcony screens, or pooja room partitions.",
    attributes: JSON.stringify({
      productFamily: "Geometric Jali",
      stoneVariety: "Bansi Paharpur Pink Sandstone",
      finish: "Hand Honed (Natural Matte)",
      customizationAvailable: true,
      availabilityStatus: "made_to_order",
      intendedApplication: "Architectural Facade & Room Partition",
      dimensions: { heightInches: 48, widthInches: 24, depthInches: 3 }
    }),
    tags: JSON.stringify(["Stone-Jali", "Architectural-Screen", "Lattice-Panel", "Bansi-Pink"]),
    seo: JSON.stringify({
      title: "Hand-Carved Stone Jali & Lattice Screen | Jaipur Stonecraft",
      description: "Custom hand-pierced sandstone lattice jali screen for architectural facades, courtyard windows, and pooja partitions. Custom dimensions available.",
      primaryKeyword: "Stone Jali Screen",
      secondaryKeywords: ["Carved Sandstone Lattice", "Architectural Stone Partition"],
      canonicalUrl: "https://jaipurstonecraft.com/designs/jali-screens/geometric-star-pattern-jali",
      indexable: true
    })
  },
  {
    slug: "botanical-lotus-lattice-screen",
    name: "White Marble Floral Lotus Jali Panel",
    sku: "JSC-JAL-002",
    status: "published",
    is_featured: 1,
    is_new_arrival: 1,
    is_custom_only: 1,
    product_type: "architectural_element",
    parent_collection: "wall-art-reliefs",
    parent_subcategory: "jali-screens-panels",
    parent_category: "jali-screens",
    subject_id: null,
    primary_material_id: "makrana-pure-white",
    short_description: "Elegant botanical lotus pattern jali panel hand-carved from white Makrana marble for sacred mandir backdrops and luxury window screens.",
    detailed_description: "Precision-pierced floral lattice screen featuring intricate lotus petal cutouts and honed smooth edges. Provides light diffusion for mandir walls, spa screens, or decorative wall art.",
    attributes: JSON.stringify({
      productFamily: "Floral Lattice",
      stoneVariety: "Makrana Pure White Marble",
      finish: "Hand Honed (Natural Matte)",
      customizationAvailable: true,
      availabilityStatus: "made_to_order",
      intendedApplication: "Mandir Altar Wall & Spa Divider",
      dimensions: { heightInches: 36, widthInches: 24, depthInches: 2.5 }
    }),
    tags: JSON.stringify(["Marble-Jali", "Lotus-Screen", "Floral-Lattice", "Makrana"]),
    seo: JSON.stringify({
      title: "White Marble Floral Lotus Jali Panel | Jaipur Stonecraft",
      description: "Hand-carved white Makrana marble lotus jali screen for home mandir backdrops and luxury architectural partitions. Sourced and crafted in Jaipur.",
      primaryKeyword: "Marble Lotus Jali",
      secondaryKeywords: ["White Marble Screen", "Floral Carved Stone Panel"],
      canonicalUrl: "https://jaipurstonecraft.com/designs/jali-screens/botanical-lotus-lattice-screen",
      indexable: true
    })
  }
];

// Update or Upsert pilot products in SQLite database
const updateStmt = db.prepare(`
  UPDATE products
  SET name = ?, sku = ?, status = ?, is_featured = ?, is_new_arrival = ?, is_custom_only = ?,
      product_type = ?, parent_collection = ?, parent_subcategory = ?, parent_category = ?,
      subject_id = ?, primary_material_id = ?, short_description = ?, detailed_description = ?,
      attributes = ?, tags = ?, seo = ?, updated_at = CURRENT_TIMESTAMP
  WHERE slug = ?
`);

pilotProducts.forEach((p) => {
  const result = updateStmt.run(
    p.name, p.sku, p.status, p.is_featured, p.is_new_arrival, p.is_custom_only,
    p.product_type, p.parent_collection, p.parent_subcategory, p.parent_category,
    p.subject_id, p.primary_material_id, p.short_description, p.detailed_description,
    p.attributes, p.tags, p.seo, p.slug
  );
  console.log(`- Updated pilot product [${p.slug}]: ${result.changes} row(s) updated.`);
});

console.log("\n=== PILOT PRODUCT MIGRATION COMPLETE ===");
db.close();
