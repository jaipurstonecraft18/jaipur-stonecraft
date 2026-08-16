import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import Link from "next/link";
import { getAllKnowledgeArticles } from "@/content/products-db";

export const metadata = {
  title: "Craftsmanship & Material Knowledge — Jaipur Stonecraft",
  description: "Explore Jaipur Stonecraft guides on marble selection, temple iconography, masonic hand-chiseling techniques, and international export packaging.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/knowledge",
  },
};

export default function KnowledgeHubPage() {
  const articles = getAllKnowledgeArticles();

  return (
    <Section background="light" spacing="standard" className="page-offset">
      <Container>
        <Breadcrumbs items={[{ label: "Craftsmanship & Material Knowledge" }]} />

        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="Craftsmanship Archives"
            heading="Stonecraft & Material Knowledge"
            description="First-hand insights into raw marble quarry selection, Shilpa Shastra proportion carving, sanctuary mandir architecture, and international logistics."
            align="center"
            headingLevel="h1"
          />
        </ScrollReveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "var(--spacing-xl)",
          marginTop: "var(--spacing-2xl)"
        }}>
          {articles.map((article, idx) => (
            <ScrollReveal key={article.slug} animation="fade-up" delay={idx * 100}>
              <div style={{
                background: "var(--color-cream)",
                border: "1px solid var(--color-stone-grey)",
                padding: "var(--spacing-md)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)"
              }}>
                <div>
                  <span className="eyebrow" style={{ marginBottom: "var(--spacing-xxs)", fontSize: "0.75rem" }}>
                    {article.type.replace(/_/g, " ")} • {article.readTimeMinutes} Min Read
                  </span>

                  <h2 style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.5rem",
                    margin: "var(--spacing-xs) 0",
                    color: "var(--color-charcoal)",
                    fontWeight: 400
                  }}>
                    {article.title}
                  </h2>

                  <p className="small" style={{ lineHeight: 1.6 }}>
                    {article.summary}
                  </p>
                </div>

                <div style={{ marginTop: "var(--spacing-md)" }}>
                  <Link
                    href={`/knowledge/${article.slug}`}
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      fontFamily: "var(--font-inter), sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--color-bronze)",
                      textDecoration: "none"
                    }}
                  >
                    Read Guide &rarr;
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
