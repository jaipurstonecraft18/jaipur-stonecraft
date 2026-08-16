import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import ProductCard from "@/components/ProductCard/ProductCard";
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
              <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.5rem", fontWeight: 400, marginBottom: "var(--spacing-md)" }}>
                Marble Statue Collections
              </h3>
              
              {/* Asymmetric Composition: Featured First Category + Supporting Cards Grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
                {/* 1. Featured Category (e.g. Ganesh Ji Statues) */}
                <ScrollReveal animation="fade-up">
                  <CategoryCard
                    name={cluster.relatedCategories[0].name}
                    badgeText="Featured Marble Category"
                    description={`Bespoke hand-carved ${cluster.relatedCategories[0].name} in solid Makrana white marble, featuring authentic Shilpa Shastra proportions.`}
                    href={cluster.relatedCategories[0].href}
                    imageSrc={`https://placehold.co/1200x600/E8E4DF/1A1918?text=${encodeURIComponent(cluster.relatedCategories[0].name)}`}
                    variant="featured"
                  />
                </ScrollReveal>

                {/* 2. Supporting Visual Categories Grid (Shiva, Krishna, Buddha, etc.) */}
                {cluster.relatedCategories.length > 1 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--spacing-xl)" }}>
                    {cluster.relatedCategories.slice(1).map((cat, idx) => (
                      <ScrollReveal key={cat.href} animation="fade-up" delay={idx * 80}>
                        <CategoryCard
                          name={cat.name}
                          description={`Hand-carved ${cat.name} in Makrana marble.`}
                          href={cat.href}
                          imageSrc={`https://placehold.co/800x500/E8E4DF/1A1918?text=${encodeURIComponent(cat.name)}`}
                          variant="standard"
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Featured Designs */}
          {cluster.featuredDesigns && cluster.featuredDesigns.length > 0 && (
            <div style={{ marginTop: "var(--spacing-xxl)" }}>
              <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.5rem", fontWeight: 400, marginBottom: "var(--spacing-md)" }}>Available Designs & Custom Configurations</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--spacing-xl)" }}>
                {cluster.featuredDesigns.map((des, idx) => (
                  <ProductCard
                    key={des.href}
                    name={des.name}
                    href={des.href}
                    material="Makrana White Marble"
                    imageSrc={`https://placehold.co/800x1000/E8E4DF/1A1918?text=${encodeURIComponent(des.name)}`}
                    variant={idx === 0 ? "featured" : "standard"}
                  />
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
