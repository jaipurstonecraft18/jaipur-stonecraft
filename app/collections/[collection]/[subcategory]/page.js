import { permanentRedirect, notFound } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { collectionsData, getCollection, getSubcategory } from "@/content/collections";
import { getCategoriesBySubcategory, getCategory } from "@/content/categories";
import { LEGACY_CATEGORY_REDIRECTS, resolveCanonicalCategoryUrl } from "@/lib/taxonomy/legacy-redirects";
import styles from "./SubcategoryPage.module.css";
export const revalidate = 600; // 10-minute ISR with instant admin on-demand revalidation

export async function generateStaticParams() {
  const params = [];
  for (const col of Object.values(collectionsData)) {
    for (const sub of col.subcategories || []) {
      params.push({
        collection: sub.parentCollection || col.slug,
        subcategory: sub.slug,
      });
    }
  }
  return params;
}
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug, subcategory: subcategorySlug } = resolvedParams;

  const subcategory = await getSubcategory(collectionSlug, subcategorySlug);
  if (!subcategory) {
    const redirectUrl = resolveCanonicalCategoryUrl(subcategorySlug);
    if (redirectUrl) {
      return {
        alternates: {
          canonical: `https://jaipurstonecraft.com${redirectUrl}`,
        },
      };
    }
    return {};
  }

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

  if (!subcategory) {
    // 1. Root cause defense: Check if subcategorySlug is actually an active category slug (2-segment category URL)
    const categoryMatch = await getCategory(collectionSlug, null, subcategorySlug);
    if (categoryMatch && categoryMatch.parentCollection && categoryMatch.parentSubcategory) {
      permanentRedirect(`/collections/${categoryMatch.parentCollection}/${categoryMatch.parentSubcategory}/${categoryMatch.slug}`);
    }

    // 2. Check if subcategorySlug is in legacy retired category redirects
    if (LEGACY_CATEGORY_REDIRECTS[subcategorySlug]) {
      permanentRedirect(LEGACY_CATEGORY_REDIRECTS[subcategorySlug]);
    }

    // 3. Check generic canonical category resolver
    const canonicalRedirect = resolveCanonicalCategoryUrl(subcategorySlug);
    if (canonicalRedirect) {
      permanentRedirect(canonicalRedirect);
    }
  }

  if (!collection || !subcategory) {
    notFound();
  }

  const categories = await getCategoriesBySubcategory(collectionSlug, subcategorySlug);

  const isTwoCategories = categories.length === 2;

  // Data-driven visual hierarchy: separate featured vs standard categories
  const featuredCategories = categories.filter((c) => c.featured);
  const standardCategories = categories.filter((c) => !c.featured);

  // Fallback: If no category is explicitly marked featured, treat the first category as featured
  // BUT if exactly two categories exist, make both cards equal in size and symmetrically aligned
  const primaryFeatured = isTwoCategories
    ? null
    : (featuredCategories.length > 0 ? featuredCategories[0] : (categories[0] || null));
  const remainingCategories = primaryFeatured
    ? categories.filter((c) => c.slug !== primaryFeatured.slug)
    : categories;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jaipurstonecraft.com" },
          { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://jaipurstonecraft.com/collections" },
          { "@type": "ListItem", "position": 3, "name": collection.name, "item": `https://jaipurstonecraft.com/collections/${collection.slug}` },
          { "@type": "ListItem", "position": 4, "name": subcategory.name, "item": `https://jaipurstonecraft.com/collections/${collection.slug}/${subcategory.slug}` },
        ],
      },
      {
        "@type": "CollectionPage",
        "name": `${subcategory.name} — Jaipur Stonecraft`,
        "description": subcategory.description,
        "url": `https://jaipurstonecraft.com/collections/${collection.slug}/${subcategory.slug}`,
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": categories.map((cat, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": cat.name,
            "url": `https://jaipurstonecraft.com/collections/${collection.slug}/${subcategory.slug}/${cat.slug}`
          }))
        }
      }
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <div className={styles.categoriesContainer}>
          {/* 1. FEATURED PROMINENT CATEGORY (Shown when not exactly 2 cards) */}
          {primaryFeatured && (
            <ScrollReveal animation="fade-up">
              <div className={styles.featuredWrapper}>
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

          {/* 2. CATEGORIES GRID (Equal 2-card symmetrical grid if exactly 2, or adaptive grid) */}
          {remainingCategories.length > 0 && (
            <div
              className={`${styles.categoriesGrid} ${
                isTwoCategories ? styles.categoriesGridTwo : ""
              }`}
            >
              {remainingCategories.map((cat, idx) => (
                <ScrollReveal
                  key={cat.slug}
                  animation="fade-up"
                  delay={idx * 50}
                  className={styles.cardReveal}
                >
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
