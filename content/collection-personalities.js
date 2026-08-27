/**
 * Jaipur Stonecraft — Collection Personality & Visual Hierarchy System
 * 
 * Provides rich, collection-specific metadata for each of the 6 collection detail pages:
 * 1. Sculptures & Statues (Devotional, artistic, sculptural, human)
 * 2. Wall Art & Reliefs (Surface texture, relief depth, architectural detail)
 * 3. Temples & Architectural Stonework (Structural, spatial, monumental)
 * 4. Fountains & Water Features (Flowing, open, courtyard elegance)
 * 5. Decorative Stone Art (Interior accents, detail, ornamentation)
 * 6. Custom & Bespoke Creations (Consultative, commission-oriented)
 */

export const collectionPersonalities = {
  "sculptures-statues": {
    eyebrow: "DEVOTIONAL & FINE ART SCULPTURE",
    tagline: "Sacred Iconography & Devotional Figures Carved in Pure White Marble",
    badgeTitle: "Atelier Standard",
    badgeValue: "Shilpa Shastra Proportions",
    heroImageSrc: "/images/collections/hero-sculptures-group.webp",
    metrics: [
      { label: "Primary Stone", value: "Makrana White Marble" },
      { label: "Carving Standard", value: "Generational Hand Chiseling" },
      { label: "Proportions", value: "Sacred Shilpa Shastra" },
      { label: "Scale Range", value: "1.5ft to 12ft+ Statues" }
    ],
    materials: [
      {
        name: "Makrana White Marble",
        origin: "Nagaur, Rajasthan",
        description: "Flawless white calcitic marble renowned for zero water absorption and lifelong sacred radiance.",
        href: "/marble"
      },
      {
        name: "Bansi Paharpur Sandstone",
        origin: "Bharatpur, Rajasthan",
        description: "Blush pink stone ideal for exterior courtyard statuary and architectural relief accents.",
        href: "/marble"
      },
      {
        name: "Black Rajasthan Marble",
        origin: "Bhainslana, Rajasthan",
        description: "Deep dark stone bringing dramatic contrast to contemporary and traditional idols.",
        href: "/marble"
      }
    ],
    processSteps: [
      {
        title: "Block Selection & Blessing",
        description: "Selecting dense calcitic marble blocks free of structural fissures prior to carving."
      },
      {
        title: "Sacred Proportions Drawing",
        description: "Plotting iconographic grid measurements according to authentic Shilpa Shastras."
      },
      {
        title: "Hand Chiseling & Relief",
        description: "Artisan carving of subtle facial expressions, garments, and ornamental details."
      },
      {
        title: "Diamond Buff Polishing",
        description: "Natural water-polishing using progressively finer stones for a smooth silky touch."
      }
    ],
    artworks: [
      {
        title: "Lord Krishna Alcove Statue",
        material: "Makrana Pure Marble",
        type: "Devotional Idol",
        imageSrc: "/images/creations/krishna-alcove.jpg"
      },
      {
        title: "Seated Sai Baba Idol",
        material: "White Marble",
        type: "Spiritual Statue",
        imageSrc: "/images/creations/sai-baba-seated.jpg"
      },
      {
        title: "Black Nandi Sacred Statue",
        material: "Black Marble",
        type: "Temple Animal Statue",
        imageSrc: "/images/creations/black-nandi-statue.jpg"
      }
    ],
    cta: {
      eyebrow: "DEVOTIONAL STATUE COMMISSION",
      heading: "Commission a Sacred Deity Statue",
      description: "Collaborate directly with master sculptors in Jaipur to carve bespoke idols in exact sizes, mudras, and postures.",
      primaryCtaText: "Discuss Statue Commission",
      primaryCtaHref: "/contact?type=custom&collection=sculptures-statues"
    }
  },

  "wall-art-reliefs": {
    eyebrow: "HIGH-RELIEF MURAL & DECORATIVE WALL ART",
    tagline: "Deep Carved Stone Reliefs & Cultural Murals for Architectural Walls",
    badgeTitle: "Relief Depth",
    badgeValue: "High-Relief & Low-Relief Masonry",
    heroImageSrc: "/images/collections/wall-art-relief.webp",
    metrics: [
      { label: "Primary Stone", value: "Sandstone & White Marble" },
      { label: "Relief Depth", value: "25mm to 100mm Carved Depth" },
      { label: "Panel Format", value: "Seamless Modular Tiles" },
      { label: "Application", value: "Feature Walls & Facades" }
    ],
    materials: [
      {
        name: "Bansi Paharpur Pink Sandstone",
        origin: "Bharatpur, Rajasthan",
        description: "Warm terracotta and blush pink tones creating rich shadows in carved wall murals.",
        href: "/marble"
      },
      {
        name: "White Makrana Marble",
        origin: "Nagaur, Rajasthan",
        description: "Pristine white stone for intricate interior relief panels and spiritual room murals.",
        href: "/marble"
      },
      {
        name: "Beige Jaisalmer Limestone",
        origin: "Jaisalmer, Rajasthan",
        description: "Golden amber stone providing royal warmth for heritage wall art panels.",
        href: "/marble"
      }
    ],
    processSteps: [
      {
        title: "Architectural Layout CAD",
        description: "Drafting precision panel joints and wall dimensions for seamless field installation."
      },
      {
        title: "Depth Roughing Out",
        description: "Chiseling multi-layer relief levels from 1-inch to 4-inch deep stone slabs."
      },
      {
        title: "Fine Surface Carving",
        description: "Hand-sculpting floral arabesques, deity scenes, and geometric lattice textures."
      },
      {
        title: "Surface Sealing & Finishing",
        description: "Applying invisible hydrophobic sealants for weather resistance."
      }
    ],
    artworks: [
      {
        title: "Rajasthani Court Heritage Mural",
        material: "Pink Sandstone",
        type: "High-Relief Wall Art",
        imageSrc: "/images/collections/wall-art-relief.webp"
      },
      {
        title: "Ornate Jali Lattice Wall",
        material: "White Marble",
        type: "Architectural Screen",
        imageSrc: "/images/collections/architectural.webp"
      },
      {
        title: "Botanical Carved Relief Panel",
        material: "Beige Stone",
        type: "Feature Wall",
        imageSrc: "/images/collections/luxury.webp"
      }
    ],
    cta: {
      eyebrow: "ARCHITECTURAL WALL FEATURE",
      heading: "Design a Custom Stone Wall Feature",
      description: "Transform residential or commercial interiors with bespoke high-relief murals and carved stone feature walls.",
      primaryCtaText: "Commission Wall Art",
      primaryCtaHref: "/contact?type=custom&collection=wall-art-reliefs"
    }
  },

  "temples-architectural-stonework": {
    eyebrow: "SANCTUARY ARCHITECTURE & STRUCTURAL MASONRY",
    tagline: "Bespoke Marble Home Mandirs, Carved Pillars & Sacred Architectural Masonry",
    badgeTitle: "Structural Joinery",
    badgeValue: "Interlocking Stone Engineering",
    heroImageSrc: "/images/collections/temples-architectural.webp",
    metrics: [
      { label: "Primary Stone", value: "Makrana Marble & Sandstone" },
      { label: "Construction", value: "Traditional Interlocking Joinery" },
      { label: "Customization", value: "Full CAD Architectural Plans" },
      { label: "Shipment", value: "Numbered ISPM-15 Crates" }
    ],
    materials: [
      {
        name: "Makrana White Marble",
        origin: "Nagaur, Rajasthan",
        description: "Premium white calcitic stone used in iconic home mandirs and sacred temple pillars.",
        href: "/marble"
      },
      {
        name: "Bansi Paharpur Pink Sandstone",
        origin: "Bharatpur, Rajasthan",
        description: "Historic temple sandstone used in grand shikhara domes and carved exterior facades.",
        href: "/marble"
      },
      {
        name: "Dholpur Beige Sandstone",
        origin: "Dholpur, Rajasthan",
        description: "Uniform buff sandstone ideal for large architectural columns, arches, and balustrades.",
        href: "/marble"
      }
    ],
    processSteps: [
      {
        title: "3D CAD & Architectural Modeling",
        description: "Developing full structural 3D CAD models and stone block piece numbers."
      },
      {
        title: "Pillar & Arch Chiseling",
        description: "Turning solid stone columns on lathes and hand-carving ornate floral capitals."
      },
      {
        title: "Dry Assembly in Workshop",
        description: "Pre-assembling the entire mandir or facade in our Jaipur yard to verify tolerances."
      },
      {
        title: "Crating & Installation Guide",
        description: "Packing clearly numbered components with detailed site placement manuals."
      }
    ],
    artworks: [
      {
        title: "Bespoke White Marble Home Mandir",
        material: "Makrana White Marble",
        type: "Sanctuary Temple",
        imageSrc: "/images/creations/marble-home-mandir.jpg"
      },
      {
        title: "Carved Temple Pillar & Arch",
        material: "Pink Sandstone",
        type: "Architectural Pillar",
        imageSrc: "/images/collections/temples-architectural.webp"
      },
      {
        title: "Heritage Jharokha Window",
        material: "Sandstone",
        type: "Facade Architectural Element",
        imageSrc: "/images/collections/architectural.webp"
      }
    ],
    cta: {
      eyebrow: "BESPOKE TEMPLE & MASONRY",
      heading: "Build a Bespoke Stone Mandir or Temple",
      description: "Our architects and master masons design complete home temples and architectural stonework from blueprint to site assembly.",
      primaryCtaText: "Start Temple Project",
      primaryCtaHref: "/contact?type=custom&collection=temples-architectural-stonework"
    }
  },

  "fountains-water-features": {
    eyebrow: "COURTYARD WATER SCULPTURES & FOUNTAINS",
    tagline: "Tiered Courtyard Fountains, Lotus Basins & Cascading Stone Water Features",
    badgeTitle: "Water Kinetics",
    badgeValue: "Precision Spillways & Sealed Joints",
    heroImageSrc: "/images/collections/garden.webp",
    metrics: [
      { label: "Primary Stone", value: "Sandstone & Marble" },
      { label: "Waterproofing", value: "Non-Porous Sealed Joints" },
      { label: "Spillway Tuning", value: "Calibrated Sheet Flow" },
      { label: "Application", value: "Courtyards & Poolsides" }
    ],
    materials: [
      {
        name: "Bansi Pink Sandstone",
        origin: "Bharatpur, Rajasthan",
        description: "Weathers gracefully outdoors with running water, developing a rich antique patina.",
        href: "/marble"
      },
      {
        name: "Makrana White Marble",
        origin: "Nagaur, Rajasthan",
        description: "Impervious calcitic marble ensuring zero water absorption and brilliant water reflections.",
        href: "/marble"
      },
      {
        name: "Black Rajasthan Marble",
        origin: "Bhainslana, Rajasthan",
        description: "Creates mirror-like black water reflections for modern cascading waterfalls.",
        href: "/marble"
      }
    ],
    processSteps: [
      {
        title: "Hydro-Dynamic Design",
        description: "Designing spillway lips and basin depths for splash-free water circulation."
      },
      {
        title: "Basin Turning & Chiseling",
        description: "Turning multi-tiered lotus basins from solid monolithic stone blocks."
      },
      {
        title: "Internal Plumbing Routing",
        description: "Drilling internal water channels for hidden pump pipes and ambient LED wiring."
      },
      {
        title: "Water Flow Testing",
        description: "Testing water circulation in our workshop to guarantee uniform spillway flow."
      }
    ],
    artworks: [
      {
        title: "3-Tier Royal Lotus Courtyard Fountain",
        material: "Bansi Pink Sandstone",
        type: "Courtyard Fountain",
        imageSrc: "/images/collections/garden.webp"
      },
      {
        title: "Cascading Stone Water Wall",
        material: "Black Marble",
        type: "Waterfall Feature",
        imageSrc: "/images/collections/luxury.webp"
      },
      {
        title: "Sculptural Water Spout Basin",
        material: "White Marble",
        type: "Architectural Fountain",
        imageSrc: "/images/collections/sacred.webp"
      }
    ],
    cta: {
      eyebrow: "WATER FEATURE COMMISSION",
      heading: "Commission a Custom Stone Fountain",
      description: "Elevate your garden or courtyard with a hand-carved stone water feature engineered for quiet elegance.",
      primaryCtaText: "Discuss Fountain Design",
      primaryCtaHref: "/contact?type=custom&collection=fountains-water-features"
    }
  },

  "decorative-stone-art": {
    eyebrow: "INTERIOR ACCENTS & HANDCRAFTED STONE DÉCOR",
    tagline: "Hand-Carved Marble Vases, Tabletop Statuettes & Refined Garden Art",
    badgeTitle: "Detail Fineness",
    badgeValue: "Micro-Chiseled Artisan Accents",
    heroImageSrc: "/images/collections/luxury.webp",
    metrics: [
      { label: "Primary Stone", value: "White Marble & Onyx" },
      { label: "Finish Level", value: "Silky Smooth Hand Polish" },
      { label: "Application", value: "Luxury Interiors & Gardens" },
      { label: "Craftsmanship", value: "Generational Fine Detailing" }
    ],
    materials: [
      {
        name: "Makrana White Marble",
        origin: "Nagaur, Rajasthan",
        description: "Pure calcitic stone ideal for refined interior vases, pedestals, and decor objects.",
        href: "/marble"
      },
      {
        name: "Pink Sandstone & Onyx",
        origin: "Rajasthan Bed",
        description: "Translucent natural stone accents that filter light in sculptural lamps and bowls.",
        href: "/marble"
      },
      {
        name: "Dholpur Sandstone",
        origin: "Dholpur, Rajasthan",
        description: "Durable natural stone for garden lanterns, outdoor planters, and stone benches.",
        href: "/marble"
      }
    ],
    processSteps: [
      {
        title: "Block Selection & Sizing",
        description: "Selecting compact, high-clarity stone pieces ideal for detailed tabletop artwork."
      },
      {
        title: "Precision Turning & Carving",
        description: "Forming graceful curves on lathes followed by delicate hand-embossing."
      },
      {
        title: "Intaglio & Inlay Detailing",
        description: "Optionally hand-inlaying semi-precious stone accents or delicate floral relief."
      },
      {
        title: "Fine Hand Wax Buffing",
        description: "Buffing with natural beeswax to enhance natural stone grain and sheen."
      }
    ],
    artworks: [
      {
        title: "Carved Marble Fluted Vase",
        material: "Makrana White Marble",
        type: "Interior Stone Vase",
        imageSrc: "/images/collections/luxury.webp"
      },
      {
        title: "Hand-Carved Stone Garden Lantern",
        material: "Dholpur Sandstone",
        type: "Garden Decor",
        imageSrc: "/images/collections/garden.webp"
      },
      {
        title: "Tabletop Marble Statuette",
        material: "White Marble",
        type: "Collectible Art",
        imageSrc: "/images/collections/sacred.webp"
      }
    ],
    cta: {
      eyebrow: "INTERIOR STONE ACCENTS",
      heading: "Order Bespoke Stone Décor & Accents",
      description: "Inquire about custom dimensions, stone colors, or bulk decorative accents for luxury interior projects.",
      primaryCtaText: "Inquire Stone Décor",
      primaryCtaHref: "/contact?type=custom&collection=decorative-stone-art"
    }
  },

  "custom-bespoke-creations": {
    eyebrow: "BESPOKE ATELIER & COMMISSIONED MASONRY",
    tagline: "Tailored Deity Statues, Memorial Portraits & Custom Architectural Commissions",
    badgeTitle: "Consultative Atelier",
    badgeValue: "Sketch-to-Stone Engineering",
    heroImageSrc: "/images/collections/custom.webp",
    metrics: [
      { label: "Process", value: "Concept Sketch to Site Delivery" },
      { label: "Clay Prototyping", value: "Client Approval Before Carving" },
      { label: "Custom Scaling", value: "Any Architectural CAD Size" },
      { label: "Global Logistics", value: "Fumigated ISPM-15 Crating" }
    ],
    materials: [
      {
        name: "Makrana White Marble",
        origin: "Nagaur, Rajasthan",
        description: "The definitive choice for custom portrait busts, deity idols, and fine monuments.",
        href: "/marble"
      },
      {
        name: "Bansi Paharpur Sandstone",
        origin: "Bharatpur, Rajasthan",
        description: "Royal pink sandstone for custom architectural facades and heritage restorations.",
        href: "/marble"
      },
      {
        name: "Black & Coloured Marbles",
        origin: "Rajasthan Quarries",
        description: "Custom stone color combinations tailored to architect specifications.",
        href: "/marble"
      }
    ],
    processSteps: [
      {
        title: "Consultation & CAD Review",
        description: "Reviewing client sketches, photos, or architectural blueprints with our design team."
      },
      {
        title: "Clay Model Prototyping",
        description: "Creating a full-scale clay model for client review and feedback before stone chiseling."
      },
      {
        title: "Master Stone Carving",
        description: "Carving the finalized design from solid natural stone blocks in our Jaipur atelier."
      },
      {
        title: "Global Secure Freight",
        description: "Custom wooden crating and international doorstep delivery coordination."
      }
    ],
    artworks: [
      {
        title: "Commissioned Ancestral Portrait Bust",
        material: "White Marble",
        type: "Custom Portrait",
        imageSrc: "/images/collections/custom.webp"
      },
      {
        title: "Bespoke Heritage Gateway Arch",
        material: "Pink Sandstone",
        type: "Architectural Project",
        imageSrc: "/images/collections/architectural.webp"
      },
      {
        title: "Monumental Deity Statue",
        material: "Makrana Marble",
        type: "Sacred Commission",
        imageSrc: "/images/collections/hero-sculptures-group.webp"
      }
    ],
    cta: {
      eyebrow: "BESPOKE COMMISSION ATELIER",
      heading: "Start Your Custom Commission",
      description: "Have a unique sketch, CAD blueprint, or photo reference? Connect with our master sculptors today.",
      primaryCtaText: "Start Bespoke Project",
      primaryCtaHref: "/contact?type=custom"
    }
  }
};

export function getCollectionPersonality(slug) {
  return collectionPersonalities[slug] || collectionPersonalities["sculptures-statues"];
}
