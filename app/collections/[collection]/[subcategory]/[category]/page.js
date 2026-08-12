import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CategoryCatalogue from "@/components/CategoryCatalogue/CategoryCatalogue";
import CTASection from "@/components/CTASection/CTASection";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { collectionsData, getCollection, getSubcategory } from "@/content/collections";
import { categoriesData, getCategory, getCategoriesBySubcategory } from "@/content/categories";
import { getDesignsByCategory } from "@/content/designs";
import { siteConfig } from "@/content/site";
import { marbleHubData } from "@/content/marble";

export async function generateStaticParams() {
  const params = [];
  Object.values(categoriesData).forEach((cat) => {
    params.push({
      collection: cat.parentCollection,
      subcategory: cat.parentSubcategory,
      category: cat.slug,
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { collection, subcategory, category: categorySlug } = resolvedParams;
  const category = getCategory(collection, subcategory, categorySlug);

  if (!category) return {};

  return {
    title: `${category.name} Marble Statues & Sculptures — Jaipur Stonecraft`,
    description: `Bespoke hand-carved ${category.name} statues, temple sculptures, and custom masonic artwork created by master artisans in Jaipur.`,
    alternates: {
      canonical: `https://jaipurstonecraft.com/collections/${collection}/${subcategory}/${categorySlug}`,
    },
    openGraph: {
      title: `${category.name} Marble Statues & Sculptures — Jaipur Stonecraft`,
      description: `Bespoke hand-carved ${category.name} statues, temple sculptures, and custom masonic artwork created by master artisans in Jaipur.`,
      url: `https://jaipurstonecraft.com/collections/${collection}/${subcategory}/${categorySlug}`,
      siteName: "Jaipur Stonecraft",
      type: "website",
      images: [
        {
          url: category.imageSrc,
          width: 800,
          height: 600,
          alt: category.name,
        },
      ],
    },
  };
}

export default async function CategoryLandingPage({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug, subcategory: subcategorySlug, category: categorySlug } = resolvedParams;

  const collection = getCollection(collectionSlug);
  const subcategory = getSubcategory(collectionSlug, subcategorySlug);
  const category = getCategory(collectionSlug, subcategorySlug, categorySlug);

  if (!collection || !subcategory || !category) {
    notFound();
  }

  const designs = getDesignsByCategory(categorySlug);
  const relatedCategories = getCategoriesBySubcategory(collectionSlug, subcategorySlug)
    .filter((cat) => cat.slug !== categorySlug)
    .slice(0, 4);

  const faqs = [
    {
      q: `What stone block options are available for ${category.name} sculptures?`,
      a: "We primary sculpt from white Makrana marble, pink Bansi Paharpur sandstone, beige limestone, and black Rajasthan marble, selected specifically for high grain density and longevity."
    },
    {
      q: "Can statues be customized to specific heights or architectural CAD files?",
      a: "Yes. Our masonic team scales any blueprint, sketch, or photo reference to exact dimensional tolerances for home mandirs, temple niches, or public installations."
    },
    {
      q: "How are large sculptures packaged for international export shipping?",
      a: "Every sculpture is encased in high-density shock wrapping and crated inside fumigated, heat-treated wooden crates conforming to international ISPM-15 freight standards."
    }
  ];

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
          { "@type": "ListItem", "position": 5, "name": category.name, "item": `https://jaipurstonecraft.com/collections/${collection.slug}/${subcategory.slug}/${category.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. BREADCRUMBS & HERO INTRO */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Collections", href: "/collections" },
              { label: collection.name, href: `/collections/${collection.slug}` },
              { label: subcategory.name, href: `/collections/${collection.slug}/${subcategory.slug}` },
              { label: category.name },
            ]}
          />

          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow={`${collection.name} — ${subcategory.name}`}
              heading={`${category.name} Statues & Sculptures`}
              description={category.description}
              align="center"
              headingLevel="h1"
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div style={{ maxWidth: "800px", margin: "var(--spacing-md) auto 0", textAlign: "center" }}>
              <p style={{ lineHeight: 1.7, fontSize: "1.05rem", color: "rgba(26, 25, 24, 0.85)" }}>
                Our Jaipur workshop specializes in hand-carved {category.name} sculptures, bringing generational masonic techniques to sacred and residential spaces worldwide. Sculpted from premium Makrana white marble and regional sandstones, each design adheres to authentic iconographic proportions and artistic refinement.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 2. DESIGN CATALOGUE & FILTERS */}
      <Section background="grey" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Catalogue"
              heading={`Explore ${category.name} Designs`}
              description="Filter our curated masonic designs by material, size, or finish, and select a design to view available configurations."
            />
          </ScrollReveal>

          <div style={{ marginTop: "var(--spacing-xl)" }}>
            <CategoryCatalogue designs={designs} categoryName={category.name} />
          </div>
        </Container>
      </Section>

      {/* 3. MATERIAL INFORMATION SECTION */}
      <Section background="light" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Material Options"
              heading="Select Natural Stones"
              description="Learn about the primary stone blocks selected for our hand-carved sculptures."
            />
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--spacing-lg)",
              marginTop: "var(--spacing-xl)"
            }}
          >
            <div style={{ padding: "var(--spacing-md)", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-stone-grey)", borderRadius: "4px" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--spacing-xxs)", color: "var(--color-bronze)" }}>Makrana White Marble</h4>
              <p className="small">Renowned for its fine crystalline structure, purity, and low water absorption, ideal for sacred deity idols.</p>
            </div>
            <div style={{ padding: "var(--spacing-md)", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-stone-grey)", borderRadius: "4px" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--spacing-xxs)", color: "var(--color-bronze)" }}>Bansi Paharpur Sandstone</h4>
              <p className="small">Distinctive warm pink hue used traditionally in iconic Indian temple architecture and outdoor relief walls.</p>
            </div>
            <div style={{ padding: "var(--spacing-md)", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-stone-grey)", borderRadius: "4px" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--spacing-xxs)", color: "var(--color-bronze)" }}>Black Rajasthan Marble</h4>
              <p className="small">Deep dark marble providing high visual contrast for modern statues and dramatic architectural accents.</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. CRAFTSMANSHIP & CONFIGURATION */}
      <Section background="grey" spacing="standard">
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--spacing-xl)" }}>
            <ScrollReveal animation="fade-up">
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--spacing-sm)" }}>Generational Craftsmanship</h3>
              <p style={{ lineHeight: 1.6, marginBottom: "var(--spacing-sm)" }}>
                Every {category.name} sculpture is hand-chiseled using traditional tools passed down through artisan families in Rajasthan. From rough block extraction to fine facial detail carving and hand polishing, every step is strictly monitored for masonic grace.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--spacing-sm)" }}>Configuration & Customization</h3>
              <p style={{ lineHeight: 1.6, marginBottom: "var(--spacing-sm)" }}>
                Designs can be scaled from compact 1.5ft tabletop idols to 8ft+ temple statuary. Clients can specify custom postures, pedestal designs, or ornament carving details.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <Section background="light" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Information"
              heading="Frequently Asked Questions"
              description={`Common questions regarding ordering and customizing ${category.name} stone sculptures.`}
            />
          </ScrollReveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", marginTop: "var(--spacing-xl)", maxWidth: "800px", margin: "var(--spacing-xl) auto 0" }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ padding: "var(--spacing-md)", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-stone-grey)", borderRadius: "4px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--spacing-xs)" }}>{faq.q}</h4>
                <p className="small" style={{ opacity: 0.85, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. RELATED CATEGORIES & MATERIAL HUB LINK */}
      {relatedCategories.length > 0 && (
        <Section background="grey" spacing="standard">
          <Container>
            <ScrollReveal animation="fade-up">
              <SectionHeading
                eyebrow="Explore Further"
                heading="Related Categories"
                description={`Browse other categories within ${subcategory.name}.`}
              />
            </ScrollReveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--spacing-lg)", marginTop: "var(--spacing-lg)" }}>
              {relatedCategories.map((relCat) => (
                <Link
                  key={relCat.slug}
                  href={`/collections/${collection.slug}/${subcategory.slug}/${relCat.slug}`}
                  style={{ padding: "var(--spacing-md)", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-stone-grey)", borderRadius: "4px", textDecoration: "none", color: "inherit" }}
                >
                  <h4 style={{ fontSize: "1.05rem", marginBottom: "var(--spacing-xxs)" }}>{relCat.name}</h4>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-bronze)" }}>Explore Category &rarr;</span>
                </Link>
              ))}
            </div>

            {/* Link to Marble Material Hub */}
            <div style={{ marginTop: "var(--spacing-xl)", textAlign: "center" }}>
              <Link
                href={marbleHubData[category.slug] ? `/marble/${category.slug}` : "/marble"}
                style={{ fontSize: "0.95rem", color: "var(--color-bronze)", textDecoration: "underline", fontWeight: 500 }}
              >
                Learn more about white marble properties & carving in our Marble Crafts Hub &rarr;
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* 7. REQUEST A QUOTE CTA */}
      <CTASection
        heading={`Commission a Custom ${category.name} Sculpture`}
        description="Discuss stone block selection, custom posture preferences, or request scaled CAD layout drawings with our masonic team."
        primaryCtaText="Request a Quote"
        primaryCtaHref={`/contact?type=quote&category=${category.slug}`}
        secondaryCtaText="WhatsApp Designer"
        secondaryCtaHref={siteConfig.contact.whatsappLink}
        background="dark"
      />
    </>
  );
}
