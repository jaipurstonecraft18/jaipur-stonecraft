import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is missing.");
  process.exit(1);
}

// Approved subcategories according to Master Specification Section 3
const APPROVED_SUBCATEGORIES = [
  // 1. Sculptures & Statues is PROTECTED — we only list here for reference/validation, NEVER modified
  // 2. Wall Art & Reliefs
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
    id: "wall-art-reliefs-religious-reliefs",
    slug: "religious-reliefs",
    parentCollection: "wall-art-reliefs",
    name: "Religious Reliefs",
    description: "Carved religious wall artwork, deity-themed reliefs, and devotional stone narrative relief panels.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    sortOrder: 2
  },
  {
    id: "wall-art-reliefs-stone-relief-panels",
    slug: "stone-relief-panels",
    parentCollection: "wall-art-reliefs",
    name: "Stone Relief Panels",
    description: "Intricately carved stone relief panels, botanical carvings, geometric walls, and heritage art.",
    imageSrc: "/images/collections/luxury.webp",
    sortOrder: 3
  },

  // 3. Temples & Architectural Stonework
  {
    id: "temples-architectural-stonework-mandirs-temples",
    slug: "mandirs-temples",
    parentCollection: "temples-architectural-stonework",
    name: "Mandirs & Temples",
    description: "Handcrafted marble home mandirs, temple architecture, and sacred pooja room stonework.",
    imageSrc: "/images/creations/marble-home-mandir.jpg",
    sortOrder: 1
  },
  {
    id: "temples-architectural-stonework-jali-designs",
    slug: "jali-designs",
    parentCollection: "temples-architectural-stonework",
    name: "Jali Designs",
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
    id: "temples-architectural-stonework-architectural-components",
    slug: "architectural-components",
    parentCollection: "temples-architectural-stonework",
    name: "Architectural Components",
    description: "Traditional stone jharokhas, heritage balconies, chhatri gazebos, and structural components.",
    imageSrc: "/images/collections/architectural.webp",
    sortOrder: 4
  },

  // 4. Fountains & Water Features
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
    id: "fountains-water-features-wall-fountains",
    slug: "wall-fountains",
    parentCollection: "fountains-water-features",
    name: "Wall Fountains",
    description: "Stone water walls, spout fountains, and poolside waterfalls for architectural installations.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    sortOrder: 2
  },
  {
    id: "fountains-water-features-freestanding-fountains",
    slug: "freestanding-fountains",
    parentCollection: "fountains-water-features",
    name: "Freestanding Fountains",
    description: "Freestanding courtyard stone fountains, lotus basins, and sculptural water features.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    sortOrder: 3
  },

  // 5. Decorative Stone Art
  {
    id: "decorative-stone-art-planters",
    slug: "planters",
    parentCollection: "decorative-stone-art",
    name: "Planters",
    description: "Hand-carved marble and sandstone planters, garden urns, and landscape stone vessels.",
    imageSrc: "/images/collections/sacred.webp",
    sortOrder: 1
  },
  {
    id: "decorative-stone-art-tulsi-pots",
    slug: "tulsi-pots",
    parentCollection: "decorative-stone-art",
    name: "Tulsi Pots",
    description: "Sacred white marble and natural sandstone carved Tulsi pots for devotional home mandirs.",
    imageSrc: "/images/collections/sacred.webp",
    sortOrder: 2
  },
  {
    id: "decorative-stone-art-pedestals-stands",
    slug: "pedestals-stands",
    parentCollection: "decorative-stone-art",
    name: "Pedestals & Stands",
    description: "Architectural display pedestals, statue plinths, and carved stone bases.",
    imageSrc: "/images/collections/temples-architectural.webp",
    sortOrder: 3
  },

  // 6. Custom & Bespoke Creations
  {
    id: "custom-bespoke-creations-custom-architectural-stonework",
    slug: "custom-architectural-stonework",
    parentCollection: "custom-bespoke-creations",
    name: "Custom Architectural Stonework",
    description: "Full temple design and carving, luxury estate stonework, and heritage restoration.",
    imageSrc: "/images/collections/architectural.webp",
    sortOrder: 1
  },
  {
    id: "custom-bespoke-creations-custom-wall-art-reliefs",
    slug: "custom-wall-art-reliefs",
    parentCollection: "custom-bespoke-creations",
    name: "Custom Wall Art & Reliefs",
    description: "Commissioned architectural feature walls, commemorative reliefs, and bespoke stone murals.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    sortOrder: 2
  }
];

// Target active categories
const APPROVED_CATEGORIES = [
  // Collection 2: Wall Art & Reliefs
  {
    id: "religious-wall-murals",
    slug: "religious-wall-murals",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "wall-murals",
    name: "Religious Wall Murals",
    description: "Devotional stone wall murals depicting sacred narratives and temples.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Religious stone wall murals carved in Jaipur",
    sortOrder: 1
  },
  {
    id: "devotional-relief-panels",
    slug: "devotional-relief-panels",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "religious-reliefs",
    name: "Devotional Relief Panels",
    description: "Hand-carved deity relief panels and sacred spiritual wall carvings.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Devotional relief panels carved in natural stone",
    sortOrder: 1
  },
  {
    id: "stone-relief-panels",
    slug: "stone-relief-panels",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "stone-relief-panels",
    name: "Stone Relief Panels",
    description: "Decorative, geometric, and heritage carved stone relief panels.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Stone relief panels handcrafted by master carvers",
    sortOrder: 1
  },
  {
    id: "floral-nature-wall-panels",
    slug: "floral-nature-wall-panels",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "stone-relief-panels",
    name: "Floral & Nature Relief Panels",
    description: "Intricately carved botanical patterns, lotuses, and tree of life panels.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Floral and nature relief panels in marble and sandstone",
    sortOrder: 2
  },

  // Collection 3: Temples & Architectural Stonework
  {
    id: "small-marble-mandir-for-home",
    slug: "small-marble-mandir-for-home",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "mandirs-temples",
    name: "Small Marble Mandir for Home",
    description: "Handcrafted compact and wall-mounted white marble temples designed for home pooja rooms.",
    imageSrc: "/images/creations/marble-home-mandir.jpg",
    imageAlt: "Small Marble Mandir for Home in Makrana white marble",
    sortOrder: 1
  },
  {
    id: "temple-parts-designs",
    slug: "temple-parts-designs",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "mandirs-temples",
    name: "Temple Architecture & Parts",
    description: "Shikharas, domes, sanctum doorways, and sacred architectural components.",
    imageSrc: "/images/collections/temples-architectural.webp",
    imageAlt: "Temple architectural stone elements hand-carved in Jaipur",
    sortOrder: 2
  },
  {
    id: "marble-jali-designs",
    slug: "marble-jali-designs",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali-designs",
    name: "Marble Jali Designs",
    description: "Hand-carved geometric and floral marble lattice screens for interior accents.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Intricate marble jali screen panel",
    sortOrder: 1
  },
  {
    id: "jali-for-partitions",
    slug: "jali-for-partitions",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali-designs",
    name: "Jali for Partitions",
    description: "Architectural stone partition screens for elegant residential and temple dividers.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Stone partition jali screen",
    sortOrder: 2
  },
  {
    id: "balcony-staircase-jali",
    slug: "balcony-staircase-jali",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "jali-designs",
    name: "Balcony & Staircase Jali",
    description: "Durable natural stone lattice balustrades and staircase railings.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Stone balustrade and staircase jali",
    sortOrder: 3
  },
  {
    id: "stone-arches-door-frames",
    slug: "stone-arches-door-frames",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "pillars-columns",
    name: "Stone Arches & Columns",
    description: "Hand-carved marble pillars, structural stone columns, and entrance arches.",
    imageSrc: "/images/collections/temples-architectural.webp",
    imageAlt: "Carved stone columns and arches",
    sortOrder: 1
  },
  {
    id: "jharokhas-windows",
    slug: "jharokhas-windows",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "architectural-components",
    name: "Jharokhas & Traditional Windows",
    description: "Traditional Rajasthani stone jharokha balconies and ornamental windows.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Traditional Rajasthani stone jharokha balcony",
    sortOrder: 1
  },
  {
    id: "gazebo-sculptural-elements",
    slug: "gazebo-sculptural-elements",
    parentCollection: "temples-architectural-stonework",
    parentSubcategory: "architectural-components",
    name: "Chhatri & Gazebo Elements",
    description: "Carved stone chhatri pavilions, domed cupolas, and garden gazebos.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Carved stone garden pavilion and chhatri",
    sortOrder: 2
  },

  // Collection 4: Fountains & Water Features
  {
    id: "tiered-fountains",
    slug: "tiered-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "tiered-fountains",
    name: "Tiered Fountains",
    description: "Multi-tier classical stone water fountains for gardens and courtyards.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Multi-tiered marble water fountain",
    sortOrder: 1
  },
  {
    id: "wall-fountains",
    slug: "wall-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "wall-fountains",
    name: "Wall Fountains",
    description: "Architectural wall fountains, water walls, and stone spouts.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Architectural stone wall fountain",
    sortOrder: 1
  },
  {
    id: "freestanding-fountains",
    slug: "freestanding-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "freestanding-fountains",
    name: "Freestanding Fountains",
    description: "Freestanding courtyard stone fountains, lotus basins, and sculptural water features.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    imageAlt: "Freestanding courtyard stone fountain",
    sortOrder: 1
  },

  // Collection 5: Decorative Stone Art
  {
    id: "marble-stone-planters",
    slug: "marble-stone-planters",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "planters",
    name: "Marble & Stone Planters",
    description: "Hand-carved marble and sandstone planters and outdoor urns.",
    imageSrc: "/images/collections/sacred.webp",
    imageAlt: "Hand-carved marble stone planter",
    sortOrder: 1
  },
  {
    id: "marble-tulsi-pots",
    slug: "marble-tulsi-pots",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "tulsi-pots",
    name: "Marble Tulsi Pots",
    description: "Sacred carved marble Tulsi pots for devotional gardens and courtyards.",
    imageSrc: "/images/collections/sacred.webp",
    imageAlt: "Sacred white marble Tulsi pot",
    sortOrder: 1
  },
  {
    id: "marble-pedestals-stands",
    slug: "marble-pedestals-stands",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "pedestals-stands",
    name: "Marble Pedestals & Stands",
    description: "Carved stone display plinths and statue pedestals.",
    imageSrc: "/images/collections/temples-architectural.webp",
    imageAlt: "Carved marble display pedestal",
    sortOrder: 1
  },

  // Collection 6: Custom & Bespoke Creations
  {
    id: "full-temple-construction",
    slug: "full-temple-construction",
    parentCollection: "custom-bespoke-creations",
    parentSubcategory: "custom-architectural-stonework",
    name: "Full Temple Construction",
    description: "Bespoke full-scale marble and stone temple design, carving, and installation.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Full-scale stone temple construction",
    sortOrder: 1
  },
  {
    id: "luxury-estate-stonework",
    slug: "luxury-estate-stonework",
    parentCollection: "custom-bespoke-creations",
    parentSubcategory: "custom-architectural-stonework",
    name: "Luxury Estate Stonework",
    description: "Custom architectural stonework for private estates, palaces, and luxury villas.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Bespoke estate stonework",
    sortOrder: 2
  },
  {
    id: "bespoke-heritage-restoration",
    slug: "bespoke-heritage-restoration",
    parentCollection: "custom-bespoke-creations",
    parentSubcategory: "custom-architectural-stonework",
    name: "Bespoke Heritage Restoration",
    description: "Historical stone conservation and restoration of heritage architecture.",
    imageSrc: "/images/collections/architectural.webp",
    imageAlt: "Heritage stone restoration carving",
    sortOrder: 3
  },
  {
    id: "commemorative-reliefs",
    slug: "commemorative-reliefs",
    parentCollection: "custom-bespoke-creations",
    parentSubcategory: "custom-wall-art-reliefs",
    name: "Commemorative Reliefs",
    description: "Bespoke commissioned memorial plaques, family crests, and narrative relief art.",
    imageSrc: "/images/collections/custom.webp",
    imageAlt: "Commemorative relief stone panel",
    sortOrder: 1
  }
];

async function main() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — CONTROLLED TAXONOMY MIGRATION");
  console.log("==================================================");

  const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(DATABASE_URL);
  const sanitizedUri = DATABASE_URL.replace(/[?&]ssl-mode=[^&]+/i, "");

  const pool = mysql.createPool({
    uri: sanitizedUri,
    ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 4
  });

  const conn = await pool.getConnection();

  try {
    console.log("\n[1/6] Pre-migration Integrity Baseline Check...");
    const [sculptureBaseline] = await conn.query("SELECT COUNT(*) as count FROM products WHERE parent_collection = 'sculptures-statues'");
    const [totalBaseline] = await conn.query("SELECT COUNT(*) as count FROM products");

    console.log(`- Total baseline products: ${totalBaseline[0].count}`);
    console.log(`- Protected Sculptures & Statues count: ${sculptureBaseline[0].count}`);

    if (sculptureBaseline[0].count !== 127) {
      throw new Error(`Integrity violation: Sculptures & Statues baseline must be exactly 127, found ${sculptureBaseline[0].count}`);
    }
    if (totalBaseline[0].count !== 320) {
      throw new Error(`Integrity violation: Total products baseline must be exactly 320, found ${totalBaseline[0].count}`);
    }

    console.log("✓ Pre-migration baseline verified: 320 products, 127 protected statues.");

    console.log("\n[2/6] Upserting Approved Subcategories in Database...");
    for (const sub of APPROVED_SUBCATEGORIES) {
      const [existing] = await conn.query("SELECT id FROM subcategories WHERE slug = ?", [sub.slug]);
      if (existing.length > 0) {
        await conn.query(`
          UPDATE subcategories SET
            parent_collection_slug = ?,
            name = ?,
            description = ?,
            image_src = ?,
            sort_order = ?,
            is_active = 1
          WHERE slug = ?
        `, [sub.parentCollection, sub.name, sub.description, sub.imageSrc, sub.sortOrder, sub.slug]);
      } else {
        await conn.query(`
          INSERT INTO subcategories (id, slug, parent_collection_slug, name, description, image_src, sort_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `, [sub.id, sub.slug, sub.parentCollection, sub.name, sub.description, sub.imageSrc, sub.sortOrder]);
      }
    }
    console.log(`✓ Synchronized ${APPROVED_SUBCATEGORIES.length} approved subcategories.`);

    console.log("\n[3/6] Upserting Approved Categories in Database...");
    for (const cat of APPROVED_CATEGORIES) {
      const [existing] = await conn.query("SELECT id FROM categories WHERE slug = ?", [cat.slug]);
      if (existing.length > 0) {
        await conn.query(`
          UPDATE categories SET
            parent_collection_slug = ?,
            parent_subcategory_slug = ?,
            name = ?,
            description = ?,
            image_src = ?,
            image_alt = ?,
            sort_order = ?,
            is_active = 1
          WHERE slug = ?
        `, [cat.parentCollection, cat.parentSubcategory, cat.name, cat.description, cat.imageSrc, cat.imageAlt, cat.sortOrder, cat.slug]);
      } else {
        await conn.query(`
          INSERT INTO categories (id, slug, parent_collection_slug, parent_subcategory_slug, name, description, image_src, image_alt, featured, sort_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 1)
        `, [cat.id, cat.slug, cat.parentCollection, cat.parentSubcategory, cat.name, cat.description, cat.imageSrc, cat.imageAlt, cat.sortOrder]);
      }
    }
    console.log(`✓ Synchronized ${APPROVED_CATEGORIES.length} approved categories.`);

    console.log("\n[4/6] Executing Controlled Product Category Reassignments...");

    // A. Wall Art & Reliefs
    // 1. Devotional Relief Panels -> religious-reliefs
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'religious-reliefs',
        parent_category = 'devotional-relief-panels'
      WHERE parent_collection = 'wall-art-reliefs'
        AND (name LIKE '%Devotional Relief%' OR slug LIKE '%devotional-relief%')
    `);

    // 2. Wall Murals -> wall-murals
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'wall-murals',
        parent_category = 'religious-wall-murals'
      WHERE parent_collection = 'wall-art-reliefs'
        AND (name LIKE '%Temple Wall Murals%' OR slug LIKE '%temple-wall-murals%')
    `);

    // 3. General Relief Panels -> stone-relief-panels
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'stone-relief-panels'
      WHERE parent_collection = 'wall-art-reliefs'
        AND parent_subcategory != 'religious-reliefs'
        AND parent_subcategory != 'wall-murals'
    `);

    // B. Temples & Architectural Stonework
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'mandirs-temples'
      WHERE parent_collection = 'temples-architectural-stonework'
        AND parent_subcategory IN ('mandir-temple', 'home-mandirs', 'temple-architecture')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'jali-designs'
      WHERE parent_collection = 'temples-architectural-stonework'
        AND parent_subcategory IN ('jali', 'jali-designs')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'pillars-columns'
      WHERE parent_collection = 'temples-architectural-stonework'
        AND parent_subcategory = 'pillars-columns'
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'architectural-components'
      WHERE parent_collection = 'temples-architectural-stonework'
        AND parent_subcategory IN ('other-temple-stone-parts', 'architectural-elements')
    `);

    // C. Fountains & Water Features
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'freestanding-fountains',
        parent_category = 'freestanding-fountains'
      WHERE parent_collection = 'fountains-water-features'
        AND parent_subcategory IN ('garden-fountains', 'sculptural-fountains', 'classical-fountains')
    `);

    // D. Decorative Stone Art
    // 1. Planters (4 products)
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'planters',
        parent_category = 'marble-stone-planters',
        status = 'published'
      WHERE parent_collection = 'decorative-stone-art'
        AND (slug LIKE '%planter%' OR name LIKE '%Planter%')
    `);

    // 2. Pedestals & Stands (4 products)
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'pedestals-stands',
        parent_category = 'marble-pedestals-stands',
        status = 'published'
      WHERE parent_collection = 'decorative-stone-art'
        AND (slug LIKE '%pedestal%' OR name LIKE '%Pedestal%')
    `);

    // 3. Uncertain Decorative Items (28 items: benches, lanterns, urns, vases, bowls, statuettes, accessories)
    // Per Rule 5: Keep in non-public review mechanism (status='draft', review-pending). Do NOT delete or force into unrelated category.
    await conn.query(`
      UPDATE products SET
        status = 'draft',
        parent_subcategory = 'review-pending',
        parent_category = 'review-pending'
      WHERE parent_collection = 'decorative-stone-art'
        AND parent_subcategory NOT IN ('planters', 'pedestals-stands', 'tulsi-pots')
    `);

    // E. Custom & Bespoke Creations
    // 1. Custom Architectural Projects (12 products: full-temple-construction, luxury-estate, bespoke-heritage-restoration)
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'custom-architectural-stonework',
        status = 'published'
      WHERE parent_collection = 'custom-bespoke-creations'
        AND parent_category IN ('full-temple-construction', 'luxury-estate-stonework', 'bespoke-heritage-restoration')
    `);

    // 2. Commemorative Reliefs (4 products)
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'custom-wall-art-reliefs',
        parent_category = 'commemorative-reliefs',
        status = 'published'
      WHERE parent_collection = 'custom-bespoke-creations'
        AND parent_category = 'commemorative-reliefs'
    `);

    // 3. Uncertain Custom Items (12 products: ancestral portraits, memorial busts, monumental sculptures)
    // Kept in draft for bespoke commission manual review.
    await conn.query(`
      UPDATE products SET
        status = 'draft',
        parent_subcategory = 'review-pending',
        parent_category = 'review-pending'
      WHERE parent_collection = 'custom-bespoke-creations'
        AND parent_category NOT IN ('full-temple-construction', 'luxury-estate-stonework', 'bespoke-heritage-restoration', 'commemorative-reliefs')
    `);

    console.log("✓ Product assignments successfully updated.");

    console.log("\n[5/6] Soft-deactivating Legacy Subcategories & Categories...");
    const activeSubSlugs = [
      ...APPROVED_SUBCATEGORIES.map(s => s.slug),
      // Sculptures & Statues subcategories
      "hindu-sculptures", "buddhist-jain-sculptures", "human-portrait-sculptures", "classical-artistic-sculptures", "animal-bird-sculptures"
    ];

    const [subResult] = await conn.query(`
      UPDATE subcategories 
      SET is_active = 0 
      WHERE slug NOT IN (${activeSubSlugs.map(() => "?").join(",")})
    `, activeSubSlugs);
    console.log(`- Deactivated ${subResult.changedRows} legacy subcategories.`);

    console.log("\n[6/6] Verifying Post-migration Parity and Constraints...");

    // Constraint 1: Protected Sculptures & Statues MUST be 100% identical (127 products)
    const [sculpturePost] = await conn.query("SELECT COUNT(*) as count FROM products WHERE parent_collection = 'sculptures-statues'");
    if (sculpturePost[0].count !== 127) {
      throw new Error(`FATAL ERROR: Sculptures & Statues count changed! Expected 127, got ${sculpturePost[0].count}`);
    }
    console.log("✓ Sculptures & Statues parity confirmed: exactly 127 products.");

    // Constraint 2: Total products MUST remain exactly 320 (0 lost, 0 deleted, 0 added)
    const [totalPost] = await conn.query("SELECT COUNT(*) as count FROM products");
    if (totalPost[0].count !== 320) {
      throw new Error(`FATAL ERROR: Total product count changed! Expected 320, got ${totalPost[0].count}`);
    }
    console.log("✓ Total products parity confirmed: exactly 320 products.");

    // Constraint 3: Strict granite exclusion check
    const [graniteCheck] = await conn.query(`
      SELECT COUNT(*) as count FROM products 
      WHERE name LIKE '%granite%' 
         OR slug LIKE '%granite%' 
         OR primary_material_id LIKE '%granite%'
         OR short_description LIKE '%granite%'
    `);
    if (graniteCheck[0].count > 0) {
      throw new Error(`FATAL ERROR: Granite product found in database (${graniteCheck[0].count} occurrences)!`);
    }
    console.log("✓ Strict granite exclusion confirmed: 0 occurrences.");

    // Display summary of current product distribution
    const [summary] = await conn.query(`
      SELECT parent_collection, parent_subcategory, status, count(*) as count 
      FROM products 
      GROUP BY parent_collection, parent_subcategory, status
      ORDER BY parent_collection, status DESC, parent_subcategory
    `);
    console.log("\nFinal Product Distribution in Database:");
    console.table(summary);

    const [activeSubs] = await conn.query(`
      SELECT parent_collection_slug, slug, name, is_active 
      FROM subcategories 
      WHERE is_active = 1 
      ORDER BY parent_collection_slug, sort_order
    `);
    console.log(`\nActive Subcategories in Database (${activeSubs.length}):`);
    console.table(activeSubs);

  } finally {
    conn.release();
    await pool.end();
  }

  console.log("\n==================================================");
  console.log("✅ CONTROLLED TAXONOMY MIGRATION COMPLETE");
  console.log("==================================================");
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
