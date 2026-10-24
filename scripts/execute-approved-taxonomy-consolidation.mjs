import mysql from "mysql2/promise";
import fs from "fs";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is missing.");
  process.exit(1);
}

// 15 Approved Subcategories for the 5 collections
const APPROVED_SUBCATEGORIES = [
  // A. Temples & Architectural Stonework (4)
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
    name: "Jali & Stone Screens",
    description: "Perforated stone lattice screens for partitions, balconies, facades, and windows.",
    imageSrc: "/images/collections/architectural.webp",
    sortOrder: 2
  },
  {
    id: "temples-architectural-stonework-pillars-columns",
    slug: "pillars-columns",
    parentCollection: "temples-architectural-stonework",
    name: "Pillars, Arches & Architectural Elements",
    description: "Hand-carved marble pillars, structural stone columns, torans, and architectural arches.",
    imageSrc: "/images/collections/temples-architectural.webp",
    sortOrder: 3
  },
  {
    id: "temples-architectural-stonework-architectural-components",
    slug: "architectural-components",
    parentCollection: "temples-architectural-stonework",
    name: "Jharokhas & Heritage Stonework",
    description: "Traditional stone jharokhas, heritage balconies, chhatri gazebos, and structural components.",
    imageSrc: "/images/collections/architectural.webp",
    sortOrder: 4
  },

  // B. Wall Art & Reliefs (3)
  {
    id: "wall-art-reliefs-religious-spiritual-wall-art",
    slug: "religious-spiritual-wall-art",
    parentCollection: "wall-art-reliefs",
    name: "Religious & Spiritual Wall Art",
    description: "Sacred stone wall murals, deity reliefs, and devotional stone narrative relief panels.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    sortOrder: 1
  },
  {
    id: "wall-art-reliefs-heritage-decorative-wall-art",
    slug: "heritage-decorative-wall-art",
    parentCollection: "wall-art-reliefs",
    name: "Heritage & Decorative Wall Art",
    description: "Intricately carved stone relief panels, Rajasthani heritage scenes, floral motifs, and geometric wall carvings.",
    imageSrc: "/images/collections/luxury.webp",
    sortOrder: 2
  },
  {
    id: "wall-art-reliefs-custom-wall-art-reliefs",
    slug: "custom-wall-art-reliefs",
    parentCollection: "wall-art-reliefs",
    name: "Custom Wall Art & Reliefs",
    description: "Commissioned architectural feature walls, commemorative reliefs, and bespoke stone murals.",
    imageSrc: "/images/collections/custom.webp",
    sortOrder: 3
  },

  // C. Fountains & Water Features (3)
  {
    id: "fountains-water-features-tiered-classical-fountains",
    slug: "tiered-classical-fountains",
    parentCollection: "fountains-water-features",
    name: "Tiered & Classical Fountains",
    description: "Classical multi-tier marble and stone water fountains, courtyard centerpieces, and lotus basins.",
    imageSrc: "/images/collections/luxury.webp",
    sortOrder: 1
  },
  {
    id: "fountains-water-features-wall-freestanding-fountains",
    slug: "wall-freestanding-fountains",
    parentCollection: "fountains-water-features",
    name: "Wall & Freestanding Fountains",
    description: "Architectural wall fountains, freestanding garden water features, and stone spouts.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    sortOrder: 2
  },
  {
    id: "fountains-water-features-sculptural-water-features",
    slug: "sculptural-water-features",
    parentCollection: "fountains-water-features",
    name: "Sculptural Water Features",
    description: "Cascading stone water walls, poolside waterfalls, and figurative water sculptures.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    sortOrder: 3
  },

  // D. Decorative Stone Art (3)
  {
    id: "decorative-stone-art-planters-tulsi-pots",
    slug: "planters-tulsi-pots",
    parentCollection: "decorative-stone-art",
    name: "Planters & Tulsi Pots",
    description: "Hand-carved marble and sandstone planters, garden urns, and sacred stone Tulsi pots.",
    imageSrc: "/images/collections/sacred.webp",
    sortOrder: 1
  },
  {
    id: "decorative-stone-art-pedestals-stands",
    slug: "pedestals-stands",
    parentCollection: "decorative-stone-art",
    name: "Pedestals, Plinths & Stands",
    description: "Architectural display pedestals, statue plinths, and carved stone bases.",
    imageSrc: "/images/collections/temples-architectural.webp",
    sortOrder: 2
  },
  {
    id: "decorative-stone-art-decorative-garden-stone-art",
    slug: "decorative-garden-stone-art",
    parentCollection: "decorative-stone-art",
    name: "Decorative & Garden Stone Art",
    description: "Stone vases, marble urns, decorative bowls, tabletop statuettes, garden lanterns, and stone benches.",
    imageSrc: "/images/collections/luxury.webp",
    sortOrder: 3
  },

  // E. Custom & Bespoke Creations (2)
  {
    id: "custom-bespoke-creations-custom-architectural-stonework",
    slug: "custom-architectural-stonework",
    parentCollection: "custom-bespoke-creations",
    name: "Custom Architectural Stonework",
    description: "Full temple design and construction, luxury estate stonework, and heritage restoration.",
    imageSrc: "/images/collections/architectural.webp",
    sortOrder: 1
  },
  {
    id: "custom-bespoke-creations-custom-sculptures-portraits-reliefs",
    slug: "custom-sculptures-portraits-reliefs",
    parentCollection: "custom-bespoke-creations",
    name: "Custom Sculptures, Portraits & Reliefs",
    description: "Commissioned monumental sculptures, ancestral portraits, and memorial busts.",
    imageSrc: "/images/collections/custom.webp",
    sortOrder: 2
  }
];

// Target Active Categories for the 5 collections
const APPROVED_CATEGORIES = [
  // A. Temples & Architectural Stonework
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

  // B. Wall Art & Reliefs
  {
    id: "devotional-relief-panels",
    slug: "devotional-relief-panels",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "religious-spiritual-wall-art",
    name: "Devotional Relief Panels",
    description: "Hand-carved deity relief panels and sacred spiritual wall carvings.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Devotional relief panels carved in natural stone",
    sortOrder: 1
  },
  {
    id: "religious-wall-murals",
    slug: "religious-wall-murals",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "religious-spiritual-wall-art",
    name: "Religious Wall Murals",
    description: "Devotional stone wall murals depicting sacred narratives and temples.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Religious stone wall murals carved in Jaipur",
    sortOrder: 2
  },
  {
    id: "stone-relief-panels",
    slug: "stone-relief-panels",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "heritage-decorative-wall-art",
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
    parentSubcategory: "heritage-decorative-wall-art",
    name: "Floral & Nature Relief Panels",
    description: "Intricately carved botanical patterns, lotuses, and tree of life panels.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Floral and nature relief panels in marble and sandstone",
    sortOrder: 2
  },
  {
    id: "commemorative-reliefs",
    slug: "commemorative-reliefs",
    parentCollection: "wall-art-reliefs",
    parentSubcategory: "custom-wall-art-reliefs",
    name: "Commemorative Reliefs",
    description: "Bespoke commissioned memorial plaques, family crests, and narrative relief art.",
    imageSrc: "/images/collections/custom.webp",
    imageAlt: "Commemorative relief stone panel",
    sortOrder: 1
  },

  // C. Fountains & Water Features
  {
    id: "tiered-fountains",
    slug: "tiered-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "tiered-classical-fountains",
    name: "Tiered Fountains",
    description: "Multi-tier classical stone water fountains for gardens and courtyards.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Multi-tiered marble water fountain",
    sortOrder: 1
  },
  {
    id: "central-courtyard-fountains",
    slug: "central-courtyard-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "tiered-classical-fountains",
    name: "Central Courtyard Fountains",
    description: "Grand central stone courtyard fountains and architectural centerpiece water features.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Central courtyard stone fountain",
    sortOrder: 2
  },
  {
    id: "lotus-basin-fountains",
    slug: "lotus-basin-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "tiered-classical-fountains",
    name: "Lotus Basin Fountains",
    description: "Intricately carved stone lotus basins and low-profile courtyard water fountains.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    imageAlt: "Lotus basin stone water fountain",
    sortOrder: 3
  },
  {
    id: "wall-fountains",
    slug: "wall-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "wall-freestanding-fountains",
    name: "Wall Fountains",
    description: "Architectural wall-mounted fountains, water spouts, and vertical stone water elements.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Architectural stone wall fountain",
    sortOrder: 1
  },
  {
    id: "freestanding-fountains",
    slug: "freestanding-fountains",
    parentCollection: "fountains-water-features",
    parentSubcategory: "wall-freestanding-fountains",
    name: "Freestanding Fountains",
    description: "Freestanding garden and patio stone water fountains.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    imageAlt: "Freestanding courtyard stone fountain",
    sortOrder: 2
  },
  {
    id: "cascading-water-walls",
    slug: "cascading-water-walls",
    parentCollection: "fountains-water-features",
    parentSubcategory: "sculptural-water-features",
    name: "Cascading Water Walls",
    description: "Multi-tier stone water walls with gentle cascading flows for luxury installations.",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Cascading stone water wall",
    sortOrder: 1
  },
  {
    id: "poolside-stone-waterfalls",
    slug: "poolside-stone-waterfalls",
    parentCollection: "fountains-water-features",
    parentSubcategory: "sculptural-water-features",
    name: "Poolside Stone Waterfalls",
    description: "Carved stone waterfalls and sheer descent spouts for luxury pools and landscape gardens.",
    imageSrc: "/images/collections/garden.webp",
    imageAlt: "Poolside stone waterfall feature",
    sortOrder: 2
  },
  {
    id: "figurative-water-sculptures",
    slug: "figurative-water-sculptures",
    parentCollection: "fountains-water-features",
    parentSubcategory: "sculptural-water-features",
    name: "Figurative Water Sculptures",
    description: "Hand-carved figurative and animal stone sculptures integrated with water fountains.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    imageAlt: "Figurative stone water sculpture",
    sortOrder: 3
  },
  {
    id: "abstract-water-sculptures",
    slug: "abstract-water-sculptures",
    parentCollection: "fountains-water-features",
    parentSubcategory: "sculptural-water-features",
    name: "Abstract Water Sculptures",
    description: "Modernist and geometric stone water sculptures for contemporary spaces.",
    imageSrc: "/images/collections/hero-sculptures-group.webp",
    imageAlt: "Abstract stone water sculpture",
    sortOrder: 4
  },

  // D. Decorative Stone Art
  {
    id: "marble-stone-planters",
    slug: "marble-stone-planters",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "planters-tulsi-pots",
    name: "Marble & Stone Planters",
    description: "Hand-carved marble and sandstone planters and outdoor garden urns.",
    imageSrc: "/images/collections/sacred.webp",
    imageAlt: "Hand-carved marble stone planter",
    sortOrder: 1
  },
  {
    id: "marble-tulsi-pots",
    slug: "marble-tulsi-pots",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "planters-tulsi-pots",
    name: "Marble Tulsi Pots",
    description: "Sacred carved marble Tulsi pots for devotional gardens and courtyards.",
    imageSrc: "/images/collections/sacred.webp",
    imageAlt: "Sacred white marble Tulsi pot",
    sortOrder: 2
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
  {
    id: "carved-stone-vases",
    slug: "carved-stone-vases",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "decorative-garden-stone-art",
    name: "Carved Stone Vases",
    description: "Handcrafted marble and stone flower vases with intricate floral carvings.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Hand-carved stone vase",
    sortOrder: 1
  },
  {
    id: "marble-urns",
    slug: "marble-urns",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "decorative-garden-stone-art",
    name: "Marble Urns",
    description: "Classical ornamental marble urns with traditional fluting and handles.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Carved marble ornamental urn",
    sortOrder: 2
  },
  {
    id: "decorative-bowls",
    slug: "decorative-bowls",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "decorative-garden-stone-art",
    name: "Decorative Bowls",
    description: "Carved marble urli bowls and tabletop water floating flower vessels.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Carved marble decorative bowl",
    sortOrder: 3
  },
  {
    id: "tabletop-statuettes",
    slug: "tabletop-statuettes",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "decorative-garden-stone-art",
    name: "Tabletop Statuettes",
    description: "Compact handcrafted stone figurines and tabletop artistic statuettes.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Tabletop stone statuette",
    sortOrder: 4
  },
  {
    id: "artisan-accessories",
    slug: "artisan-accessories",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "decorative-garden-stone-art",
    name: "Artisan Accessories",
    description: "Handcrafted stone home decor accents, coasters, candle holders, and desk art.",
    imageSrc: "/images/collections/luxury.webp",
    imageAlt: "Handcrafted stone artisan accessories",
    sortOrder: 5
  },
  {
    id: "garden-lanterns-lamps",
    slug: "garden-lanterns-lamps",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "decorative-garden-stone-art",
    name: "Garden Lanterns & Lamps",
    description: "Traditional carved stone pagodas, outdoor garden lanterns, and pathway lamps.",
    imageSrc: "/images/collections/garden.webp",
    imageAlt: "Carved stone garden lantern",
    sortOrder: 6
  },
  {
    id: "benches-seating",
    slug: "benches-seating",
    parentCollection: "decorative-stone-art",
    parentSubcategory: "decorative-garden-stone-art",
    name: "Benches & Seating",
    description: "Solid hand-carved stone benches and architectural garden seating.",
    imageSrc: "/images/collections/garden.webp",
    imageAlt: "Hand-carved stone garden bench",
    sortOrder: 7
  },

  // E. Custom & Bespoke Creations
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
    id: "custom-monumental-sculptures",
    slug: "custom-monumental-sculptures",
    parentCollection: "custom-bespoke-creations",
    parentSubcategory: "custom-sculptures-portraits-reliefs",
    name: "Custom Monumental Sculptures",
    description: "Large-scale commissioned monumental statues and civic stone sculptures.",
    imageSrc: "/images/collections/custom.webp",
    imageAlt: "Custom monumental stone sculpture",
    sortOrder: 1
  },
  {
    id: "ancestral-portrait-carvings",
    slug: "ancestral-portrait-carvings",
    parentCollection: "custom-bespoke-creations",
    parentSubcategory: "custom-sculptures-portraits-reliefs",
    name: "Ancestral Portrait Carvings",
    description: "Custom hand-carved stone and marble ancestral portraits from photographs.",
    imageSrc: "/images/collections/custom.webp",
    imageAlt: "Hand-carved ancestral stone portrait",
    sortOrder: 2
  },
  {
    id: "lifesize-memorial-busts",
    slug: "lifesize-memorial-busts",
    parentCollection: "custom-bespoke-creations",
    parentSubcategory: "custom-sculptures-portraits-reliefs",
    name: "Lifesize Memorial Busts",
    description: "Lifesize marble memorial busts and portrait head carvings.",
    imageSrc: "/images/collections/custom.webp",
    imageAlt: "Lifesize marble memorial portrait bust",
    sortOrder: 3
  }
];

async function main() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — TAXONOMY CONSOLIDATION MIGRATION");
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
    console.log("\n[1/7] Pre-migration Baseline Verification...");
    const [sculpturesBefore] = await conn.query("SELECT COUNT(*) as count FROM products WHERE parent_collection = 'sculptures-statues'");
    const [totalBefore] = await conn.query("SELECT COUNT(*) as count FROM products");
    const [pubBefore] = await conn.query("SELECT COUNT(*) as count FROM products WHERE status = 'published'");
    const [draftBefore] = await conn.query("SELECT COUNT(*) as count FROM products WHERE status = 'draft'");

    console.log(`- Total baseline products: ${totalBefore[0].count}`);
    console.log(`- Published products: ${pubBefore[0].count}`);
    console.log(`- Draft products: ${draftBefore[0].count}`);
    console.log(`- Sculptures & Statues products: ${sculpturesBefore[0].count}`);

    if (sculpturesBefore[0].count !== 131) {
      throw new Error(`Integrity error: Sculptures & Statues must have exactly 131 products, found ${sculpturesBefore[0].count}`);
    }
    if (totalBefore[0].count !== 325) {
      throw new Error(`Integrity error: Total products must be exactly 325, found ${totalBefore[0].count}`);
    }
    if (pubBefore[0].count !== 21 || draftBefore[0].count !== 304) {
      throw new Error(`Integrity error: Status mismatch (Expected 21 pub / 304 draft, found ${pubBefore[0].count} / ${draftBefore[0].count})`);
    }

    console.log("✓ Pre-migration baseline verified: exactly 325 products (131 protected sculptures).");

    // BEGIN TRANSACTION
    await conn.beginTransaction();
    console.log("\n[Transaction Started]");

    // 2. Upsert approved subcategories
    console.log("\n[2/7] Upserting 15 Approved Subcategories...");
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

    // Deactivate obsolete subcategories in the 5 collections (NEVER touch sculptures-statues!)
    const approvedSubSlugs = APPROVED_SUBCATEGORIES.map(s => s.slug);
    const [deactSubs] = await conn.query(`
      UPDATE subcategories 
      SET is_active = 0 
      WHERE parent_collection_slug != 'sculptures-statues'
        AND slug NOT IN (${approvedSubSlugs.map(() => "?").join(",")})
    `, approvedSubSlugs);
    console.log(`✓ 15 approved subcategories active. Deactivated obsolete subcategories: ${deactSubs.affectedRows}`);

    // 3. Upsert approved categories
    console.log("\n[3/7] Upserting Approved Child Categories...");
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

    // Deactivate obsolete categories in the 5 collections (NEVER touch sculptures-statues!)
    const approvedCatSlugs = APPROVED_CATEGORIES.map(c => c.slug);
    const [deactCats] = await conn.query(`
      UPDATE categories 
      SET is_active = 0 
      WHERE parent_collection_slug != 'sculptures-statues'
        AND slug NOT IN (${approvedCatSlugs.map(() => "?").join(",")})
    `, approvedCatSlugs);
    console.log(`✓ ${APPROVED_CATEGORIES.length} approved categories active. Deactivated obsolete categories: ${deactCats.affectedRows}`);

    // 4. Update Product Assignments (PRESERVING STATUS)
    console.log("\n[4/7] Updating Product Assignments...");

    // A. Wall Art & Reliefs products
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'religious-spiritual-wall-art'
      WHERE parent_collection = 'wall-art-reliefs'
        AND parent_category IN ('devotional-relief-panels', 'religious-wall-murals')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'heritage-decorative-wall-art'
      WHERE parent_collection = 'wall-art-reliefs'
        AND parent_category IN ('stone-relief-panels', 'floral-nature-wall-panels')
    `);

    // Migrate commemorative-reliefs to wall-art-reliefs
    await conn.query(`
      UPDATE products SET
        parent_collection = 'wall-art-reliefs',
        parent_subcategory = 'custom-wall-art-reliefs'
      WHERE parent_category = 'commemorative-reliefs'
    `);

    // B. Fountains & Water Features products
    // 1. Tiered & Classical Fountains
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'tiered-classical-fountains',
        parent_category = 'tiered-fountains'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%tier%' OR name LIKE '%Tier%')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'tiered-classical-fountains',
        parent_category = 'central-courtyard-fountains'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%courtyard%' OR name LIKE '%Courtyard%')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'tiered-classical-fountains',
        parent_category = 'lotus-basin-fountains'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%lotus%' OR name LIKE '%Lotus%')
    `);

    // 2. Wall & Freestanding Fountains
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'wall-freestanding-fountains',
        parent_category = 'wall-fountains'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%wall-fountain%' OR name LIKE '%Wall Fountain%')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'wall-freestanding-fountains',
        parent_category = 'freestanding-fountains'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%freestanding%' OR name LIKE '%Freestanding%')
    `);

    // 3. Sculptural Water Features
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'sculptural-water-features',
        parent_category = 'cascading-water-walls'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%cascading%' OR name LIKE '%Cascading%')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'sculptural-water-features',
        parent_category = 'poolside-stone-waterfalls'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%waterfall%' OR name LIKE '%Waterfall%')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'sculptural-water-features',
        parent_category = 'figurative-water-sculptures'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%figurative%' OR name LIKE '%Figurative%')
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'sculptural-water-features',
        parent_category = 'abstract-water-sculptures'
      WHERE parent_collection = 'fountains-water-features'
        AND (slug LIKE '%abstract-water%' OR name LIKE '%Abstract Water%')
    `);

    // C. Decorative Stone Art products
    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'planters-tulsi-pots'
      WHERE parent_collection = 'decorative-stone-art'
        AND parent_category = 'marble-stone-planters'
    `);

    await conn.query(`
      UPDATE products SET
        parent_subcategory = 'pedestals-stands'
      WHERE parent_collection = 'decorative-stone-art'
        AND parent_category = 'marble-pedestals-stands'
    `);

    // Unpark the 28 products from review-pending in decorative-stone-art
    const decorMappings = [
      { pattern: "%carved-stone-vases%", cat: "carved-stone-vases" },
      { pattern: "%marble-urns%", cat: "marble-urns" },
      { pattern: "%decorative-bowls%", cat: "decorative-bowls" },
      { pattern: "%tabletop-statuettes%", cat: "tabletop-statuettes" },
      { pattern: "%artisan-accessories%", cat: "artisan-accessories" },
      { pattern: "%garden-lanterns-lamps%", cat: "garden-lanterns-lamps" },
      { pattern: "%benches-seating%", cat: "benches-seating" }
    ];

    for (const m of decorMappings) {
      const [res] = await conn.query(`
        UPDATE products SET
          parent_subcategory = 'decorative-garden-stone-art',
          parent_category = ?
        WHERE parent_collection = 'decorative-stone-art'
          AND parent_subcategory = 'review-pending'
          AND slug LIKE ?
      `, [m.cat, m.pattern]);
      console.log(`  - Unparked ${res.affectedRows} products -> ${m.cat}`);
    }

    // D. Custom & Bespoke Creations products
    // Unpark the 12 products from review-pending in custom-bespoke-creations
    const bespokeMappings = [
      { pattern: "%custom-monumental-sculptures%", cat: "custom-monumental-sculptures" },
      { pattern: "%ancestral-portrait-carvings%", cat: "ancestral-portrait-carvings" },
      { pattern: "%lifesize-memorial-busts%", cat: "lifesize-memorial-busts" }
    ];

    for (const m of bespokeMappings) {
      const [res] = await conn.query(`
        UPDATE products SET
          parent_subcategory = 'custom-sculptures-portraits-reliefs',
          parent_category = ?
        WHERE parent_collection = 'custom-bespoke-creations'
          AND parent_subcategory = 'review-pending'
          AND slug LIKE ?
      `, [m.cat, m.pattern]);
      console.log(`  - Unparked ${res.affectedRows} products -> ${m.cat}`);
    }

    console.log("✓ All affected products reclassified.");

    // 5. Post-migration Verification inside transaction
    console.log("\n[5/7] Verifying Transaction Integrity...");

    const [sculpturesAfter] = await conn.query("SELECT COUNT(*) as count FROM products WHERE parent_collection = 'sculptures-statues'");
    const [totalAfter] = await conn.query("SELECT COUNT(*) as count FROM products");
    const [pubAfter] = await conn.query("SELECT COUNT(*) as count FROM products WHERE status = 'published'");
    const [draftAfter] = await conn.query("SELECT COUNT(*) as count FROM products WHERE status = 'draft'");
    const [orphanedProducts] = await conn.query("SELECT COUNT(*) as count FROM products WHERE parent_subcategory = 'review-pending' OR parent_category = 'review-pending'");
    const [invalidCatParents] = await conn.query(`
      SELECT COUNT(*) as count FROM products p 
      LEFT JOIN categories c ON p.parent_category COLLATE utf8mb4_unicode_ci = c.slug COLLATE utf8mb4_unicode_ci 
      WHERE c.slug IS NULL
    `);
    const [invalidSubParents] = await conn.query(`
      SELECT COUNT(*) as count FROM products p 
      LEFT JOIN subcategories s ON p.parent_subcategory COLLATE utf8mb4_unicode_ci = s.slug COLLATE utf8mb4_unicode_ci 
      WHERE s.slug IS NULL
    `);

    console.log(`- Sculptures & Statues after: ${sculpturesAfter[0].count} (must be 131)`);
    console.log(`- Total products after: ${totalAfter[0].count} (must be 325)`);
    console.log(`- Published products after: ${pubAfter[0].count} (must be 21)`);
    console.log(`- Draft products after: ${draftAfter[0].count} (must be 304)`);
    console.log(`- Products in review-pending: ${orphanedProducts[0].count} (must be 0)`);
    console.log(`- Products with non-existent parent category: ${invalidCatParents[0].count} (must be 0)`);
    console.log(`- Products with non-existent parent subcategory: ${invalidSubParents[0].count} (must be 0)`);

    if (sculpturesAfter[0].count !== 131) {
      throw new Error(`ABORT: Sculptures count changed! Found ${sculpturesAfter[0].count}`);
    }
    if (totalAfter[0].count !== 325) {
      throw new Error(`ABORT: Total products count changed! Found ${totalAfter[0].count}`);
    }
    if (pubAfter[0].count !== 21 || draftAfter[0].count !== 304) {
      throw new Error(`ABORT: Product publication status was altered!`);
    }
    if (orphanedProducts[0].count !== 0) {
      throw new Error(`ABORT: Found ${orphanedProducts[0].count} products still in review-pending!`);
    }
    if (invalidCatParents[0].count !== 0 || invalidSubParents[0].count !== 0) {
      throw new Error(`ABORT: Found products with invalid parent taxonomy!`);
    }

    // 6. Verify Active Subcategories count for the 5 collections
    const [activeSubsRows] = await conn.query("SELECT slug FROM subcategories WHERE parent_collection_slug != 'sculptures-statues' AND is_active = 1");
    console.log(`- Active subcategories in 5 collections: ${activeSubsRows.length} (must be exactly 15)`);
    if (activeSubsRows.length !== 15) {
      throw new Error(`ABORT: Target is 15 main categories, found ${activeSubsRows.length}`);
    }

    // COMMIT
    await conn.commit();
    console.log("\n[Transaction Successfully Committed! ✓]");

    // Save post-migration report
    const [finalCollections] = await conn.query("SELECT * FROM collections WHERE is_active = 1 ORDER BY id ASC");
    const [finalSubs] = await conn.query("SELECT * FROM subcategories WHERE is_active = 1 ORDER BY parent_collection_slug, sort_order ASC");
    const [finalCats] = await conn.query("SELECT * FROM categories WHERE is_active = 1 ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order ASC");
    const [finalProducts] = await conn.query("SELECT id, slug, sku, name, parent_collection, parent_subcategory, parent_category, status FROM products ORDER BY id ASC");

    const report = {
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      counts: {
        totalCollections: finalCollections.length,
        totalActiveSubcategories: finalSubs.length,
        reorganizedActiveSubcategories: activeSubsRows.length,
        totalActiveCategories: finalCats.length,
        totalProducts: finalProducts.length,
        publishedProducts: finalProducts.filter(p => p.status === 'published').length,
        draftProducts: finalProducts.filter(p => p.status === 'draft').length,
        sculpturesProducts: finalProducts.filter(p => p.parent_collection === 'sculptures-statues').length
      },
      collections: finalCollections,
      subcategories: finalSubs,
      categories: finalCats,
      products: finalProducts
    };

    fs.writeFileSync("scripts/post-migration-snapshot.json", JSON.stringify(report, null, 2));
    console.log("\nSaved scripts/post-migration-snapshot.json");
    console.log("Migration execution completed flawlessly.");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ MIGRATION FAILED — ROLLING BACK TRANSACTION:", error);
    try {
      await conn.rollback();
      console.log("Transaction rolled back successfully. No database changes were applied.");
    } catch (rbErr) {
      console.error("Failed to rollback:", rbErr);
    }
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

main();
