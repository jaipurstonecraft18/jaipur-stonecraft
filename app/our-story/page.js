import StoryHeader from "@/components/OurStory/StoryHeader";
import StoryLineageSection from "@/components/OurStory/StoryLineageSection";
import StoryValuesSection from "@/components/OurStory/StoryValuesSection";
import StoryTransitionDark from "@/components/OurStory/StoryTransitionDark";
import StoryFutureSection from "@/components/OurStory/StoryFutureSection";
import StoryCTA from "@/components/OurStory/StoryCTA";
import { getPageSection } from "@/lib/db/content.js";

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
    imageSrc: "/images/collections/hero-sculptures-group.jpg"
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
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. EDITORIAL HERO (Connected to Page CMS with Fallback) */}
      <StoryHeader
        eyebrow={headerData.eyebrow}
        heading={headerData.heading}
        subtitle={headerData.subtitle}
        imageSrc={headerData.imageSrc}
      />

      {/* 2. CHAPTER I: OUR HERITAGE - PASSING DOWN THE CHISEL */}
      <StoryLineageSection />

      {/* 3. CHAPTER II: OUR VALUES - PRINCIPLES BEHIND EVERY CHISEL */}
      <StoryValuesSection />

      {/* 4. CHAPTER III: DARK BRAND HERITAGE STATS STRIP */}
      <StoryTransitionDark />

      {/* 5. CHAPTER IV: OUR VISION - CARVING INDIAN HERITAGE FOR THE WORLD */}
      <StoryFutureSection />

      {/* 6. CHAPTER V: FINAL STORY CTA CARD */}
      <StoryCTA />
    </main>
  );
}
