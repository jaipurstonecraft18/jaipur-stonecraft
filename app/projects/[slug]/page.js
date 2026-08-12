import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import Gallery from "@/components/Gallery/Gallery";
import CTASection from "@/components/CTASection/CTASection";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import { categoriesData } from "@/content/categories";
import { projectsData } from "@/content/projects";
import { collectionsData } from "@/content/collections";
import { siteConfig } from "@/content/site";
import styles from "./page.module.css";

// Pre-render static paths for all 10 projects (SEO standard)
export async function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

// Generate dynamic meta titles
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const project = projectsData[slug];

  if (!project) return {};

  return {
    title: `${project.name} — Jaipur Stonecraft`,
    description: project.description,
    alternates: {
      canonical: `https://jaipurstonecraft.com/projects/${slug}`,
    },
    openGraph: {
      title: `${project.name} — Jaipur Stonecraft`,
      description: project.description,
      url: `https://jaipurstonecraft.com/projects/${slug}`,
      siteName: "Jaipur Stonecraft",
      type: "website",
      images: [
        {
          url: project.imageSrc,
          width: 1200,
          height: 800,
          alt: project.name,
        },
      ],
    },
  };
}

export default async function ProjectDetail({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const project = projectsData[slug];

  if (!project) {
    notFound();
  }

  const collection = collectionsData[project.collectionSlug];

  // Resolve related projects of the same type/category (excluding current project)
  const relatedProjects = Object.values(projectsData)
    .filter((p) => p.type === project.type && p.slug !== slug)
    .slice(0, 2);

  return (
    <>
      {/* 1. BREADCRUMBS & CORE INFO */}
      <Section background="light" spacing="standard" className="page-offset" style={{ paddingBottom: 0 }}>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Projects", href: "/projects" },
              { label: project.name },
            ]}
          />
        </Container>
      </Section>

      {/* 2. PROJECT HERO WIDESCREEN BANNER */}
      <Section background="light" spacing="none">
        <Container>
          <ScrollReveal animation="fade-scale">
            <div className={styles.heroBanner}>
              <Image
                src={project.imageSrc}
                alt={project.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 1280px"
                className={styles.heroImage}
                priority
              />
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 3. PROJECT DETAILS OVERVIEW */}
      <Section background="light" spacing="standard">
        <Container>
          <div className={styles.detailsGrid}>
            {/* Left Column: Title & Description */}
            <ScrollReveal animation="fade-up" className={styles.descriptionCol}>
              <span className="eyebrow">{project.type} Case Study</span>
              <h1 className={styles.title}>{project.name}</h1>
              <p className="large" style={{ color: "rgba(26, 25, 24, 0.85)", marginTop: "var(--spacing-sm)" }}>
                {project.description}
              </p>
            </ScrollReveal>

            {/* Right Column: Spec card */}
            <ScrollReveal animation="fade-up" delay={150} className={styles.specCol}>
              <div className={styles.specCard}>
                <h4 className={styles.specCardTitle}>Case Details</h4>
                <ul className={styles.specList}>
                  <li>
                    <span className={styles.specLabel}>Category:</span>{" "}
                    <span>{project.type}</span>
                  </li>
                  <li>
                    <span className={styles.specLabel}>Location:</span>{" "}
                    <span className={styles.placeholderTag}>{project.location}</span>
                  </li>
                  <li>
                    <span className={styles.specLabel}>Materials:</span>{" "}
                    <span className={styles.placeholderTag}>{project.materials}</span>
                  </li>
                  {collection && (
                    <li>
                      <span className={styles.specLabel}>Collection:</span>{" "}
                      <Link href={`/collections/${collection.slug}`} className={styles.textLink}>
                        {collection.name}
                      </Link>
                    </li>
                  )}
                </ul>

                {/* Products Used tag array */}
                {project.productsUsed && project.productsUsed.length > 0 && (
                  <div className={styles.productsUsedSection}>
                    <h5 className={styles.productsUsedTitle}>Integrated Catalog Pieces</h5>
                    <div className={styles.productsList}>
                      {project.productsUsed.map((prod) => {
                        const cat = categoriesData[prod.slug];
                        const href = cat
                          ? `/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`
                          : `/collections/temples-architectural-stonework`;
                        return (
                          <Link
                            key={prod.slug}
                            href={href}
                            className={styles.productTag}
                            aria-label={`View category details for ${prod.name}`}
                          >
                            {prod.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 4. VISUAL GALLERY */}
      <Section background="grey" spacing="standard">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Portfolio Gallery"
              heading="Installation & Site Views"
              description="A study of completed masonry scales, shadow alignments, and physical details in context."
            />
          </ScrollReveal>

          <div style={{ marginTop: "var(--spacing-lg)" }}>
            <Gallery images={project.gallery} aspect="aspect32" columns={3} altPrefix={`${project.name} installation view`} />
          </div>
        </Container>
      </Section>

      {/* 5. CRAFTSMANSHIP & FINAL RESULTS SPLIT */}
      <Section background="light" spacing="standard">
        <Container>
          <div className={styles.splitGrid}>
            <ScrollReveal animation="fade-up" className={styles.splitBlock}>
              <h4 className={styles.splitTitle}>Carving & Atelier Execution</h4>
              <p>{project.craftsmanship}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150} className={styles.splitBlock}>
              <h4 className={styles.splitTitle}>Delivery & Site Placement</h4>
              <p>{project.finalResult}</p>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 6. RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <Section background="grey" spacing="standard">
          <Container>
            <ScrollReveal animation="fade-up">
              <SectionHeading
                eyebrow="Portfolio Case Studies"
                heading="Related Installations"
                description={`Browse other masonry commissions executed under our ${project.type} portfolio.`}
              />
            </ScrollReveal>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--spacing-xl)",
              marginTop: "var(--spacing-lg)"
            }}>
              {relatedProjects.map((related, idx) => (
                <ScrollReveal key={related.slug} animation="fade-up" delay={idx * 100}>
                  <ProjectCard
                    name={related.name}
                    type={related.type}
                    location={related.location}
                    imageSrc={related.imageSrc}
                    href={`/projects/${related.slug}`}
                  />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 7. FINAL CTA INQUIRY */}
      <CTASection
        heading={`Inquire About ${project.name}`}
        description="Discuss site blueprint scaling, request custom stone layout plans, or receive estimated shipping quotes."
        primaryCtaText="Request a Quote"
        primaryCtaHref={`/contact?type=quote&project=${slug}`}
        secondaryCtaText="WhatsApp Coordinator"
        secondaryCtaHref={siteConfig.contact.whatsappLink}
        background="dark"
      />
    </>
  );
}
