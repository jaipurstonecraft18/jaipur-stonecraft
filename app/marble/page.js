import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import MaterialCard from "@/components/MaterialCard/MaterialCard";
import CTASection from "@/components/CTASection/CTASection";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { marbleHubData } from "@/content/marble";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "White Marble Statues, Sculptures & Architectural Stonework — Jaipur Marble Hub",
  description: "Explore hand-carved white Makrana marble deity statues, home mandirs, and custom architectural stonework crafted by generational master artisans in Jaipur, India.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/marble",
  },
  openGraph: {
    title: "White Marble Statues, Sculptures & Architectural Stonework — Jaipur Marble Hub",
    description: "Explore hand-carved white Makrana marble deity statues, home mandirs, and custom architectural stonework crafted by generational master artisans in Jaipur, India.",
    url: "https://jaipurstonecraft.com/marble",
    siteName: "Jaipur Stonecraft",
    type: "website",
  },
};

export default function MarbleHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "White Marble Statues, Sculptures & Architectural Stonework",
    "description": "Comprehensive guide and portfolio hub for hand-carved white Makrana marble statues, temple masonry, and custom architectural stonework.",
    "publisher": {
      "@type": "Organization",
      "name": "Jaipur Stonecraft",
      "url": "https://jaipurstonecraft.com",
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://jaipurstonecraft.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Marble Hub",
          "item": "https://jaipurstonecraft.com/marble",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO & INTRO SECTION */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Marble Crafts Hub" },
            ]}
          />

          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Material Excellence"
              heading="White Marble Statues, Sculptures & Architectural Stonework"
              description="A master reference to Makrana white marble, hand-carving techniques, surface treatments, and masonic application across sacred and architectural projects."
              align="center"
              headingLevel="h1"
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div style={{ maxWidth: "840px", margin: "var(--spacing-md) auto 0", textAlign: "center", lineHeight: 1.7 }}>
              <p style={{ fontSize: "1.05rem", color: "rgba(26, 25, 24, 0.85)" }}>
                For centuries, Rajasthan has been the spiritual heartland of white marble carving. Operating directly from our Jaipur workshop, Jaipur Stonecraft transforms raw Makrana marble blocks into intricate deity idols, courtyard fountains, geometric jali screens, and structural temple components using generational hand-chiseling practices.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 2. MARBLE CATEGORY CLUSTERS */}
      <Section background="grey" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Material Clusters"
              heading="Browse Marble Stonework by Subject"
              description="Explore specialized material pages linking directly into our master product designs and collection landing pages."
            />
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--spacing-xl)",
              marginTop: "var(--spacing-xl)",
            }}
          >
            {Object.values(marbleHubData).map((cluster, idx) => (
              <ScrollReveal key={cluster.slug} animation="fade-up" delay={idx * 80}>
                <MaterialCard
                  name={cluster.title}
                  badgeText={cluster.eyebrow}
                  description={cluster.description}
                  imageSrc={cluster.imageSrc || `https://placehold.co/800x500/E8E4DF/1A1918?text=${encodeURIComponent(cluster.title)}`}
                  href={`/marble/${cluster.slug}`}
                  variant={idx === 0 ? "featured" : "standard"}
                />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. SUBSTANTIVE MARBLE KNOWLEDGE SECTION */}
      <Section background="light" spacing="standard">
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--spacing-xl)" }}>
            <ScrollReveal animation="fade-up">
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--spacing-sm)" }}>The Heritage of Makrana White Marble</h3>
              <p style={{ lineHeight: 1.6, marginBottom: "var(--spacing-sm)" }}>
                Quarried in Nagaur district, Rajasthan, Makrana marble is historically world-renowned for its calcitic purity (up to 98% calcium carbonate). Unlike dolomitic marbles that absorb water and yellow over time, Makrana marble possesses virtually zero water absorption, preserving its pristine white lustre outdoors across centuries.
              </p>
              <p style={{ lineHeight: 1.6 }}>
                It was famously chosen for the Taj Mahal and historic Jain temples of Dilwara, proving its structural longevity under extreme weathering.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--spacing-sm)" }}>Masonic Carving & Finishing Methods</h3>
              <p style={{ lineHeight: 1.6, marginBottom: "var(--spacing-sm)" }}>
                Sculpting white marble demands absolute chisel control; a single miscalculated blow can cleave a crystalline plane. Artisans map proportions using traditional bamboo compasses and grid guidelines.
              </p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.2rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
                <li><strong>Natural Honed Finish:</strong> Smooth matte finish preserving stone texture without high reflections.</li>
                <li><strong>High-Gloss Mirror Polish:</strong> Hand-buffed using natural emery powders for brilliant sacred statue luster.</li>
                <li><strong>Antique Chiseled Relief:</strong> Textured chisel strokes for historic temple facade walls.</li>
              </ul>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 4. REQUEST A QUOTE CTA */}
      <CTASection
        heading="Commission Custom White Marble Stonework"
        description="Consult with our Jaipur atelier for custom marble block selection, CAD drawing scaling, or international shipment coordination."
        primaryCtaText="Request a Quote"
        primaryCtaHref="/contact?type=quote&material=white-marble"
        secondaryCtaText="WhatsApp Designer"
        secondaryCtaHref={siteConfig.contact.whatsappLink}
        background="dark"
      />
    </>
  );
}
