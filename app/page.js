import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Hero from "@/components/Hero/Hero";
import TrustStrip from "@/components/TrustStrip/TrustStrip";
import HomeCollections from "@/components/HomeCollections/HomeCollections";
import HeritageStory from "@/components/HeritageStory/HeritageStory";
import CraftProcess from "@/components/CraftProcess/CraftProcess";
import CapabilitiesSection from "@/components/CapabilitiesSection/CapabilitiesSection";
import MaterialsSection from "@/components/MaterialsSection/MaterialsSection";
import HomeProjects from "@/components/HomeProjects/HomeProjects";
import WhyUsSection from "@/components/WhyUsSection/WhyUsSection";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ImageWithText from "@/components/ImageWithText/ImageWithText";
import CTASection from "@/components/CTASection/CTASection";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export const metadata = {
  title: "Jaipur Stonecraft — Premium Stone Atelier & Generational Craftsmanship",
  description: "Bespoke white marble deity statues, temple architecture, stone wall murals, and custom architectural stonework carved by master artisans in Jaipur, India.",
  alternates: {
    canonical: "https://jaipurstonecraft.com",
  },
  openGraph: {
    title: "Jaipur Stonecraft — Premium Stone Atelier & Generational Craftsmanship",
    description: "Bespoke white marble deity statues, temple architecture, stone wall murals, and custom architectural stonework carved by master artisans in Jaipur, India.",
    url: "https://jaipurstonecraft.com",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=Jaipur+Stonecraft+Atelier",
        width: 1200,
        height: 630,
        alt: "Jaipur Stonecraft Atelier white marble sculpture and temple stonework",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      {/* 1. HERO SECTION (Transparent Navigation Overlay) */}
      <Hero
        imageSrc="/images/hero/homepage-hero.png"
        imageAlt="Hand-carved architectural stone sculpture detail"
        videoSrc="/videos/herovid.webm"
        eyebrow="HANDCRAFTED IN JAIPUR"
        heading="Where Stone Becomes Legacy."
        description="Bespoke white marble sculptures, temple architecture, and custom architectural stonework carved by master artisans in Rajasthan."
        primaryCtaText="Explore Collections"
        primaryCtaHref="/collections"
        secondaryCtaText="Discuss Your Project"
        secondaryCtaHref="/contact?type=custom"
      />

      {/* 2. TRUST / BRAND PROMISE STRIP */}
      <TrustStrip />

      {/* 3. HERITAGE & BRAND STORY SECTION */}
      <HeritageStory />

      {/* 4. EDITORIAL COLLECTIONS SHOWCASE */}
      <HomeCollections />

      {/* 5. CAPABILITIES SECTION ("BEYOND THE STATUE") */}
      <CapabilitiesSection />

      {/* 6. CRAFTSMANSHIP PROCESS SECTION */}
      <CraftProcess />

      {/* 7. MATERIALS & MARBLE HUB LINK SECTION */}
      <MaterialsSection />

      {/* 8. FEATURED PROJECTS CASE STUDIES SHOWCASE */}
      <HomeProjects />

      {/* 9. WHY JAIPUR STONECRAFT ATELIER STANDARDS */}
      <WhyUsSection />

      {/* 10. FINAL CONVERSION CTA SECTION */}
      <CTASection
        heading="Have a Vision in Mind?"
        description="Whether you have a hand sketch, architectural CAD blueprint, or a reference photo, our atelier team will guide your custom stone creation from block selection to global delivery."
        primaryCtaText="Discuss Your Project"
        primaryCtaHref="/contact?type=custom"
        secondaryCtaText="Request a Quote"
        secondaryCtaHref="/contact?type=quote"
        background="dark"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Organization", "LocalBusiness"],
            name: "Jaipur Stonecraft",
            url: "https://jaipurstonecraft.com",
            logo: "https://jaipurstonecraft.com/images/hero/homepage-hero.png",
            telephone: "+91 70147 53278",
            email: "Jaipurstonecraft18@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "30, Industrial Area, Krisna Nagar a, Kartarpura, Gopal Pura Mode",
              addressLocality: "Jaipur",
              addressRegion: "Rajasthan",
              postalCode: "302015",
              addressCountry: "IN"
            },
            sameAs: [
              "https://instagram.com",
              "https://pinterest.com",
            ],
          }),
        }}
      />
    </>
  );
}
