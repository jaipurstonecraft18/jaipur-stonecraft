/**
 * Jaipur Stonecraft — Dual Discovery Sliders Configuration
 * 
 * Defines curated popular statues and architectural stonework categories
 * for continuous horizontal discovery gallery below hero & trust strip.
 * All href destinations link to verified canonical routes in the application.
 */

export const popularStatuesData = {
  enabled: true,
  eyebrow: "POPULAR CHOICES",
  heading: "Most Sought-After Marble Statues",
  supportingText: "Sacred forms. Timeless craftsmanship.",
  exploreText: "EXPLORE ALL STATUES",
  exploreHref: "/collections/sculptures-statues",
  items: [
    {
      id: "statue-ganesha",
      entityType: "category",
      entitySlug: "ganesh-ji",
      title: "Lord Ganesha",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/ganesh-ji-1789471991997-mhytk.webp",
      fallbackImage: "/images/brand/heritage-ganesha.webp",
      imageAlt: "Handcrafted white marble Lord Ganesha deity statue with ornate mukut",
      href: "/collections/sculptures-statues/hindu-sculptures/ganesh-ji",
      isActive: true
    },
    {
      id: "statue-shiva",
      entityType: "category",
      entitySlug: "shiva-ji",
      title: "Lord Shiva",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/shiva-ji-1789474822681-7nygs.webp",
      imageAlt: "Meditating Lord Shiva statue sculpted from pure white Makrana marble",
      href: "/collections/sculptures-statues/hindu-sculptures/shiva-ji",
      isActive: true
    },
    {
      id: "statue-radha-krishna",
      entityType: "category",
      entitySlug: "radha-krishna",
      title: "Radha Krishna",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/radha-krishna-1789476292722-xp331.webp",
      imageAlt: "Intricately detailed Radha Krishna divine pair marble sculpture",
      href: "/collections/sculptures-statues/hindu-sculptures/radha-krishna",
      isActive: true
    },
    {
      id: "statue-krishna",
      entityType: "category",
      entitySlug: "krishna-ji",
      title: "Lord Krishna",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/krishna-ji-1789473043099-qa25k.webp",
      fallbackImage: "/images/hero/hero-krishna-artisan.webp",
      imageAlt: "Master white marble Lord Krishna statue playing bansuri",
      href: "/collections/sculptures-statues/hindu-sculptures/krishna-ji",
      isActive: true
    },
    {
      id: "statue-hanuman",
      entityType: "category",
      entitySlug: "hanuman-ji",
      title: "Hanuman Ji",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/hanuman-ji-1789474284146-xq3jf.webp",
      imageAlt: "Devotional Lord Hanuman marble statue carved in traditional stance",
      href: "/collections/sculptures-statues/hindu-sculptures/hanuman-ji",
      isActive: true
    },
    {
      id: "statue-durga",
      entityType: "category",
      entitySlug: "durga-ji",
      title: "Maa Durga",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/durga-ji-1789476561773-11u8h.webp",
      imageAlt: "Maa Durga marble deity idol with traditional weapons and lion mount",
      href: "/collections/sculptures-statues/hindu-sculptures/durga-ji",
      isActive: true
    },
    {
      id: "statue-saraswati",
      entityType: "category",
      entitySlug: "saraswati-ji",
      title: "Saraswati Mata",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/saraswati-ji-1789482356633-j5ef5.webp",
      imageAlt: "Hand-carved Goddess Saraswati marble statue with veena",
      href: "/collections/sculptures-statues/hindu-sculptures/saraswati-ji",
      isActive: true
    },
    {
      id: "statue-lakshmi",
      entityType: "category",
      entitySlug: "lakshmi-ji",
      title: "Goddess Lakshmi",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/lakshmi-ji-1789482097538-kg6pl.webp",
      imageAlt: "Goddess Lakshmi white marble idol on lotus pedestal",
      href: "/collections/sculptures-statues/hindu-sculptures/lakshmi-ji",
      isActive: true
    },
    {
      id: "statue-ram-darbar",
      entityType: "category",
      entitySlug: "ram-darbar",
      title: "Ram Darbar",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/ram-darbar-1789804266160-exo6u.webp",
      imageAlt: "Complete Ram Darbar white marble statue set for home mandir",
      href: "/collections/sculptures-statues/hindu-sculptures/ram-darbar",
      isActive: true
    },
    {
      id: "statue-buddha",
      entityType: "category",
      entitySlug: "buddha-statues",
      title: "Lord Buddha",
      category: "Marble Statues",
      imageSrc: "/uploads/categories/display/buddha-statues-1788269035210-k9www.webp",
      imageAlt: "Serene Buddha meditative sculpture carved in white stone",
      href: "/collections/sculptures-statues/buddhist-jain-sculptures/buddha-statues",
      isActive: true
    },
    {
      id: "statue-portrait",
      entityType: "subcategory",
      entitySlug: "human-portrait-sculptures",
      title: "Portrait Sculptures",
      category: "Marble & Bronze",
      imageSrc: "/uploads/categories/display/human-portrait-sculptures-1788527675376-eplb8.webp",
      fallbackImage: "/images/collections/custom.webp",
      imageAlt: "Custom portrait busts and figurative human stone sculptures",
      href: "/collections/sculptures-statues/human-portrait-sculptures",
      isActive: true
    }
  ]
};

export const architecturalArtData = {
  enabled: true,
  eyebrow: "EXPLORE SPACES",
  heading: "Murals, Jalis, Mandirs & Architectural Art",
  supportingText: "Stonework crafted for walls, spaces and sacred places.",
  exploreText: "EXPLORE ALL ARCHITECTURAL ART",
  exploreHref: "/collections/temples-architectural-stonework",
  items: [
    {
      id: "arch-wall-murals",
      entityType: "collection",
      entitySlug: "wall-art-reliefs",
      title: "Marble Wall Murals",
      category: "Reliefs & Carvings",
      imageSrc: "/uploads/categories/display/wall-art-reliefs-1787907673529-6puo6.webp",
      fallbackImage: "/images/collections/wall-art-relief.webp",
      imageAlt: "Spiritual high-relief stone wall mural carving for heritage interior",
      href: "/collections/wall-art-reliefs",
      isActive: true
    },
    {
      id: "arch-jali-screens",
      entityType: "category",
      entitySlug: "marble-jali-designs",
      title: "Marble Jali Screens",
      category: "Lattice Architecture",
      imageSrc: "/images/collections/architectural.webp",
      imageAlt: "Intricately carved marble jali screens and ornamental lattice panels",
      href: "/collections/temples-architectural-stonework/jali-designs/marble-jali-designs",
      isActive: true
    },
    {
      id: "arch-mandirs",
      entityType: "subcategory",
      entitySlug: "mandirs-temples",
      title: "Marble Mandirs",
      category: "Sacred Sanctuaries",
      imageSrc: "/images/creations/marble-home-mandir.jpg",
      imageAlt: "Bespoke hand-carved white marble home mandir temple with pillared arch",
      href: "/collections/temples-architectural-stonework/mandirs-temples",
      isActive: true
    },
    {
      id: "arch-temple-architecture",
      entityType: "category",
      entitySlug: "temple-parts-designs",
      title: "Temple Architecture",
      category: "Shikharas & Pillars",
      imageSrc: "/uploads/categories/display/temples-architectural-stonework-1787907938061-ica6c.webp",
      fallbackImage: "/images/collections/temples-architectural.webp",
      imageAlt: "Traditional marble temple architecture, structural domes and mandapas",
      href: "/collections/temples-architectural-stonework/mandirs-temples/temple-parts-designs",
      isActive: true
    },
    {
      id: "arch-fountains",
      entityType: "collection",
      entitySlug: "fountains-water-features",
      title: "Fountains & Water Features",
      category: "Courtyard & Garden",
      imageSrc: "/uploads/categories/display/fountains-water-features-1787911434282-6jjjs.webp",
      fallbackImage: "/images/collections/garden.webp",
      imageAlt: "Tiered marble courtyard fountains and carved stone water features",
      href: "/collections/fountains-water-features",
      isActive: true
    },
    {
      id: "arch-decorative-panels",
      entityType: "subcategory",
      entitySlug: "heritage-decorative-wall-art",
      title: "Decorative Relief Panels",
      category: "Heritage Patterns",
      imageSrc: "/images/collections/luxury.webp",
      imageAlt: "Floral and geometric hand-carved decorative stone wall panels",
      href: "/collections/wall-art-reliefs/heritage-decorative-wall-art",
      isActive: true
    },
    {
      id: "arch-elements",
      entityType: "subcategory",
      entitySlug: "pillars-columns",
      title: "Architectural Elements",
      category: "Columns & Facades",
      imageSrc: "/images/collections/custom.webp",
      imageAlt: "Carved stone columns, balustrades, jharokha windows and door frames",
      href: "/collections/temples-architectural-stonework/pillars-columns",
      isActive: true
    }
  ]
};
