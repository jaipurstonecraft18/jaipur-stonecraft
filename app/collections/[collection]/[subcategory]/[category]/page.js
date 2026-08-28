import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CategoryCatalogue from "@/components/CategoryCatalogue/CategoryCatalogue";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import MaterialCard from "@/components/MaterialCard/MaterialCard";
import CTASection from "@/components/CTASection/CTASection";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getCollection, getSubcategory } from "@/content/collections";
import { categoriesData, getCategory, getCategoriesBySubcategory } from "@/content/categories";
import { getDesignsByCategory } from "@/content/designs";
import { siteConfig } from "@/content/site";
import { marbleHubData } from "@/content/marble";

const FINAL_CUSTOMER_NAMES = {
  "ganesh-ji": "Ganesh Statues & Murtis",
  "shiva-ji": "Shiva Statues & Idols",
  "krishna-ji": "Krishna Statues & Murtis",
  "ram-darbar": "Ram Darbar Statues",
  "hanuman-ji": "Hanuman Statues & Murtis",
  "durga-maa": "Durga Maa Statues",
  "lakshmi-ji": "Lakshmi Statues & Idols",
  "saraswati-ji": "Saraswati Statues",
  "vishnu-ji": "Vishnu Statues",
  "buddha-statues": "Buddha Statues",
  "mahavira-statues": "Lord Mahavira Statues",
  "tirthankara-murtis": "Jain Tirthankara Murtis",
  "dhyan-buddha-sculptures": "Dhyan Buddha Sculptures",
  "cultural-tribal-figures": "Cultural & Tribal Sculptures",
  "bespoke-portrait-busts": "Portrait Busts",
  "full-body-figures": "Full Body Human Statues",
  "artisan-figures": "Artisan Sculptures",
  "abstract-form-sculptures": "Abstract Stone Sculptures",
  "classical-figure-carvings": "Classical Figure Carvings",
  "modernist-stone-sculptures": "Modernist Stone Art",
  "mythological-figures": "Mythological Sculptures",
  "stone-elephants": "Carved Stone Elephants",
  "masonic-lions": "Guardian Lion Statues",
  "sacred-nandi-statues": "Sacred Nandi Statues",
  "peacock-sculptures": "Carved Peacock Sculptures",
  "horse-sculptures": "Stone Horse Sculptures",
  "devotional-relief-panels": "Devotional Relief Panels",
  "mandala-wall-art": "Stone Mandala Wall Art",
  "temple-wall-murals": "Temple Wall Murals",
  "tree-of-life-relief": "Tree of Life Wall Reliefs",
  "rajasthani-heritage-scenes": "Rajasthani Heritage Reliefs",
  "royal-court-panels": "Royal Court Carved Panels",
  "traditional-procession-murals": "Procession Stone Murals",
  "jharokha-relief-panels": "Jharokha Relief Panels",
  "botanical-reliefs": "Botanical Stone Reliefs",
  "floral-pattern-panels": "Floral Carved Panels",
  "geometric-carved-walls": "Geometric Stone Wall Panels",
  "modern-textured-stone-walls": "Textured Stone Wall Murals",
  "architectural-accent-murals": "Architectural Accent Murals",
  "bespoke-feature-walls": "Bespoke Feature Wall Panels",
  "custom-crests-logos": "Custom Stone Crests & Logos",
  "compact-wall-mandirs": "Compact Wall-Mounted Mandirs",
  "pooja-room-panels": "Pooja Room Stone Panels",
  "marble-home-temples": "Marble Home Mandirs & Temples",
  "carved-mandir-arches": "Carved Mandir Arches",
  "garbhagriha-architecture": "Garbhagriha Temple Architecture",
  "intricate-torans": "Carved Stone Torans",
  "pillared-mandapas": "Pillared Mandapas & Pavilions",
  "shikhara-domes": "Temple Shikhara & Domes",
  "jali-screens": "Stone Jali & Architectural Screens",
  "jharokhas-windows": "Stone Jharokhas & Heritage Windows",
  "carved-pillars-columns": "Carved Stone Pillars & Columns",
  "stone-balustrades": "Carved Stone Balustrades",
  "stone-door-frames": "Carved Stone Door Frames",
  "portico-carvings": "Carved Stone Porticos",
  "bespoke-facade-elements": "Architectural Facade Elements",
  "custom-heritage-columns": "Custom Heritage Columns",
  "tiered-marble-fountains": "Tiered Marble Fountains",
  "lotus-basin-fountains": "Lotus Basin Fountains",
  "central-courtyard-fountains": "Central Courtyard Fountains",
  "figurative-water-sculptures": "Figurative Water Sculptures",
  "cascading-water-walls": "Cascading Water Walls",
  "abstract-water-sculptures": "Abstract Water Features",
  "poolside-waterfalls": "Poolside Stone Waterfalls",
  "heritage-palace-spouts": "Heritage Palace Water Spouts",
  "large-scale-features": "Large-Scale Water Features",
  "carved-stone-vases": "Carved Stone Vases",
  "pedestals-plinths": "Pedestals & Statue Plinths",
  "decorative-bowls-urns": "Decorative Stone Bowls & Urli",
  "luxury-marble-objects": "Luxury Marble Accessories",
  "tabletop-statuettes": "Tabletop Stone Statuettes",
  "miniature-reliefs": "Miniature Carved Reliefs",
  "artisan-accessories": "Handcrafted Stone Accessories",
  "stone-planters": "Carved Stone Planters",
  "garden-lanterns": "Stone Garden Lanterns",
  "benches-seating": "Carved Stone Benches",
  "bespoke-deity-statues": "Custom Deity Statue Commissions",
  "monumental-stone-art": "Monumental Stone Sculptures",
  "commissioned-artwork": "Commissioned Stone Artwork",
  "lifesize-memorial-busts": "Memorial Busts & Sculptures",
  "ancestral-portrait-carvings": "Ancestral Portrait Sculptures",
  "full-temple-carving-projects": "Full Temple Construction Projects",
  "luxury-estate-stonework": "Luxury Estate Stonework",
  "bespoke-heritage-restoration": "Heritage Stone Restoration"
};

const PRODUCT_FAMILY_TAGS = {
  "krishna-ji": ["Radha Krishna", "Laddu Gopal", "Bal Gopal", "Jugal Jodi"],
  "shiva-ji": ["Shiv Parivar", "Shivlinga", "Mahadev", "Sacred Nandi"],
  "ganesh-ji": ["Seated Ganesh", "Riddhi Siddhi", "Dancing Ganesha", "Mandir Idol"],
  "ram-darbar": ["Ram Sita Laxman", "Hanuman Sewa", "Ram Lalla"],
  "buddha-statues": ["Dhyan Mudra", "Abhaya Mudra", "Sleeping Buddha"],
  "home-mandirs": ["Marble Mandir", "Pooja Room Panel", "Compact Wall Temple"],
  "jali-screens": ["Geometric Jali", "Floral Lattice", "Bansi Pink Jali", "Marble Screen"],
  "tiered-marble-fountains": ["3-Tier Fountain", "Lotus Basin", "Courtyard Waterfall"]
};

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
  const category = await getCategory(collection, subcategory, categorySlug);

  if (!category) return {};

  const customerName = FINAL_CUSTOMER_NAMES[categorySlug] || category.name;
  const designs = await getDesignsByCategory(categorySlug);
  const isIndexable = designs.length > 0 || ["marble-home-temples", "carved-pillars-columns", "bespoke-portrait-busts"].includes(categorySlug);

  return {
    title: `${customerName} — Handcrafted in Jaipur | Jaipur Stonecraft`,
    description: `Bespoke hand-carved ${customerName}, temple sculptures, and custom architectural stone artwork sculpted by master artisans in Jaipur.`,
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: `https://jaipurstonecraft.com/collections/${collection}/${subcategory}/${categorySlug}`,
    },
    openGraph: {
      title: `${customerName} — Handcrafted in Jaipur | Jaipur Stonecraft`,
      description: `Bespoke hand-carved ${customerName}, temple sculptures, and custom architectural stone artwork sculpted by master artisans in Jaipur.`,
      url: `https://jaipurstonecraft.com/collections/${collection}/${subcategory}/${categorySlug}`,
      siteName: "Jaipur Stonecraft",
      type: "website",
      images: [
        {
          url: category.imageSrc,
          width: 800,
          height: 600,
          alt: customerName,
        },
      ],
    },
  };
}

export default async function CategoryLandingPage({ params }) {
  const resolvedParams = await params;
  const { collection: collectionSlug, subcategory: subcategorySlug, category: categorySlug } = resolvedParams;

  const collection = await getCollection(collectionSlug);
  const subcategory = await getSubcategory(collectionSlug, subcategorySlug);
  const category = await getCategory(collectionSlug, subcategorySlug, categorySlug);

  if (!collection || !subcategory || !category) {
    notFound();
  }

  const customerName = FINAL_CUSTOMER_NAMES[categorySlug] || category.name;
  const designs = await getDesignsByCategory(categorySlug);
  const productFamilyList = PRODUCT_FAMILY_TAGS[categorySlug] || [];
  const rawRelated = await getCategoriesBySubcategory(collectionSlug, subcategorySlug);
  const relatedCategories = rawRelated
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
            src={category.imageSrc || category.image_src || subcategory.imageSrc || collection.imageSrc || "/images/collections/hero-sculptures-group.webp"}
            alt={`${category.name} background`}
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
                { label: subcategory.name, href: `/collections/${collection.slug}/${subcategory.slug}` },
                { label: category.name },
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
                {collection.name} — {subcategory.name}
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
                {customerName}
              </h1>
              <p style={{
                fontSize: "clamp(1rem, 1.4vw, 1.12rem)",
                lineHeight: 1.7,
                color: "rgba(250, 248, 245, 0.9)",
                maxWidth: "760px",
                margin: "0 auto 1.25rem",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)"
              }}>
                {category.description || `Our Jaipur atelier hand-chisels bespoke ${customerName} from pure Makrana marble and regional Rajasthan sandstone, serving sacred temples and luxury residences worldwide.`}
              </p>

              {/* Product Family Discovery Pills */}
              {productFamilyList.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(250, 248, 245, 0.7)", alignSelf: "center", marginRight: "0.25rem" }}>Popular Forms:</span>
                  {productFamilyList.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: "500",
                        color: "#FAF8F5",
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(230, 200, 148, 0.3)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        backdropFilter: "blur(4px)"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </ScrollReveal>
          </div>
        </Container>
      </div>

      {/* 2. DESIGN CATALOGUE & FILTERS */}
      <Section background="grey" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Catalogue"
              heading={`Explore ${customerName}`}
              description="Filter our curated designs by material, size, or finish, and select a design to view available configurations."
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
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--spacing-xl)",
              marginTop: "var(--spacing-xl)"
            }}
          >
            <MaterialCard
              name="Makrana White Marble"
              origin="Nagaur, Rajasthan"
              description="Renowned for its fine calcitic crystalline structure, purity, and zero water absorption, ideal for sacred deity idols."
              imageSrc="https://placehold.co/800x500/FCFBF9/1A1918?text=Makrana+White+Marble"
              href="/marble"
              variant="standard"
            />
            <MaterialCard
              name="Bansi Paharpur Sandstone"
              origin="Bharatpur, Rajasthan"
              description="Distinctive warm blush pink hue used traditionally in iconic Indian temple architecture and outdoor relief walls."
              imageSrc="https://placehold.co/800x500/E8E4DF/9E7B4F?text=Bansi+Pink+Sandstone"
              href="/marble"
              variant="standard"
            />
            <MaterialCard
              name="Black Rajasthan Marble"
              origin="Bhainslana, Rajasthan"
              description="Deep dark obsidian marble providing high visual contrast for modern statues and dramatic architectural accents."
              imageSrc="https://placehold.co/800x500/1A1918/FCFBF9?text=Black+Rajasthan+Marble"
              href="/marble"
              variant="standard"
            />
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--spacing-xl)", marginTop: "var(--spacing-xl)" }}>
              {relatedCategories.map((relCat) => (
                <CategoryCard
                  key={relCat.slug}
                  name={relCat.name}
                  description={relCat.description}
                  imageSrc={relCat.imageSrc}
                  imageAlt={relCat.imageAlt}
                  href={`/collections/${collection.slug}/${subcategory.slug}/${relCat.slug}`}
                  variant="secondary"
                />
              ))}
            </div>

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
