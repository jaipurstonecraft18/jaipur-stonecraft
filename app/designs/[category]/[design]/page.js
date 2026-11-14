import { permanentRedirect, notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import ProductHero from "@/components/ProductDetail/ProductHero";
import ProductSubtleCraftsmanship from "@/components/ProductDetail/ProductSubtleCraftsmanship";
import ProductPerspectiveGallery from "@/components/ProductDetail/ProductPerspectiveGallery";
import ProductRecommendations from "@/components/ProductDetail/ProductRecommendations";
import ProductCustomizationBanner from "@/components/ProductDetail/ProductCustomizationBanner";
import { getCollection, getSubcategory } from "@/content/collections";
import { categoriesData, getCategory } from "@/content/categories";
import { getProductFromDB, getRelatedProductsFromDB, getAllProductsFromDB } from "@/content/products-db";

export const revalidate = 3600; // 1-hour ISR with instant admin on-demand revalidation

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
  let design = await getProductFromDB(categorySlug, designSlug);
  if (!design) {
    design = await getProductFromDB(designSlug);
  }

  if (!design) return {};

  const category = await getCategory(design.parentCategory);

  let seoObj = {};
  if (typeof design.seo === "string") {
    try { seoObj = JSON.parse(design.seo); } catch { seoObj = {}; }
  } else if (design.seo && typeof design.seo === "object") {
    seoObj = design.seo;
  }

  const pageTitle = (seoObj.title || seoObj.seoTitle || seoObj.titleTag || "").trim() || `${design.name} | Jaipur Stonecraft`;
  const metaDesc = (seoObj.description || seoObj.metaDescription || "").trim() || design.shortDescription || `Hand-carved ${design.name} sculpted in Jaipur, Rajasthan. Custom dimensions and worldwide delivery available.`;
  const targetCategory = design.parentCategory || categorySlug;
  const targetSlug = design.slug || designSlug;
  const canonicalUrl = `https://jaipurstonecraft.com/designs/${targetCategory}/${targetSlug}`;
  const isIndexable = seoObj.indexable !== undefined ? Boolean(seoObj.indexable) : true;
  
  const primaryKw = (seoObj.primaryKeyword || "").trim();
  const secondaryKws = Array.isArray(seoObj.secondaryKeywords) ? seoObj.secondaryKeywords : [];
  const longTailKws = Array.isArray(seoObj.longTailKeywords) ? seoObj.longTailKeywords : [];
  const baseKws = Array.isArray(seoObj.keywords) ? seoObj.keywords : (typeof seoObj.keywords === "string" ? seoObj.keywords.split(",") : []);
  const combinedKeywordsList = Array.from(new Set([primaryKw, ...secondaryKws, ...longTailKws, ...baseKws])).map(k => String(k).trim()).filter(Boolean);

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
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: metaDesc,
      images: [design.imageSrc],
    },
  };
}

export default async function DesignDetailPage({ params }) {
  const resolvedParams = await params;
  const { category: categorySlug, design: designSlug } = resolvedParams;

  let design = await getProductFromDB(categorySlug, designSlug);
  if (!design) {
    const singleProduct = await getProductFromDB(designSlug);
    if (singleProduct && singleProduct.parentCategory && singleProduct.parentCategory !== categorySlug) {
      permanentRedirect(`/designs/${singleProduct.parentCategory}/${singleProduct.slug}`);
    }
    notFound();
  }

  const category = await getCategory(design.parentCategory);
  const collection = category ? await getCollection(category.parentCollection) : null;
  const subcategory = category ? await getSubcategory(category.parentCollection, category.parentSubcategory) : null;

  // Data-driven related products
  const relatedDesigns = await getRelatedProductsFromDB(design, 6);

  const availabilitySchema = design.attributes?.availabilityStatus === "made_to_order" 
    ? "https://schema.org/MadeToOrder"
    : design.isCustomOnly
    ? "https://schema.org/PreOrder"
    : "https://schema.org/InStock";

  const canonicalUrl = `https://jaipurstonecraft.com/designs/${design.parentCategory || categorySlug}/${design.slug || designSlug}`;

  // Image perspectives array for schema (deduplicated)
  const allImageUrls = Array.from(
    new Set(
      [
        design.imageSrc,
        ...(Array.isArray(design.imageGallery)
          ? design.imageGallery.map((img) => (typeof img === "string" ? img : (img.url || img.src))).filter(Boolean)
          : []),
      ]
        .filter(Boolean)
        .map((u) => (typeof u === "string" ? u.trim().replace(/^["']|["']$/g, "") : ""))
        .filter(Boolean)
    )
  );

  // Extract structured FAQs from knowledge layer
  const klFaqs = design.knowledgeLayer?.faqs || design.faqs || [];
  const validFaqs = Array.isArray(klFaqs) ? klFaqs.filter((f) => (f.question || f.q) && (f.answer || f.a)) : [];

  const jsonLdGraph = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jaipurstonecraft.com" },
        { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://jaipurstonecraft.com/collections" },
        ...(collection ? [{ "@type": "ListItem", "position": 3, "name": collection.name, "item": `https://jaipurstonecraft.com/collections/${collection.slug}` }] : []),
        ...(subcategory ? [{ "@type": "ListItem", "position": 4, "name": subcategory.name, "item": `https://jaipurstonecraft.com/collections/${collection?.slug}/${subcategory.slug}` }] : []),
        ...(category ? [{ "@type": "ListItem", "position": 5, "name": category.name, "item": `https://jaipurstonecraft.com/collections/${collection?.slug}/${subcategory?.slug}/${category.slug}` }] : []),
        { "@type": "ListItem", "position": 6, "name": design.name, "item": canonicalUrl },
      ],
    },
    {
      "@type": "Product",
      "name": design.name,
      "description": design.shortDescription || design.detailedDescription,
      ...(design.knowledgeLayer?.aeoSummary ? { "disambiguatingDescription": design.knowledgeLayer.aeoSummary } : {}),
      "image": allImageUrls.length > 1 ? allImageUrls : design.imageSrc,
      "sku": design.sku || design.slug,
      "url": canonicalUrl,
      "category": category ? category.name : undefined,
      "brand": {
        "@type": "Brand",
        "name": "Jaipur Stonecraft",
      },
      "material": design.primaryMaterial ? design.primaryMaterial.name : (design.attributes?.stoneVariety || "White Makrana Marble"),
      "countryOfOrigin": "India",
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "INR",
        ...(design.price && Number(design.price) > 0 ? { "price": String(design.price) } : {}),
        "availability": availabilitySchema,
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Jaipur Stonecraft",
          "url": "https://jaipurstonecraft.com"
        }
      }
    },
    ...(validFaqs.length > 0 ? [{
      "@type": "FAQPage",
      "mainEntity": validFaqs.map((f) => ({
        "@type": "Question",
        "name": f.question || f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer || f.a,
        },
      })),
    }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": jsonLdGraph,
  };


  const MARBLE_DEITY_LANDINGS = {
    "ganesh-ji": { href: "/marble-ganesh-statues", label: "Marble Ganesh Statues Guide" },
    "shiva-ji": { href: "/marble-shiva-statues", label: "Marble Shiva Statues Guide" },
    "radha-krishna": { href: "/marble-radha-krishna-statues", label: "Marble Radha Krishna Statues Guide" },
    "krishna-ji": { href: "/marble-radha-krishna-statues", label: "Marble Radha Krishna Statues Guide" },
    "hanuman-ji": { href: "/marble-hanuman-statues", label: "Marble Hanuman Statues Guide" },
  };

  const relevantLanding = MARBLE_DEITY_LANDINGS[design.parentCategory] || 
    (category?.parentCollection === "sculptures-statues" ? { href: "/marble-statues", label: "Marble Statues Guide" } : null);

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
        subcategorySlug={subcategory ? subcategory.slug : ""}
        categorySlug={category ? category.slug : ""}
      />

      {/* Contextual Link to Dedicated Marble Guide */}
      {relevantLanding && (
        <section style={{ backgroundColor: "#F4F1EA", padding: "1.75rem 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)" }}>
          <Container>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-bronze)", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>
                  Iconography & Sizing Specifications
                </span>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-charcoal)", fontWeight: 500 }}>
                  Explore comprehensive guidelines on posture traditions, Makrana marble grades, and temple sizing for this sacred form.
                </p>
              </div>
              <Link
                href={relevantLanding.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.25rem",
                  backgroundColor: "var(--color-charcoal)",
                  color: "#FFF",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderRadius: "2px"
                }}
              >
                {relevantLanding.label} →
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* 5. CUSTOM ORDER CONSULTATION BANNER (STEP 3) */}
      <ProductCustomizationBanner design={design} />
    </main>
  );
}
