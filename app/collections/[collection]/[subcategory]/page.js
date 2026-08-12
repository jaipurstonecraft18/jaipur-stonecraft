import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { collectionsData, getCollection, getSubcategory } from "@/content/collections";
import { getCategoriesBySubcategory } from "@/content/categories";

export async function generateStaticParams() {
  const params = [];
  Object.values(collectionsData).forEach((collection) => {
    collection.subcategories.forEach((sub) => {
      params.push({
        collection: collection.slug,
        subcategory: sub.slug,
      });
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug, subcategory: subcategorySlug } = resolvedParams;
  const subcategory = getSubcategory(collectionSlug, subcategorySlug);

  if (!subcategory) return {};

  return {
    title: `${subcategory.name} — Jaipur Stonecraft`,
    description: subcategory.description,
    alternates: {
      canonical: `https://jaipurstonecraft.com/collections/${collectionSlug}/${subcategorySlug}`,
    },
  };
}

export default async function SubcategoryPage({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug, subcategory: subcategorySlug } = resolvedParams;

  const collection = getCollection(collectionSlug);
  const subcategory = getSubcategory(collectionSlug, subcategorySlug);

  if (!collection || !subcategory) {
    notFound();
  }

  const categories = getCategoriesBySubcategory(collectionSlug, subcategorySlug);

  // Data-driven visual hierarchy: separate featured vs standard categories
  const featuredCategories = categories.filter((c) => c.featured);
  const standardCategories = categories.filter((c) => !c.featured);

  // Fallback: If no category is explicitly marked featured, treat the first category as featured
  const primaryFeatured = featuredCategories.length > 0 ? featuredCategories[0] : (categories[0] || null);
  const remainingCategories = primaryFeatured
    ? categories.filter((c) => c.slug !== primaryFeatured.slug)
    : categories;

  return (
    <Section background="light" spacing="standard" className="page-offset">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Collections", href: "/collections" },
            { label: collection.name, href: `/collections/${collection.slug}` },
            { label: subcategory.name },
          ]}
        />

        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow={collection.name}
            heading={subcategory.name}
            description={subcategory.description}
            align="center"
            headingLevel="h1"
          />
        </ScrollReveal>

        <div style={{ marginTop: "var(--spacing-xl)" }}>
          {/* 1. FEATURED PROMINENT CATEGORY */}
          {primaryFeatured && (
            <ScrollReveal animation="fade-up">
              <div style={{ marginBottom: "var(--spacing-xl)" }}>
                <CategoryCard
                  name={primaryFeatured.name}
                  description={primaryFeatured.description}
                  imageSrc={primaryFeatured.imageSrc}
                  imageAlt={primaryFeatured.imageAlt}
                  href={`/collections/${collection.slug}/${subcategory.slug}/${primaryFeatured.slug}`}
                  featured={true}
                />
              </div>
            </ScrollReveal>
          )}

          {/* 2. STANDARD CATEGORIES GRID */}
          {remainingCategories.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--spacing-xl)",
              }}
            >
              {remainingCategories.map((cat, idx) => (
                <ScrollReveal key={cat.slug} animation="fade-up" delay={idx * 50}>
                  <CategoryCard
                    name={cat.name}
                    description={cat.description}
                    imageSrc={cat.imageSrc}
                    imageAlt={cat.imageAlt}
                    href={`/collections/${collection.slug}/${subcategory.slug}/${cat.slug}`}
                    featured={false}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
