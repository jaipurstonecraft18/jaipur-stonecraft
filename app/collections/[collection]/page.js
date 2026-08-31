import { notFound } from "next/navigation";
import { collectionsData, getCollection } from "@/content/collections";
import { getCollectionPersonality } from "@/content/collection-personalities";
import CollectionDetailHero from "@/components/CollectionDetail/CollectionDetailHero";
import CollectionMetricsBar from "@/components/CollectionDetail/CollectionMetricsBar";
import SubcollectionExploration from "@/components/CollectionDetail/SubcollectionExploration";
import CollectionMaterials from "@/components/CollectionDetail/CollectionMaterials";
import CollectionCraftProcess from "@/components/CollectionDetail/CollectionCraftProcess";
import CollectionFeaturedArtworks from "@/components/CollectionDetail/CollectionFeaturedArtworks";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
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

      {/* 4. TAILORED NATURAL STONE MATERIAL PALETTE */}
      <CollectionMaterials
        materials={personality.materials}
        collectionName={collection.name}
      />

      {/* 5. DARK TRANSITION — ATELIER MASONIC CRAFTSMANSHIP PROCESS */}
      <CollectionCraftProcess
        processSteps={personality.processSteps}
        collectionName={collection.name}
      />

      {/* 6. CURATED FEATURED CREATIONS / ARTWORKS */}
      <CollectionFeaturedArtworks
        artworks={personality.artworks}
        collectionName={collection.name}
      />

      {/* 7. COMPACT CLOSING CONVERSION CTA */}
      <CollectionCTA
        ctaData={personality.cta}
        collectionSlug={collection.slug}
      />
    </main>
  );
}
