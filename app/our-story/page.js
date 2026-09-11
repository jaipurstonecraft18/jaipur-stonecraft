import StoryHero from "@/components/OurStory/StoryHero";
import StoryPlaceSection from "@/components/OurStory/StoryPlaceSection";
import StoryLineageSection from "@/components/OurStory/StoryLineageSection";
import StoryPeopleSection from "@/components/OurStory/StoryPeopleSection";
import StoryValuesSection from "@/components/OurStory/StoryValuesSection";
import StoryTransitionDark from "@/components/OurStory/StoryTransitionDark";
import StoryEvolutionSection from "@/components/OurStory/StoryEvolutionSection";
import StoryFutureSection from "@/components/OurStory/StoryFutureSection";
import StoryCTA from "@/components/OurStory/StoryCTA";
import { getPageSection } from "@/lib/db/content.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Our Story — Jaipur Stonecraft Atelier",
  description: "Discover the generational heritage, master artisan hands, and modern vision behind Jaipur Stonecraft's hand-carved white marble and sandstone atelier in Rajasthan.",
  keywords: "Jaipur Stonecraft story, Rajasthan stone carving heritage, master Indian artisans, Makrana marble sculptors, hand carved temple stonework",
  alternates: {
    canonical: "https://jaipurstonecraft.com/our-story",
  },
  openGraph: {
    title: "Our Story — Jaipur Stonecraft Atelier",
    description: "Discover the generational heritage, master artisan hands, and modern vision behind Jaipur Stonecraft's hand-carved white marble and sandstone atelier in Rajasthan.",
    url: "https://jaipurstonecraft.com/our-story",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-krishna-artisan.jpg",
        width: 1200,
        height: 630,
        alt: "Jaipur Stonecraft master artisan carving white marble with hammer and chisel",
      },
    ],
  },
};

export default async function OurStory() {
  // 1. HERO DATA (Origin / Headline)
  const cmsHeader = await getPageSection("story_header", {});
  const headerData = {
    eyebrow: cmsHeader.eyebrow || "OUR STORY",
    heading: cmsHeader.heading || "A Story Written in Stone",
    subtitle: cmsHeader.subtitle || "Built on generations of family craftsmanship. Rooted in Rajasthan. Carried forward for tomorrow.",
    ctaText: cmsHeader.ctaText || "Our Journey",
    ctaHref: cmsHeader.ctaHref || "#chapter-01",
    imageSrc: cmsHeader.imageSrc || "/images/hero/hero-krishna-artisan.webp",
    imageAlt: cmsHeader.imageAlt || "Jaipur Stonecraft master artisan carving white marble with hammer and chisel"
  };

  // 2. CHAPTER 01: THE PLACE (Born in Rajasthan)
  const cmsPlace = await getPageSection("story_place", {});
  const placeData = {
    chapter: cmsPlace.chapter || "CHAPTER 01",
    heading: cmsPlace.heading || "Born in Rajasthan",
    paragraph1: cmsPlace.paragraph1 || "Our story is deeply connected to the historic stone hubs of Rajasthan — a land where stone is more than a material; it is a part of culture, architecture and everyday life.",
    paragraph2: cmsPlace.paragraph2 || "From the royal monuments of Jaipur to the quiet workshops of generational artisans, this region has nurtured an unbroken stonecraft tradition across centuries.",
    linkText: cmsPlace.linkText || "Our Roots in Rajasthan",
    linkHref: cmsPlace.linkHref || "/craftsmanship",
    imageSrc: cmsPlace.imageSrc || "/images/collections/architectural.webp",
    imageAlt: cmsPlace.imageAlt || "Historic Rajasthan stone architecture and royal temple colonnade",
    overlayTitle: cmsPlace.overlayTitle || "Living Heritage of Rajasthan Stone Art"
  };

  // 3. CHAPTER 02: THE LINEAGE (A Craft Passed Hand to Hand)
  const cmsLineage = await getPageSection("story_lineage", {});
  const defaultMilestones = [
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
  ];

  const lineageData = {
    chapter: cmsLineage.chapter || "CHAPTER 02",
    heading: cmsLineage.heading || "A Craft Passed Hand to Hand",
    paragraph1: cmsLineage.paragraph1 || "For more than three generations, our family and artisans have carried forward the knowledge, skills and values of traditional stonecraft — learning not just techniques, but a way of seeing, feeling and respecting stone.",
    linkText: cmsLineage.linkText || "Our Heritage",
    linkHref: cmsLineage.linkHref || "/craftsmanship",
    milestones: Array.isArray(cmsLineage.milestones) && cmsLineage.milestones.length > 0 ? cmsLineage.milestones : defaultMilestones
  };

  // 4. CHAPTER 03: THE PEOPLE (The People Behind the Name)
  const cmsPeople = await getPageSection("story_people", {});
  const peopleData = {
    chapter: cmsPeople.chapter || "CHAPTER 03",
    heading: cmsPeople.heading || "The People Behind the Name",
    narrative: cmsPeople.narrative || "Our strength lies in our people — the master sculptors, generational carvers and dedicated teams who bring this heritage to life every day. Their experience, patience and devotion are at the heart of everything we carve.",
    linkText: cmsPeople.linkText || "Meet Our Artisans",
    linkHref: cmsPeople.linkHref || "/craftsmanship",
    imageSrc: cmsPeople.imageSrc || "/images/craftsmanship/artisan-hands.webp",
    imageAlt: cmsPeople.imageAlt || "Jaipur Stonecraft master artisan hands holding steel chisel",
    emphasisText: cmsPeople.emphasisText || "Generations of devotion, patience, and skilled hands in our Jaipur workshop."
  };

  // 5. CHAPTER 04: WHAT WE CARRY FORWARD (Core Principles)
  const cmsValues = await getPageSection("story_values", {});
  const defaultValuesList = [
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
  ];

  const valuesData = {
    chapter: cmsValues.chapter || "CHAPTER 04",
    heading: cmsValues.heading || "What We Carry Forward",
    values: Array.isArray(cmsValues.values) && cmsValues.values.length > 0 ? cmsValues.values : defaultValuesList
  };

  // 6. DARK SECTION: A LIVING TRADITION IN A MODERN WORLD (Stats & Scale)
  const cmsStats = await getPageSection("story_stats", {});
  const defaultStats = [
    { value: "3+", label: "Generations of Stone Carving Heritage" },
    { value: "500+", label: "Skilled Artisans Across Rajasthan" },
    { value: "25+", label: "Countries Our Sculptures Have Reached" },
    { value: "1000+", label: "Custom Sculptures & Architectural Projects Delivered" }
  ];

  const statsData = {
    heading: cmsStats.heading || "A Living Tradition in a Modern World",
    narrative: cmsStats.narrative || "Our heritage is measured not just in years, but in the trust of our clients, the dedication of our master artisans across Rajasthan, and the timeless spaces we help create around the world.",
    linkText: cmsStats.linkText || "Our Impact",
    linkHref: cmsStats.linkHref || "/our-world",
    artworkSrc: cmsStats.artworkSrc || "/images/creations/krishna-alcove.webp",
    artworkAlt: cmsStats.artworkAlt || "Lord Krishna Marble Statue in Temple Alcove",
    stats: Array.isArray(cmsStats.stats) && cmsStats.stats.length > 0 ? cmsStats.stats : defaultStats
  };

  // 7. CHAPTER 05: WHAT WE KEPT. WHAT WE CHANGED. (Evolution)
  const cmsEvolution = await getPageSection("story_evolution", {});
  const evolutionData = {
    chapter: cmsEvolution.chapter || "CHAPTER 05",
    heading: cmsEvolution.heading || "What We Kept. What We Changed.",
    narrative: cmsEvolution.narrative || "We remain rooted in traditional handcraftsmanship, while embracing contemporary architectural design, international precision tolerances, and global collaborations. The result is a unique balance — ancestral heritage with a modern vision.",
    linkText: cmsEvolution.linkText || "Our Evolution",
    linkHref: cmsEvolution.linkHref || "/collections",
    traditionalLabel: cmsEvolution.traditionalLabel || "OUR FOUNDATION",
    traditionalTitle: cmsEvolution.traditionalTitle || "Traditional Craft",
    traditionalDesc: cmsEvolution.traditionalDesc || "Ancestral hand carving, sacred geometry, and devotional stonework.",
    traditionalImage: cmsEvolution.traditionalImage || "/images/craftsmanship/step-02-shape-precision.webp",
    traditionalAlt: cmsEvolution.traditionalAlt || "Traditional hand chiseling craftsmanship in Jaipur atelier",
    modernLabel: cmsEvolution.modernLabel || "NEW POSSIBILITIES",
    modernTitle: cmsEvolution.modernTitle || "Contemporary Spaces",
    modernDesc: cmsEvolution.modernDesc || "Architectural residences, bespoke temple sanctuaries, and global installations.",
    modernImage: cmsEvolution.modernImage || "/images/collections/architectural.webp",
    modernAlt: cmsEvolution.modernAlt || "Contemporary architectural stonework and monumental pavilions"
  };

  // 8. CHAPTER 06: CARVING INDIAN HERITAGE FOR THE WORLD (The Future)
  const cmsVision = await getPageSection("story_vision", {});
  const visionData = {
    chapter: cmsVision.chapter || "CHAPTER 06",
    heading: cmsVision.heading || "Carving Indian Heritage for the World",
    subcopy: cmsVision.subcopy || "We envision a future where the timeless stone artistry of Rajasthan continues to inspire architectural, sacred, and cultural spaces across the globe — creating meaningful, enduring monuments in natural stone.",
    linkText: cmsVision.linkText || "Our Vision",
    linkHref: cmsVision.linkHref || "/contact?type=custom",
    imageSrc: cmsVision.imageSrc || "/images/collections/temples-architectural.webp",
    imageAlt: cmsVision.imageAlt || "Grand hand-carved stone temple architecture and shikhara",
    visionStatement: cmsVision.visionStatement || "A Global Bridge for Master Indian Stonework"
  };

  // 9. FINAL STORY CTA
  const cmsCta = await getPageSection("story_cta", {});
  const ctaData = {
    eyebrow: cmsCta.eyebrow || "LET'S CREATE TOGETHER",
    heading: cmsCta.heading || "Bring Your Architectural Vision to Stone",
    desc: cmsCta.desc || cmsCta.description || "Connect directly with our Jaipur design office to discuss custom commissions, architectural carvings, or natural stone selection.",
    imageSrc: cmsCta.imageSrc || "/images/collections/wall-art-relief.webp",
    imageAlt: cmsCta.imageAlt || "Jaipur Stonecraft hand-carved natural stone relief texture in atelier",
    primaryCtaText: cmsCta.primaryCtaText || "Discuss a Commission",
    primaryCtaHref: cmsCta.primaryCtaHref || "/contact?type=custom",
    secondaryCtaText: cmsCta.secondaryCtaText || "WhatsApp Coordinator"
  };

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
        "description": "Generational heritage, master artisan hands, and modern vision of Jaipur Stonecraft.",
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

      {/* 01. EDITORIAL HERO (A Story Written in Stone) */}
      <StoryHero data={headerData} />

      {/* 02. CHAPTER 01: ORIGIN / PLACE (Born in Rajasthan) */}
      <StoryPlaceSection data={placeData} />

      {/* 03. CHAPTER 02: LINEAGE (A Craft Passed Hand to Hand) */}
      <StoryLineageSection data={lineageData} />

      {/* 04. CHAPTER 03: PEOPLE (The People Behind the Name) */}
      <StoryPeopleSection data={peopleData} />

      {/* 05. CHAPTER 04: VALUES (What We Carry Forward) */}
      <StoryValuesSection data={valuesData} />

      {/* 06. DARK SECTION: HERITAGE & IMPACT (A Living Tradition in a Modern World) */}
      <StoryTransitionDark data={statsData} />

      {/* 07. CHAPTER 05: TRADITION & EVOLUTION (What We Kept. What We Changed.) */}
      <StoryEvolutionSection data={evolutionData} />

      {/* 08. CHAPTER 06: THE FUTURE (Carving Indian Heritage for the World) */}
      <StoryFutureSection data={visionData} />

      {/* 09. FINAL STORY CTA */}
      <StoryCTA data={ctaData} />
    </div>
  );
}
