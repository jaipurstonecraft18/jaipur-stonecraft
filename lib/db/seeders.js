import { query, getOne, execute, initDB } from "./client.js";
import { projectsData } from "@/content/projects.js";
import { defaultOurWorldContent } from "@/content/our-world.js";

// Default Page Sections Content
const DEFAULT_PAGE_SECTIONS = [
  {
    key_name: "homepage_hero",
    page: "Homepage",
    section_id: "hero",
    label: "Homepage → Hero Banner & Copy",
    content_json: JSON.stringify({
      eyebrow: "TIMELESS ART. CARVED BY HAND.",
      description: "Handcrafted sculptures, architectural stonework, and timeless creations shaped by master artisans with devotion and precision.",
      primaryCtaText: "Explore Our Collections",
      primaryCtaHref: "/collections",
      secondaryCtaText: "Start a Custom Project",
      secondaryCtaHref: "/contact?type=custom",
      imageSrc: "/images/hero/hero-krishna-artisan.jpg"
    })
  },
  {
    key_name: "homepage_trust_strip",
    page: "Homepage",
    section_id: "trust_strip",
    label: "Homepage → Statistics & Achievements Bar",
    content_json: JSON.stringify({
      stats: [
        { label: "Generations of Craft", value: "3+" },
        { label: "Master Artisans in Atelier", value: "500+" },
        { label: "Countries Shipped & Installed", value: "25+" },
        { label: "Bespoke Commissions Delivered", value: "1000+" }
      ]
    })
  },
  {
    key_name: "homepage_story",
    page: "Homepage",
    section_id: "story",
    label: "Homepage → Heritage Story Section",
    content_json: JSON.stringify({
      eyebrow: "Generational Lineage",
      heading: "Passing Down the Chisel Through Generations",
      paragraph1: "In the heart of Jaipur, our master sculptors honor centuries of traditional stone carving techniques. Every statue begins as a solid block of Makrana marble or pink sandstone, meticulously shaped using traditional chisels and hand-carving methods.",
      paragraph2: "We preserve ancient Indian iconography while crafting statues and architectural stonework for modern temples, private shrines, and luxury heritage residences worldwide.",
      quote: "Stone endures across centuries. When shaped with devotion, a sculpture becomes a living legacy.",
      imageSrc: "/images/collections/custom.webp"
    })
  },
  {
    key_name: "homepage_cta",
    page: "Homepage",
    section_id: "cta",
    label: "Homepage → Closing Conversion CTA Section",
    content_json: JSON.stringify({
      heading: "Have a Vision in Mind?",
      description: "Whether you have a hand sketch, architectural CAD blueprint, or a reference photo, our atelier team will guide your custom stone creation from block selection to global delivery.",
      primaryCtaText: "Discuss Your Project",
      primaryCtaHref: "/contact?type=custom",
      secondaryCtaText: "Request a Quote",
      secondaryCtaHref: "/contact?type=quote"
    })
  },
  {
    key_name: "homepage_reviews",
    page: "Homepage",
    section_id: "reviews",
    label: "Homepage → Client Testimonials & Reviews",
    content_json: JSON.stringify({
      eyebrow: "WHAT OUR CLIENTS SAY",
      heading: "Trusted by Devotees. Loved for Generations.",
      reviews: [
        {
          id: "1",
          stars: 5,
          quote: "Exceptional craftsmanship and top-notch quality. The statue has brought so much divinity to our home.",
          author: "Anjali Sharma",
          location: "Jaipur, India",
          imageSrc: "",
          initials: "AS"
        },
        {
          id: "2",
          stars: 5,
          quote: "From design to delivery, everything was seamless. Highly professional and very cooperative team.",
          author: "Vikram Mehta",
          location: "Delhi, India",
          imageSrc: "",
          initials: "VM"
        },
        {
          id: "3",
          stars: 5,
          quote: "The marble finish and detailing are simply breathtaking. Thank you Jaipur Stonecraft!",
          author: "Neetu Agarwal",
          location: "Mumbai, India",
          imageSrc: "",
          initials: "NA"
        },
        {
          id: "4",
          stars: 5,
          quote: "We received our custom temple on time and the quality exceeded our expectations.",
          author: "Suresh Reddy",
          location: "Hyderabad, India",
          imageSrc: "",
          initials: "SR"
        }
      ]
    })
  },
  {
    key_name: "homepage_featured_creations",
    page: "Homepage",
    section_id: "featured_creations",
    label: "Homepage → Featured Creations & Testimonials Mosaic (From Our Hands to Your World)",
    content_json: JSON.stringify({
      eyebrow: "CRAFTED FOR REAL SPACES",
      heading: "From Our Hands to Your World.",
      description: "A glimpse of sculptures and creations crafted for our valued clients and the spaces they cherish.",
      ctaText: "View All Creations",
      ctaHref: "/projects",
      items: [
        {
          id: "1",
          type: "image",
          src: "/images/brand/heritage-ganesha.webp",
          alt: "White Marble Lord Ganesha Statue adorned with marigolds",
          title: "White Marble Ganesha Murti",
          gridClass: "tileGanesha",
          isActive: true
        },
        {
          id: "2",
          type: "quote",
          stars: 5,
          quote: "The detailing, finish and divine presence of the idol is beyond words. Truly exceptional work.",
          author: "Rajesh S.",
          location: "Jaipur",
          gridClass: "tileQuote1",
          isActive: true
        },
        {
          id: "3",
          type: "image",
          src: "/images/creations/sai-baba-seated.webp",
          alt: "Seated Sai Baba White Marble Sculpture",
          title: "Sai Baba Devotional Statue",
          gridClass: "tileSaiBaba",
          isActive: true
        },
        {
          id: "4",
          type: "quote",
          stars: 5,
          quote: "Beautifully crafted with incredible attention to detail and delivered with care.",
          author: "Meera K.",
          location: "Delhi",
          gridClass: "tileQuote2",
          isActive: true
        },
        {
          id: "5",
          type: "image",
          src: "/images/creations/krishna-alcove.webp",
          alt: "Lord Krishna Marble Statue in Temple Alcove",
          title: "Krishna Mandir Alcove Sculpture",
          gridClass: "tileKrishna",
          isActive: true
        },
        {
          id: "6",
          type: "quote",
          stars: 5,
          quote: "The portrait statue captured every detail perfectly. We are extremely happy!",
          author: "Amit P.",
          location: "Mumbai",
          gridClass: "tileQuote3",
          isActive: true
        },
        {
          id: "7",
          type: "image",
          src: "/images/collections/hero-sculptures-group.webp",
          alt: "Hand-Carved Marble Portrait Bust Sculpture",
          title: "Bespoke Portrait Bust",
          gridClass: "tileBust",
          isActive: true
        },
        {
          id: "8",
          type: "image",
          src: "/images/creations/marble-home-mandir.webp",
          alt: "Custom Carved White Marble Home Mandir Temple",
          title: "Custom Home Mandir Sanctuary",
          gridClass: "tileMandir",
          isActive: true
        },
        {
          id: "9",
          type: "quote",
          stars: 5,
          quote: "Our temple is now complete because of your amazing art.",
          author: "Shyam Family",
          location: "Bangalore",
          gridClass: "tileQuote4",
          isActive: true
        },
        {
          id: "10",
          type: "image",
          src: "/images/creations/black-nandi-statue.webp",
          alt: "Hand-Carved Black Marble Nandi Bull Sculpture",
          title: "Black Marble Nandi Murti",
          gridClass: "tileNandi",
          isActive: true
        }
      ]
    })
  },
  {
    key_name: "story_header",
    page: "Our Story",
    section_id: "header",
    label: "Our Story → 01 Hero & Editorial Header",
    content_json: JSON.stringify({
      eyebrow: "OUR STORY",
      heading: "A Story Written in Stone",
      subtitle: "Built on generations of family craftsmanship. Rooted in Rajasthan. Carried forward for tomorrow.",
      ctaText: "Our Journey",
      ctaHref: "#chapter-01",
      imageSrc: "/images/hero/hero-krishna-artisan.webp",
      imageAlt: "Jaipur Stonecraft master artisan carving white marble with hammer and chisel"
    })
  },
  {
    key_name: "story_place",
    page: "Our Story",
    section_id: "place",
    label: "Our Story → 02 Chapter 01: Place / Origin",
    content_json: JSON.stringify({
      chapter: "CHAPTER 01",
      heading: "Born in Rajasthan",
      paragraph1: "Our story is deeply connected to the historic stone hubs of Rajasthan — a land where stone is more than a material; it is a part of culture, architecture and everyday life.",
      paragraph2: "From the royal monuments of Jaipur to the quiet workshops of generational artisans, this region has nurtured an unbroken stonecraft tradition across centuries.",
      linkText: "Our Roots in Rajasthan",
      linkHref: "/craftsmanship",
      imageSrc: "/images/collections/architectural.webp",
      imageAlt: "Historic Rajasthan stone architecture and royal temple colonnade",
      overlayTitle: "Living Heritage of Rajasthan Stone Art"
    })
  },
  {
    key_name: "story_lineage",
    page: "Our Story",
    section_id: "lineage",
    label: "Our Story → 03 Chapter 02: Heritage Lineage",
    content_json: JSON.stringify({
      chapter: "CHAPTER 02",
      heading: "A Craft Passed Hand to Hand",
      paragraph1: "For more than three generations, our family and artisans have carried forward the knowledge, skills and values of traditional stonecraft — learning not just techniques, but a way of seeing, feeling and respecting stone.",
      linkText: "Our Heritage",
      linkHref: "/craftsmanship",
      milestones: [
        {
          tag: "3+ GENERATIONS",
          title: "Generations of Family Craft",
          desc: "A family lineage rooted in Rajasthan, working with authentic Makrana white marble and regional sandstones.",
          imageSrc: "/images/brand/heritage-ganesha.webp",
          imageAlt: "Generational hand-carved heritage Ganesha marble murti"
        },
        {
          tag: "HAND TO HAND",
          title: "Passed Down Through Hands",
          desc: "Traditional carving knowledge, sacred stone sculpting, and manual chiseling skills carried forward across generations.",
          imageSrc: "/images/collections/custom.webp",
          imageAlt: "Artisan hands carving stone with traditional hammer and chisel"
        },
        {
          tag: "LIVING ATELIER",
          title: "The Workshop Today",
          desc: "Our Jaipur atelier continues this living tradition, carving sacred deity murties, architectural stonework, and custom pieces.",
          imageSrc: "/images/collections/hero-sculptures-group.webp",
          imageAlt: "Master stone sculptures in Jaipur Stonecraft workshop atelier"
        }
      ]
    })
  },
  {
    key_name: "story_people",
    page: "Our Story",
    section_id: "people",
    label: "Our Story → 04 Chapter 03: People Behind the Name",
    content_json: JSON.stringify({
      chapter: "CHAPTER 03",
      heading: "The People Behind the Name",
      narrative: "Our strength lies in our people — the master sculptors, generational carvers and dedicated teams who bring this heritage to life every day. Their experience, patience and devotion are at the heart of everything we carve.",
      linkText: "Meet Our Artisans",
      linkHref: "/craftsmanship",
      imageSrc: "/images/craftsmanship/artisan-hands.webp",
      imageAlt: "Jaipur Stonecraft master artisan hands holding steel chisel",
      emphasisText: "Generations of devotion, patience, and skilled hands in our Jaipur workshop."
    })
  },
  {
    key_name: "story_values",
    page: "Our Story",
    section_id: "values",
    label: "Our Story → 05 Chapter 04: What We Carry Forward",
    content_json: JSON.stringify({
      chapter: "CHAPTER 04",
      heading: "What We Carry Forward",
      values: [
        {
          num: "01",
          title: "Respect for the Material",
          desc: "We work with authentic natural stone — Makrana marble, Bansi Paharpur sandstone, and Dholpur stone — honouring its character and natural durability."
        },
        {
          num: "02",
          title: "Knowledge in the Hands",
          desc: "Skills passed through generations of manual chiseling, refined through continuous temple and sculpture practice."
        },
        {
          num: "03",
          title: "Honest Craft",
          desc: "Every statue, wall mural, and architectural piece is carved with care, authenticity, and attention to detail."
        },
        {
          num: "04",
          title: "Precision with Purpose",
          desc: "Traditional carving skill united with architectural care for sacred sanctuaries and contemporary spaces."
        }
      ]
    })
  },
  {
    key_name: "story_stats",
    page: "Our Story",
    section_id: "stats",
    label: "Our Story → 06 Heritage & Impact Section",
    content_json: JSON.stringify({
      heading: "A Living Tradition in a Modern World",
      narrative: "Our heritage is measured not just in years, but in the trust of our clients, the dedication of our master artisans across Rajasthan, and the timeless spaces we help create around the world.",
      linkText: "Our Impact",
      linkHref: "/our-world",
      artworkSrc: "/images/creations/krishna-alcove.webp",
      artworkAlt: "Lord Krishna Marble Statue in Temple Alcove",
      stats: [
        { value: "3+", label: "Generations of Stone Carving Heritage" },
        { value: "500+", label: "Skilled Artisans Across Rajasthan" },
        { value: "25+", label: "Countries Our Sculptures Have Reached" },
        { value: "1000+", label: "Custom Sculptures & Architectural Projects Delivered" }
      ]
    })
  },
  {
    key_name: "story_evolution",
    page: "Our Story",
    section_id: "evolution",
    label: "Our Story → 07 Chapter 05: Evolution",
    content_json: JSON.stringify({
      chapter: "CHAPTER 05",
      heading: "What We Kept. What We Changed.",
      narrative: "We remain rooted in traditional handcraftsmanship, while embracing contemporary architectural design, international precision tolerances, and global collaborations. The result is a unique balance — ancestral heritage with a modern vision.",
      linkText: "Our Evolution",
      linkHref: "/collections",
      traditionalLabel: "OUR FOUNDATION",
      traditionalTitle: "Traditional Craft",
      traditionalDesc: "Ancestral hand carving, sacred geometry, and devotional stonework.",
      traditionalImage: "/images/craftsmanship/step-02-shape-precision.webp",
      traditionalAlt: "Traditional hand chiseling craftsmanship in Jaipur atelier",
      modernLabel: "NEW POSSIBILITIES",
      modernTitle: "Contemporary Spaces",
      modernDesc: "Architectural residences, bespoke temple sanctuaries, and global installations.",
      modernImage: "/images/collections/architectural.webp",
      modernAlt: "Contemporary architectural stonework and monumental pavilions"
    })
  },
  {
    key_name: "story_vision",
    page: "Our Story",
    section_id: "vision",
    label: "Our Story → 08 Chapter 06: Future Vision",
    content_json: JSON.stringify({
      chapter: "CHAPTER 06",
      heading: "Carving Indian Heritage for the World",
      subcopy: "We envision a future where the timeless stone artistry of Rajasthan continues to inspire architectural, sacred, and cultural spaces across the globe — creating meaningful, enduring monuments in natural stone.",
      linkText: "Our Vision",
      linkHref: "/contact?type=custom",
      imageSrc: "/images/collections/temples-architectural.webp",
      imageAlt: "Grand hand-carved stone temple architecture and shikhara",
      visionStatement: "A Global Bridge for Master Indian Stonework"
    })
  },
  {
    key_name: "story_cta",
    page: "Our Story",
    section_id: "cta",
    label: "Our Story → 09 Final Story CTA",
    content_json: JSON.stringify({
      eyebrow: "LET'S CREATE TOGETHER",
      heading: "Bring Your Architectural Vision to Stone",
      desc: "Connect directly with our Jaipur design office to discuss custom commissions, architectural carvings, or natural stone selection.",
      imageSrc: "/images/collections/wall-art-relief.webp",
      imageAlt: "Jaipur Stonecraft hand-carved natural stone relief texture in atelier",
      primaryCtaText: "Discuss a Commission",
      primaryCtaHref: "/contact?type=custom",
      secondaryCtaText: "WhatsApp Coordinator"
    })
  },
  {
    key_name: "our_world_page",
    page: "Our World",
    section_id: "portfolio",
    label: "Our World → Visual Brand Portfolio & Editorial Gallery",
    content_json: JSON.stringify(defaultOurWorldContent)
  },
  {
    key_name: "craftsmanship_hero",
    page: "Craftsmanship",
    section_id: "hero",
    label: "Craftsmanship → Atelier Journey Hero Manifesto",
    content_json: JSON.stringify({
      eyebrow: "ATELIER JOURNEY / FROM RAW STONE TO FINISHED ART",
      heading: "Raw Stone → Artisan Hands → Form → Detail → Finished Creation",
      description: "Every masterpiece carved at Jaipur Stonecraft begins as a single solid block selected from natural stone quarries. Explore how generational master carvers transform raw marble into timeless sacred art."
    })
  },
  {
    key_name: "homepage_social",
    page: "Homepage",
    section_id: "social",
    label: "Homepage → Beyond the Gallery (Social Section)",
    content_json: JSON.stringify({
      enabled: true,
      eyebrow: "FOLLOW THE CRAFT",
      heading: "Beyond the Gallery",
      description: "There is more to our craft than the finished piece. Discover our world across our social channels.",
      videoTitle: "CRAFT IN MOTION",
      videoMessage: "See the craft come to life.",
      videoDescription: "From raw stone to timeless beauty – watch the hands, tools and traditions behind every creation.",
      videoSrc: "/videos/herovid.webm",
      videoPoster: "/images/craftsmanship/artisan-hands.png",
      youtubeCtaText: "Watch more on YouTube \u2197",
      footerStripText: "FOLLOW • EXPLORE • GET INSPIRED",
      instagramCard: {
        title: "Instagram",
        description: "Latest creations & studio moments.",
        ctaText: "Explore Instagram \u2192",
        imageSrc: "/images/brand/heritage-ganesha.jpg"
      },
      pinterestCard: {
        title: "Pinterest",
        description: "Stonework ideas & inspiration for every space.",
        ctaText: "Explore Pinterest \u2192",
        imageSrc: "/images/collections/temples-architectural.webp"
      },
      facebookCard: {
        title: "Facebook",
        description: "Projects, updates & our journey together.",
        ctaText: "Visit Facebook \u2192",
        imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg"
      }
    })
  }
];

// Default Site Settings
const DEFAULT_SITE_SETTINGS = [
  {
    key_name: "announcement_bar",
    category: "header",
    label: "Header Announcement Bar",
    value: JSON.stringify({
      active: true,
      text: "✨ Worldwide Safe Export Shipping Available for Custom Marble Mandirs & Deity Statues",
      linkText: "Enquire Now",
      linkUrl: "/contact?type=custom"
    })
  },
  {
    key_name: "studio_contact",
    category: "contact",
    label: "Studio Contact Information",
    value: JSON.stringify({
      telephone: "+91 70147 53278",
      whatsapp: "+91 70147 53278",
      email: "Jaipurstonecraft18@gmail.com",
      address: "30, Industrial Area, Krisna Nagar a, Kartarpura, Gopal Pura Mode, Jaipur, Rajasthan 302015",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India"
    })
  },
  {
    key_name: "social_links",
    category: "social",
    label: "Social Media Channels",
    value: JSON.stringify({
      instagram: "https://instagram.com/jaipurstonecraft",
      facebook: "https://facebook.com/jaipurstonecraft",
      pinterest: "https://pinterest.com/jaipurstonecraft",
      youtube: "https://youtube.com/@jaipurstonecraft"
    })
  }
];

export async function seedCMSFoundation() {
  await initDB();

  // 1. Seed Page Sections
  for (const item of DEFAULT_PAGE_SECTIONS) {
    const existing = await getOne("SELECT key_name FROM page_sections WHERE key_name = ?", [item.key_name]);
    if (!existing) {
      await execute(`
        INSERT INTO page_sections (key_name, page, section_id, label, content_json)
        VALUES (?, ?, ?, ?, ?)
      `, [item.key_name, item.page, item.section_id, item.label, item.content_json]);
    }
  }

  // 2. Seed Site Settings
  for (const item of DEFAULT_SITE_SETTINGS) {
    const existing = await getOne("SELECT key_name FROM site_settings WHERE key_name = ?", [item.key_name]);
    if (!existing) {
      await execute(`
        INSERT INTO site_settings (key_name, category, label, value)
        VALUES (?, ?, ?, ?)
      `, [item.key_name, item.category, item.label, item.value]);
    }
  }

  // 3. Seed Projects from content/projects.js
  const projectsList = Object.values(projectsData);
  let order = 0;
  for (const proj of projectsList) {
    order++;
    const existing = await getOne("SELECT id FROM projects WHERE id = ? OR slug = ?", [proj.slug, proj.slug]);
    if (!existing) {
      await execute(`
        INSERT INTO projects (id, slug, name, type, location, year, description, materials, craftsmanship, final_result, image_src, gallery, products_used, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        proj.slug,
        proj.slug,
        proj.name,
        proj.type || "Custom",
        proj.location || "Jaipur / Global Site",
        proj.year || "2024",
        proj.description || "",
        proj.materials || "Makrana Marble / Sandstone",
        proj.craftsmanship || "",
        proj.finalResult || "",
        proj.imageSrc || "",
        JSON.stringify(proj.gallery || []),
        JSON.stringify(proj.productsUsed || []),
        order
      ]);
    }
  }
}
