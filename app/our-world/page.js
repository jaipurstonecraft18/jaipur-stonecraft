import { getPageSection } from "@/lib/db/content.js";
import { defaultOurWorldContent } from "@/content/our-world.js";
import OurWorldClient from "./OurWorldClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Our World — Stone, Culture & Curated Masterpieces | Jaipur Stonecraft",
  description: "Explore the visual universe of Jaipur Stonecraft. Discover our portfolio of hand-carved marble sculptures, temple architecture, lattice jalis, courtyard fountains, and bespoke stone commissions.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/our-world",
  },
  openGraph: {
    title: "Our World — Stone, Culture & Curated Masterpieces | Jaipur Stonecraft",
    description: "Explore the visual universe of Jaipur Stonecraft. Discover our portfolio of hand-carved marble sculptures, temple architecture, lattice jalis, courtyard fountains, and bespoke stone commissions.",
    url: "https://jaipurstonecraft.com/our-world",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "/images/collections/temples-architectural.webp",
        width: 1200,
        height: 630,
        alt: "The World of Jaipur Stonecraft — Handcrafted Natural Stone Art & Architecture",
      },
    ],
  },
};

export default async function OurWorldPage() {
  // Query CMS page_sections with seamless static fallback
  const cmsData = await getPageSection("our_world_page", defaultOurWorldContent);

  // Merge CMS with default structure to ensure 100% resilient fallback for all sub-sections
  const pageData = {
    hero: { ...defaultOurWorldContent.hero, ...(cmsData?.hero || {}) },
    categories: cmsData?.categories || defaultOurWorldContent.categories,
    gallery: cmsData?.gallery || defaultOurWorldContent.gallery,
    featuredProjects: cmsData?.featuredProjects || defaultOurWorldContent.featuredProjects,
    whatWeCreate: cmsData?.whatWeCreate || defaultOurWorldContent.whatWeCreate,
    closingCta: { ...defaultOurWorldContent.closingCta, ...(cmsData?.closingCta || {}) }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "Our World — Jaipur Stonecraft Visual Portfolio",
        "description": "Curated editorial showcase of hand-carved natural stone sculptures, temple architecture, and bespoke stonework.",
        "url": "https://jaipurstonecraft.com/our-world",
        "publisher": {
          "@type": "Organization",
          "name": "Jaipur Stonecraft",
          "url": "https://jaipurstonecraft.com",
          "logo": "https://jaipurstonecraft.com/images/logo.png"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://jaipurstonecraft.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Our World",
            "item": "https://jaipurstonecraft.com/our-world"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OurWorldClient initialData={pageData} />
    </>
  );
}
