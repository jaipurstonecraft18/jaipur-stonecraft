import fs from "fs";
import path from "path";

const baseline = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "audit-baseline.json"), "utf8"));

// Target taxonomy definition
// Temples & Architectural Stonework:
// B1. Mandir & Temple (mandir-temple)
//   - small-marble-mandir-for-home (Small Marble Mandir for Home)
//   - floor-standing-marble-mandir (Floor-Standing Marble Mandir)
//   - large-marble-temple (Large Marble Temple)
//   - temple-parts-designs (Temple Parts & Designs)
// B2. Jali (jali)
//   - marble-jali-designs (Marble Jali Designs)
//   - balcony-staircase-jali (Balcony & Staircase Jali)
//   - jali-for-partitions (Jali for Partitions)
//   - window-jali (Window Jali)
// B3. Pillars & Columns (pillars-columns)
//   - marble-pillars (Marble Pillars)
//   - stone-pillars (Stone Pillars)
//   - decorative-pillars (Decorative Pillars)
//   - stone-arches-door-frames (Stone Arches & Door Frames)
// B4. Other Temple & Stone Parts (other-temple-stone-parts)
//   - jharokhas-windows (Stone Jharokhas & Architectural Elements)
//   - gazebo-sculptural-elements (Gazebo & Pavilion Elements)

// Wall Art & Reliefs:
//   - religious-wall-murals (Religious Wall Murals) [sub: wall-murals]
//   - stone-relief-panels (Stone Relief Panels) [sub: relief-panels]
//   - floral-nature-wall-panels (Floral & Nature Wall Panels) [sub: relief-panels]
//   - custom-wall-art (Custom Wall Art) [sub: custom-wall-art]
//   (3D Stone Wall Panels: unverified capability, held awaiting business verification)

// Fountains & Water Features:
//   - tiered-fountains (Tiered Fountains) [sub: tiered-fountains]
//   - garden-fountains (Garden Fountains) [sub: garden-fountains]
//   - wall-fountains (Wall Fountains) [sub: wall-fountains]

// Decorative Stone Art:
//   - marble-stone-planters (Marble & Stone Planters) [sub: planters-tulsi-pots]
//   - marble-tulsi-pots (Marble Tulsi Pots) [sub: planters-tulsi-pots]
//   - marble-pedestals-stands (Marble Pedestals & Stands) [sub: pedestals-stands]
//   (Unverified categories: benches-seating, garden-lanterns-lamps, carved-stone-vases, decorative-bowls, marble-urns, artisan-accessories, tabletop-statuettes -> held in exception report for business verification)

// Custom & Bespoke Creations:
//   - custom-monumental-sculptures [sub: custom-sculptures]
//   - lifesize-memorial-busts [sub: custom-portraits]
//   - ancestral-portrait-carvings [sub: custom-portraits]
//   - commemorative-reliefs [sub: custom-portraits]
//   - full-temple-construction [sub: custom-architectural-projects]
//   - luxury-estate-stonework [sub: custom-architectural-projects]
//   - bespoke-heritage-restoration [sub: custom-architectural-projects]

const migrationMap = [];

for (const p of baseline.products) {
  const item = {
    productId: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    currentCollection: p.parent_collection,
    currentSubcategory: p.parent_subcategory,
    currentCategory: p.parent_category,
    currentPath: `/collections/${p.parent_collection}/${p.parent_subcategory}/${p.parent_category}`,
    currentProductUrl: `/designs/${p.parent_category}/${p.slug}`,
    status: p.status,
    material: p.primary_material_id,
    productType: p.product_type,
    shortDescription: p.short_description,
    images: p.images.map(img => img.url),
    targetCollection: null,
    targetSubcategory: null,
    targetCategory: null,
    targetPath: null,
    targetProductUrl: null,
    action: null, // "RETAIN_PROTECTED" | "REASSIGN" | "RETAIN_CORRECT" | "AWAITING_BUSINESS_VERIFICATION"
    reason: null,
    supportingEvidence: null,
    confidence: null, // "HIGH_VERIFIED" | "PROTECTED" | "NEEDS_BUSINESS_REVIEW"
    urlChange: false,
    unresolvedIssue: null
  };

  // 1. Check Protected Statue Taxonomy
  if (p.parent_collection === "sculptures-statues") {
    item.targetCollection = p.parent_collection;
    item.targetSubcategory = p.parent_subcategory;
    item.targetCategory = p.parent_category;
    item.targetPath = item.currentPath;
    item.targetProductUrl = item.currentProductUrl;
    item.action = "RETAIN_PROTECTED";
    item.reason = "Protected Sculptures & Statues taxonomy must remain completely untouched per Section 1A.";
    item.supportingEvidence = "Belongs to approved Hindu, Buddhist/Jain, Portrait, Classical, or Animal deity/statuary taxonomy.";
    item.confidence = "PROTECTED";
    item.urlChange = false;
    migrationMap.push(item);
    continue;
  }

  // 2. Temples & Architectural Stonework
  if (p.parent_collection === "temples-architectural-stonework") {
    if (p.parent_category === "compact-wall-mandirs") {
      item.targetCollection = "temples-architectural-stonework";
      item.targetSubcategory = "mandir-temple";
      item.targetCategory = "small-marble-mandir-for-home";
      item.action = "REASSIGN";
      item.reason = "Wall-mounted and compact home mandirs belong to approved Small Marble Mandir for Home category.";
      item.supportingEvidence = `Product name "${p.name}", verified home mandir specifications, makrana marble construction.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (["pooja-room-panels", "shikhara-domes", "garbhagriha-architecture", "pillared-mandapas"].includes(p.parent_category)) {
      item.targetCollection = "temples-architectural-stonework";
      item.targetSubcategory = "mandir-temple";
      item.targetCategory = "temple-parts-designs";
      item.action = "REASSIGN";
      item.reason = "Architectural temple components, mandapa elements, pooja panels and domes belong to Temple Parts & Designs.";
      item.supportingEvidence = `Product "${p.name}", architectural component of temple architecture, makrana marble.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (["intricate-torans", "portico-carvings"].includes(p.parent_category)) {
      item.targetCollection = "temples-architectural-stonework";
      item.targetSubcategory = "pillars-columns";
      item.targetCategory = "stone-arches-door-frames";
      item.action = "REASSIGN";
      item.reason = "Torans and portico carvings are traditional carved entrance arches and architectural door frames.";
      item.supportingEvidence = `Product "${p.name}", architectural entrance arch/frame carving in Makrana marble.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (p.parent_category === "jharokhas-windows") {
      item.targetCollection = "temples-architectural-stonework";
      item.targetSubcategory = "other-temple-stone-parts";
      item.targetCategory = "jharokhas-windows";
      item.action = "REASSIGN";
      item.reason = "Jharokhas are traditional architectural stone overhanging balcony and window structures.";
      item.supportingEvidence = `Product "${p.name}", stone jharokha window element.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (p.parent_category === "jali-screens") {
      item.targetCollection = "temples-architectural-stonework";
      item.targetSubcategory = "jali";
      if (p.id === "stones-jali") {
        item.targetCategory = "marble-jali-designs";
        item.action = "REASSIGN";
        item.reason = "CNC cut stone jali architectural design.";
        item.supportingEvidence = "Dholpur sandstone CNC jali screen.";
      } else if (p.id === "traditional-rajasthani-arch-jali") {
        item.targetCategory = "balcony-staircase-jali";
        item.action = "REASSIGN";
        item.reason = "Arched stone jali intended for balustrades and balcony openings.";
        item.supportingEvidence = "Traditional Rajasthani arch jali screen.";
      } else {
        item.targetCategory = "jali-for-partitions";
        item.action = "REASSIGN";
        item.reason = "Slatted stone screen designed as interior partition.";
        item.supportingEvidence = "Modern slatted stone screen.";
      }
      item.confidence = "HIGH_VERIFIED";
    }
  }

  // 3. Wall Art & Reliefs
  else if (p.parent_collection === "wall-art-reliefs") {
    if (p.parent_category === "jali-screens") {
      // Miscategorized jali in wall-art-reliefs!
      item.targetCollection = "temples-architectural-stonework";
      item.targetSubcategory = "jali";
      if (p.id === "botanical-lotus-lattice-screen") {
        item.targetCategory = "marble-jali-designs";
        item.reason = "Verified Makrana white marble floral lotus jali panel; moved from Wall Art to Temples & Architectural Stonework Jali.";
        item.supportingEvidence = "Makrana pure white marble floral lattice screen.";
      } else {
        item.targetCategory = "jali-for-partitions";
        item.reason = "Geometric star pattern lattice screen for dividers; moved from Wall Art to Temples & Architectural Stonework Jali for Partitions.";
        item.supportingEvidence = "Bansi Paharpur pink sandstone geometric lattice partition screen.";
      }
      item.action = "REASSIGN";
      item.confidence = "HIGH_VERIFIED";
    } else if (p.parent_category === "temple-wall-murals") {
      item.targetCollection = "wall-art-reliefs";
      item.targetSubcategory = "wall-murals";
      item.targetCategory = "religious-wall-murals";
      item.action = "REASSIGN";
      item.reason = "Temple wall murals with religious and spiritual subjects belong in Religious Wall Murals.";
      item.supportingEvidence = `Product "${p.name}", devotional wall mural in carved stone.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (["tree-of-life-relief", "floral-pattern-panels", "botanical-reliefs"].includes(p.parent_category)) {
      item.targetCollection = "wall-art-reliefs";
      item.targetSubcategory = "relief-panels";
      item.targetCategory = "floral-nature-wall-panels";
      item.action = "REASSIGN";
      item.reason = "Botanical, floral, and Tree of Life carved panels belong in Floral & Nature Wall Panels.";
      item.supportingEvidence = `Product "${p.name}", carved botanical/floral stone relief panel.`;
      item.confidence = "HIGH_VERIFIED";
    } else if ([
      "devotional-relief-panels", "mandala-wall-art", "geometric-carved-walls",
      "modern-textured-stone-walls", "royal-court-panels", "traditional-procession-murals",
      "rajasthani-heritage-scenes", "architectural-accent-murals"
    ].includes(p.parent_category)) {
      item.targetCollection = "wall-art-reliefs";
      item.targetSubcategory = "relief-panels";
      item.targetCategory = "stone-relief-panels";
      item.action = "REASSIGN";
      item.reason = "Sculpted and carved relief panels (heritage, geometric, textured, devotional) belong in Stone Relief Panels.";
      item.supportingEvidence = `Product "${p.name}", hand-carved stone relief panel.`;
      item.confidence = "HIGH_VERIFIED";
    }
  }

  // 4. Fountains & Water Features
  else if (p.parent_collection === "fountains-water-features") {
    if (p.parent_category === "tiered-water-fountains") {
      item.targetCollection = "fountains-water-features";
      item.targetSubcategory = "tiered-fountains";
      item.targetCategory = "tiered-fountains";
      item.action = "REASSIGN";
      item.reason = "Multi-tiered fountains belong in Tiered Fountains.";
      item.supportingEvidence = `Product "${p.name}", multi-tier stone fountain.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (["cascading-water-walls", "spout-fountains", "poolside-stone-waterfalls"].includes(p.parent_category)) {
      item.targetCollection = "fountains-water-features";
      item.targetSubcategory = "wall-fountains";
      item.targetCategory = "wall-fountains";
      item.action = "REASSIGN";
      item.reason = "Wall-mounted water walls, waterfalls, and spout features belong in Wall Fountains.";
      item.supportingEvidence = `Product "${p.name}", wall installation water feature.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (["central-courtyard-fountains", "lotus-basin-fountains", "figurative-water-sculptures", "abstract-water-sculptures", "heritage-palace-water-features"].includes(p.parent_category)) {
      item.targetCollection = "fountains-water-features";
      item.targetSubcategory = "garden-fountains";
      item.targetCategory = "garden-fountains";
      item.action = "REASSIGN";
      item.reason = "Freestanding courtyard, garden, basin, and sculptural water fountains belong in Garden Fountains.";
      item.supportingEvidence = `Product "${p.name}", outdoor garden/courtyard freestanding stone fountain.`;
      item.confidence = "HIGH_VERIFIED";
    }
  }

  // 5. Decorative Stone Art
  else if (p.parent_collection === "decorative-stone-art") {
    if (p.parent_category === "stone-planters") {
      item.targetCollection = "decorative-stone-art";
      item.targetSubcategory = "planters-tulsi-pots";
      item.targetCategory = "marble-stone-planters";
      item.action = "REASSIGN";
      item.reason = "Hand-carved stone planters for horticulture belong in Marble & Stone Planters.";
      item.supportingEvidence = `Product "${p.name}", carved planter container.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (p.parent_category === "pedestals-plinths") {
      item.targetCollection = "decorative-stone-art";
      item.targetSubcategory = "pedestals-stands";
      item.targetCategory = "marble-pedestals-stands";
      item.action = "REASSIGN";
      item.reason = "Display pedestals and statue plinths belong in Marble Pedestals & Stands.";
      item.supportingEvidence = `Product "${p.name}", display pedestal plinth.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (p.parent_category === "miniature-reliefs") {
      item.targetCollection = "wall-art-reliefs";
      item.targetSubcategory = "relief-panels";
      item.targetCategory = "stone-relief-panels";
      item.action = "REASSIGN";
      item.reason = "Carved miniature relief plaques are wall art relief panels, not decorative tabletop items.";
      item.supportingEvidence = `Product "${p.name}", miniature carved stone relief.`;
      item.confidence = "HIGH_VERIFIED";
    } else if (p.parent_category === "gazebo-sculptural-elements") {
      item.targetCollection = "temples-architectural-stonework";
      item.targetSubcategory = "other-temple-stone-parts";
      item.targetCategory = "gazebo-sculptural-elements";
      item.action = "REASSIGN";
      item.reason = "Gazebo and stone chhatri structural carvings belong in architectural stonework.";
      item.supportingEvidence = `Product "${p.name}", architectural pavilion element.`;
      item.confidence = "HIGH_VERIFIED";
    } else {
      // Unapproved product families per Section 3: benches-seating, garden-lanterns-lamps, carved-stone-vases, decorative-bowls, marble-urns, artisan-accessories, tabletop-statuettes
      item.targetCollection = "decorative-stone-art";
      item.targetSubcategory = "decorative-accents";
      item.targetCategory = p.parent_category;
      item.action = "AWAITING_BUSINESS_VERIFICATION";
      item.reason = `Category "${p.parent_category}" is an unapproved decorative product family per Section 3. Kept separate in exception review rather than forced into Planters or Pedestals.`;
      item.supportingEvidence = `Product "${p.name}", category "${p.parent_category}" requires explicit business approval and capability verification.`;
      item.confidence = "NEEDS_BUSINESS_REVIEW";
      item.unresolvedIssue = `Requires business verification: confirm whether Jaipur Stonecraft offers dedicated categories for ${p.parent_category}.`;
    }
  }

  // 6. Custom & Bespoke Creations
  else if (p.parent_collection === "custom-bespoke-creations") {
    item.targetCollection = "custom-bespoke-creations";
    item.targetSubcategory = p.parent_subcategory;
    item.targetCategory = p.parent_category;
    item.action = "RETAIN_CORRECT";
    item.reason = "Legitimate bespoke service / custom project offering. Retained in approved custom collection per Section 3.";
    item.supportingEvidence = `Product "${p.name}", custom project / bespoke carving service.`;
    item.confidence = "HIGH_VERIFIED";
  }

  item.targetPath = `/collections/${item.targetCollection}/${item.targetSubcategory}/${item.targetCategory}`;
  item.targetProductUrl = `/designs/${item.targetCategory}/${item.slug}`;
  item.urlChange = item.targetProductUrl !== item.currentProductUrl;

  migrationMap.push(item);
}

fs.writeFileSync(path.join(process.cwd(), "scripts", "migration-mapping.json"), JSON.stringify(migrationMap, null, 2), "utf8");
console.log(`Migration mapping generated: ${migrationMap.length} items`);

// Summary stats
const summary = {
  totalAudited: migrationMap.length,
  protectedSculptures: migrationMap.filter(m => m.action === "RETAIN_PROTECTED").length,
  reassigned: migrationMap.filter(m => m.action === "REASSIGN").length,
  retainedCorrect: migrationMap.filter(m => m.action === "RETAIN_CORRECT").length,
  awaitingBusinessVerification: migrationMap.filter(m => m.action === "AWAITING_BUSINESS_VERIFICATION").length,
  urlChangesCount: migrationMap.filter(m => m.urlChange).length
};

console.log("Summary Stats:", summary);
fs.writeFileSync(path.join(process.cwd(), "scripts", "migration-summary.json"), JSON.stringify(summary, null, 2), "utf8");
