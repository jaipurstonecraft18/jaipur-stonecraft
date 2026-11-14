import { getMarbleHanumanProducts } from "@/lib/db/seo-landings.js";
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
    title: "Marble Hanuman Statues & Murtis in Jaipur | Jaipur Stonecraft",
    description: "Hand-sculpted marble Hanuman statues in pure white marble from Jaipur. Veer and Panchmukhi postures with custom mandir sizing and secure global delivery.",
    path: "/marble-hanuman-statues",
    ogImage: "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp"
  });
}

export default async function MarbleHanumanStatuesPage() {
  const products = await getMarbleHanumanProducts(12);

  const breadcrumbs = [
    { label: "Marble Statues", href: "/marble-statues" },
    { label: "Marble Hanuman Statues", href: "/marble-hanuman-statues" }
  ];

  const schemaBreadcrumbs = [
    { name: "Home", url: "https://jaipurstonecraft.com" },
    { name: "Marble Statues", url: "https://jaipurstonecraft.com/marble-statues" },
    { name: "Marble Hanuman Statues", url: "https://jaipurstonecraft.com/marble-hanuman-statues" }
  ];

  const faqs = [
    {
      question: "What are the most popular postures for marble Hanuman statues?",
      answer: "The three most revered classical postures are: 1) Veer Hanuman (standing powerfully carrying the Gada / mace on his shoulder and uplifting the Sanjeevani Dronagiri mountain); 2) Bhakti / Dasya Hanuman (kneeling with folded hands in eternal devotion to Lord Rama); and 3) Panchmukhi Hanuman (the five-faced divine form embodying supreme protective energy)."
    },
    {
      question: "How does natural white marble react to traditional Sindoor and oil offerings?",
      answer: "Quality natural white marble has a compact crystalline texture that responds well to traditional worship with proper care. Following sindoor or oil offerings, we advise gentle wiping with a damp soft cloth to preserve the crisp chiseling and pristine stone appearance."
    },
    {
      question: "How do your sculptors capture both muscular strength and spiritual devotion in stone?",
      answer: "Sculpting Lord Hanuman requires a harmonious balance between dynamic muscular anatomy (symbolizing boundless physical power) and a gentle, serene facial expression (Soumya Bhava, reflecting utter humility and selfless devotion to Shri Rama). This dual mastery is the hallmark of Jaipur's hereditary Shilpkars."
    },
    {
      question: "Can I order a custom size for my home shrine or private gym / akhara?",
      answer: "Yes. We hand-carve residential murtis from 12 inches to 24 inches for home mandirs, 30 inches to 48 inches for architectural entrances and private wellness sanctuaries, and monumental 5-foot to 8-foot monolithic idols for public temples and community trusts."
    },
    {
      question: "Is international packaging available for projections like the raised arm and Gada?",
      answer: "International packaging is available. Careful attention is given to protecting projections such as the raised arm, mountain, and Gada during transportation. Contact us to discuss packaging and shipping arrangements for your statue."
    }
  ];

  const craftPillars = [
    {
      title: "Heroic Veer Hanuman & Sanjeevani",
      text: "Our master carvers capture the dynamic momentum of Bajrangbali flying with Mount Dronagiri in his left hand while his right hand wields the mighty Gada, balanced upon a solid carved rocky plinth.",
      highlights: ["Intricately carved Sanjeevani mountain", "Hand-chiseled Gada with optional decorative gold-finish detailing", "Flowing sacred yajnopavita thread and crown"]
    },
    {
      title: "Panchmukhi Cosmic Manifestation",
      text: "For protective spiritual sanctuaries, we sculpt the sacred five faces (Hanuman, Narasimha, Garuda, Varaha, and Hayagriva) with twenty arms holding classical ayudhas according to traditional iconographic texts.",
      highlights: ["Five-headed iconographic balance", "Precision multi-armed symmetry", "Chiseled from a single monolithic marble block"]
    },
    {
      title: "Natural White Marble Selection & Longevity",
      text: "Carved from quality white marble blocks selected in Rajasthan, ensuring structural soundness, fine grain, and natural beauty for indoor shrines and temple sanctums.",
      highlights: ["Carefully inspected natural marble", "Enduring structural soundness", "Hand-polished smooth natural finish"]
    }
  ];

  const internalLinks = [
    {
      title: "Related Sacred Statues",
      links: [
        { label: "Marble Statues Hub", href: "/marble-statues" },
        { label: "Marble Ganesh Statues", href: "/marble-ganesh-statues" },
        { label: "Marble Radha Krishna Statues", href: "/marble-radha-krishna-statues" },
        { label: "Marble Shiva Statues", href: "/marble-shiva-statues" }
      ]
    },
    {
      title: "Hanuman Catalog Pages",
      links: [
        { label: "Hanuman Ji Category Catalogue", href: "/collections/sculptures-statues/hindu-sculptures/hanuman-ji" },
        { label: "Hindu Deity Sculptures", href: "/collections/sculptures-statues/hindu-sculptures" },
        { label: "Standing Muscular Hanuman Ji", href: "/designs/hanuman-ji/white-marble-standing-muscular-hanuman-ji" },
        { label: "Complete Sculptures Collection", href: "/collections/sculptures-statues" }
      ]
    },
    {
      title: "Sanctuary Stonework",
      links: [
        { label: "Marble Home Mandirs", href: "/collections/temples-architectural-stonework/mandirs-temples" },
        { label: "Stone Jali Screens", href: "/collections/temples-architectural-stonework/jali-designs" },
        { label: "Architectural Pillars & Columns", href: "/collections/temples-architectural-stonework/pillars-columns" },
        { label: "Custom Temple Projects", href: "/custom-projects" }
      ]
    },
    {
      title: "Atelier Resources",
      links: [
        { label: "About Jaipur Stonecraft", href: "/our-story" },
        { label: "Stone Crafting Techniques", href: "/craftsmanship" },
        { label: "Global Export & Packing", href: "/export" },
        { label: "Contact Atelier Studio", href: "/contact" }
      ]
    }
  ];

  const jsonLd = generateLandingPageSchema({
    title: "Marble Hanuman Statue & Murti Manufacturer in Jaipur | Jaipur Stonecraft",
    description: "Hand-sculpted marble Hanuman statues in pure Makrana white marble. From muscular Veer Hanuman to Panchmukhi postures, sculpted by master Jaipur craftsmen with global delivery.",
    url: "https://jaipurstonecraft.com/marble-hanuman-statues",
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
        title="Handcrafted Marble Hanuman Statues & Bajrangbali Murtis"
        lead="Carved from solid natural white marble, our Lord Hanuman statues embody supreme strength, unwavering devotion, and protective grace. Handcrafted in Jaipur by experienced artisans for private home mandirs, wellness spaces, and temple trusts worldwide."
        breadcrumbs={breadcrumbs}
        highlights={[
          { label: "Iconic Postures", value: "Veer Hanuman & Panchmukhi" },
          { label: "Stone Selection", value: "Premium White Natural Marble" },
          { label: "Residential Scales", value: "12″ to 36″ Mandir Sizing" },
          { label: "Temple Sanctum", value: "48″ to 84″+ Monolithic Idols" }
        ]}
        whatsappText="Hello Jaipur Stonecraft, I am inquiring about a handcrafted Marble Lord Hanuman statue."
      />

      <LandingShowcaseGrid
        id="available-designs"
        eyebrow="Direct Atelier Creations"
        title="Handcrafted Marble Hanuman Statues"
        subtitle="Explore our verified published Lord Hanuman statues sculpted in solid natural marble with fine anatomical detail and serene devotion."
        products={products}
        categoryLink="/collections/sculptures-statues/hindu-sculptures/hanuman-ji"
        categoryLinkLabel="Explore Complete Hanuman Ji Category Catalogue"
      />

      <LandingCraftGuide
        eyebrow="Iconography & Strength"
        title="Sculpting Heroic Devotion in Solid Natural Marble"
        description="Every contour, the firm grip on the Gada, and the serene humility in Hanuman's eyes are sculpted with deep reverence according to traditional artistic canons."
        pillars={craftPillars}
      />

      <LandingSizingGuide
        eyebrow="Sanctuary Planning"
        title="Altar Height, Base Balance & Protective Placement"
        description="Whether carving an intimate devotional murti for a family mandir or a grand life-sized idol for a community temple, we provide guidance on balanced proportions, stable plinths, and international packaging arrangements."
      />

      <LandingFaq
        id="faq"
        eyebrow="Knowledge & Transparency"
        title="Frequently Asked Questions on Marble Hanuman Statues"
        description="Clear answers regarding postures, Makrana marble resilience against sindoor, bespoke sizing, and safe worldwide delivery."
        faqs={faqs}
      />

      <LandingInquiry
        id="custom-inquiry"
        eyebrow="Bespoke Commission"
        title="Commission a Custom Marble Hanuman Statue"
        description="Share your desired height, posture (Veer Hanuman, Bhakti Mudra, or Panchmukhi), and sanctuary specifications. Our Jaipur atelier will provide custom dimension sketches and quotation."
        landingPageName="Marble Hanuman Statue Inquiry"
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
