import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import ProductHero from "@/components/ProductDetail/ProductHero";
import ProductSubtleCraftsmanship from "@/components/ProductDetail/ProductSubtleCraftsmanship";
import ProductPerspectiveGallery from "@/components/ProductDetail/ProductPerspectiveGallery";
import ProductRecommendations from "@/components/ProductDetail/ProductRecommendations";
import ProductCustomizationBanner from "@/components/ProductDetail/ProductCustomizationBanner";
import { getCollection, getSubcategory } from "@/content/collections";
import { categoriesData } from "@/content/categories";
import { getProductFromDB, getRelatedProductsFromDB, getAllProductsFromDB } from "@/content/products-db";

export async function generateStaticParams() {
  const designs = await getAllProductsFromDB();
  return designs.map((design) => ({
    category: design.parentCategory,
    design: design.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { category: categorySlug, design: designSlug } = resolvedParams;
  const design = await getProductFromDB(categorySlug, designSlug);

  if (!design) return {};

  const category = categoriesData[design.parentCategory];

  let seoObj = {};
  if (typeof design.seo === "string") {
    try { seoObj = JSON.parse(design.seo); } catch { seoObj = {}; }
  } else if (design.seo && typeof design.seo === "object") {
    seoObj = design.seo;
  }

  const pageTitle = (seoObj.title || seoObj.seoTitle || seoObj.titleTag || "").trim() || `${design.name} | Jaipur Stonecraft`;
  const metaDesc = (seoObj.description || seoObj.metaDescription || "").trim() || design.shortDescription || `Hand-carved ${design.name} sculpted in Jaipur, Rajasthan. Custom dimensions and worldwide delivery available.`;
  const canonicalUrl = (seoObj.canonicalUrl || seoObj.canonical || "").trim() || `https://jaipurstonecraft.com/designs/${categorySlug}/${designSlug}`;
  const isIndexable = seoObj.indexable !== undefined ? Boolean(seoObj.indexable) : true;
  
  const primaryKw = (seoObj.primaryKeyword || "").trim();
  const secondaryKws = Array.isArray(seoObj.secondaryKeywords) ? seoObj.secondaryKeywords : [];
  const baseKws = Array.isArray(seoObj.keywords) ? seoObj.keywords : (typeof seoObj.keywords === "string" ? seoObj.keywords.split(",") : []);
  const combinedKeywordsList = Array.from(new Set([primaryKw, ...secondaryKws, ...baseKws])).map(k => String(k).trim()).filter(Boolean);

  return {
    title: pageTitle,
    description: metaDesc,
    keywords: combinedKeywordsList.join(", ") || undefined,
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "Jaipur Stonecraft",
      type: "website",
      images: [
        {
          url: design.imageSrc,
          width: 800,
          height: 600,
          alt: design.imageAlt || `${design.name} - Hand-carved in Jaipur`,
        },
      ],
    },
  };
}

export default async function DesignDetailPage({ params }) {
  const resolvedParams = await params;
  const { category: categorySlug, design: designSlug } = resolvedParams;

  const design = await getProductFromDB(categorySlug, designSlug);
  if (!design) {
    notFound();
  }

  const category = categoriesData[design.parentCategory];
  const collection = category ? await getCollection(category.parentCollection) : null;
  const subcategory = category ? await getSubcategory(category.parentCollection, category.parentSubcategory) : null;

  // Data-driven related products
  const relatedDesigns = await getRelatedProductsFromDB(design, 6);

  const availabilitySchema = design.attributes?.availabilityStatus === "made_to_order" 
    ? "https://schema.org/MadeToOrder"
    : design.isCustomOnly
    ? "https://schema.org/PreOrder"
    : "https://schema.org/InStock";

  const jsonLdGraph = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jaipurstonecraft.com" },
        { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://jaipurstonecraft.com/collections" },
        ...(collection ? [{ "@type": "ListItem", "position": 3, "name": collection.name, "item": `https://jaipurstonecraft.com/collections/${collection.slug}` }] : []),
        ...(subcategory ? [{ "@type": "ListItem", "position": 4, "name": subcategory.name, "item": `https://jaipurstonecraft.com/collections/${collection?.slug}/${subcategory.slug}` }] : []),
        ...(category ? [{ "@type": "ListItem", "position": 5, "name": category.name, "item": `https://jaipurstonecraft.com/collections/${collection?.slug}/${subcategory?.slug}/${category.slug}` }] : []),
        { "@type": "ListItem", "position": 6, "name": design.name, "item": `https://jaipurstonecraft.com/designs/${categorySlug}/${designSlug}` },
      ],
    },
    {
      "@type": "Product",
      "name": design.name,
      "description": design.shortDescription || design.detailedDescription,
      "image": design.imageSrc,
      "category": category ? category.name : undefined,
      "brand": {
        "@type": "Brand",
        "name": "Jaipur Stonecraft",
      },
      "material": design.primaryMaterial ? design.primaryMaterial.name : (design.attributes?.stoneVariety || "White Makrana Marble"),
      "offers": {
        "@type": "Offer",
        "availability": availabilitySchema,
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Jaipur Stonecraft"
        }
      }
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": jsonLdGraph,
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. PRODUCT HERO & GALLERY (STEP 1 - REFERENCE LAYOUT) */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container>
          <ProductHero
            design={design}
            category={category}
            collection={collection}
            subcategory={subcategory}
          />
        </Container>
      </Section>

      {/* 2. DARK ATELIER CRAFTSMANSHIP BANNER + 6-CARD PRODUCT DETAILS (STEP 2) */}
      <ProductSubtleCraftsmanship design={design} />

      {/* 3. MULTIPLE PERSPECTIVES GALLERY (STEP 3) */}
      <ProductPerspectiveGallery design={design} />

      {/* 4. MORE FROM THE COLLECTION RECOMMENDATIONS (STEP 3) */}
      <ProductRecommendations
        relatedProducts={relatedDesigns}
        categoryName={category ? category.name : ""}
        collectionSlug={collection ? collection.slug : ""}
        categorySlug={category ? category.slug : ""}
      />

      {/* 5. CUSTOM ORDER CONSULTATION BANNER (STEP 3) */}
      <ProductCustomizationBanner design={design} />
    </main>
  );
}
