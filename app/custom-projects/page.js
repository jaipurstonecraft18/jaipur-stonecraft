import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ProcessSteps from "@/components/ProcessSteps/ProcessSteps";
import ContactForm from "@/components/ContactForm/ContactForm";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export const metadata = {
  title: "Bespoke Commissions & Custom Projects — Jaipur Stonecraft",
  description: "Bring your blueprints, sketches, or photos. We hand-carve custom marble and sandstone architectural structures to your exact specifications.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/custom-projects",
  },
  openGraph: {
    title: "Bespoke Commissions & Custom Projects — Jaipur Stonecraft",
    description: "Bring your blueprints, sketches, or photos. We hand-carve custom marble and sandstone architectural structures to your exact specifications.",
    url: "https://jaipurstonecraft.com/custom-projects",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=Bespoke+Commissions+Workshop",
        width: 1200,
        height: 630,
        alt: "Bespoke Commissions Workshop",
      },
    ],
  },
};

export default function CustomProjects() {
  const customSteps = [
    {
      title: "Share Your Idea",
      description: "Submit sketches, dimensions, photos, or architectural blueprints of your design."
    },
    {
      title: "Discuss Details",
      description: "Consult with our coordination team to align load points and stone selections."
    },
    {
      title: "Select Material",
      description: "Choose structural sandstones or premium white Makrana sculptor marbles."
    },
    {
      title: "Finalize Design",
      description: "Verify digital design parameters or approve clay models before carving begins."
    },
    {
      title: "Hand Carving",
      description: "Artisans rough-carve and detail the solid block centimeter by centimeter."
    },
    {
      title: "Inspection",
      description: "Execute dimensional quality audits and apply structural stone sealer coatings."
    },
    {
      title: "Secure Delivery",
      description: "Secure padded crate logistics coordinated from our dry port to your site."
    }
  ];

  return (
    <>
      {/* 1. BREADCRUMBS & HEADER */}
      <Section background="light" spacing="standard" className="page-offset">
        <Container style={{ borderBottom: "1px solid var(--color-stone-grey)", paddingBottom: "var(--spacing-lg)" }}>
          <Breadcrumbs items={[{ label: "Custom Projects" }]} />
          <SectionHeading
            eyebrow="Bespoke Commissions"
            heading="Your Vision. Our Craftsmanship."
            description="Whether you need a custom-scaled sanctuary shrine, architectural pillars, or garden sculpture, we translate your layout plans into hand-carved stone art."
            headingLevel="h1"
          />
        </Container>
      </Section>

      {/* 2. THE 7-STEP COMMISSION TIMELINE */}
      <Section background="grey" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Workflow"
              heading="The Custom Project Journey"
              description="How we translate sketches and architectural blueprints into permanent structural stone art."
            />
          </ScrollReveal>

          <div style={{ marginTop: "var(--spacing-xl)" }}>
            <ProcessSteps steps={customSteps} />
          </div>
        </Container>
      </Section>

      {/* 3. THE FULL CUSTOM INQUIRY FORM */}
      <Section background="light" spacing="standard">
        <Container style={{ maxWidth: "800px" }}>
          <ScrollReveal animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: "var(--spacing-lg)" }}>
              <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: "400", fontSize: "2rem", marginBottom: "0.5rem" }}>
                Start Your Custom Project
              </h2>
              <p style={{ fontSize: "0.95rem", color: "rgba(26, 25, 24, 0.7)", maxWidth: "580px", margin: "0 auto" }}>
                Please fill in the dimensional parameters, material category, and details. You can attach sketch sheets or blueprint reference files.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <ContactForm formType="custom" />
          </ScrollReveal>
        </Container>
      </Section>
    </>
  );
}
