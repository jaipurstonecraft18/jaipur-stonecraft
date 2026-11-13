import { getMarbleGaneshProducts } from "@/lib/db/seo-landings.js";
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
    title: "Marble Ganesh Statue & Murti Manufacturer in Jaipur | Jaipur Stonecraft",
    description: "Handcrafted marble Ganesh statues sculpted from quality natural white marble in Jaipur. Explore seated, blessing, and dancing Ganpati murtis with custom mandir sizing and secure global delivery.",
    path: "/marble-ganesh-statues",
    ogImage: "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp"
  });
}

export default async function MarbleGaneshStatuesPage() {
  const products = await getMarbleGaneshProducts(12);

  const breadcrumbs = [
    { label: "Marble Statues", href: "/marble-statues" },
    { label: "Marble Ganesh Statues", href: "/marble-ganesh-statues" }
  ];

  const schemaBreadcrumbs = [
    { name: "Home", url: "https://jaipurstonecraft.com" },
    { name: "Marble Statues", url: "https://jaipurstonecraft.com/marble-statues" },
    { name: "Marble Ganesh Statues", url: "https://jaipurstonecraft.com/marble-ganesh-statues" }
  ];

  const faqs = [
    {
      question: "Which trunk direction is recommended for a home mandir Ganesh statue?",
      answer: "For residential home mandirs, the Vamavarthi Ganesha (trunk turned towards the deity's left side) is traditionally favored. The left-turned trunk symbolizes peaceful domestic harmony, auspicious blessings, and spiritual calm for daily family worship."
    },
    {
      question: "Why is natural white marble preferred for Lord Ganesha murtis?",
      answer: "High-quality white marble is favored for Lord Ganesha murtis because of its dense crystalline structure, smooth texture, and natural resilience. It provides a luminous, durable surface that allows fine facial expressions and ceremonial adornment to stand out clearly."
    },
    {
      question: "Can I commission a custom pose such as Lalitasana, Dancing Ganesh, or Ganesh on a Lotus?",
      answer: "Yes. Our skilled artisans carve Lord Ganesha in classical postures including Lalitasana (one leg folded, one resting on the base), Nritya Ganpati (joyous dancing posture), and Padmasana seated upon an ornate lotus pedestal. Custom crowns (Mukut), jewelry, and decorative gold-finish detailing can be tailored to your sanctuary preferences."
    },
    {
      question: "What are the common sizes for indoor and entrance Ganesh statues?",
      answer: "For indoor home mandirs, sizes commonly range from 9 to 18 inches. For grand foyer entrances, garden courtyards, or community temples, we sculpt statues ranging from 24 inches to 5 feet or higher, carved from single solid marble blocks with matching pedestals (chokis)."
    },
    {
      question: "Is international packaging available for fragile elements like the trunk and ears?",
      answer: "International packaging is available for all Ganesh statues. Special attention is given to protecting delicate elements such as the trunk, ears, and mudras during transportation. Contact us to discuss packaging and shipping arrangements for your statue."
    }
  ];

  const craftPillars = [
    {
      title: "Vamavarthi vs Dakshinavarthi Trunk",
      text: "We carve exact trunk orientations according to your spiritual sanctuary requirements—peaceful left-turned trunks for domestic bliss, or powerful right-turned trunks for disciplined shrine sthapana.",
      highlights: ["Left trunk (Vamavarthi) for home serenity", "Right trunk (Dakshinavarthi) for sacred discipline", "Subtle modak touch at trunk tip"]
    },
    {
      title: "Sacred Mudras & Classical Ayudhas",
      text: "Lord Ganesha holds the sacred Parashu (axe) to sever worldly attachments, the Pasa (noose) to steer devotees toward righteousness, a broken tusk for wisdom, and the Abhaya mudra blessing protection.",
      highlights: ["Clear four-armed anatomical balance", "Intricate mushaka (mouse) at the base", "Modak vessel in left palm"]
    },
    {
      title: "Deep Undercutting & Fine Finishing",
      text: "Our Jaipur sculptors specialize in deep undercut carving beneath the ears, trunk folds, and jewelry ornaments, finished with smooth hand-polishing and optional decorative gold-finish detailing.",
      highlights: ["Hand-honed smooth natural finish", "Optional decorative gold-finish detailing", "Carved from single solid marble blocks"]
    }
  ];

  const internalLinks = [
    {
      title: "Related Sacred Murtis",
      links: [
        { label: "Marble Statues Hub", href: "/marble-statues" },
        { label: "Marble Radha Krishna Statues", href: "/marble-radha-krishna-statues" },
        { label: "Marble Shiva Statues", href: "/marble-shiva-statues" },
        { label: "Marble Hanuman Statues", href: "/marble-hanuman-statues" }
      ]
    },
    {
      title: "Ganesh Catalog Pages",
      links: [
        { label: "Ganesh Ji Category Catalogue", href: "/collections/sculptures-statues/hindu-sculptures/ganesh-ji" },
        { label: "Hindu Deity Collection", href: "/collections/sculptures-statues/hindu-sculptures" },
        { label: "White Makrana Blessing Ganesh", href: "/designs/ganesh-ji/blessing-ganesh-statue" },
        { label: "Marble Ganesh Seated on Lotus", href: "/designs/ganesh-ji/marble-ganesh-ji-seated-on-lotus" }
      ]
    },
    {
      title: "Sanctuary Stonework",
      links: [
        { label: "Marble Home Mandirs", href: "/collections/temples-architectural-stonework/mandirs-temples" },
        { label: "Stone Jali Screens", href: "/collections/temples-architectural-stonework/jali-designs" },
        { label: "Carved Pillars & Plinths", href: "/collections/temples-architectural-stonework/pillars-columns" },
        { label: "Custom Bespoke Stonework", href: "/custom-projects" }
      ]
    },
    {
      title: "Atelier Resources",
      links: [
        { label: "Our Story & Heritage", href: "/our-story" },
        { label: "Stone Crafting Techniques", href: "/craftsmanship" },
        { label: "Global Export & Packing", href: "/export" },
        { label: "Inquire with Atelier", href: "/contact" }
      ]
    }
  ];

  const jsonLd = generateLandingPageSchema({
    title: "Marble Ganesh Statue & Murti Manufacturer in Jaipur | Jaipur Stonecraft",
    description: "Handcrafted marble Ganesh statues sculpted from pure Makrana white marble in Jaipur. Explore seated, blessing, and dancing Ganpati murtis with custom mandir sizing and global delivery.",
    url: "https://jaipurstonecraft.com/marble-ganesh-statues",
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
        title="Hand-Carved Marble Ganesh Statues & Murtis"
        lead="Sculpted from quality natural white marble, our Lord Ganesha statues combine classical iconography with graceful hand-carved detailing. Handcrafted in Jaipur for private home shrines, dedicated entryways, and temple sanctums worldwide."
        breadcrumbs={breadcrumbs}
        highlights={[
          { label: "Trunk Iconography", value: "Vamavarthi & Dakshinavarthi" },
          { label: "Stone Variety", value: "Premium White Marble" },
          { label: "Home Mandir Sizes", value: "9″ to 36″ Residential Scale" },
          { label: "Temple Sanctum", value: "48″ to 72″+ Monolithic Carvings" }
        ]}
        whatsappText="Hello Jaipur Stonecraft, I am inquiring about a handcrafted Marble Ganesh Statue for my home mandir."
      />

      <LandingShowcaseGrid
        id="available-designs"
        eyebrow="Direct Atelier Creations"
        title="Handcrafted Marble Ganesh Statues"
        subtitle="Browse published Ganesh murtis sculpted in our Jaipur workshop. Each statue is carved from quality natural white marble with fine mudras and finishing."
        products={products}
        categoryLink="/collections/sculptures-statues/hindu-sculptures/ganesh-ji"
        categoryLinkLabel="Explore Complete Ganesh Ji Category Catalogue"
      />

      <LandingCraftGuide
        eyebrow="Vedic Iconography & Craft"
        title="Iconographic Precision in Every Ganesha Murti"
        description="Every curve of Ganesha's trunk, posture, and facial expression carries profound spiritual meaning. Our master sculptors ensure your murti is not only aesthetically magnificent but spiritually auspicious."
        pillars={craftPillars}
      />

      <LandingSizingGuide
        eyebrow="Sanctuary Dimensions"
        title="Selecting the Right Ganesh Murti Height for Your Sanctuary"
        description="Whether positioned inside an intimate carved teak mandir or greeting visitors in an architectural foyer, our statues are engineered for structural balance and visual harmony."
      />

      <LandingFaq
        id="faq"
        eyebrow="Buyer Guidance"
        title="Frequently Asked Questions on Marble Ganesh Murtis"
        description="Clear answers on trunk directions, natural marble selection, sizing for mandirs, and international shipping arrangements."
        faqs={faqs}
      />

      <LandingInquiry
        id="custom-inquiry"
        eyebrow="Bespoke Commission"
        title="Commission a Custom Marble Ganesh Statue"
        description="Share your desired statue height, trunk orientation (left or right), and mandir dimensions. Our Jaipur master carvers will provide personalized consultation, dimension drawings, and quote."
        landingPageName="Marble Ganesh Statue Inquiry"
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
