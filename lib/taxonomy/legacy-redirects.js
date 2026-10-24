import { categoriesData } from "../../content/categories-data.js";

export const LEGACY_CATEGORY_REDIRECTS = {
  // Temples & Architectural Stonework retired categories
  "compact-wall-mandirs": "/collections/temples-architectural-stonework/mandirs-temples/small-marble-mandir-for-home",
  "pooja-room-panels": "/collections/temples-architectural-stonework/mandirs-temples/temple-parts-designs",
  "marble-home-temples": "/collections/temples-architectural-stonework/mandirs-temples/small-marble-mandir-for-home",
  "carved-mandir-arches": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "shikhara-domes": "/collections/temples-architectural-stonework/mandirs-temples/temple-parts-designs",
  "garbhagriha-architecture": "/collections/temples-architectural-stonework/mandirs-temples/temple-parts-designs",
  "pillared-mandapas": "/collections/temples-architectural-stonework/mandirs-temples/temple-parts-designs",
  "intricate-torans": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "portico-carvings": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "carved-pillars-columns": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "custom-heritage-columns": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "stone-door-frames": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "stone-balustrades": "/collections/temples-architectural-stonework/jali-designs/balcony-staircase-jali",
  "jali-screens": "/collections/temples-architectural-stonework/jali-designs/marble-jali-designs",
  "window-jali": "/collections/temples-architectural-stonework/jali-designs/marble-jali-designs",
  "floor-standing-marble-mandir": "/collections/temples-architectural-stonework/mandirs-temples/small-marble-mandir-for-home",
  "large-marble-temple": "/collections/temples-architectural-stonework/mandirs-temples/temple-parts-designs",
  "marble-pillars": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "stone-pillars": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "decorative-pillars": "/collections/temples-architectural-stonework/pillars-columns/stone-arches-door-frames",
  "bespoke-facade-elements": "/collections/temples-architectural-stonework/architectural-components/jharokhas-windows",

  // Wall Art & Reliefs retired categories
  "temple-wall-murals": "/collections/wall-art-reliefs/religious-spiritual-wall-art/religious-wall-murals",
  "mandala-wall-art": "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
  "tree-of-life-relief": "/collections/wall-art-reliefs/heritage-decorative-wall-art/floral-nature-wall-panels",
  "floral-pattern-panels": "/collections/wall-art-reliefs/heritage-decorative-wall-art/floral-nature-wall-panels",
  "botanical-reliefs": "/collections/wall-art-reliefs/heritage-decorative-wall-art/floral-nature-wall-panels",
  "geometric-carved-walls": "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
  "modern-textured-stone-walls": "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
  "royal-court-panels": "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
  "traditional-procession-murals": "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
  "rajasthani-heritage-scenes": "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
  "jharokha-relief-panels": "/collections/wall-art-reliefs/heritage-decorative-wall-art/stone-relief-panels",
  "bespoke-feature-walls": "/collections/wall-art-reliefs/custom-wall-art-reliefs/commemorative-reliefs",
  "architectural-accent-murals": "/collections/wall-art-reliefs/custom-wall-art-reliefs/commemorative-reliefs",
  "custom-crests-logos": "/collections/wall-art-reliefs/custom-wall-art-reliefs/commemorative-reliefs",

  // Fountains & Water Features retired categories
  "tiered-water-fountains": "/collections/fountains-water-features/tiered-classical-fountains/tiered-fountains",
  "pedestal-fountains": "/collections/fountains-water-features/tiered-classical-fountains/tiered-fountains",
  "spout-fountains": "/collections/fountains-water-features/sculptural-water-features/cascading-water-walls",
  "heritage-palace-water-features": "/collections/fountains-water-features/wall-freestanding-fountains/freestanding-fountains",
  "garden-fountains": "/collections/fountains-water-features/wall-freestanding-fountains/freestanding-fountains",

  // Decorative Stone Art retired categories
  "stone-planters": "/collections/decorative-stone-art/planters-tulsi-pots/marble-stone-planters",
  "pedestals-plinths": "/collections/decorative-stone-art/pedestals-stands/marble-pedestals-stands",
  "miniature-reliefs": "/collections/decorative-stone-art/decorative-garden-stone-art/tabletop-statuettes",

  // Custom & Bespoke retired categories
  "bespoke-deity-statues": "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs/custom-monumental-sculptures",
  "commissioned-statuary": "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs/custom-monumental-sculptures"
};

/**
 * Resolves any category slug (active or legacy) to its canonical 3-level URL.
 * Returns null if not found.
 */
export function resolveCanonicalCategoryUrl(slug) {
  if (!slug) return null;

  // 1. Active category lookup
  const active = categoriesData[slug];
  if (active && active.parentCollection && active.parentSubcategory) {
    return `/collections/${active.parentCollection}/${active.parentSubcategory}/${active.slug}`;
  }

  // 2. Legacy retired category lookup
  if (LEGACY_CATEGORY_REDIRECTS[slug]) {
    return LEGACY_CATEGORY_REDIRECTS[slug];
  }

  return null;
}
