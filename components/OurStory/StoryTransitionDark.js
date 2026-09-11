import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

const defaultStatIcons = [
  // 3+ Generations (Heritage / Pedestal)
  (
    <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C49653" strokeWidth="1.5">
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    </svg>
  ),
  // 500+ Artisans (Community of Carvers)
  (
    <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C49653" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  // 25+ Countries (Global globe)
  (
    <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C49653" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  // 1000+ Projects (Completed Monuments / Architectural projects)
  (
    <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C49653" strokeWidth="1.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
];

const defaultStatsList = [
  { value: "3+", label: "Generations of Stone Carving Heritage" },
  { value: "500+", label: "Skilled Artisans Across Rajasthan" },
  { value: "25+", label: "Countries Our Sculptures Have Reached" },
  { value: "1000+", label: "Custom Sculptures & Architectural Projects Delivered" }
];

export default function StoryTransitionDark({ data = {} }) {
  const heading = data.heading || "A Living Tradition in a Modern World";
  const narrative = data.narrative || "Our heritage is measured not just in years, but in the trust of our clients, the dedication of our master artisans, and the timeless spaces we help create around the world.";
  const linkText = data.linkText || "Our Impact";
  const linkHref = data.linkHref || "/our-world";
  const stats = Array.isArray(data.stats) && data.stats.length > 0 ? data.stats : defaultStatsList;
  const rawArtwork = data.artworkSrc || "/images/creations/krishna-alcove.webp";
  const artworkSrc = getImageVariantUrl(rawArtwork, "display") || rawArtwork;

  return (
    <section className={styles.darkImpactSection} aria-label="Brand Heritage Impact and Living Tradition">
      <Container>
        <div className={styles.darkImpactGrid}>
          {/* Left Column: Living Tradition Narrative */}
          <div className={styles.darkNarrativeCol}>
            <ScrollReveal animation="fade-up">
              <span className={styles.darkEyebrow}>A LIVING TRADITION</span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={80}>
              <h2 className={styles.darkHeading}>{heading}</h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120}>
              <p className={styles.darkText}>{narrative}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <Link href={linkHref} className={styles.darkLink}>
                <span>{linkText}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </ScrollReveal>
          </div>

          {/* Center Column: 4 Dominant Heritage Stats */}
          <div className={styles.darkStatsGrid}>
            {stats.map((stat, idx) => (
              <ScrollReveal key={stat.value || idx} animation="fade-up" delay={idx * 60}>
                <div className={styles.darkStatItem}>
                  <div className={styles.darkStatIcon} aria-hidden="true">
                    {defaultStatIcons[idx % defaultStatIcons.length]}
                  </div>
                  <span className={styles.darkStatValue}>{stat.value}</span>
                  <span className={styles.darkStatLabel}>{stat.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Right Column: Illuminated Sculpture Silhouette (Desktop) */}
          <div className={styles.darkArtworkCol}>
            <Image
              src={artworkSrc}
              alt={data.artworkAlt || "Illuminated hand-carved stone sculpture from Jaipur Stonecraft atelier"}
              fill
              unoptimized
              sizes="(max-width: 991px) 100vw, 25vw"
              className={styles.darkArtworkImage}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
