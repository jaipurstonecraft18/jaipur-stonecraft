import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ProjectsList from "@/components/ProjectsList/ProjectsList";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Completed Installations Portfolio — Jaipur Stonecraft",
  description: "Browse completed structural columns, sandstones arches, deity sculptures, and carved jali lattice screens built globally.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/projects",
  },
  openGraph: {
    title: "Completed Installations Portfolio — Jaipur Stonecraft",
    description: "Browse completed structural columns, sandstones arches, deity sculptures, and carved jali lattice screens built globally.",
    url: "https://jaipurstonecraft.com/projects",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=Jaipur+Stonecraft+Portfolio",
        width: 1200,
        height: 630,
        alt: "Jaipur Stonecraft Portfolio Showcase",
      },
    ],
  },
};

export default function Projects() {
  return (
    <Section background="light" spacing="standard" className="page-offset">
      <Container>
        <Breadcrumbs items={[{ label: "Projects" }]} />

        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="Portfolio"
            heading="Completed Case Studies"
            description="Explore our hand-carved installations integrated into residential, hospitality, and temple environments globally."
            align="center"
            headingLevel="h1"
          />
        </ScrollReveal>

        <ProjectsList />
      </Container>
    </Section>
  );
}
