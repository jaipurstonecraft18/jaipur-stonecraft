import { getMarbleHubProducts } from "@/lib/db/seo-landings.js";
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
    title: "Marble Statues & Murtis Manufacturer in Jaipur | Jaipur Stonecraft",
    description: "Handcrafted marble statues and Hindu deity murtis in Jaipur. Sculpted from pure natural marble for mandirs and temples. Custom sizing & global delivery.",
    path: "/marble-statues",
    ogImage: "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp"
  });
}

export default async function MarbleStatuesPage() {
  const products = await getMarbleHubProducts(24);

  const breadcrumbs = [
    { label: "Marble Statues", href: "/marble-statues" }
  ];

  const schemaBreadcrumbs = [
    { name: "Home", url: "https://jaipurstonecraft.com" },
    { name: "Marble Statues", url: "https://jaipurstonecraft.com/marble-statues" }
  ];

  const faqs = [
    {
      question: "Why is Jaipur considered the premier center for marble statue manufacturing?",
      answer: "Jaipur has been the historical epicenter of Indian stone sculpture (Moorti Kala) for centuries. Generations of skilled sculptors (Shilpkars) in Jaipur have preserved classical artistic proportions, combining traditional hand-chiseling techniques with access to Rajasthan's renowned marble quarries."
    },
    {
      question: "Which marble variety is best suited for Hindu deity murtis?",
      answer: "High-grade natural white marble, including prized Makrana varieties, is chosen for its dense crystalline structure and natural purity. Its low porosity and fine grain make it ideal for enduring devotional murtis, maintaining its natural luster and dignified presence over decades of respectful care."
    },
    {
      question: "Can Jaipur Stonecraft carve custom statue sizes for residential mandirs and temples?",
      answer: "Yes. Every marble statue can be commissioned to exact architectural and shrine dimensions—from compact 9-inch and 15-inch home mandir murtis up to monumental temple sanctum idols with custom mudras, postures, and elegant decorative gold-finish detailing."
    },
    {
      question: "How are marble statues prepared for international transportation?",
      answer: "International packaging is available. Orders are prepared for transportation in accordance with applicable shipping requirements to protect the statue during transit. Contact us to discuss packaging and shipping arrangements for your specific statue."
    },
    {
      question: "What is the typical crafting timeline for a bespoke marble statue?",
      answer: "Crafting timelines depend directly on the required scale, stone selection, posture complexity, and level of hand-chiseling required. We invite clients to share their desired dimensions and design preferences so our atelier can provide an accurate, transparent schedule for their custom commission."
    }
  ];

  const craftPillars = [
    {
      title: "Natural Stone Selection & Marble Purity",
      text: "We carefully inspect and select quality natural marble blocks, prioritizing structural density, uniform grain, and natural purity for every sacred sculpture.",
      highlights: ["Carefully inspected natural marble", "Dense crystalline structure", "Enduring natural luster"]
    },
    {
      title: "Canonical Shastra Proportions",
      text: "Every deity is sculpted following classical aesthetic guidelines and iconographic traditions. The facial expression (bhava) is imbued with serene grace, divine compassion, and spiritual poise.",
      highlights: ["Classical aesthetic proportions", "Expressive facial detailing", "Balanced physical mudras and postures"]
    },
    {
      title: "Generational Hand-Carving",
      text: "While modern diamond tools assist with initial roughing, the fine anatomical nuances, flowing drapery, and intricate ornaments are carved by hand using specialized chisels.",
      highlights: ["Deep undercut ornamentation", "Hand-honed matte or polished finish", "Optional premium gold-finish detailing"]
    }
  ];

  const internalLinks = [
    {
      title: "Deity Specialty Pages",
      links: [
        { label: "Marble Ganesh Statues", href: "/marble-ganesh-statues" },
        { label: "Marble Radha Krishna Statues", href: "/marble-radha-krishna-statues" },
        { label: "Marble Shiva Statues", href: "/marble-shiva-statues" },
        { label: "Marble Hanuman Statues", href: "/marble-hanuman-statues" }
      ]
    },
    {
      title: "Catalog Categories",
      links: [
        { label: "All Hindu Deity Sculptures", href: "/collections/sculptures-statues/hindu-sculptures" },
        { label: "Ganesh Ji Category", href: "/collections/sculptures-statues/hindu-sculptures/ganesh-ji" },
        { label: "Radha Krishna Category", href: "/collections/sculptures-statues/hindu-sculptures/radha-krishna" },
        { label: "Shiva Ji Category", href: "/collections/sculptures-statues/hindu-sculptures/shiva-ji" }
      ]
    },
    {
      title: "Architectural Stonework",
      links: [
        { label: "Hand-Carved Stone Jalis", href: "/collections/temples-architectural-stonework/jali-designs" },
        { label: "Carved Pillars & Columns", href: "/collections/temples-architectural-stonework/pillars-columns" },
        { label: "Marble Home Mandirs", href: "/collections/temples-architectural-stonework/mandirs-temples" },
        { label: "Architectural Components", href: "/collections/temples-architectural-stonework/architectural-components" }
      ]
    },
    {
      title: "Atelier Heritage",
      links: [
        { label: "Our Story & Lineage", href: "/our-story" },
        { label: "Stone Craftsmanship Techniques", href: "/craftsmanship" },
        { label: "Global Export & Logistics", href: "/export" },
        { label: "Contact Jaipur Atelier", href: "/contact" }
      ]
    }
  ];

  const jsonLd = generateLandingPageSchema({
    title: "Marble Statues & Murtis Manufacturer in Jaipur | Jaipur Stonecraft",
    description: "Premier manufacturer of handcrafted marble statues and Hindu god murtis in Jaipur, Rajasthan. Sculpted from pure Makrana white marble for home mandirs and temple trusts worldwide.",
    url: "https://jaipurstonecraft.com/marble-statues",
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
        eyebrow="Jaipur Atelier • Direct Manufacturer & Exporter"
        title="Handcrafted Marble Statues & Murtis from Jaipur Atelier"
        lead="Jaipur Stonecraft sculpts fine marble statues and sacred Hindu deity murtis from carefully selected natural white marble. Handcrafted by skilled artisans in Jaipur, Rajasthan, our work brings spiritual grace and enduring beauty to homes and temples worldwide."
        breadcrumbs={breadcrumbs}
        whatsappText="Hello Jaipur Stonecraft, I am inquiring about handcrafted marble statues and custom murtis."
      />

      <LandingShowcaseGrid
        id="available-designs"
        eyebrow="Direct Atelier Creations"
        title="Hand-Carved Marble Statues Collection"
        subtitle="Explore our verified published marble sculptures sculpted in solid natural marble. Each piece embodies generational mastery and sacred iconography."
        products={products}
        categoryLink="/collections/sculptures-statues"
        categoryLinkLabel="Browse Complete Sculptures & Statues Collection"
      />

      <LandingCraftGuide
        eyebrow="The Jaipur Moorti Heritage"
        title="Centuries of Sculptural Tradition in Natural Marble"
        description="Every marble statue at Jaipur Stonecraft begins with careful stone selection from trusted quarries, sculpted with precision to uphold sacred artistic traditions."
        pillars={craftPillars}
      />

      <LandingSizingGuide
        eyebrow="Sanctuary Planning"
        title="Statue Dimensions, Altar Placement & Worldwide Delivery"
        description="Whether commissioning a sacred murti for a home mandir or an expansive temple sanctuary, our team provides guidance on proportions, stable pedestals, and international packaging arrangements."
      />

      <LandingFaq
        id="faq"
        eyebrow="Knowledge & Transparency"
        title="Frequently Asked Questions on Marble Statues"
        description="Helpful guidance on marble selection, craftsmanship details, custom commissions, and secure packaging arrangements."
        faqs={faqs}
      />

      <LandingInquiry
        id="custom-inquiry"
        eyebrow="Custom Commission"
        title="Inquire About a Marble Statue or Custom Murti"
        description="Discuss your project directly with our Jaipur atelier coordinators. Submit your required height, deity posture, and sanctuary details for custom quotation and dimension guidance."
        landingPageName="Marble Statues Hub Inquiry"
      />

      <LandingInternalLinks
        eyebrow="Interconnected Architecture"
        title="Explore Sacred Murtis & Architectural Collections"
        groups={internalLinks}
      />
    </main>
  );
}
