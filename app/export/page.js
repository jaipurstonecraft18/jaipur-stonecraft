import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ImageWithText from "@/components/ImageWithText/ImageWithText";
import FeatureCards from "@/components/FeatureCards/FeatureCards";
import CTASection from "@/components/CTASection/CTASection";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "International Export & Shipping Logistics — Jaipur Stonecraft",
  description: "Learn about our international stone export procedures: custom crating, ocean freight delivery, documentation, and coordination.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/export",
  },
  openGraph: {
    title: "International Export & Shipping Logistics — Jaipur Stonecraft",
    description: "Learn about our international stone export procedures: custom crating, ocean freight delivery, documentation, and coordination.",
    url: "https://jaipurstonecraft.com/export",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=International+Stone+Export",
        width: 1200,
        height: 630,
        alt: "International Stone Export",
      },
    ],
  },
};

export default function Export() {
  const exportLogisticsSteps = [
    {
      title: "Custom Documentation",
      description: "We prepare all Indian export clearance paperwork, Certificate of Origin filings, and port documents."
    },
    {
      title: "Ocean Freight Shipping",
      description: "Our freight partners coordinate container loading at local ports and handle customs broker handoffs."
    },
    {
      title: "Heat-Treated Crates",
      description: "Crates are built to ISPM-15 regulations and padded with shock-absorbing foam inserts."
    },
    {
      title: "Progress Updates",
      description: "Our design team sends carving progress photos and keeps you updated on shipping transit logs."
    }
  ];

  return (
    <>
      {/* 1. BREADCRUMBS & HEADER */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container style={{ borderBottom: "1px solid var(--color-stone-grey)", paddingBottom: "var(--spacing-lg)" }}>
          <Breadcrumbs items={[{ label: "Export" }]} />
          <SectionHeading
            eyebrow="Global Shipping"
            heading="Delivering Jaipur Stonework Internationally"
            description="We coordinate door-to-door or port-to-port ocean and air freight shipping for all B2B architectural commissions and private art orders."
            headingLevel="h1"
          />
        </Container>
      </Section>

      {/* 2. SHIPPING & PORTS */}
      <Section background="light" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc="https://placehold.co/800x1000/E8E4DF/1A1918?text=[PORT+COORDINATION]"
            imageAlt="Cargo ship carrying containerized freight at harbor"
            eyebrow="Logistics Infrastructure"
            heading="Port Coordination & Delivery Channels"
            ctaText="Explore Our Craftsmanship"
            ctaHref="/craftsmanship"
          >
            <p>
              Delivering heavy stone components requires organized shipping routes. We coordinate shipping from Jaipur through dry port connections to primary exit hubs.
            </p>
            <p>
              We coordinate with destination customs brokers to handle local port handoffs and curbside transport. For residential projects, we coordinate crane unloading requirements.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 3. VERIFIABLE EXPORT DATA & COUNTRIES */}
      <Section background="grey" spacing="standard">
        <Container>
          <ImageWithText
            imageSrc="https://placehold.co/800x1000/E8E4DF/1A1918?text=[EXPORT+CRATING]"
            imageAlt="Secured crating detail showing foam sheets and straps"
            eyebrow="Packaging Compliance"
            heading="Custom Internal Foam Crate Bracing"
            ctaText="Read Our Story"
            ctaHref="/our-story"
            reverse
          >
            <p>
              [EXPORT INFORMATION]: Jaipur Stonecraft serves clients in [LIST OF EXPORT COUNTRIES] including [SAMPLE COUNTRIES]. Each export is coordinated under Indian custom inspection and shipping regulations.
            </p>
            <p>
              To protect carved details, sculptures are wrapped in protective foam sheets and held inside custom internal wood framing. This framing prevents movement inside the crate during ocean transit.
            </p>
          </ImageWithText>
        </Container>
      </Section>

      {/* 4. LOGISTICS TRUST CARDS */}
      <Section background="light" spacing="standard">
        <Container>
          <SectionHeading
            eyebrow="Atelier Standards"
            heading="Export Procedures"
            description="We handle shipping details to ensure secure transport from our Jaipur studio to your site."
            align="center"
          />
          <div style={{ marginTop: "var(--spacing-lg)" }}>
            <FeatureCards features={exportLogisticsSteps} />
          </div>
        </Container>
      </Section>

      {/* 5. INQUIRY CTA */}
      <CTASection
        heading="Discuss International Shipping"
        description="Connect with our Jaipur design office to discuss shipping options, request material samples, or coordinate a freight estimate."
        primaryCtaText="Request a Shipping Quote"
        primaryCtaHref="/contact?type=quote&subject=export"
        secondaryCtaText="WhatsApp Coordinator"
        secondaryCtaHref={siteConfig.contact.whatsappLink}
        background="dark"
      />
    </>
  );
}
