import { query, getOne, execute, initDB } from "./client.js";
import { projectsData } from "@/content/projects.js";

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
    key_name: "story_header",
    page: "Our Story",
    section_id: "header",
    label: "Our Story → Editorial Header Hero",
    content_json: JSON.stringify({
      eyebrow: "OUR HERITAGE & VISION",
      heading: "Generational Hands, Modern Vision",
      subtitle: "For over three generations, Jaipur Stonecraft has preserved the ancient art of stone carving, shaping sacred deity sculptures, architectural temples, and monumental stone art for sanctuaries worldwide.",
      imageSrc: "/images/hero/hero-krishna-artisan.jpg"
    })
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
      instagram: "https://instagram.com",
      pinterest: "https://pinterest.com",
      youtube: "https://youtube.com"
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
