import { notFound } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { collectionsData, getCollection, getSubcategory } from "@/content/collections";
import { getCategoriesBySubcategory } from "@/content/categories";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const collection = await getCollection(collectionSlug);
  const subcategory = await getSubcategory(collectionSlug, subcategorySlug);

  if (!collection || !subcategory) {
    notFound();
  }

  const categories = await getCategoriesBySubcategory(collectionSlug, subcategorySlug);

  // Data-driven visual hierarchy: separate featured vs standard categories
  const featuredCategories = categories.filter((c) => c.featured);
  const standardCategories = categories.filter((c) => !c.featured);

  // Fallback: If no category is explicitly marked featured, treat the first category as featured
  const primaryFeatured = featuredCategories.length > 0 ? featuredCategories[0] : (categories[0] || null);
  const remainingCategories = primaryFeatured
    ? categories.filter((c) => c.slug !== primaryFeatured.slug)
    : categories;

  return (
    <>
      {/* 1. BREADCRUMBS & HERO INTRO BANNER */}
      <div style={{
        position: "relative",
        minHeight: "420px",
        display: "flex",
        alignItems: "center",
        paddingTop: "calc(90px + var(--spacing-lg))",
        paddingBottom: "var(--spacing-xxl)",
        overflow: "hidden",
        backgroundColor: "#111110",
        color: "#FAF8F5",
        borderBottom: "1px solid rgba(158, 123, 79, 0.3)"
      }}>
        {/* Dimmed Background Cover Image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <Image
            src={subcategory.imageSrc || subcategory.image_src || collection.imageSrc || "/images/collections/hero-sculptures-group.jpg"}
            alt={`${subcategory.name} background`}
            fill
            sizes="100vw"
            style={{ objectFit: "cover", filter: "brightness(0.6) contrast(1.05)" }}
            priority
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(17, 17, 16, 0.72) 0%, rgba(26, 25, 24, 0.88) 100%)"
          }} />
        </div>

        {/* Foreground Content */}
        <Container style={{ position: "relative", zIndex: 3 }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "840px",
            margin: "0 auto"
          }}>
            <Breadcrumbs
              items={[
                { label: "Collections", href: "/collections" },
                { label: collection.name, href: `/collections/${collection.slug}` },
                { label: subcategory.name },
              ]}
              theme="dark"
            />

            <ScrollReveal animation="fade-up">
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "#E6C894",
                background: "rgba(158, 123, 79, 0.25)",
                backdropFilter: "blur(4px)",
                padding: "0.4rem 1rem",
                borderRadius: "var(--radius-subtle)",
                border: "1px solid rgba(230, 200, 148, 0.35)",
                marginBottom: "0.75rem"
              }}>
                {collection.name}
              </span>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: "300",
                lineHeight: 1.12,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
                marginBottom: "0.75rem"
              }}>
                {subcategory.name}
              </h1>
              <p style={{
                fontSize: "clamp(1rem, 1.4vw, 1.12rem)",
                lineHeight: 1.7,
                color: "rgba(250, 248, 245, 0.9)",
                maxWidth: "760px",
                margin: "0 auto",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)"
              }}>
                {subcategory.description}
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </div>

      <Section background="light" spacing="standard">
        <Container>
          <div style={{ marginTop: "var(--spacing-md)" }}>
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
  </>
);
}
