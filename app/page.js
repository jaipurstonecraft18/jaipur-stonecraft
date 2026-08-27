import Hero from "@/components/Hero/Hero";
import TrustStrip from "@/components/TrustStrip/TrustStrip";
import HomeCollections from "@/components/HomeCollections/HomeCollections";
import HeritageStory from "@/components/HeritageStory/HeritageStory";
import FeaturedCreations from "@/components/FeaturedCreations/FeaturedCreations";
import ClientReviews from "@/components/ClientReviews/ClientReviews";
import CraftProcess from "@/components/CraftProcess/CraftProcess";
import CTASection from "@/components/CTASection/CTASection";
import { getPageSection } from "@/lib/db/content.js";
import { getAllCollections } from "@/content/collections";

export const metadata = {
  title: "Jaipur Stonecraft — Premium Stone Atelier & Generational Craftsmanship",
  description: "Bespoke white marble deity statues, temple architecture, stone wall murals, and custom architectural stonework carved by master artisans in Jaipur, India.",
  alternates: {
    canonical: "https://jaipurstonecraft.com",
  },
  openGraph: {
    title: "Jaipur Stonecraft — Premium Stone Atelier & Generational Craftsmanship",
    description: "Bespoke white marble deity statues, temple architecture, stone wall murals, and custom architectural stonework carved by master artisans in Jaipur, India.",
    url: "https://jaipurstonecraft.com",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp",
        width: 1200,
        height: 630,
        alt: "Jaipur Stonecraft Atelier white marble sculpture and temple stonework",
      },
    ],
  },
};

export default async function Home() {
  const defaultSlides = [
    {
      eyebrow: "TIMELESS ART. CARVED BY HAND.",
      headingTitle: "Where Stone",
      headingAccent: "Becomes Art",
      description: "Handcrafted sculptures, architectural stonework, and timeless creations shaped by master artisans with devotion and precision.",
      primaryCtaText: "Explore Our Collections",
      primaryCtaHref: "/collections",
      secondaryCtaText: "Start a Custom Project",
      secondaryCtaHref: "/contact?type=custom",
      imageSrc: "/images/hero/hero-krishna-artisan.jpg"
    },
    {
      eyebrow: "DIVINE SACRED MASONRY",
      headingTitle: "Temples &",
      headingAccent: "Architectural Art",
      description: "Pure Makrana white marble mandirs, hand-carved stone pillars, and grand temple arches built to traditional iconographic standards.",
      primaryCtaText: "View Temples",
      primaryCtaHref: "/collections/temples-architectural-stonework",
      secondaryCtaText: "Consult Artisan",
      secondaryCtaHref: "/contact?type=quote",
      imageSrc: "/images/collections/temples-architectural.jpg"
    },
    {
      eyebrow: "HERITAGE STONE RELIEFS",
      headingTitle: "Wall Murals &",
      headingAccent: "High Reliefs",
      description: "Spiritual high-relief stone panels, lattice jali screens, and bespoke architectural carvings for modern and classical residences.",
      primaryCtaText: "Discover Wall Art",
      primaryCtaHref: "/collections/wall-art-reliefs",
      secondaryCtaText: "Custom Commission",
      secondaryCtaHref: "/contact?type=custom",
      imageSrc: "/images/collections/wall-art-relief.jpg"
    }
  ];

  const heroData = await getPageSection("homepage_hero", { slides: defaultSlides });
  const heroSlides = Array.isArray(heroData.slides) && heroData.slides.length > 0
    ? heroData.slides
    : heroData.imageSrc
    ? [{ ...defaultSlides[0], ...heroData }, defaultSlides[1], defaultSlides[2]]
    : defaultSlides;

  const trustData = await getPageSection("homepage_trust_strip", {
    stats: [
      { value: "3+", label: "Generations of Craft" },
      { value: "500+", label: "Master Artisans in Atelier" },
      { value: "25+", label: "Countries Shipped & Installed" },
      { value: "1000+", label: "Bespoke Commissions Delivered" }
    ]
  });

  const storyData = await getPageSection("homepage_story", {
    eyebrow: "ABOUT JAIPUR STONECRAFT",
    heading: "Heritage of Indian Stone Art",
    paragraph1: "Jaipur Stonecraft brings together tradition, devotion and artistic excellence. For over four decades, we have been crafting exquisite marble and stone sculptures, temple art, fountains and custom creations that stand as symbols of faith, beauty and timeless craftsmanship.",
    imageSrc: "/images/brand/heritage-ganesha.jpg"
  });

  const ctaData = await getPageSection("homepage_cta", {
    heading: "Have a Vision in Mind?",
    description: "Whether you have a hand sketch, architectural CAD blueprint, or a reference photo, our atelier team will guide your custom stone creation from block selection to global delivery.",
    primaryCtaText: "Discuss Your Project",
    primaryCtaHref: "/contact?type=custom",
    secondaryCtaText: "Request a Quote",
    secondaryCtaHref: "/contact?type=quote"
  });

  const reviewsData = await getPageSection("homepage_reviews", {
    eyebrow: "WHAT OUR CLIENTS SAY",
    heading: "Trusted by Devotees. Loved for Generations.",
    reviews: []
  });

  const collectionsDataList = await getAllCollections();

  return (
    <>
      {/* 1. HERO SECTION (Connected to Page CMS with 3-Slide Dynamic Management) */}
      <Hero slides={heroSlides} />

      {/* 2. FLOATING ACHIEVEMENT / STATISTICS BAR (Connected to Page CMS with Fallback) */}
      <TrustStrip stats={trustData?.stats} />

      {/* 3. HERITAGE & BRAND STORY SECTION (Connected to Page CMS with Fallback) */}
      <HeritageStory storyData={storyData} />

      {/* 4. EDITORIAL COLLECTIONS SHOWCASE (Single Source of Truth DB-driven) */}
      <HomeCollections collections={collectionsDataList} />

      {/* 5. FEATURED CREATIONS MOSAIC (Warm Dark Showcase) */}
      <FeaturedCreations />

      {/* 6. CLIENT REVIEWS (Connected to Page CMS with Dynamic Reviews & Photos) */}
      <ClientReviews reviewsData={reviewsData} />

      {/* 7. CRAFTSMANSHIP PROCESS SECTION */}
      <CraftProcess />

      {/* 8. FINAL CONVERSION CTA SECTION (Connected to Page CMS with Fallback) */}
      <CTASection
        heading={ctaData.heading}
        description={ctaData.description}
        primaryCtaText={ctaData.primaryCtaText}
        primaryCtaHref={ctaData.primaryCtaHref}
        secondaryCtaText={ctaData.secondaryCtaText}
        secondaryCtaHref={ctaData.secondaryCtaHref}
        background="dark"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Organization", "LocalBusiness"],
            name: "Jaipur Stonecraft",
            url: "https://jaipurstonecraft.com",
            logo: "https://jaipurstonecraft.com/images/hero/homepage-hero.png",
            telephone: "+91 70147 53278",
            email: "Jaipurstonecraft18@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "30, Industrial Area, Krisna Nagar a, Kartarpura, Gopal Pura Mode",
              addressLocality: "Jaipur",
              addressRegion: "Rajasthan",
              postalCode: "302015",
              addressCountry: "IN"
            },
            sameAs: [
              "https://instagram.com",
              "https://pinterest.com",
            ],
          }),
        }}
      />
    </>
  );
}
