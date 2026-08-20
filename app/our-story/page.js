import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ImageWithText from "@/components/ImageWithText/ImageWithText";
import CTASection from "@/components/CTASection/CTASection";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "Our Story — Jaipur Stonecraft",
  description: "Learn about the generational family heritage in stone masonry and the modern vision behind our Jaipur-based atelier.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/our-story",
  },
  openGraph: {
    title: "Our Story — Jaipur Stonecraft",
    description: "Learn about the generational family heritage in stone masonry and the modern vision behind our Jaipur-based atelier.",
    url: "https://jaipurstonecraft.com/our-story",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=Our+Story+Heritage",
        width: 1200,
        height: 630,
        alt: "Our Story Heritage",
      },
    ],
  },
};

import { getSiteContent } from "@/lib/db/content.js";

export default async function OurStory() {
  const heritageBanner = await getSiteContent("about_heritage_banner", "https://placehold.co/800x1000/E8E4DF/1A1918?text=[Jaipur+Heritage+Workshop]", "Artisan carving marble in traditional Rajasthan workshop");
  const quarryImg = await getSiteContent("about_quarry_image", "https://placehold.co/800x1000/E8E4DF/1A1918?text=[Traditional+Architectural+Drawing]", "Design sketch overlaying raw sandstone blocks");

  return (
    <>
      {/* 1. BREADCRUMBS & HEADER */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container style={{ borderBottom: "1px solid var(--color-stone-grey)", paddingBottom: "var(--spacing-lg)" }}>
          <Breadcrumbs items={[{ label: "Our Story" }]} />
          <SectionHeading
            eyebrow="Atelier History"
            heading="Generational Hands, Modern Vision"
            description="Our family's dedication to chiseling raw stone spans decades in Rajasthan. Today, we bring this heritage directly to global architectural commissions."
            headingLevel="h1"
          />
        </Container>
      </Section>

      {/* 2. THE FAMILY LINEAGE */}
      <Section background="light" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc={heritageBanner.url}
            imageAlt={heritageBanner.alt}
            eyebrow="The Heritage"
            heading="Passing Down the Chisel"
            ctaText="See Our Craftsmanship"
            ctaHref="/craftsmanship"
          >
            <p>
              In the historic stone hubs of Rajasthan, carving is more than a technique; it is a legacy passed down from parent to child. For generations, members of our family worked as apprentices and master masons, carving temple arches, sandstone screens, and detailed deity statues for local trusts.
            </p>
            <p>
              This foundation taught us how to read raw stone blocks, understanding how mineral veins react under pressure and which chisels yield clean geometric lines. The physical skill of manual chiseling remains at the center of all our work today.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 3. THE BRAND GENESIS */}
      <Section background="grey" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc={quarryImg.url}
            imageAlt={quarryImg.alt}
            eyebrow="The Transition"
            heading="Why We Founded Jaipur Stonecraft"
            ctaText="View Completed Projects"
            ctaHref="/projects"
            reverse
          >
            <p>
              While our family&apos;s hand-carving heritage has existed for decades, we realized that B2B architects and international art collectors had limited direct access to authentic Jaipur masons. Brokers and exporters often added cost layers while diluting design details.
            </p>
            <p>
              To solve this, we founded <strong>Jaipur Stonecraft</strong> as a modern brand and direct-to-project atelier. We merged our family&apos;s carving skills with an organized design coordination process, translating CAD blueprints and hand sketches into precise, hand-sculpted works.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 4. ATELIER VISION */}
      <Section background="light" spacing="standard">
        <Container>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--spacing-xl)"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--spacing-xl)"
            }}>
              <div>
                <h4 style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-bronze)",
                  borderBottom: "1px solid var(--color-stone-grey)",
                  paddingBottom: "var(--spacing-xs)",
                  marginBottom: "var(--spacing-sm)"
                }}>
                  The Artisan Culture
                </h4>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                  We support fair wages and safe workshop practices in our Jaipur studio. By keeping production in-house and providing direct B2B opportunities, we ensure traditional masonry remains a viable livelihood for our master carving teams.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-bronze)",
                  borderBottom: "1px solid var(--color-stone-grey)",
                  paddingBottom: "var(--spacing-xs)",
                  marginBottom: "var(--spacing-sm)"
                }}>
                  Future Vision
                </h4>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                  We aim to serve as the global portal for premium Indian stonework, matching century-old structural techniques with modern architectural scales. Our target is to supply heritage masonry for sacred and luxury residential builds worldwide.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. INQUIRY CTA */}
      <CTASection
        heading="Discuss Custom Commissions"
        description="Connect directly with our design office in Jaipur to translate structural plans or sketch concepts into raw stone."
        primaryCtaText="Contact Our Office"
        primaryCtaHref="/contact"
        secondaryCtaText="WhatsApp Coordinator"
        secondaryCtaHref={siteConfig.contact.whatsappLink}
        background="dark"
      />
    </>
  );
}
