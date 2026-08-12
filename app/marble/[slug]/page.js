import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CTASection from "@/components/CTASection/CTASection";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { marbleHubData } from "@/content/marble";
import { siteConfig } from "@/content/site";

export async function generateStaticParams() {
  return Object.keys(marbleHubData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const cluster = marbleHubData[slug];

  if (!cluster) return {};

  return {
    title: `${cluster.title} — Jaipur Marble Hub`,
    description: cluster.description,
    alternates: {
      canonical: `https://jaipurstonecraft.com/marble/${slug}`,
    },
    openGraph: {
      title: `${cluster.title} — Jaipur Marble Hub`,
      description: cluster.description,
      url: `https://jaipurstonecraft.com/marble/${slug}`,
      siteName: "Jaipur Stonecraft",
      type: "website",
    },
  };
}

export default async function MarbleSubPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const cluster = marbleHubData[slug];

  if (!cluster) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": cluster.title,
    "description": cluster.description,
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
        {
          "@type": "ListItem",
          "position": 3,
          "name": cluster.title,
          "item": `https://jaipurstonecraft.com/marble/${slug}`,
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

      {/* 1. HERO SECTION */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Marble Hub", href: "/marble" },
              { label: cluster.title },
            ]}
          />

          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow={cluster.eyebrow}
              heading={cluster.title}
              description={cluster.description}
              align="center"
              headingLevel="h1"
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div style={{ maxWidth: "800px", margin: "var(--spacing-md) auto 0", textAlign: "center", lineHeight: 1.7 }}>
              <p style={{ fontSize: "1.05rem", color: "rgba(26, 25, 24, 0.85)" }}>
                {cluster.intro}
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 2. RELEVANT CATEGORY & DESIGN LINKS (PARALLEL DISCOVERY PATH) */}
      <Section background="grey" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Catalogue Discovery"
              heading="Explore Matching Product Categories & Designs"
              description="Navigate directly into our master catalog pages for specific dimensions and variant configurations."
            />
          </ScrollReveal>

          {/* Related Categories */}
          {cluster.relatedCategories && cluster.relatedCategories.length > 0 && (
            <div style={{ marginTop: "var(--spacing-xl)" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--spacing-md)" }}>Master Categories:</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-md)" }}>
                {cluster.relatedCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    style={{
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--color-cream)",
                      border: "1px solid var(--color-stone-grey)",
                      borderRadius: "4px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <h4 style={{ fontSize: "1.05rem", marginBottom: "var(--spacing-xxs)" }}>{cat.name}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-bronze)" }}>View Category Landing Page &rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured Designs */}
          {cluster.featuredDesigns && cluster.featuredDesigns.length > 0 && (
            <div style={{ marginTop: "var(--spacing-xl)" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--spacing-md)" }}>Featured Masonic Designs:</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-md)" }}>
                {cluster.featuredDesigns.map((des) => (
                  <Link
                    key={des.href}
                    href={des.href}
                    style={{
                      padding: "var(--spacing-md)",
                      backgroundColor: "#ffffff",
                      border: "1px solid var(--color-stone-grey)",
                      borderRadius: "4px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <h4 style={{ fontSize: "1.05rem", marginBottom: "var(--spacing-xxs)" }}>{des.name}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-bronze)" }}>View Design & Variant Options &rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* 3. MATERIAL & CRAFT GUIDANCE */}
      <Section background="light" spacing="standard">
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--spacing-xl)" }}>
            <ScrollReveal animation="fade-up">
              <h3 style={{ fontSize: "1.35rem", marginBottom: "var(--spacing-sm)" }}>Stone Block Sourcing</h3>
              <p style={{ lineHeight: 1.6 }}>
                We inspect raw marble blocks directly at Nagaur quarries in Rajasthan, rejecting any block exhibiting internal mica fissures or iron deposits to ensure long-term structural integrity.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h3 style={{ fontSize: "1.35rem", marginBottom: "var(--spacing-sm)" }}>Maintenance & Care</h3>
              <p style={{ lineHeight: 1.6 }}>
                Pure white marble should be cleaned with mild pH-neutral stone soaps. Avoid acidic cleaners. Outdoor installations can be treated with breathable impregnating sealers to repel rain stains without trapping internal moisture.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 4. REQUEST A QUOTE CTA */}
      <CTASection
        heading={`Commission ${cluster.title}`}
        description="Connect with our master carvers in Jaipur for custom dimensions, CAD blueprints, and international export packing."
        primaryCtaText="Request a Quote"
        primaryCtaHref={`/contact?type=quote&material=${slug}`}
        secondaryCtaText="WhatsApp Designer"
        secondaryCtaHref={siteConfig.contact.whatsappLink}
        background="dark"
      />
    </>
  );
}
