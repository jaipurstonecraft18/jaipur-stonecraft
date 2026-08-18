import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import CollectionCard from "@/components/CollectionCard/CollectionCard";
import { getKnowledgeArticle, getAllKnowledgeArticles, getProductFromDB } from "@/content/products-db";

export async function generateStaticParams() {
  return getAllKnowledgeArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const article = getKnowledgeArticle(slug);

  if (!article) return {};

  return {
    title: `${article.title} | Jaipur Stonecraft`,
    description: article.summary,
    alternates: {
      canonical: `https://jaipurstonecraft.com/knowledge/${slug}`,
    },
  };
}

export default async function KnowledgeArticlePage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const article = getKnowledgeArticle(slug);
  if (!article) {
    notFound();
  }

  const rawProducts = await Promise.all(
    (article.relatedProductSlugs || []).map(async (productSlug) => {
      return await getProductFromDB(productSlug);
    })
  );
  const relatedProducts = rawProducts.filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.summary,
    "author": {
      "@type": "Organization",
      "name": "Jaipur Stonecraft Artisans"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jaipur Stonecraft"
    },
    "dateModified": article.lastUpdated
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section background="light" spacing="standard" className="page-offset">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Knowledge Archives", href: "/knowledge" },
              { label: article.title },
            ]}
          />

          <article style={{ maxWidth: "800px", margin: "0 auto" }}>
            <ScrollReveal animation="fade-up">
              <span className="eyebrow">
                {article.type.replace(/_/g, " ")} • Authored by {article.authorRole}
              </span>

              <h1 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                margin: "var(--spacing-xs) 0 var(--spacing-sm)",
                color: "var(--color-charcoal)",
                fontWeight: 300
              }}>
                {article.title}
              </h1>

              <p className="large" style={{ lineHeight: "1.7" }}>
                {article.summary}
              </p>
            </ScrollReveal>

            <div style={{
              height: "1px",
              background: "var(--color-stone-grey)",
              margin: "var(--spacing-xl) 0"
            }} />

            {/* Article Content Sections */}
            <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
              {article.sections.map((sec, idx) => (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 60}>
                  <h2 style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.6rem",
                    color: "var(--color-charcoal)",
                    marginBottom: "var(--spacing-xs)",
                    fontWeight: 400
                  }}>
                    {sec.heading}
                  </h2>
                  <p style={{
                    fontSize: "1rem",
                    lineHeight: "1.75",
                    color: "rgba(26, 25, 24, 0.85)"
                  }}>
                    {sec.content}
                  </p>
                </ScrollReveal>
              ))}
            </div>

            {/* Related Products from Central Data Engine */}
            {relatedProducts.length > 0 && (
              <div style={{ marginTop: "var(--spacing-xxl)", paddingTop: "var(--spacing-xl)", borderTop: "1px solid var(--color-stone-grey)" }}>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.5rem", marginBottom: "var(--spacing-md)", fontWeight: 400 }}>
                  Featured Artworks Referenced in This Guide
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                  {relatedProducts.map((p) => (
                    <CollectionCard
                      key={p.slug}
                      name={p.name}
                      description={`${p.primaryMaterial ? p.primaryMaterial.shortName : 'Makrana Marble'} • Hand-carved`}
                      imageSrc={p.imageSrc}
                      href={`/designs/${p.parentCategory}/${p.slug}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        </Container>
      </Section>
    </>
  );
}
