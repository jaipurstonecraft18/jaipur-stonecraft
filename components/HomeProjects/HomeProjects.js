import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { projectsData } from "@/content/projects";
import styles from "./HomeProjects.module.css";

export default function HomeProjects() {
  const projectList = Object.values(projectsData);
  const heroProject = projectList[0]; // London Temple Columns & Arches
  const sideProjects = projectList.slice(1, 3); // Private Residence Shrine & Resort Facade

  return (
    <Section background="light" spacing="standard" className={styles.section}>
      <Container>
        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="CASE STUDIES"
            heading="From Vision to Legacy."
            description="Selected architectural, temple, and landscape masonic installations created for private shrines, cultural estates, and commercial spaces globally."
            align="center"
          />
        </ScrollReveal>

        <div className={styles.asymmetricGrid}>
          {/* Left Column: Hero Spotlight Project */}
          {heroProject && (
            <ScrollReveal animation="fade-up">
              <Link href={`/projects/${heroProject.slug}`} className={styles.heroProjectCard}>
                <div className={styles.heroImageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroProject.imageSrc}
                    alt={heroProject.name}
                    className={styles.projectImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.heroContent}>
                  <div>
                    <div className={styles.metaRow}>
                      <span>{heroProject.type}</span>
                      <span>•</span>
                      <span>Jaipur Atelier Export</span>
                    </div>
                    <h3 className={styles.projectTitle}>{heroProject.name}</h3>
                    <p className={styles.projectDesc}>
                      Hand-carved solid marble structural pillars and ornate arches engineered for a global sacred sanctuary installation.
                    </p>
                  </div>
                  <span className={styles.projectLink}>
                    View Project Case Study &rarr;
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          )}

          {/* Right Column: 2 Supporting Projects */}
          <div className={styles.sideColumn}>
            {sideProjects.map((proj, idx) => (
              <ScrollReveal key={proj.slug} animation="fade-up" delay={(idx + 1) * 100}>
                <Link href={`/projects/${proj.slug}`} className={styles.subProjectCard}>
                  <div className={styles.subImageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proj.imageSrc}
                      alt={proj.name}
                      className={styles.projectImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.subContent}>
                    <div className={styles.metaRow}>
                      <span>{proj.type}</span>
                    </div>
                    <h4 className={styles.subTitle}>{proj.name}</h4>
                    <span className={styles.projectLink} style={{ marginTop: "0.25rem" }}>
                      Read Installation Story &rarr;
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* View All Projects CTA */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className={styles.ctaWrapper}>
            <PrimaryButton href="/projects" variant="bronze">
              View All Projects &rarr;
            </PrimaryButton>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
