import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Define approved target subcategories
const TARGET_SUBCATEGORIES = [
  // Temples & Architectural Stonework
  {
    id: "temples-architectural-stonework-mandir-temple",
    slug: "mandir-temple",
    parentCollection: "temples-architectural-stonework",
    name: "Mandir & Temple",
    description: "Handcrafted marble home mandirs, temple architecture, and sacred pooja room stonework.",
    imageSrc: "/images/creations/marble-home-mandir.jpg",
    sortOrder: 1
  },
  {
    id: "temples-architectural-stonework-jali",
    slug: "jali",
    parentCollection: "temples-architectural-stonework",
    name: "Jali",
    description: "Perforated stone lattice screens for partitions, balconies, facades, and windows.",
    imageSrc: "/images/collections/architectural.webp",
    sortOrder: 2
  },
  {
    id: "temples-architectural-stonework-pillars-columns",
    slug: "pillars-columns",
    parentCollection: "temples-architectural-stonework",
    name: "Pillars & Columns",
    description: "Hand-carved marble pillars, structural stone columns, torans, and architectural arches.",
    imageSrc: "/images/collections/temples-architectural.webp",
    sortOrder: 3
  },
  {
    id: "temples-architectural-stonework-other-temple-stone-parts",
    slug: "other-temple-stone-parts",
    parentCollection: "temples-architectural-stonework",
    name: "Other Temple & Stone Parts",
    description: "Traditional stone jharokhas, heritage balconies, chhatri pavilions, and architectural stonework.",
    imageSrc: "/images/collections/architectural.webp",
    sortOrder: 4
  },

  // Wall Art & Reliefs
  {
    id: "wall-art-reliefs-wall-murals",
    slug: "wall-murals",
    parentCollection: "wall-art-reliefs",
    name: "Wall Murals",
    description: "Grand spiritual and devotional stone wall murals hand-carved in high relief.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    sortOrder: 1
  },
  {
    id: "wall-art-reliefs-relief-panels",
    slug: "relief-panels",
    parentCollection: "wall-art-reliefs",
    name: "Stone Relief Panels",
    description: "Intricately carved stone relief panels, botanical carvings, and decorative wall art.",
    imageSrc: "/images/collections/luxury.webp",
    sortOrder: 2
  },
  {
    id: "wall-art-reliefs-custom-wall-art",
    slug: "custom-wall-art",
    parentCollection: "wall-art-reliefs",
    name: "Custom Wall Art",
    description: "Bespoke architectural feature walls, custom crests, and commission murals.",
    imageSrc: "/images/collections/custom.webp",
    sortOrder: 3
  },

  // Fountains & Water Features
  {
    id: "fountains-water-features-tiered-fountains",
    slug: "tiered-fountains",
    parentCollection: "fountains-water-features",
    name: "Tiered Fountains",
    description: "Classical multi-tier marble and stone water fountains for gardens and courtyards.",
    imageSrc: "/images/collections/luxury.webp",
    sortOrder: 1
  },
  {
    id: "fountains-water-features-garden-fountains",
    slug: "garden-fountains",
    parentCollection: "fountains-water-features",
    name: "Garden Fountains",
    description: "Freestanding courtyard stone fountains, lotus basins, and sculptural water features.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    sortOrder: 2
  },
  {
    id: "fountains-water-features-wall-fountains",
    slug: "wall-fountains",
    parentCollection: "fountains-water-features",
    name: "Wall Fountains",
    description: "Stone water walls, spout fountains, and poolside waterfalls for architectural installations.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    sortOrder: 3
  },

  // Decorative Stone Art
  {
    id: "decorative-stone-art-planters-tulsi-pots",
    slug: "planters-tulsi-pots",
    parentCollection: "decorative-stone-art",
    name: "Marble & Stone Planters & Tulsi Pots",
    description: "Hand-carved marble and sandstone planters, garden urns, and sacred Tulsi pots.",
    imageSrc: "/images/collections/sacred.webp",
    sortOrder: 1
  },
  {
    id: "decorative-stone-art-pedestals-stands",
    slug: "pedestals-stands",
    parentCollection: "decorative-stone-art",
    name: "Marble Pedestals & Stands",
    description: "Architectural display pedestals, statue plinths, and carved stone bases.",
    imageSrc: "/images/collections/temples-architectural.webp",
    sortOrder: 2
  },
  {
    id: "decorative-stone-art-decorative-accents",
    slug: "decorative-accents",
    parentCollection: "decorative-stone-art",
    name: "Decorative Accents",
    description: "Stone decorative items and outdoor artistic elements awaiting catalogue review.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    sortOrder: 3
  }
];

// Define approved target categories
const TARGET_CATEGORIES = [
  // B1. Mandir & Temple
  {
    id: "small-marble-mandir-for-home",
    slug: "small-marble-mandir-for-home",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "mandir-temple",
    name: "Small Marble Mandir for Home",
    description: "Hand-carved compact and wall-mounted white marble temples designed for home pooja rooms and apartments.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Small+Marble+Mandir",
    imageAlt: "Small Marble Mandir for Home hand-carved in Makrana marble",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "floor-standing-marble-mandir",
    slug: "floor-standing-marble-mandir",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "mandir-temple",
    name: "Floor-Standing Marble Mandir",
    description: "Freestanding floor-placed marble mandirs with intricate carved pillars, shikharas, and storage drawers.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Floor-Standing+Mandir",
    imageAlt: "Floor-Standing Marble Mandir hand-carved in Jaipur",
    featured: 1,
    sortOrder: 2
  },
  {
    id: "large-marble-temple",
    slug: "large-marble-temple",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "mandir-temple",
    name: "Large Marble Temple",
    description: "Grand architectural marble temples with multi-tier domes, pillared mandapas, and sanctum sanctorum.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Large+Marble+Temple",
    imageAlt: "Large Marble Temple architectural structure in Makrana marble",
    featured: 1,
    sortOrder: 3
  },
  {
    id: "temple-parts-designs",
    slug: "temple-parts-designs",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "mandir-temple",
    name: "Temple Parts & Designs",
    description: "Individual architectural temple components including shikharas, garbhagriha designs, mandapa pillars, and pooja room panels.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Temple+Parts",
    imageAlt: "Temple Parts and Architectural Designs hand-carved in Jaipur",
    featured: 0,
    sortOrder: 4
  },

  // B2. Jali
  {
    id: "marble-jali-designs",
    slug: "marble-jali-designs",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali",
    name: "Marble Jali Designs",
    description: "Intricately perforated white marble jali panels hand-pierced by master artisans for sacred and architectural installations.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Marble+Jali+Designs",
    imageAlt: "Marble Jali Designs carved in Makrana white marble",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "balcony-staircase-jali",
    slug: "balcony-staircase-jali",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali",
    name: "Balcony & Staircase Jali",
    description: "Architectural stone lattice screens engineered for balcony railings, staircase balustrades, and parapets.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Balcony+Jali",
    imageAlt: "Balcony and Staircase Jali architectural screen",
    featured: 0,
    sortOrder: 2
  },
  {
    id: "jali-for-partitions",
    slug: "jali-for-partitions",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali",
    name: "Jali for Partitions",
    description: "Freestanding and floor-to-ceiling stone jali screens designed for room dividers and ventilation walls.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Jali+Partitions",
    imageAlt: "Stone Jali for Partitions and Space Dividers",
    featured: 1,
    sortOrder: 3
  },
  {
    id: "window-jali",
    slug: "window-jali",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali",
    name: "Window Jali",
    description: "Hand-carved decorative stone jali screens for window openings, providing natural light, air flow, and privacy.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Window+Jali",
    imageAlt: "Window Jali perforated stone architectural screen",
    featured: 0,
    sortOrder: 4
  },

  // B3. Pillars & Columns
  {
    id: "marble-pillars",
    slug: "marble-pillars",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "pillars-columns",
    name: "Marble Pillars",
    description: "Solid Makrana white marble pillars carved with traditional fluted, floral, and heritage temple motifs.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Marble+Pillars",
    imageAlt: "Hand-carved Marble Pillars in Makrana white marble",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "stone-pillars",
    slug: "stone-pillars",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "pillars-columns",
    name: "Stone Pillars",
    description: "Architectural sandstone and limestone columns for exterior porticos, verandas, and structural colonnades.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Stone+Pillars",
    imageAlt: "Architectural Stone Pillars in Bansi Paharpur sandstone",
    featured: 0,
    sortOrder: 2
  },
  {
    id: "decorative-pillars",
    slug: "decorative-pillars",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "pillars-columns",
    name: "Decorative Pillars",
    description: "Ornamental carved stone pillars featuring decorative capitals, bases, and intricate relief patterns.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Decorative+Pillars",
    imageAlt: "Ornamental Decorative Pillars hand-carved in stone",
    featured: 0,
    sortOrder: 3
  },
  {
    id: "stone-arches-door-frames",
    slug: "stone-arches-door-frames",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "pillars-columns",
    name: "Stone Arches & Door Frames",
    description: "Carved stone torans, entrance archways, portico carvings, and ornamental temple door frames.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Stone+Arches",
    imageAlt: "Stone Arches and Door Frames hand-carved in Rajasthan stone",
    featured: 1,
    sortOrder: 4
  },

  // B4. Other Temple & Stone Parts
  {
    id: "jharokhas-windows",
    slug: "jharokhas-windows",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "other-temple-stone-parts",
    name: "Stone Jharokhas & Windows",
    description: "Traditional Rajasthani stone jharokhas, oriel balcony windows, and heritage stone fenestrations.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Stone+Jharokhas",
    imageAlt: "Stone Jharokhas and Heritage Window Balconies",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "gazebo-sculptural-elements",
    slug: "gazebo-sculptural-elements",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "other-temple-stone-parts",
    name: "Gazebo & Pavilion Elements",
    description: "Architectural stone chhatri domes, pavilion brackets, pillar balusters, and gazebo carvings.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Gazebo+Elements",
    imageAlt: "Carved Stone Gazebo and Pavilion Elements",
    featured: 0,
    sortOrder: 2
  },

  // Wall Art & Reliefs
  {
    id: "religious-wall-murals",
    slug: "religious-wall-murals",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "wall-murals",
    name: "Religious Wall Murals",
    description: "Monumental devotional wall murals depicting temple deities, sacred narratives, and spiritual symbology.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Religious+Wall+Murals",
    imageAlt: "Religious Wall Murals hand-carved in Rajasthan stone",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "stone-relief-panels",
    slug: "stone-relief-panels",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "relief-panels",
    name: "Stone Relief Panels",
    description: "Deep carved stone relief panels including heritage Rajasthani court scenes, mandalas, geometric, and textured feature walls.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Stone+Relief+Panels",
    imageAlt: "Carved Stone Relief Panels sculpted in Jaipur atelier",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "floral-nature-wall-panels",
    slug: "floral-nature-wall-panels",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "relief-panels",
    name: "Floral & Nature Wall Panels",
    description: "Botanical and natural stone wall carvings featuring the sacred Tree of Life, lotus blossoms, and delicate floral relief patterns.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Floral+Wall+Panels",
    imageAlt: "Floral and Nature Stone Wall Panels in high relief",
    featured: 1,
    sortOrder: 2
  },
  {
    id: "architectural-accent-murals",
    slug: "architectural-accent-murals",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "custom-wall-art",
    name: "Architectural Accent Murals",
    description: "Custom architectural stone feature walls and decorative murals for luxury residences and hotels.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Accent+Murals",
    imageAlt: "Architectural Accent Murals custom carved in stone",
    featured: 0,
    sortOrder: 1
  },

  // Fountains & Water Features
  {
    id: "tiered-fountains",
    slug: "tiered-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "tiered-fountains",
    name: "Tiered Fountains",
    description: "Multi-tiered hand-carved marble and sandstone fountains with scalloped bowls, water spouts, and pedestal bases.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Tiered+Fountains",
    imageAlt: "Multi-Tiered Marble Water Fountains",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "garden-fountains",
    slug: "garden-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "garden-fountains",
    name: "Garden Fountains",
    description: "Courtyard centerpiece stone fountains, lotus basin water bodies, and sculptural garden water fountains.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Garden+Fountains",
    imageAlt: "Outdoor Garden Fountains in natural stone",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "wall-fountains",
    slug: "wall-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "wall-fountains",
    name: "Wall Fountains",
    description: "Architectural stone water walls, cascading stone waterfalls, and lion-head spouts for wall installations.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Wall+Fountains",
    imageAlt: "Carved Stone Wall Fountains and Cascades",
    featured: 1,
    sortOrder: 1
  },

  // Decorative Stone Art
  {
    id: "marble-stone-planters",
    slug: "marble-stone-planters",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "planters-tulsi-pots",
    name: "Marble & Stone Planters",
    description: "Hand-carved marble and sandstone planters, fluted pots, and horticultural stone urns for interior and landscape design.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Stone+Planters",
    imageAlt: "Hand-carved Marble and Stone Planters",
    featured: 1,
    sortOrder: 1
  },
  {
    id: "marble-tulsi-pots",
    slug: "marble-tulsi-pots",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "planters-tulsi-pots",
    name: "Marble Tulsi Pots",
    description: "Traditional sacred white marble Tulsi Kyaras and Mandap planters intricately carved for home courtyards and terraces.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Marble+Tulsi+Pots",
    imageAlt: "Sacred Marble Tulsi Pots and Kyaras in Makrana marble",
    featured: 1,
    sortOrder: 2
  },
  {
    id: "marble-pedestals-stands",
    slug: "marble-pedestals-stands",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "pedestals-stands",
    name: "Marble Pedestals & Stands",
    description: "Fluted, square, and octagonal display pedestals, statue plinths, and carved stone display stands.",
    imageSrc: "https://placehold.co/800x500/E8E4DF/1A1918?text=Marble+Pedestals",
    imageAlt: "Hand-carved Marble Pedestals and Display Stands",
    featured: 1,
    sortOrder: 1
  }
];

async function executeMigration() {
  const connectionString = process.env.DATABASE_URL || "";
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing.");
  }

  const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(connectionString);
  const sanitizedUri = connectionString.replace(/[?&]ssl-mode=[^&]+/i, "");

  console.log("Connecting to Database for Phase 4 Execution...");
  const conn = await mysql.createConnection({
    uri: sanitizedUri,
    ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 10000
  });

  const mapping = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "migration-mapping.json"), "utf8"));

  try {
    console.log("Starting Transaction...");
    await conn.beginTransaction();

    // 1. Upsert target subcategories
    console.log(`Upserting ${TARGET_SUBCATEGORIES.length} target subcategories...`);
    for (const sub of TARGET_SUBCATEGORIES) {
      await conn.query(`
        INSERT INTO subcategories (id, slug, parent_collection_slug, name, description, image_src, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          description = VALUES(description),
          parent_collection_slug = VALUES(parent_collection_slug),
          sort_order = VALUES(sort_order),
          is_active = 1
      `, [sub.id, sub.slug, sub.parentCollection, sub.name, sub.description, sub.imageSrc, sub.sortOrder]);
    }

    // 2. Upsert target categories
    console.log(`Upserting ${TARGET_CATEGORIES.length} target categories...`);
    for (const cat of TARGET_CATEGORIES) {
      await conn.query(`
        INSERT INTO categories (id, slug, parent_collection_slug, parent_subcategory_slug, name, description, image_src, image_alt, featured, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          parent_collection_slug = VALUES(parent_collection_slug),
          parent_subcategory_slug = VALUES(parent_subcategory_slug),
          description = VALUES(description),
          image_src = VALUES(image_src),
          image_alt = VALUES(image_alt),
          featured = VALUES(featured),
          sort_order = VALUES(sort_order),
          is_active = 1
      `, [cat.id, cat.slug, cat.parentCollection, cat.parentSubcategory, cat.name, cat.description, cat.imageSrc, cat.imageAlt, cat.featured, cat.sortOrder]);
    }

    // 3. Update products according to mapping
    console.log(`Applying product reassignments for ${mapping.length} audited products...`);
    let reassignedCount = 0;
    let protectedCount = 0;
    let retainedCustomCount = 0;
    let exceptionCount = 0;

    for (const m of mapping) {
      if (m.action === "RETAIN_PROTECTED") {
        protectedCount++;
        continue; // DO NOT TOUCH
      }

      if (m.action === "REASSIGN") {
        await conn.query(`
          UPDATE products
          SET parent_collection = ?, parent_subcategory = ?, parent_category = ?, updated_at = NOW()
          WHERE id = ?
        `, [m.targetCollection, m.targetSubcategory, m.targetCategory, m.productId]);
        reassignedCount++;
      } else if (m.action === "RETAIN_CORRECT") {
        retainedCustomCount++;
      } else if (m.action === "AWAITING_BUSINESS_VERIFICATION") {
        // Update parent subcategory to decorative-accents
        await conn.query(`
          UPDATE products
          SET parent_subcategory = ?, updated_at = NOW()
          WHERE id = ?
        `, [m.targetSubcategory, m.productId]);
        exceptionCount++;
      }
    }

    console.log(`Reassigned products: ${reassignedCount}`);
    console.log(`Protected statues verified untouched: ${protectedCount}`);
    console.log(`Retained custom products: ${retainedCustomCount}`);
    console.log(`Exception review products: ${exceptionCount}`);

    // 4. Mark superseded legacy categories as is_active = 0 so they don't pollute navigation
    const targetCategorySlugs = new Set([
      ...TARGET_CATEGORIES.map(c => c.slug),
      // Keep protected statue categories
      "sai-baba", "ganesh-ji", "krishna-ji", "shiva-ji", "hanuman-ji", "radha-krishna", "durga-ji", "lakshmi-ji", "saraswati-ji",
      "ram-darbar", "vishnu-ji", "lakshmi-narayan", "jagannath", "kartikeya", "parvati-ji", "nandi", "other-deities", "modi-ji",
      "buddha-statues", "mahavira-statues", "tirthankara-sculptures", "meditating-buddha", "reclining-buddha",
      "bespoke-portrait-busts", "full-body-figures", "cultural-tribal-figures", "artisan-figures",
      "abstract-form-sculptures", "contemporary-stone-art", "roman-greek-figures", "modernist-carvings",
      "elephants", "lions", "peacocks", "horses", "swans", "custom-animal-figures",
      // Keep custom creations categories
      "bespoke-deity-statues", "custom-monumental-sculptures", "commissioned-statuary",
      "lifesize-memorial-busts", "ancestral-portrait-carvings", "commemorative-reliefs",
      "full-temple-construction", "luxury-estate-stonework", "bespoke-heritage-restoration",
      // Exception categories awaiting review
      "benches-seating", "garden-lanterns-lamps", "carved-stone-vases", "decorative-bowls", "marble-urns", "artisan-accessories", "tabletop-statuettes"
    ]);

    const [allDbCats] = await conn.query("SELECT id, slug, name, parent_collection_slug FROM categories");
    let deactivatedCount = 0;
    for (const cat of allDbCats) {
      if (cat.parent_collection_slug !== "sculptures-statues" && !targetCategorySlugs.has(cat.slug)) {
        await conn.query("UPDATE categories SET is_active = 0 WHERE id = ?", [cat.id]);
        deactivatedCount++;
      }
    }
    console.log(`Deactivated ${deactivatedCount} superseded legacy categories.`);

    // 5. Verification checks within transaction
    const [finalTotalRes] = await conn.query("SELECT COUNT(*) as cnt FROM products");
    const [finalSculptRes] = await conn.query("SELECT COUNT(*) as cnt FROM products WHERE parent_collection = 'sculptures-statues'");
    const [finalNonSculptRes] = await conn.query("SELECT COUNT(*) as cnt FROM products WHERE parent_collection != 'sculptures-statues'");

    console.log(`Verification: Total Products in DB = ${finalTotalRes[0].cnt} (Expected 320)`);
    console.log(`Verification: Sculptures & Statues = ${finalSculptRes[0].cnt} (Expected 127)`);
    console.log(`Verification: Non-Sculptures = ${finalNonSculptRes[0].cnt} (Expected 193)`);

    if (finalTotalRes[0].cnt !== 320 || finalSculptRes[0].cnt !== 127) {
      throw new Error("Integrity check failed! Total or statue count mismatch. Rolling back.");
    }

    await conn.commit();
    console.log("✅ Transaction committed successfully! Database migration complete.");
  } catch (err) {
    console.error("Migration error, rolling back:", err);
    await conn.rollback();
    process.exit(1);
  } finally {
    await conn.end();
  }
}

executeMigration().catch(e => {
  console.error("Execution failed:", e);
  process.exit(1);
});
