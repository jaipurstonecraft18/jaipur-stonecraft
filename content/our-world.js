/**
 * Jaipur Stonecraft — Our World Visual Portfolio & Editorial Dataset
 * 
 * Strict Rules:
 * - 100% verified real assets on disk
 * - No granite
 * - Clean category tagging for editorial gallery filtering
 */

export const defaultOurWorldContent = {
  hero: {
    eyebrow: "THE WORLD OF JAIPUR STONECRAFT",
    heading: "Stone, Culture. Timeless Beauty.",
    description: "From sacred sculptures to architectural masterpieces, our work reflects centuries of heritage, the skill of master artisans, and a devotion to perfection.",
    primaryCtaText: "DISCOVER OUR WORLD",
    primaryCtaHref: "#gallery-showcase",
    backgroundImage: "/images/collections/temples-architectural.webp"
  },
  categories: [
    { id: "all", label: "All Works" },
    { id: "sculptures", label: "Sculptures" },
    { id: "architectural", label: "Architectural Elements" },
    { id: "jalis", label: "Jalis & Screens" },
    { id: "fountains", label: "Fountains" },
    { id: "custom", label: "Custom Creations" }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Grand Shikhara Temple Sanctuary",
      category: "architectural",
      categoryLabel: "Architectural Elements",
      material: "Makrana White Marble",
      imageSrc: "/images/collections/temples-architectural.webp",
      altText: "Hand-carved white marble temple shikhara and colonnade by Jaipur Stonecraft",
      aspectRatio: "tall", // featured tall in column 1
      featured: true
    },
    {
      id: "gal-2",
      title: "Generational Master Hand Chiseling",
      category: "custom",
      categoryLabel: "Custom Creations",
      material: "Artisan Masonry",
      imageSrc: "/images/craftsmanship/artisan-hands.png",
      altText: "Master artisan hands carving white marble with mallet and steel chisel",
      aspectRatio: "square"
    },
    {
      id: "gal-3",
      title: "High-Relief Devotional Wall Mural",
      category: "jalis",
      categoryLabel: "Jalis & Screens",
      material: "Natural Sandstone",
      imageSrc: "/images/collections/wall-art-relief.webp",
      altText: "Intricate floral high-relief stone wall panel",
      aspectRatio: "square"
    },
    {
      id: "gal-4",
      title: "Lattice Geometric Jali Screen",
      category: "jalis",
      categoryLabel: "Jalis & Screens",
      material: "Beige Sandstone",
      imageSrc: "/images/collections/luxury.webp",
      altText: "Perforated stone jali lattice screen for architectural privacy facade",
      aspectRatio: "square"
    },
    {
      id: "gal-5",
      title: "Sacred Saraswati & Krishna Deities",
      category: "sculptures",
      categoryLabel: "Sculptures",
      material: "Pure Makrana Marble",
      imageSrc: "/images/collections/hero-sculptures-group.webp",
      altText: "White marble carved Hindu deity idols in Jaipur atelier",
      aspectRatio: "centerpiece", // dominant center piece
      featured: true
    },
    {
      id: "gal-6",
      title: "Heritage Pillar Capital Carving",
      category: "architectural",
      categoryLabel: "Architectural Elements",
      material: "Rajasthan Sandstone",
      imageSrc: "/images/collections/architectural.webp",
      altText: "Ornate carved stone pillar capital with floral brackets",
      aspectRatio: "square"
    },
    {
      id: "gal-7",
      title: "Lord Ganesha Sanctuary Idol",
      category: "sculptures",
      categoryLabel: "Sculptures",
      material: "Hand-honed Marble",
      imageSrc: "/images/brand/heritage-ganesha.jpg",
      altText: "Majestic Lord Ganesha stone sculpture carved by master sculptors",
      aspectRatio: "square"
    },
    {
      id: "gal-8",
      title: "Tiered Courtyard Lotus Fountain",
      category: "fountains",
      categoryLabel: "Fountains & Water Features",
      material: "Pink Sandstone",
      imageSrc: "/images/collections/garden.webp",
      altText: "Hand-carved tiered lotus water fountain basin for courtyard landscape",
      aspectRatio: "tall"
    },
    {
      id: "gal-9",
      title: "Classical Colonnade Heritage Corridor",
      category: "architectural",
      categoryLabel: "Architectural Elements",
      material: "Carved Stone Columns",
      imageSrc: "/uploads/categories/display/temples-architectural-stonework-1787907938061-ica6c.webp",
      altText: "Symmetrical carved stone colonnade corridor in palace courtyard",
      aspectRatio: "landscape"
    },
    {
      id: "gal-10",
      title: "Intricate Floral Wall Art Medallion",
      category: "jalis",
      categoryLabel: "Jalis & Screens",
      material: "White Marble Inset",
      imageSrc: "/uploads/categories/display/wall-art-reliefs-1787907673529-6puo6.webp",
      altText: "Fine botanical relief carving medallion in natural stone",
      aspectRatio: "square"
    },
    {
      id: "gal-11",
      title: "Classical Multitier Stone Fountain",
      category: "fountains",
      categoryLabel: "Fountains & Water Features",
      material: "Waterproof Honed Stone",
      imageSrc: "/uploads/categories/display/fountains-water-features-1787911434282-6jjjs.webp",
      altText: "Multitier stone water fountain with sculptural spouts",
      aspectRatio: "square"
    },
    {
      id: "gal-12",
      title: "Bespoke Ancestral Portrait Sculpture",
      category: "custom",
      categoryLabel: "Custom Creations",
      material: "Makrana Pure Marble",
      imageSrc: "/images/collections/custom.webp",
      altText: "Custom life-size portrait bust carved from client photograph references",
      aspectRatio: "tall"
    },
    {
      id: "gal-13",
      title: "Lord Krishna Alcove Statue",
      category: "sculptures",
      categoryLabel: "Sculptures",
      material: "Makrana Pure White Marble",
      imageSrc: "/images/creations/krishna-alcove.jpg",
      altText: "Devotional Lord Krishna marble murti with delicate ornamentation",
      aspectRatio: "square"
    },
    {
      id: "gal-14",
      title: "Sacred Black Nandi Guardian",
      category: "sculptures",
      categoryLabel: "Sculptures",
      material: "Black Bhainslana Marble",
      imageSrc: "/images/creations/black-nandi-statue.jpg",
      altText: "Traditional hand-carved black stone Nandi bull idol",
      aspectRatio: "square"
    },
    {
      id: "gal-15",
      title: "Serene Seated Buddha Murti",
      category: "sculptures",
      categoryLabel: "Sculptures",
      material: "Honed White Marble",
      imageSrc: "/uploads/categories/display/buddha-statues-1788269035210-k9www.webp",
      altText: "Meditating Buddha statue carved in pure white marble",
      aspectRatio: "tall"
    },
    {
      id: "gal-16",
      title: "Bespoke Home Mandir Sanctuary",
      category: "architectural",
      categoryLabel: "Architectural Elements",
      material: "Makrana Pristine White",
      imageSrc: "/images/creations/marble-home-mandir.jpg",
      altText: "Custom carved marble home temple with ornate shikhar and pillars",
      aspectRatio: "square"
    }
  ],
  featuredProjects: [
    {
      id: "fp-1",
      slug: "london-temple",
      title: "London Temple Columns & Arches",
      category: "Temple Architecture",
      location: "London, UK",
      description: "Structural marble columns and ornate temple arches carved in Jaipur and installed for an international sanctuary.",
      imageSrc: "/images/collections/temples-architectural.webp",
      href: "/projects/london-temple"
    },
    {
      id: "fp-2",
      slug: "private-shrine",
      title: "Private Residence Shrine",
      category: "Residential Mandir",
      location: "New Delhi, India",
      description: "Bespoke Makrana white marble home mandir featuring hand-carved pillars and devotional backdrop panels.",
      imageSrc: "/images/creations/marble-home-mandir.jpg",
      href: "/projects/private-shrine"
    },
    {
      id: "fp-3",
      slug: "resort-facade",
      title: "Resort Facade Pillar System",
      category: "Hospitality Architecture",
      location: "Udaipur, Rajasthan",
      description: "Load-bearing sandstone colonnades, fluted capitals, and arched portico elements for a luxury heritage resort.",
      imageSrc: "/images/collections/architectural.webp",
      href: "/projects/resort-facade"
    },
    {
      id: "fp-4",
      slug: "estate-boundary",
      title: "Estate Boundary Landscape",
      category: "Garden & Landscape",
      location: "Jaipur, Rajasthan",
      description: "Custom sandstone pavilions, tiered lotus fountains, and carved landscape perimeter stonework across private estate grounds.",
      imageSrc: "/images/collections/garden.webp",
      href: "/projects/estate-boundary"
    }
  ],
  whatWeCreate: [
    {
      id: "wwc-1",
      title: "Sculptures",
      description: "Divine deity murtis, figurative statues, and sacred icons hand-carved according to authentic iconographic proportions.",
      linkText: "EXPLORE SCULPTURES",
      linkHref: "/collections/sculptures-statues",
      iconKey: "sculpture"
    },
    {
      id: "wwc-2",
      title: "Architectural Stonework",
      description: "Carved stone columns, temple arches, balustrades, jharokha windows, and bespoke facades engineered for structural endurance.",
      linkText: "EXPLORE ARCHITECTURAL WORK",
      linkHref: "/collections/temples-architectural-stonework",
      iconKey: "architecture"
    },
    {
      id: "wwc-3",
      title: "Fountains & Water Features",
      description: "Cascading stone walls, tiered courtyard lotus fountains, and architectural water elements that bring tranquility to luxury spaces.",
      linkText: "EXPLORE FOUNTAINS",
      linkHref: "/collections/fountains-water-features",
      iconKey: "fountain"
    },
    {
      id: "wwc-4",
      title: "Custom Creations",
      description: "Bespoke portrait busts, custom dimensional murals, and private commissions crafted directly from blueprints and client sketches.",
      linkText: "DISCUSS YOUR PROJECT",
      linkHref: "/contact?type=custom",
      iconKey: "custom"
    }
  ],
  closingCta: {
    eyebrow: "LET'S CREATE SOMETHING TIMELESS",
    heading: "Have a Vision in Mind?",
    description: "Whether it's a statement sculpture, an architectural temple element, or a bespoke stone commission, our Jaipur atelier welcomes your vision.",
    primaryCtaText: "DISCUSS A BESPOKE PROJECT",
    primaryCtaHref: "/contact?type=custom",
    secondaryCtaText: "VISIT OUR WORKSHOP",
    secondaryCtaHref: "/contact?type=visit",
    imageSrc: "/images/creations/krishna-alcove.jpg"
  }
};
