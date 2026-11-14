import { getMarbleShivaProducts } from "@/lib/db/seo-landings.js";
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
    title: "Marble Shiva Statues & Shiv Parivar in Jaipur | Jaipur Stonecraft",
    description: "Handcrafted marble Shiva statues & Shiv Parivar murtis carved in white & black marble in Jaipur. Meditative postures, custom sizes and worldwide delivery.",
    path: "/marble-shiva-statues",
    ogImage: "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp"
  });
}

export default async function MarbleShivaStatuesPage() {
  const products = await getMarbleShivaProducts(12);

  const breadcrumbs = [
    { label: "Marble Statues", href: "/marble-statues" },
    { label: "Marble Shiva Statues", href: "/marble-shiva-statues" }
  ];

  const schemaBreadcrumbs = [
    { name: "Home", url: "https://jaipurstonecraft.com" },
    { name: "Marble Statues", url: "https://jaipurstonecraft.com/marble-statues" },
    { name: "Marble Shiva Statues", url: "https://jaipurstonecraft.com/marble-shiva-statues" }
  ];

  const faqs = [
    {
      question: "What is the difference between a Lord Shiva statue and a Shiva Lingam?",
      answer: "A Lord Shiva statue depicts the anthropomorphic, meditative, or cosmic form of the deity (such as Mahadev seated in deep Dhyana meditation, Nataraja dancing the cosmic rhythm, or the benevolent Shiv Parivar family). A Shiva Lingam is the aniconic, formless symbol (Nirguna Brahman) representing cosmic creation and dissolution. Both serve distinct spiritual intents and sanctuary arrangements."
    },
    {
      question: "Which marble types are used for sculpting Lord Shiva statues?",
      answer: "We primarily sculpt Lord Shiva statues in pristine Makrana White Marble (symbolizing transcendent purity and stillness) and Black Bhainslana Marble from Rajasthan (symbolizing the infinite cosmic depth of Mahakaal). Both are natural, dense, solid marbles ideal for daily worship and ceremonial abhishek."
    },
    {
      question: "Can we commission a complete Shiv Parivar marble composition?",
      answer: "Yes. Our Shiv Parivar sculptures portray Lord Shiva alongside Mata Parvati, young Ganesha, Kartikeya, and the faithful Nandi Bull at the base. These are sculpted either from a single solid block of marble or as harmonized multi-piece compositions for large temple shrines."
    },
    {
      question: "How do you care for a marble Shiva statue during water and milk abhishek?",
      answer: "Natural marble has a dense structure that responds well to gentle, respectful care. We recommend rinsing with clean water following ritual offerings and softly drying the surface with a clean cloth. Abrasive or acidic cleaners should always be avoided on natural polished stone."
    },
    {
      question: "What heights are available for custom Shiva statues?",
      answer: "Residential meditative Shiva statues typically range from 12 inches to 36 inches in height. For temple sanctums, ashrams, and landscape meditation gardens, we hand-carve monumental monolithic statues from 4 feet up to 8 feet or higher with custom engineering for outdoor climate resilience."
    }
  ];

  const craftPillars = [
    {
      title: "Contemplative Dhyana Mudra",
      text: "Sculpting the profound stillness of the Adiyogi requires masterful facial chiseling. Half-closed eyes reflect deep meditative withdrawal (Antarmukhi), radiating serenity and spiritual silence.",
      highlights: ["Half-closed meditative eyes (Trinetra)", "Subtle peaceful countenance", "Padmasana on tiger skin pedestal"]
    },
    {
      title: "Sacred Iconographic Symbols (Ayudhas)",
      text: "Every sacred element is deeply hand-chiseled: the coiled serpent (Vasuki) symbolizing controlled cosmic energy, the Trishula representing the three Gunas, the Damru of primordial sound, and the crescent moon.",
      highlights: ["Matted hair locks (Jata Juta) with Ganga stream", "Intricate Vasuki serpent around the neck", "Trishula and Damru hand carvings"]
    },
    {
      title: "Natural White & Black Marble Varieties",
      text: "Clients can select from fine white marble or dense natural black marble quarried in Rajasthan, each shaped and hand-honed to express the profound spiritual presence of Lord Shiva.",
      highlights: ["Natural solid stone blocks", "Smooth natural matte or refined polish", "Careful material selection"]
    }
  ];

  const internalLinks = [
    {
      title: "Related Sacred Statues",
      links: [
        { label: "Marble Statues Hub", href: "/marble-statues" },
        { label: "Marble Ganesh Statues", href: "/marble-ganesh-statues" },
        { label: "Marble Radha Krishna Statues", href: "/marble-radha-krishna-statues" },
        { label: "Marble Hanuman Statues", href: "/marble-hanuman-statues" }
      ]
    },
    {
      title: "Shiva Catalog Pages",
      links: [
        { label: "Shiva Ji Category Catalogue", href: "/collections/sculptures-statues/hindu-sculptures/shiva-ji" },
        { label: "Hindu Deity Sculptures", href: "/collections/sculptures-statues/hindu-sculptures" },
        { label: "Mahadev Ji with 4 Hands", href: "/designs/shiva-ji/mahadev-ji-with-4-hands" },
        { label: "Shiv Pariwar Marble Sculpture", href: "/designs/shiva-ji/shiv-pariwar" }
      ]
    },
    {
      title: "Temple Stonework",
      links: [
        { label: "Marble Home Mandirs", href: "/collections/temples-architectural-stonework/mandirs-temples" },
        { label: "Architectural Pillars & Columns", href: "/collections/temples-architectural-stonework/pillars-columns" },
        { label: "Stone Jali Screens", href: "/collections/temples-architectural-stonework/jali-designs" },
        { label: "Architectural Carved Elements", href: "/collections/temples-architectural-stonework/architectural-components" }
      ]
    },
    {
      title: "Atelier Resources",
      links: [
        { label: "Atelier Lineage & Heritage", href: "/our-story" },
        { label: "Hand-Carving Craftsmanship", href: "/craftsmanship" },
        { label: "Global Export & Packaging", href: "/export" },
        { label: "Contact Atelier Studio", href: "/contact" }
      ]
    }
  ];

  const jsonLd = generateLandingPageSchema({
    title: "Marble Shiva Statue & Shiv Parivar Murti in Jaipur | Jaipur Stonecraft",
    description: "Handcrafted marble Lord Shiva statues and Shiv Parivar murtis carved in pure Makrana white and natural black marble. Meditative postures, custom sizing, and global crated delivery from Jaipur.",
    url: "https://jaipurstonecraft.com/marble-shiva-statues",
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
        eyebrow="Jaipur Moorti Atelier • Direct Manufacturer"
        title="Hand-Carved Marble Shiva Statues & Mahadev Murtis"
        lead="Sculpted in quality white marble and natural black Bhainslana marble, our Lord Shiva statues and Shiv Parivar compositions reflect the transcendent stillness of Mahadev. Hand-chiseled by experienced Jaipur artisans for home shrines, meditation spaces, and temple sanctuaries worldwide."
        breadcrumbs={breadcrumbs}
        highlights={[
          { label: "Sacred Postures", value: "Dhyana Mudra & Shiv Parivar" },
          { label: "Stone Selection", value: "Natural White & Black Marble" },
          { label: "Residential Scales", value: "12″ to 36″ Home Shrine Size" },
          { label: "Temple Sanctum", value: "48″ to 96″+ Monolithic Idols" }
        ]}
        whatsappText="Hello Jaipur Stonecraft, I am inquiring about a handcrafted Marble Lord Shiva statue."
      />

      <LandingShowcaseGrid
        id="available-designs"
        eyebrow="Direct Atelier Creations"
        title="Handcrafted Marble Shiva Statues & Shiv Parivar"
        subtitle="Explore our verified published Lord Shiva and Shiv Parivar statues hand-sculpted in solid natural marble with divine serenity and anatomical precision."
        products={products}
        categoryLink="/collections/sculptures-statues/hindu-sculptures/shiva-ji"
        categoryLinkLabel="Explore Complete Shiva Ji Category Catalogue"
      />

      <LandingCraftGuide
        eyebrow="Spiritual Iconography"
        title="Sculpting the Infinite Stillness of Lord Shiva"
        description="Every iconographic element—from the river Ganga flowing from matted hair to the tranquil third eye—is sculpted in strict adherence to classical Dhyana slokas by our master Jaipur stonecarvers."
        pillars={craftPillars}
      />

      <LandingSizingGuide
        eyebrow="Sanctuary Planning"
        title="Altar Proportions, Base Engineering & Placement"
        description="Whether carving a peaceful meditation sanctuary focal point or a grand temple sanctum idol, we ensure optimal viewing angles, pedestal stability, and ritual drainage."
      />

      <LandingFaq
        id="faq"
        eyebrow="Knowledge & Guidance"
        title="Frequently Asked Questions on Marble Shiva Statues"
        description="Clear answers regarding statue vs lingam distinction, marble abhishek durability, Shiv Parivar compositions, and safe international transit."
        faqs={faqs}
      />

      <LandingInquiry
        id="custom-inquiry"
        eyebrow="Bespoke Commission"
        title="Commission a Custom Marble Shiva Statue"
        description="Discuss custom dimensions, posture (meditative Dhyana or complete Shiv Parivar), and marble selection with our master carver coordination team."
        landingPageName="Marble Shiva Statue Inquiry"
        defaultMarble="Makrana Pure White Marble"
      />

      <LandingInternalLinks
        eyebrow="Connected Collections"
        title="Explore Related Murtis & Architectural Elements"
        groups={internalLinks}
      />
    </main>
  );
}
