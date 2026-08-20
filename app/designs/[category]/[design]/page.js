import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ProductCard from "@/components/ProductCard/ProductCard";
import Gallery from "@/components/Gallery/Gallery";
import CTASection from "@/components/CTASection/CTASection";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton/SecondaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getCollection, getSubcategory } from "@/content/collections";
import { categoriesData } from "@/content/categories";
import { getProductFromDB, getRelatedProductsFromDB, getAllProductsFromDB, getKnowledgeArticlesForProduct } from "@/content/products-db";
import { siteConfig } from "@/content/site";
import styles from "./page.module.css";

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

  // Parse SEO object safely if present
  let seoObj = {};
  if (typeof design.seo === "string") {
    try { seoObj = JSON.parse(design.seo); } catch { seoObj = {}; }
  } else if (design.seo && typeof design.seo === "object") {
    seoObj = design.seo;
  }

  const pageTitle = (seoObj.title || seoObj.seoTitle || seoObj.titleTag || "").trim() || `${design.name} — ${category ? category.name : "Stonecraft"} Design`;
  const metaDesc = (seoObj.description || seoObj.metaDescription || "").trim() || design.shortDescription || "";
  
  const primaryKw = (seoObj.primaryKeyword || "").trim();
  const secondaryKws = Array.isArray(seoObj.secondaryKeywords) ? seoObj.secondaryKeywords : [];
  const baseKws = Array.isArray(seoObj.keywords) ? seoObj.keywords : (typeof seoObj.keywords === "string" ? seoObj.keywords.split(",") : []);
  const combinedKeywordsList = Array.from(new Set([primaryKw, ...secondaryKws, ...baseKws])).map(k => String(k).trim()).filter(Boolean);
  const keywords = combinedKeywordsList.join(", ");

  return {
    title: pageTitle,
    description: metaDesc,
    keywords: keywords || undefined,
    alternates: {
      canonical: `https://jaipurstonecraft.com/designs/${categorySlug}/${designSlug}`,
    },
    openGraph: {
      title: pageTitle,
      description: metaDesc,
      url: `https://jaipurstonecraft.com/designs/${categorySlug}/${designSlug}`,
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


function normalizeKnowledgeData(kl) {
  let sections = [];
  let faqs = [];

  if (Array.isArray(kl)) {
    sections = kl;
  } else if (kl && typeof kl === "object") {
    if (Array.isArray(kl.sections)) sections = kl.sections;
    if (Array.isArray(kl.faqs)) faqs = kl.faqs;

    if (sections.length === 0 && !kl.sections && !kl.faqs) {
      if (kl.whatIsThis) sections.push({ title: "What Is This Carving?", content: kl.whatIsThis });
      if (kl.materialOrigin) sections.push({ title: "Material Origin & Characteristics", content: kl.materialOrigin });
      if (kl.suitableFor) sections.push({ title: "Suitable Placement & Environments", content: kl.suitableFor });
      if (kl.installationCare) sections.push({ title: "Installation Requirements & Care", content: kl.installationCare });
    }
  }

  return { sections, faqs };
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

  const { sections: knowledgeSections, faqs: productFaqs } = normalizeKnowledgeData(design.knowledgeLayer);

  // Data-Driven Relationship Engine (Genuine shared taxonomy)
  const relatedDesigns = await getRelatedProductsFromDB(design, 3);

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
      "sku": design.sku || undefined,
      "category": category ? category.name : undefined,
      "brand": {
        "@type": "Brand",
        "name": "Jaipur Stonecraft",
      },
      "material": design.primaryMaterial ? design.primaryMaterial.name : "White Makrana Marble",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Jaipur Stonecraft"
        }
      }
    },
  ];

  if (productFaqs.length > 0) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      "mainEntity": productFaqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": jsonLdGraph,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. HERO & CONFIGURATION SECTION */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Collections", href: "/collections" },
              ...(collection ? [{ label: collection.name, href: `/collections/${collection.slug}` }] : []),
              ...(subcategory ? [{ label: subcategory.name, href: `/collections/${collection?.slug}/${subcategory.slug}` }] : []),
              ...(category ? [{ label: category.name, href: `/collections/${collection?.slug}/${subcategory?.slug}/${category.slug}` }] : []),
              { label: design.name },
            ]}
          />

          <div className={styles.designCoreGrid}>
            {/* Left Column: Primary Image */}
            <div className={styles.imageCol}>
              <ScrollReveal animation="fade-scale">
                <div className={styles.imageContainer}>
                  <Image
                    src={getImageVariantUrl(design.imageSrc, "display")}
                    alt={`${design.name} — Hand-carved ${design.primaryMaterial ? design.primaryMaterial.name : "Natural Marble"} by Jaipur Stonecraft`}
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Title, Descriptions, Specs & Knowledge Layer */}
            <div className={styles.infoCol}>
              <ScrollReveal animation="fade-up" className={styles.infoContent}>
                <span className="eyebrow">{category ? category.name : "Stonecraft"} — Design Detail</span>
                <h1 className={styles.title}>{design.name}</h1>
                <p className="large" style={{ color: "rgba(26, 25, 24, 0.85)" }}>
                  {design.shortDescription}
                </p>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "1rem 0" }}>
                  {design.primaryMaterial && (
                    <Link
                      href={`/products?material=${design.primaryMaterialId}`}
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.3rem 0.7rem",
                        background: "var(--color-warm-cream, #f4f0ea)",
                        border: "1px solid var(--color-border-subtle, #d8d2c7)",
                        color: "var(--color-charcoal)",
                        textDecoration: "none",
                        borderRadius: "2px"
                      }}
                    >
                      Material: {design.primaryMaterial.name} &rarr;
                    </Link>
                  )}

                  {category && (
                    <Link
                      href={`/collections/${collection?.slug}/${subcategory?.slug}/${category.slug}`}
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.3rem 0.7rem",
                        background: "var(--color-warm-cream, #f4f0ea)",
                        border: "1px solid var(--color-border-subtle, #d8d2c7)",
                        color: "var(--color-charcoal)",
                        textDecoration: "none",
                        borderRadius: "2px"
                      }}
                    >
                      Category: {category.name} &rarr;
                    </Link>
                  )}
                </div>

                <div className={styles.divider} />

                <div className={styles.specGrid}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Primary Stone</span>
                    <span className={styles.specValue}>{design.primaryMaterial ? design.primaryMaterial.name : "Makrana White Marble"}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Stone Origin</span>
                    <span className={styles.specValue}>{design.primaryMaterial ? design.primaryMaterial.origin : "Rajasthan, India"}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Environment</span>
                    <span className={styles.specValue}>{design.attributes ? design.attributes.environment : "Indoor Sanctuary"}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Customization</span>
                    <span className={styles.specValue}>Available (Scale & Finish)</span>
                  </div>
                </div>

                <div className={styles.ctaGroup}>
                  <PrimaryButton href={`/contact?type=quote&design=${design.slug}`}>
                    Request a Quote for this Piece
                  </PrimaryButton>
                  <SecondaryButton href={`/contact?type=custom&design=${design.slug}`}>
                    Commission Custom Size
                  </SecondaryButton>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. KNOWLEDGE LAYER & DETAILED MASONIC STORY */}
      <Section background="dark" spacing="standard">
        <Container>
          <div style={{ maxWidth: "840px", margin: "0 auto" }}>
            <ScrollReveal animation="fade-up">
              <SectionHeading
                eyebrow="Craftsmanship & Specifications"
                heading="Masonic Artisanship & Material Details"
                description={design.detailedDescription}
                align="center"
              />
            </ScrollReveal>

            {knowledgeSections.length > 0 && (
              <div style={{ marginTop: "var(--spacing-xl)", display: "grid", gap: "var(--spacing-lg)" }}>
                {knowledgeSections.map((sec, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "4px" }}>
                    <h3 style={{ color: "var(--color-bronze)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{sec.title}</h3>
                    <p style={{ color: "var(--color-cream)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* DYNAMIC PRODUCT FAQS & Q&A */}
            {productFaqs.length > 0 && (
              <div style={{ marginTop: "3rem", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 style={{ color: "var(--color-bronze)", fontFamily: "var(--font-cormorant), serif", fontSize: "1.5rem", marginBottom: "1.25rem", textAlign: "center" }}>
                  Frequently Asked Questions
                </h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {productFaqs.map((faq, idx) => (
                    <div key={idx} style={{ background: "rgba(255,255,255,0.04)", padding: "1.25rem 1.5rem", borderRadius: "4px", borderLeft: "3px solid var(--color-bronze)" }}>
                      <h4 style={{ color: "var(--color-cream)", fontSize: "1.05rem", fontWeight: "600", marginBottom: "0.4rem" }}>
                        Q: {faq.question}
                      </h4>
                      <p style={{ color: "rgba(244, 240, 234, 0.85)", fontSize: "0.92rem", lineHeight: "1.6" }}>
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Knowledge & Craftsmanship Guides */}
            {getKnowledgeArticlesForProduct(design).length > 0 && (
              <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 style={{ color: "var(--color-cream)", fontFamily: "var(--font-cormorant), serif", fontSize: "1.4rem", marginBottom: "1rem" }}>
                  Craftsmanship & Material Guides for this Piece
                </h3>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {getKnowledgeArticlesForProduct(design).map((art) => (
                    <Link
                      key={art.slug}
                      href={`/knowledge/${art.slug}`}
                      style={{
                        padding: "0.6rem 1rem",
                        background: "rgba(158, 123, 79, 0.15)",
                        border: "1px solid var(--color-bronze)",
                        color: "var(--color-cream)",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        borderRadius: "2px"
                      }}
                    >
                      📖 Read: {art.title} &rarr;
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 3. GALLERY SECTION */}
      {design.imageGallery && design.imageGallery.length > 0 && (
        <Section background="light" spacing="standard">
          <Container>
            <ScrollReveal animation="fade-up">
              <SectionHeading
                eyebrow="Visual Details"
                heading="Artwork Perspective Views"
                description={`View angles and masonic chiseling details for ${design.name}.`}
                align="center"
              />
            </ScrollReveal>
            <Gallery images={design.imageGallery} altPrefix={design.name} />
          </Container>
        </Section>
      )}

      {/* 4. RELATED PRODUCTS RECOMMENDATION ENGINE */}
      {relatedDesigns.length > 0 && (
        <Section background="light" spacing="standard">
          <Container>
            <ScrollReveal animation="fade-up">
              <SectionHeading
                eyebrow="Related Atelier Creations"
                heading="Similar Hand-Carved Artworks"
                description="Explore complementary stonecraft creations sharing iconographic subject, stone material, or masonic tradition."
                align="center"
              />
            </ScrollReveal>

            <div className={styles.relatedGrid}>
              {relatedDesigns.map((rel) => (
                <ProductCard
                  key={rel.slug}
                  title={rel.name}
                  category={category ? category.name : "Stonecraft"}
                  imageSrc={rel.imageSrc}
                  href={`/designs/${rel.parentCategory}/${rel.slug}`}
                  shortDescription={rel.shortDescription}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 5. INQUIRY CTA SECTION */}
      <CTASection
        eyebrow="Commission This Piece"
        heading={`Acquire ${design.name}`}
        description="Connect with our Jaipur stone studio to request custom dimensions, discuss shipping arrangements, or receive a formal quote."
        primaryCtaText="Request a Quote"
        primaryCtaLink={`/contact?type=quote&design=${design.slug}`}
        secondaryCtaText="Contact via WhatsApp"
        secondaryCtaLink={`https://wa.me/${siteConfig.contact.whatsapp}?text=Inquiry%20regarding%20${encodeURIComponent(design.name)}`}
      />
    </>
  );
}
