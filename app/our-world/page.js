import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import Gallery from "@/components/Gallery/Gallery";
import CraftProcess from "@/components/CraftProcess/CraftProcess";
import CTASection from "@/components/CTASection/CTASection";

export const metadata = {
  title: "Our World — Jaipur Workshop, Master Artisans & Behind The Scenes",
  description: "Experience the world of Jaipur Stonecraft. Explore our Jaipur atelier, generational stone sculptors, behind-the-scenes craftsmanship, and live workshop artistry.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/our-world",
  },
  openGraph: {
    title: "Our World — Jaipur Workshop, Master Artisans & Behind The Scenes",
    description: "Experience the world of Jaipur Stonecraft. Explore our Jaipur atelier, generational stone sculptors, behind-the-scenes craftsmanship, and live workshop artistry.",
    url: "https://jaipurstonecraft.com/our-world",
    siteName: "Jaipur Stonecraft",
    type: "website",
  },
};

export default function OurWorldPage() {
  const worldGalleryImages = [
    {
      id: "w1",
      src: "/images/hero/hero-krishna-artisan.jpg",
      title: "Master Artisan Chiseling White Marble",
      subtitle: "Jaipur Workshop Studio",
      category: "Workshop Artistry"
    },
    {
      id: "w2",
      src: "/images/collections/sculptures.png",
      title: "Hand Carved White Marble Sculptures",
      subtitle: "Makrana Pure Marble",
      category: "Sculpture Studio"
    },
    {
      id: "w3",
      src: "/images/collections/reliefs.png",
      title: "Intricate Stone Wall Relief Mural",
      subtitle: "Spiritual Architectural Relief",
      category: "Architectural Relief"
    },
    {
      id: "w4",
      src: "/images/collections/temples.png",
      title: "Custom Marble Home Mandir Carving",
      subtitle: "Sanctuary Architecture",
      category: "Sanctuary Craft"
    },
    {
      id: "w5",
      src: "/images/collections/fountains.png",
      title: "Hand-turned Water Fountain Basin",
      subtitle: "Courtyard Stonework",
      category: "Water Features"
    },
    {
      id: "w6",
      src: "/images/collections/custom.png",
      title: "Bespoke Portrait Bust Sculpture",
      subtitle: "Custom Art Studio",
      category: "Bespoke Commissions"
    }
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <Section background="dark" spacing="hero" className="page-offset">
        <Container style={{ textAlign: "center", maxWidth: "900px" }}>
          <span className="eyebrow" style={{ color: "var(--color-bronze)" }}>STEP INSIDE OUR ATELIER</span>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem, 4.5vw, 4rem)", fontWeight: "600", color: "var(--color-cream)", margin: "0.75rem 0 1.25rem", lineHeight: "1.15" }}>
            The World of Jaipur Stonecraft
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(1rem, 1.2vw, 1.15rem)", color: "rgba(247, 245, 240, 0.8)", lineHeight: "1.7", margin: "0 auto" }}>
            Where centuries of family stone carving traditions meet pure devotion and modern masonic precision. Walk through our Jaipur workshop, witness master sculptors at work, and experience how single stone blocks transform into timeless art.
          </p>
        </Container>
      </Section>

      {/* 2. VISUAL EXPERIENCE & GALLERY */}
      <Section background="light" spacing="standard">
        <Container>
          <SectionHeading
            eyebrow="BEHIND THE SCENES"
            heading="Life Inside the Jaipur Workshop"
            description="Every curve, chisel line, and polished surface carries the imprint of generations of family devotion and stone sculpting expertise."
            align="center"
          />
          <div style={{ marginTop: "var(--spacing-lg)" }}>
            <Gallery images={worldGalleryImages} />
          </div>
        </Container>
      </Section>

      {/* 3. CRAFTSMANSHIP PROCESS */}
      <CraftProcess />

      {/* 4. CTA SECTION */}
      <CTASection
        heading="Experience Our Craftsmanship Firsthand"
        description="Schedule a private workshop visit in Jaipur or request a virtual video walkthrough with our master sculptors."
        primaryCtaText="Schedule a Workshop Visit"
        primaryCtaHref="/contact?type=visit"
        secondaryCtaText="Discuss a Bespoke Project"
        secondaryCtaHref="/contact?type=custom"
        background="dark"
      />
    </>
  );
}
