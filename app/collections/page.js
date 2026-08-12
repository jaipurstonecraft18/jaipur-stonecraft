import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CollectionCard from "@/components/CollectionCard/CollectionCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { collectionsData } from "@/content/collections";

export const metadata = {
  title: "Collections — Jaipur Stonecraft",
  description: "Browse our handcrafted stone collections: Sculptures & Statues, Wall Art & Reliefs, Temples & Architectural Stonework, Fountains & Water Features, Decorative Stone Art, and Custom & Bespoke Creations.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/collections",
  },
  openGraph: {
    title: "Collections — Jaipur Stonecraft",
    description: "Browse our handcrafted stone collections: Sculptures & Statues, Wall Art & Reliefs, Temples & Architectural Stonework, Fountains & Water Features, Decorative Stone Art, and Custom & Bespoke Creations.",
    url: "https://jaipurstonecraft.com/collections",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=Bespoke+Stone+Collections",
        width: 1200,
        height: 630,
        alt: "Bespoke Stone Collections",
      },
    ],
  },
};

export default function Collections() {
  const collections = Object.values(collectionsData);

  return (
    <Section background="light" spacing="standard" className="page-offset">
      <Container>
        <Breadcrumbs items={[{ label: "Collections" }]} />
        
        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="Portfolio Overview"
            heading="Bespoke Collections"
            description="Explore our 6 main stonecraft collections. Every piece is handcrafted from select raw blocks of sandstone, limestone, or premium white marble in our Jaipur atelier."
            align="center"
            headingLevel="h1"
          />
        </ScrollReveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--spacing-xl)",
          marginTop: "var(--spacing-xl)"
        }}>
          {collections.map((col, idx) => (
            <ScrollReveal key={col.slug} animation="fade-up" delay={idx * 100}>
              <CollectionCard
                name={col.name}
                description={col.description}
                imageSrc={col.imageSrc}
                href={`/collections/${col.slug}`}
              />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
