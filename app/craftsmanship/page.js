import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ImageWithText from "@/components/ImageWithText/ImageWithText";
import Gallery from "@/components/Gallery/Gallery";
import CTASection from "@/components/CTASection/CTASection";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "Craftsmanship & Masonry Process — Jaipur Stonecraft",
  description: "Explore the step-by-step hand carving process inside our Jaipur studio: stone sourcing, drawings, chiseling, and packaging.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/craftsmanship",
  },
  openGraph: {
    title: "Craftsmanship & Masonry Process — Jaipur Stonecraft",
    description: "Explore the step-by-step hand carving process inside our Jaipur studio: stone sourcing, drawings, chiseling, and packaging.",
    url: "https://jaipurstonecraft.com/craftsmanship",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=Craftsmanship+Masonry+Process",
        width: 1200,
        height: 630,
        alt: "Craftsmanship Masonry Process",
      },
    ],
  },
};

import { getSiteContent } from "@/lib/db/content.js";

export default async function Craftsmanship() {
  const heroBanner = await getSiteContent("craftsmanship_hero_banner", "/images/craftsmanship/artisan-hands.png", "Generational stone carving techniques in Jaipur");
  const chiselImg = await getSiteContent("craftsmanship_chisel_image", "https://placehold.co/800x1000/E8E4DF/1A1918?text=[DESIGN+MAPPING]", "Fine chisel detailing on marble deity idol");

  const stepsGallery = [
    "https://placehold.co/1200x800/E8E4DF/1A1918?text=[Quarry+Inspection]",
    "https://placehold.co/1200x800/E8E4DF/1A1918?text=[Masonry+Chiseling+Detail]",
    "https://placehold.co/1200x800/E8E4DF/1A1918?text=[Completed+Basin+Finishing]"
  ];

  return (
    <>
      {/* 1. BREADCRUMBS & HEADER */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container style={{ borderBottom: "1px solid var(--color-stone-grey)", paddingBottom: "var(--spacing-lg)" }}>
          <Breadcrumbs items={[{ label: "Craftsmanship" }]} />
          <SectionHeading
            eyebrow="The Atelier Process"
            heading="Raw Stone to Finished Element"
            description="Explore the physical journey of our masonry. We combine traditional tools with modern architectural blueprints in our Jaipur workshop."
            headingLevel="h1"
          />
        </Container>
      </Section>

      {/* 2. STONE SELECTION */}
      <Section background="light" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc={heroBanner.url}
            imageAlt={heroBanner.alt}
            eyebrow="Phase 1: Sourcing"
            heading="Selecting the Solid Block"
            ctaText="Read Our Story"
            ctaHref="/our-story"
          >
            <p>
              The durability of a sculpture starts at the quarry. We source raw blocks of white Makrana marble, pink Bansi Paharpur sandstone, and Dholpur sandstone directly from regional quarries in Rajasthan.
            </p>
            <p>
              We inspect each block for mineral uniformity, hairline fractures, and structural stability. Only blocks free from hidden lines are carted to our studio for carving.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 3. DESIGN & BLUEPRINT MAPPING */}
      <Section background="grey" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc={chiselImg.url}
            imageAlt={chiselImg.alt}
            eyebrow="Phase 2: Modeling"
            heading="From CAD Draft to Chalk Grid"
            ctaText="Explore Collections"
            ctaHref="/collections"
            reverse
          >
            <p>
              We collaborate with architectural design teams. Before carving starts, we match CAD blueprints, hand sketches, or digital mockups to the raw stone block dimensions.
            </p>
            <p>
              Artisans map precise chalk grid lines directly onto the stone face. For custom portrait commissions, we model a clay bust first to confirm structural dimensions before cutting stone.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 4. PHYSICAL GALLERY SLIDE */}
      <Section background="light" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Atelier Views"
              heading="Workshop Environment"
              description="Captured directly from our workspace floors: inspecting blocks, chiseling details, and polishing surfaces."
            />
          </ScrollReveal>
          <div style={{ marginTop: "var(--spacing-lg)" }}>
            <Gallery images={stepsGallery} aspect="aspect32" columns={3} />
          </div>
        </Container>
      </Section>

      {/* 5. HAND CARVING */}
      <Section background="grey" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc="https://placehold.co/800x1000/E8E4DF/1A1918?text=[HAND+CARVING]"
            imageAlt="Artisan carving floral screen patterns with chisel"
            eyebrow="Phase 3: Sculpting"
            heading="Generational Hand Chiseling"
            ctaText="View Completed Projects"
            ctaHref="/projects"
          >
            <p>
              Our carving relies entirely on manual tools: steel points, flat chisels, and wooden mallets. By using traditional hand chisels, our masons retain tactile control over the carving depth, creating organic surface finishes that machinery cannot duplicate.
            </p>
            <p>
              We carve deity statues, architectural pillars, and wall panels centimeter by centimeter, checking shapes continuously against templates.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 6. FINISHING & QUALITY INSPECTION */}
      <Section background="light" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc="https://placehold.co/800x1000/E8E4DF/1A1918?text=[QUALITY+INSPECTION]"
            imageAlt="Quality control manager measuring stone basin edges"
            eyebrow="Phase 4: Inspection"
            heading="Honing & Dimensional Verification"
            ctaText="About Global Export"
            ctaHref="/export"
            reverse
          >
            <p>
              After carving, surfaces are honed using progress-graded stones to get a smooth, matte finish that highlights the stone&apos;s raw texture.
            </p>
            <p>
              Our quality inspection check lists:
              1. **Dimensional Tolerance**: Verify measurements against blueprints.
              2. **Structural Checks**: Inspect edges and corners for structural chips.
              3. **Water Honeycomb Honing**: Seal pedestal basins and countertops to prevent staining.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 7. CRATING & EXPORT LOGISTICS */}
      <Section background="grey" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc="https://placehold.co/800x1000/E8E4DF/1A1918?text=[CRATE+PACKAGING]"
            imageAlt="Heavy duty wooden crate framing for export"
            eyebrow="Phase 5: Logistics"
            heading="Secure International Crate Packaging"
            ctaText="Learn About Export"
            ctaHref="/export"
          >
            <p>
              International shipping of heavy stone art requires strict packaging standards. We build custom wooden crates for each piece, securing stone elements inside thick shock-absorbing foam inserts.
            </p>
            <p>
              Crates are locked with internal bracing to prevent shift during ocean transport. All packaging conforms to international export guidelines.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 8. INQUIRY CTA */}
      <CTASection
        heading="Bring Jaipur Stonecraft to Your Project"
        description="Collaborate with our master masons to custom-carve fireplace mantels, garden fountains, columns, or sacred temple shrines."
        primaryCtaText="Request a Quote"
        primaryCtaHref="/contact?type=quote"
        secondaryCtaText="Start Custom Project"
        secondaryCtaHref="/contact?type=custom"
        background="dark"
      />
    </>
  );
}
