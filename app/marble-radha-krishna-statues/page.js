import { getMarbleRadhaKrishnaProducts } from "@/lib/db/seo-landings.js";
import { generatePageMetadata } from "@/lib/seo/metadata.js";
import { generateLandingPageSchema } from "@/lib/seo/schemas.js";
import LandingHero from "@/components/SeoLanding/LandingHero";
import LandingShowcaseGrid from "@/components/SeoLanding/LandingShowcaseGrid";
import LandingCraftGuide from "@/components/SeoLanding/LandingCraftGuide";
import LandingSizingGuide from "@/components/SeoLanding/LandingSizingGuide";
import LandingFaq from "@/components/SeoLanding/LandingFaq";
import LandingInquiry from "@/components/SeoLanding/LandingInquiry";
import LandingInternalLinks from "@/components/SeoLanding/LandingInternalLinks";

export const revalidate = 600;

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Marble Radha Krishna Statues in Jaipur | Jaipur Stonecraft",
    description: "Hand-carved marble Radha Krishna statues & Jugal Jodi murtis sculpted from pure white marble in Jaipur. Custom mandir sizing and secure worldwide delivery.",
    path: "/marble-radha-krishna-statues",
    ogImage: "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp"
  });
}

export default async function MarbleRadhaKrishnaStatuesPage() {
  const products = await getMarbleRadhaKrishnaProducts(12);

  const breadcrumbs = [
    { label: "Marble Statues", href: "/marble-statues" },
    { label: "Marble Radha Krishna Statues", href: "/marble-radha-krishna-statues" }
  ];

  const schemaBreadcrumbs = [
    { name: "Home", url: "https://jaipurstonecraft.com" },
    { name: "Marble Statues", url: "https://jaipurstonecraft.com/marble-statues" },
    { name: "Marble Radha Krishna Statues", url: "https://jaipurstonecraft.com/marble-radha-krishna-statues" }
  ];

  const faqs = [
    {
      question: "What is the spiritual significance of the Tribhanga posture in Radha Krishna statues?",
      answer: "The Tribhanga (three-bend) stance is the classical aesthetic posture of Lord Krishna where the neck, waist, and knees gently bend in opposing directions. This posture embodies divine rhythm, grace, and eternal charm (Madana Mohana). Our sculptors painstakingly carve this dynamic equilibrium from a solid marble block while preserving perfect anatomical stability."
    },
    {
      question: "Are Radha Krishna statues carved from a single block or as a pair?",
      answer: "We offer both monolithic Jugal Jodi sculptures (where Radha and Krishna are sculpted together from a single solid block of premium natural marble with an integrated pedestal and cow) and paired individual sculptures (where Radharani and Shri Krishna are carved as complementary matching statues for wider altar layouts)."
    },
    {
      question: "Can we request decorative gold-finish detailing on the marble?",
      answer: "Yes. In addition to natural honed or polished white marble, we offer traditional Jaipur shringar work featuring decorative gold-finish detailing or gold-effect finishing on Krishna's pitambari, crown (mukut), flute, and delicate facial adornments upon request."
    },
    {
      question: "What are recommended sizes for residential Radha Krishna shrines?",
      answer: "Standard residential heights range from 12 inches to 24 inches for compact to medium mandirs, and 30 inches to 48 inches for dedicated prayer rooms or luxury architectural spaces. Temple trust commissions typically range from 4 feet to 6 feet in height."
    },
    {
      question: "Is international packaging available for slender elements like Krishna's flute and Radharani's hands?",
      answer: "International packaging is available. Care is taken to protect delicate features such as the flute (bansuri) and mudras during transportation. Contact us to discuss packaging and shipping arrangements for your statue."
    }
  ];

  const craftPillars = [
    {
      title: "Divine Tribhanga & Jugal Harmony",
      text: "Lord Krishna's three-fold graceful bend is counterbalanced by Radharani's gentle poise. Master artisans ensure seamless visual interaction, loving glances, and rhythmic garment folds.",
      highlights: ["Balanced three-bend Tribhanga posture", "Synchronized facial expressions (Premanubhuti)", "Single-block or complementary twin carving"]
    },
    {
      title: "Intricate Shringar & Flute Detailing",
      text: "From the delicate contours of the bansuri across Krishna's lips to the intricate waistband (kamarbandh), necklaces, and ankle bells, every ornament is deeply undercut by hand chisels.",
      highlights: ["Micro-chiseled pearls and jewelry", "Peacock feather (Mor Pankh) crown carving", "Kamadhenu cow with calf at the pedestal"]
    },
    {
      title: "Quality White Marble Selection & Longevity",
      text: "High-grade natural white marble offers enduring density and fine texture for ritual worship and ceremonial occasions, retaining its dignified presence across generations.",
      highlights: ["Carefully selected natural white marble", "Silky hand-honed tactile finish", "Enduring devotional craftsmanship"]
    }
  ];

  const internalLinks = [
    {
      title: "Related Sacred Statues",
      links: [
        { label: "Marble Statues Hub", href: "/marble-statues" },
        { label: "Marble Ganesh Statues", href: "/marble-ganesh-statues" },
        { label: "Marble Shiva Statues", href: "/marble-shiva-statues" },
        { label: "Marble Hanuman Statues", href: "/marble-hanuman-statues" }
      ]
    },
    {
      title: "Catalog Categories",
      links: [
        { label: "Radha Krishna Category", href: "/collections/sculptures-statues/hindu-sculptures/radha-krishna" },
        { label: "Krishna Ji Category", href: "/collections/sculptures-statues/hindu-sculptures/krishna-ji" },
        { label: "Hindu Deity Sculptures", href: "/collections/sculptures-statues/hindu-sculptures" },
        { label: "Radha Krishna Jugal Jodi Sculpture", href: "/designs/krishna-ji/flute-playing-krishna" }
      ]
    },
    {
      title: "Sanctuary Environments",
      links: [
        { label: "Handcrafted Home Mandirs", href: "/collections/temples-architectural-stonework/mandirs-temples" },
        { label: "Temple Carved Jalis", href: "/collections/temples-architectural-stonework/jali-designs" },
        { label: "Carved Architectural Pillars", href: "/collections/temples-architectural-stonework/pillars-columns" },
        { label: "Custom Temple Projects", href: "/custom-projects" }
      ]
    },
    {
      title: "Atelier Lineage",
      links: [
        { label: "About Jaipur Stonecraft", href: "/our-story" },
        { label: "Master Stone Sculpting Art", href: "/craftsmanship" },
        { label: "Export Packaging & Shipping", href: "/export" },
        { label: "Contact Atelier Studio", href: "/contact" }
      ]
    }
  ];

  const jsonLd = generateLandingPageSchema({
    title: "Marble Radha Krishna Statue Manufacturer in Jaipur | Jaipur Stonecraft",
    description: "Exquisite hand-carved marble Radha Krishna statues in pure Makrana white marble. Mastercrafted Jugal Jodi murtis with delicate shringar, flute, and cow detailing from Jaipur.",
    url: "https://jaipurstonecraft.com/marble-radha-krishna-statues",
    breadcrumbs: schemaBreadcrumbs,
    faqs,
    products
  });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingHero
        eyebrow="Jaipur Moorti Atelier • Master Craftsmen"
        title="Handcrafted Marble Radha Krishna Statues & Jugal Jodi Murtis"
        lead="Capture divine eternal love and devotion with our hand-carved marble Radha Krishna statues. Sculpted by experienced Jaipur artisans from quality natural white marble, featuring graceful Tribhanga postures, detailed bansuri, and sacred cow carvings."
        breadcrumbs={breadcrumbs}
        highlights={[
          { label: "Artistic Posture", value: "Canonical Tribhanga Mudra" },
          { label: "Marble Quality", value: "Premium White Natural Marble" },
          { label: "Jugal Jodi Options", value: "Monolithic or Twin Statue Pair" },
          { label: "Finishing Art", value: "Natural Honed or Premium Gold Finish" }
        ]}
        whatsappText="Hello Jaipur Stonecraft, I am inquiring about a handcrafted Marble Radha Krishna Jugal Jodi statue."
      />

      <LandingShowcaseGrid
        id="available-designs"
        eyebrow="Direct Atelier Creations"
        title="Handcrafted Marble Radha Krishna Collection"
        subtitle="Explore our verified published Radha Krishna marble murtis. Each statue is carved with breathtaking grace, serene facial expressions, and classical shringar."
        products={products}
        categoryLink="/collections/sculptures-statues/hindu-sculptures/radha-krishna"
        categoryLinkLabel="Browse Radha Krishna Category Catalogue"
      />

      <LandingCraftGuide
        eyebrow="Devotional Artistry"
        title="Sculpting the Divine Harmony of Radha and Krishna"
        description="The sculpting of Radha Krishna requires supreme artistic sensitivity to express divine affection (Bhakti Bhava) through subtle marble chiseling, flowing folds, and delicate facial smiles."
        pillars={craftPillars}
      />

      <LandingSizingGuide
        eyebrow="Sanctuary Proportions"
        title="Altar Height & Mandir Dimensions for Radha Krishna Murtis"
        description="Whether designing a sacred domestic puja space or an expansive temple sanctum, our artisans carve matching pedestals and proportions for perfect darshan perspective."
      />

      <LandingFaq
        id="faq"
        eyebrow="Buyer Information"
        title="Frequently Asked Questions on Radha Krishna Statues"
        description="Essential guidance regarding single-block vs pair carving, stone care, decorative gold-finish detailing, and international shipping arrangements."
        faqs={faqs}
      />

      <LandingInquiry
        id="custom-inquiry"
        eyebrow="Bespoke Commission"
        title="Commission a Custom Marble Radha Krishna Statue"
        description="Provide your preferred height, single or twin composition, and sanctuary dimensions. Our Jaipur atelier will share dimension sketches, stone block options, and quotation."
        landingPageName="Marble Radha Krishna Statue Inquiry"
        defaultMarble="Makrana Pure White Marble"
      />

      <LandingInternalLinks
        eyebrow="Interconnected Collections"
        title="Explore Related Murtis & Architectural Elements"
        groups={internalLinks}
      />
    </main>
  );
}
