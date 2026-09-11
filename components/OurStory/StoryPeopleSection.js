import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

export default function StoryPeopleSection({ data = {} }) {
  const chapter = data.chapter || "CHAPTER 03";
  const heading = data.heading || "The People Behind the Name";
  const narrative = data.narrative || "Our strength lies in our people — the generational carvers, master sculptors, and devoted workshop teams in Jaipur. Behind every sacred deity, high-relief mural, and architectural pillar is decades of shared experience, patience, and human pride in carrying forward an ancient artistic lineage.";
  const linkText = data.linkText || "Meet Our Artisans";
  const linkHref = data.linkHref || "/craftsmanship";
  const rawImage = data.imageSrc || "/images/craftsmanship/artisan-hands.webp";
  const imageSrc = getImageVariantUrl(rawImage, "display") || rawImage;
  const emphasisText = data.emphasisText || "Generations of devotion, patience, and skilled hands in our Jaipur workshop.";

  return (
    <section id="chapter-03" className={styles.peopleSection} aria-label="Chapter 03: The People Behind the Name">
      <Container>
        <div className={styles.peopleGrid}>
          {/* Left Column: Hands of the Master Carver */}
          <div className={styles.peopleVisual}>
            <ScrollReveal animation="fade-up">
              <div className={styles.peopleImageFrame}>
                <Image
                  src={imageSrc}
                  alt={data.imageAlt || "Jaipur Stonecraft master artisan hands holding steel chisel"}
                  fill
                  unoptimized
                  sizes="(max-width: 991px) 100vw, 35vw"
                  className={styles.peopleImage}
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Center Column: People Story */}
          <div className={styles.peopleContent}>
            <ScrollReveal animation="fade-up" delay={80}>
              <span className={styles.chapterEyebrow}>{chapter}</span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120}>
              <h2 className={styles.chapterHeading}>{heading}</h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <p className={styles.chapterText}>{narrative}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <Link href={linkHref} className={styles.editorialLink}>
                <span>{linkText}</span>
                <span className={styles.editorialLinkArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Emphasis Block (No Invented Quotes) */}
          <div className={styles.peopleQuoteCol}>
            <ScrollReveal animation="fade-up" delay={140}>
              <div className={styles.peopleEditorialQuote}>
                <p className={styles.peopleQuoteText}>{emphasisText}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
