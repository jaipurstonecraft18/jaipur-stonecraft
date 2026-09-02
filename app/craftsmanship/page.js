import AtelierHero from "@/components/Craftsmanship/AtelierHero";
import TransformationPathway from "@/components/Craftsmanship/TransformationPathwaySection";
import ProcessTimelineNav from "@/components/Craftsmanship/ProcessTimelineNav";
import StoneSourcingStage from "@/components/Craftsmanship/StoneSourcingStage";
import BlueprintModelingStage from "@/components/Craftsmanship/BlueprintModelingStage";
import HandChiselingStage from "@/components/Craftsmanship/HandChiselingStage";
import DetailSculptingStage from "@/components/Craftsmanship/DetailSculptingStage";
import InspectionHoningStage from "@/components/Craftsmanship/InspectionHoningStage";
import ExportLogisticsStage from "@/components/Craftsmanship/ExportLogisticsStage";
import MasterpieceBorn from "@/components/Craftsmanship/MasterpieceBorn";
import CTASection from "@/components/CTASection/CTASection";
import { getPageSection } from "@/lib/db/content.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Atelier Journey & Craftsmanship Process — Jaipur Stonecraft",
  description: "Explore the step-by-step hand carving journey inside our Jaipur atelier: raw stone selection, blueprint grid mapping, generational chiseling, water-stone honing, and global export packaging.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/craftsmanship",
  },
  openGraph: {
    title: "Atelier Journey & Craftsmanship Process — Jaipur Stonecraft",
    description: "Explore the step-by-step hand carving journey inside our Jaipur atelier: raw stone selection, blueprint grid mapping, generational chiseling, water-stone honing, and global export packaging.",
    url: "https://jaipurstonecraft.com/craftsmanship",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-krishna-artisan.jpg",
        width: 1200,
        height: 630,
        alt: "Craftsmanship & Masonry Process at Jaipur Stonecraft Atelier",
      },
    ],
  },
};

export default async function Craftsmanship() {
  const craftData = await getPageSection("craftsmanship_hero", {
    eyebrow: "JAIPUR ATELIER & MASONRY",
    heading: "From Raw Stone to Finished Art",
    description: "Inside our Jaipur workshop, generational carvers transform solid Makrana marble monoliths and regional sandstones into divine sculptures, temple architecture, and architectural elements using hand mallets and steel chisels.",
    heroImageSrc: "/images/craftsmanship/artisan-hands.png"
  });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      {/* 1. EDITORIAL ATELIER HERO */}
      <AtelierHero data={craftData} />

      {/* 2. TRANSFORMATION PATHWAY (SIGNATURE VISUAL MOMENT) */}
      <TransformationPathway />

      {/* 3. STICKY ATELIER PROCESS TIMELINE NAVIGATION */}
      <ProcessTimelineNav />

      {/* 4. STAGE 01: RAW STONE SELECTION (LIGHT) */}
      <StoneSourcingStage />

      {/* 5. STAGE 02: BLUEPRINT MAPPING & MODELING (DARK ATELIER) */}
      <BlueprintModelingStage />

      {/* 6. STAGE 03: GENERATIONAL HAND CARVING (LIGHT) */}
      <HandChiselingStage />

      {/* 7. STAGE 04: REFINEMENT & DETAIL SCULPTING (WARM LIGHT) */}
      <DetailSculptingStage />

      {/* 8. STAGE 05: HONING & QUALITY INSPECTION (LIGHT) */}
      <InspectionHoningStage />

      {/* 9. STAGE 06: EXPORT LOGISTICS & CRATING (DARK TRANSIT) */}
      <ExportLogisticsStage />

      {/* 10. STAGE 07: THE MASTERPIECE BORN (LIGHT) */}
      <MasterpieceBorn />

      {/* 11. CLOSING INQUIRY CTA SECTION (DARK) */}
      <CTASection
        heading="Bring Jaipur Stonecraft to Your Project"
        description="Collaborate with our master masons to custom-carve white marble deity statues, temple architecture, garden fountains, fireplace mantels, or bespoke stone friezes."
        primaryCtaText="Request a Quote"
        primaryCtaHref="/contact?type=quote"
        secondaryCtaText="Start Custom Project"
        secondaryCtaHref="/contact?type=custom"
        background="dark"
      />

      {/* JSON-LD Process Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Jaipur Stonecraft Atelier Masonry & Carving Process",
            description: "The 7-stage hand carving process from raw stone selection to export crating in Jaipur, India.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Raw Material Selection",
                text: "Selecting solid blocks of white Makrana marble and regional sandstones based on mineral uniformity and fracture checks."
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Blueprint Grid Mapping",
                text: "Matching CAD architectural drawings to stone block dimensions with chalk grid lines and 1:1 clay maquettes."
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Generational Hand Chiseling",
                text: "Manual carving using tempered steel points, flat chisels, and wooden mallets for tactile depth control."
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Detail Sculpting",
                text: "Refining sacred facial expressions, deity iconography, and ornamental Jali floral motifs."
              },
              {
                "@type": "HowToStep",
                position: 5,
                name: "Surface Honing & Inspection",
                text: "Progressive water stone honing and dimensional tolerance checks against architectural blueprints."
              },
              {
                "@type": "HowToStep",
                position: 6,
                name: "Custom Crate Packaging",
                text: "Building ISPM 15 heat-treated wooden crates with shock-absorbing foam inserts for international transit."
              },
              {
                "@type": "HowToStep",
                position: 7,
                name: "Masterpiece Delivery",
                text: "Final installation preparation and global delivery of hand-carved stone art."
              }
            ]
          }),
        }}
      />
    </main>
  );
}
