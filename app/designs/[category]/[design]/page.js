import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import { designsData, getDesign, getDesignsByCategory } from "@/content/designs";
import { siteConfig } from "@/content/site";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const params = [];
  Object.values(designsData).forEach((design) => {
    params.push({
      category: design.parentCategory,
      design: design.slug,
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { category: categorySlug, design: designSlug } = resolvedParams;
  const design = getDesign(categorySlug, designSlug);

  if (!design) return {};

  const category = categoriesData[design.parentCategory];

  return {
    title: `${design.name} — ${category ? category.name : "Stonecraft"} Design`,
    description: design.shortDescription,
    alternates: {
      canonical: `https://jaipurstonecraft.com/designs/${categorySlug}/${designSlug}`,
    },
    openGraph: {
      title: `${design.name} — ${category ? category.name : "Stonecraft"} Design`,
      description: design.shortDescription,
      url: `https://jaipurstonecraft.com/designs/${categorySlug}/${designSlug}`,
      siteName: "Jaipur Stonecraft",
      type: "website",
      images: [
        {
          url: design.imageSrc,
          width: 800,
          height: 600,
          alt: design.name,
        },
      ],
    },
  };
}

export default async function DesignDetailPage({ params }) {
  const resolvedParams = await params;
  const { category: categorySlug, design: designSlug } = resolvedParams;

  const design = getDesign(categorySlug, designSlug);
  if (!design) {
    notFound();
  }

  const category = categoriesData[design.parentCategory];
  const collection = category ? getCollection(category.parentCollection) : null;
  const subcategory = category ? getSubcategory(category.parentCollection, category.parentSubcategory) : null;

  const relatedDesigns = getDesignsByCategory(categorySlug)
    .filter((d) => d.slug !== designSlug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
        "description": design.shortDescription,
        "image": design.imageSrc,
        "brand": {
          "@type": "Brand",
          "name": "Jaipur Stonecraft",
        },
        "material": design.variants?.materials?.join(", "),
      },
    ],
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={design.imageSrc}
                    alt={design.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Title, Descriptions, Variants */}
            <div className={styles.infoCol}>
              <ScrollReveal animation="fade-up" className={styles.infoContent}>
                <span className="eyebrow">{category ? category.name : "Stonecraft"} — Design Detail</span>
                <h1 className={styles.title}>{design.name}</h1>
                <p className="large" style={{ color: "rgba(26, 25, 24, 0.85)" }}>
                  {design.shortDescription}
                </p>

                {/* Variants & Configurations Box */}
                <div className={styles.variantBox}>
                  <h4 className={styles.boxTitle}>Available Variant Configurations</h4>

                  {/* Materials */}
                  <div className={styles.variantGroup}>
                    <div className={styles.variantGroupLabel}>Material Block Options:</div>
                    <div className={styles.pillContainer}>
                      {design.variants.materials.map((mat) => (
                        <span key={mat} className={styles.optionPill}>{mat}</span>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className={styles.variantGroup}>
                    <div className={styles.variantGroupLabel}>Available Size Configurations:</div>
                    <div className={styles.pillContainer}>
                      {design.variants.sizes.map((sz) => (
                        <span key={sz} className={styles.optionPill}>{sz}</span>
                      ))}
                    </div>
                  </div>

                  {/* Finishes */}
                  <div className={styles.variantGroup}>
                    <div className={styles.variantGroupLabel}>Surface Finishes:</div>
                    <div className={styles.pillContainer}>
                      {design.variants.finishes.map((fn) => (
                        <span key={fn} className={styles.optionPill}>{fn}</span>
                      ))}
                    </div>
                  </div>

                  {/* Colours */}
                  <div className={styles.variantGroup}>
                    <div className={styles.variantGroupLabel}>Stone Shades:</div>
                    <div className={styles.pillContainer}>
                      {design.variants.colours.map((clr) => (
                        <span key={clr} className={styles.optionPill}>{clr}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specifications & Customization */}
                <div className={styles.specBox}>
                  <h4 className={styles.boxTitle}>Masonic Specifications</h4>
                  <ul className={styles.specList}>
                    <li>
                      <span className={styles.specLabel}>Category:</span>{" "}
                      <span>{category ? category.name : design.parentCategory}</span>
                    </li>
                    <li>
                      <span className={styles.specLabel}>Iconography:</span>{" "}
                      <span>Traditional Hand Chiseling</span>
                    </li>
                    <li>
                      <span className={styles.specLabel}>Customization:</span>{" "}
                      <span>CAD blueprint scaling & custom stone block sourcing available</span>
                    </li>
                  </ul>
                </div>

                {/* Call to Actions */}
                <div className={styles.actions}>
                  <PrimaryButton href={`/contact?type=quote&design=${design.slug}`} variant="charcoal">
                    Request a Quote
                  </PrimaryButton>
                  <SecondaryButton href={siteConfig.contact.whatsappLink} variant="bronze">
                    WhatsApp Inquiry
                  </SecondaryButton>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. IMAGE GALLERY SECTION */}
      <Section background="grey" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Visual Study"
              heading="Chisel & Detail Views"
              description="A visual study of physical carvings, surface finishes, and close-up stone textures."
            />
          </ScrollReveal>

          <div style={{ marginTop: "var(--spacing-lg)" }}>
            <Gallery
              images={design.imageGallery}
              aspect="aspect45"
              columns={3}
              altPrefix={`${design.name} detail view`}
            />
          </div>
        </Container>
      </Section>

      {/* 3. CRAFTSMANSHIP & TECHNICAL SPECS */}
      <Section background="light" spacing="standard">
        <Container>
          <div className={styles.processGrid}>
            <ScrollReveal animation="fade-up">
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--spacing-sm)" }}>Atelier Manufacturing Process</h3>
              <p style={{ lineHeight: 1.6, marginBottom: "var(--spacing-sm)" }}>
                Each {design.name} sculpture is hand-carved in our Jaipur workshop from a solid raw stone block. Master artisans map proportional grids onto the stone surface before extracting bulk volume using heavy spikes, followed by weeks of fine flat-chisel relief detailing.
              </p>
              <p style={{ lineHeight: 1.6 }}>
                {design.detailedDescription}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <div className={styles.detailCard} style={{ marginBottom: "var(--spacing-md)" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--spacing-xxs)" }}>Export Packaging & Freight</h4>
                <p className="small">
                  Enclosed in heat-treated wood frames with high-density shock wrap for safe air or ocean transport to international project destinations.
                </p>
              </div>
              <div className={styles.detailCard}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--spacing-xxs)" }}>Architectural Adaptation</h4>
                <p className="small">
                  We adapt pedestal heights, backplates, and mounting anchors to fit exact site architectural blueprints.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 4. RELATED DESIGNS */}
      {relatedDesigns.length > 0 && (
        <Section background="grey" spacing="standard">
          <Container>
            <ScrollReveal animation="fade-up">
              <SectionHeading
                eyebrow="Recommendations"
                heading={`More ${category ? category.name : "Category"} Designs`}
                description="Explore other handcrafted masonic designs in this category."
              />
            </ScrollReveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "var(--spacing-xl)",
                marginTop: "var(--spacing-lg)",
              }}
            >
              {relatedDesigns.map((rel, idx) => (
                <ScrollReveal key={rel.slug} animation="fade-up" delay={idx * 100}>
                  <ProductCard
                    name={rel.name}
                    category={category ? category.name : rel.parentCategory}
                    material={rel.variants?.materials?.[0] || "Marble"}
                    imageSrc={rel.imageSrc}
                    href={`/designs/${rel.parentCategory}/${rel.slug}`}
                  />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 5. FINAL CTA SECTION */}
      <CTASection
        heading={`Inquire About ${design.name}`}
        description="Receive detailed drawing layouts, discuss custom sizing parameters, or coordinate marble slab sample shipments."
        primaryCtaText="Request a Quote"
        primaryCtaHref={`/contact?type=quote&design=${design.slug}`}
        secondaryCtaText="WhatsApp Designer"
        secondaryCtaHref={siteConfig.contact.whatsappLink}
        background="dark"
      />
    </>
  );
}
