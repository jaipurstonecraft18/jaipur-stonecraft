import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CollectionCard from "@/components/CollectionCard/CollectionCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { collectionsData, getCollection } from "@/content/collections";

export async function generateStaticParams() {
  return Object.keys(collectionsData).map((collection) => ({
    collection,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug } = resolvedParams;
  const collection = getCollection(collectionSlug);

  if (!collection) return {};

  return {
    title: `${collection.name} — Jaipur Stonecraft`,
    description: collection.description,
    alternates: {
      canonical: `https://jaipurstonecraft.com/collections/${collectionSlug}`,
    },
  };
}

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug } = resolvedParams;
  const collection = getCollection(collectionSlug);

  if (!collection) {
    notFound();
  }

  return (
    <Section background="light" spacing="standard" className="page-offset">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Collections", href: "/collections" },
            { label: collection.name },
          ]}
        />

        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="Collection Category"
            heading={collection.name}
            description={collection.description}
            align="center"
            headingLevel="h1"
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
          {collection.subcategories.map((sub, idx) => (
            <ScrollReveal key={sub.slug} animation="fade-up" delay={idx * 80}>
              <CollectionCard
                name={sub.name}
                description={sub.description}
                imageSrc={sub.imageSrc}
                href={`/collections/${collection.slug}/${sub.slug}`}
              />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
