import StoryHeader from "@/components/OurStory/StoryHeader";
import StoryLineageSection from "@/components/OurStory/StoryLineageSection";
import StoryValuesSection from "@/components/OurStory/StoryValuesSection";
import StoryTransitionDark from "@/components/OurStory/StoryTransitionDark";
import StoryFutureSection from "@/components/OurStory/StoryFutureSection";
import StoryCTA from "@/components/OurStory/StoryCTA";
import { getPageSection } from "@/lib/db/content.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Our Story — Jaipur Stonecraft Atelier",
  description: "Discover the generational family heritage, master artisan hands, and modern vision behind Jaipur Stonecraft's hand-carved white marble and sandstone atelier.",
  keywords: "Jaipur Stonecraft story, Indian stone craftsmanship, Rajasthan marble artisans, hand carved marble heritage, bespoke stonework atelier",
  alternates: {
    canonical: "https://jaipurstonecraft.com/our-story",
  },
  openGraph: {
    title: "Our Story — Jaipur Stonecraft Atelier",
    description: "Discover the generational family heritage, master artisan hands, and modern vision behind Jaipur Stonecraft's hand-carved white marble and sandstone atelier.",
    url: "https://jaipurstonecraft.com/our-story",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "/images/craftsmanship/artisan-hands.png",
        width: 1200,
        height: 630,
        alt: "Jaipur Stonecraft master artisan hands chiseling white marble",
      },
    ],
  },
};

export default async function OurStory() {
  const headerData = await getPageSection("story_header", {
    eyebrow: "OUR STORY",
    heading: "Generational Hands, Modern Vision",
    subtitle: "From historic stone hubs in Rajasthan to world-class architectural projects, our family's dedication to chiseling raw natural stone spans decades. Today, we bring this generational craft directly to global architects, sacred trusts, and private collectors without middleman distortion.",
    imageSrc: "/images/collections/hero-sculptures-group.webp"
  });

  const lineageData = await getPageSection("story_lineage", {
    badge: "OUR HERITAGE",
    heading: "Passing Down the Chisel",
    imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg",
    pullQuote: "It never was, nor will be, only about time. It knows not the material gain. Actually, true beauty speaks when a true master crafts every stroke of the hammer.",
    paragraph1: "In the historic stone hubs of Rajasthan, hand carving is far more than an occupation — it is an oral lineage passed down from master to apprentice across generations.",
    paragraph2: "For decades, our family carved sacred deity idols, temple arches, sandstone jali lattices, screens, and palace facades for royal trusts and noble patrons throughout Jaipur, Makrana, and Bharatpur.",
    paragraph3: "This generational foundation taught us how to select stones, how raw blocks are sculpted into human expressions, and everything where marble and bliss converge. The physical mastery of manual chiseling remains the beating heart of our work today."
  });

  const valuesData = await getPageSection("story_values", {
    eyebrow: "OUR VALUES",
    heading: "Principles Behind Every Chisel",
    values: [
      { num: "01", title: "Artisan Dignity", desc: "We support fair compensation, health security, and comfortable workspace conditions in our Jaipur studio." },
      { num: "02", title: "In-House Production", desc: "Every statue, wall mural, and architectural piece is carved entirely in our owned Jaipur workshop." },
      { num: "03", title: "Authentic Materials", desc: "We source authentic Makrana white marble, Bansi Paharpur pink sandstone, and Dholpur beige stone directly." },
      { num: "04", title: "Precision & Tolerance", desc: "We bridge ancient Shilpa Shastra proportions with modern 3D CAD modeling for accuracy and installation perfection." }
    ]
  });

  const statsData = await getPageSection("story_stats", {
    stats: [
      { value: "3+", label: "Generations of Stone Carving Heritage" },
      { value: "500+", label: "Skilled Artisans Associated Across Rajasthan" },
      { value: "25+", label: "Countries Our Sculptures Have Reached" },
      { value: "1000+", label: "Custom Sculptures & Architectural Projects Delivered" }
    ]
  });

  const visionData = await getPageSection("story_vision", {
    eyebrow: "OUR VISION",
    heading: "Carving Indian Heritage for the World",
    imageSrc: "/images/collections/temples-architectural.webp",
    leadQuote: "Our vision is to serve as the global bridge for master Indian stonework — showcasing centuries of hand-carved heritage while creating art that finds its place in spiritual spaces, luxury residences, and public monuments across the world.",
    subcopy: "We partner with architects, interior designers, temple trusts, and private collectors who value raw material integrity, ancestral craftsmanship, and flawless execution."
  });

  const ctaData = await getPageSection("story_cta", {
    eyebrow: "LET'S CREATE TOGETHER",
    heading: "Bring Your Architectural Vision to Stone",
    desc: "Connect directly with our Jaipur design office to discuss custom commissions, CAD blueprint coordination, or raw stone block selection.",
    imageSrc: "/images/craftsmanship/artisan-hands.png",
    primaryCtaText: "Discuss a Commission",
    primaryCtaHref: "/contact?type=custom",
    secondaryCtaText: "WhatsApp Coordinator"
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jaipurstonecraft.com" },
          { "@type": "ListItem", "position": 2, "name": "Our Story", "item": "https://jaipurstonecraft.com/our-story" },
        ],
      },
      {
        "@type": "AboutPage",
        "name": "Our Story — Jaipur Stonecraft Atelier",
        "description": "The generational heritage and master craftsmanship of Jaipur Stonecraft.",
        "publisher": {
          "@type": "Organization",
          "name": "Jaipur Stonecraft",
          "url": "https://jaipurstonecraft.com",
          "logo": "https://jaipurstonecraft.com/images/logo.png",
        },
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. EDITORIAL HERO */}
      <StoryHeader
        eyebrow={headerData.eyebrow}
        heading={headerData.heading}
        subtitle={headerData.subtitle}
        imageSrc={headerData.imageSrc}
      />

      {/* 2. CHAPTER I: OUR HERITAGE - PASSING DOWN THE CHISEL */}
      <StoryLineageSection data={lineageData} />

      {/* 3. CHAPTER II: OUR VALUES - PRINCIPLES BEHIND EVERY CHISEL */}
      <StoryValuesSection data={valuesData} />

      {/* 4. CHAPTER III: DARK BRAND HERITAGE STATS STRIP */}
      <StoryTransitionDark data={statsData} />

      {/* 5. CHAPTER IV: OUR VISION - CARVING INDIAN HERITAGE FOR THE WORLD */}
      <StoryFutureSection data={visionData} />

      {/* 6. CHAPTER V: FINAL STORY CTA CARD */}
      <StoryCTA data={ctaData} />
    </div>
  );
}
