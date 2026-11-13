import { notFound } from "next/navigation";
import { collectionsData, getCollection } from "@/content/collections";
import { getCollectionPersonality } from "@/content/collection-personalities";
import Link from "next/link";
import Container from "@/components/Container/Container";
import CollectionDetailHero from "@/components/CollectionDetail/CollectionDetailHero";
import CollectionMetricsBar from "@/components/CollectionDetail/CollectionMetricsBar";
import SubcollectionExploration from "@/components/CollectionDetail/SubcollectionExploration";
import CollectionCraftProcess from "@/components/CollectionDetail/CollectionCraftProcess";
import CollectionCTA from "@/components/CollectionDetail/CollectionCTA";
export const revalidate = 600; // 10-minute ISR with instant admin on-demand revalidation

export async function generateStaticParams() {
  return Object.keys(collectionsData).map((collection) => ({
    collection,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug } = resolvedParams;
  const collection = await getCollection(collectionSlug);

  if (!collection) return {};

  const personality = getCollectionPersonality(collectionSlug);

  return {
    title: `${collection.name} — Jaipur Stonecraft Atelier`,
    description: collection.description,
    alternates: {
      canonical: `https://jaipurstonecraft.com/collections/${collectionSlug}`,
    },
    openGraph: {
      title: `${collection.name} — Jaipur Stonecraft Atelier`,
      description: collection.description,
      url: `https://jaipurstonecraft.com/collections/${collectionSlug}`,
      siteName: "Jaipur Stonecraft",
      type: "website",
      images: [
        {
          url: collection.imageSrc || collection.image_src || personality.heroImageSrc || "/images/collections/hero-sculptures-group.webp",
          width: 1200,
          height: 630,
          alt: `${collection.name} — Jaipur Stonecraft`,
        },
      ],
    },
  };
}

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug } = resolvedParams;
  const collection = await getCollection(collectionSlug);

  if (!collection) {
    notFound();
  }

  const personality = getCollectionPersonality(collectionSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jaipurstonecraft.com" },
          { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://jaipurstonecraft.com/collections" },
          { "@type": "ListItem", "position": 3, "name": collection.name, "item": `https://jaipurstonecraft.com/collections/${collection.slug}` },
        ],
      },
      {
        "@type": "CollectionPage",
        "name": `${collection.name} — Jaipur Stonecraft Atelier`,
        "description": collection.description,
        "url": `https://jaipurstonecraft.com/collections/${collection.slug}`,
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": (collection.subcategories || []).map((sub, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": sub.name,
            "url": `https://jaipurstonecraft.com/collections/${collection.slug}/${sub.slug}`
          }))
        }
      }
    ],
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. REFINED COLLECTION INTRO HERO */}

      <CollectionDetailHero
        collection={collection}
        heroData={{
          eyebrow: personality.eyebrow,
          tagline: personality.tagline,
          badgeTitle: personality.badgeTitle,
          badgeValue: personality.badgeValue,
          heroImageSrc: collection.imageSrc || collection.image_src || personality.heroImageSrc || "/images/collections/hero-sculptures-group.webp"
        }}
      />

      {/* 2. COLLECTION METRICS & SPECIFICATIONS STRIP */}
      <CollectionMetricsBar metrics={personality.metrics} />

      {/* 3. SCALABLE SUB-COLLECTION EXPLORATION (3 to 20+ Categories) */}
      <SubcollectionExploration collection={collection} />

      {/* Contextual Link Strip for Sculptures Collection */}
      {collectionSlug === "sculptures-statues" && (
        <section style={{ backgroundColor: "var(--color-cream-secondary)", padding: "clamp(2.5rem, 4vw, 4rem) 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)" }}>
          <Container>
            <div style={{ maxWidth: "880px", margin: "0 auto", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-bronze)", fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                Specialized Sizing & Iconography Guides
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.35rem)", color: "var(--color-charcoal)", marginBottom: "0.75rem", fontWeight: "400" }}>
                Commissioning Sacred Marble Moorti Art
              </h3>
              <p style={{ fontSize: "1rem", color: "#55504B", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Explore our dedicated search guides on Makrana white marble selection, classical postures, and bespoke sizing for home mandirs and temple trusts.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/marble-statues" style={{ padding: "0.6rem 1.25rem", background: "var(--color-charcoal)", color: "#FFF", borderRadius: "2px", fontSize: "0.8125rem", fontWeight: "600", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                  Marble Statues Overview →
                </Link>
                <Link href="/marble-ganesh-statues" style={{ padding: "0.6rem 1.25rem", background: "#FFF", border: "1px solid var(--color-border-subtle)", color: "var(--color-charcoal)", borderRadius: "2px", fontSize: "0.8125rem", fontWeight: "600", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                  Marble Ganesh Statues
                </Link>
                <Link href="/marble-radha-krishna-statues" style={{ padding: "0.6rem 1.25rem", background: "#FFF", border: "1px solid var(--color-border-subtle)", color: "var(--color-charcoal)", borderRadius: "2px", fontSize: "0.8125rem", fontWeight: "600", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                  Marble Radha Krishna Statues
                </Link>
                <Link href="/marble-shiva-statues" style={{ padding: "0.6rem 1.25rem", background: "#FFF", border: "1px solid var(--color-border-subtle)", color: "var(--color-charcoal)", borderRadius: "2px", fontSize: "0.8125rem", fontWeight: "600", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                  Marble Shiva Statues
                </Link>
                <Link href="/marble-hanuman-statues" style={{ padding: "0.6rem 1.25rem", background: "#FFF", border: "1px solid var(--color-border-subtle)", color: "var(--color-charcoal)", borderRadius: "2px", fontSize: "0.8125rem", fontWeight: "600", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                  Marble Hanuman Statues
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 4. DARK TRANSITION — ATELIER MASONIC CRAFTSMANSHIP PROCESS */}
      <CollectionCraftProcess
        processSteps={personality.processSteps}
        collectionName={collection.name}
      />

      {/* 5. COMPACT CLOSING CONVERSION CTA */}
      <CollectionCTA
        ctaData={personality.cta}
        collectionSlug={collection.slug}
      />
    </main>
  );
}
