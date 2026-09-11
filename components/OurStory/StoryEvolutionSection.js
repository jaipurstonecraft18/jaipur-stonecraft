import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

export default function StoryEvolutionSection({ data = {} }) {
  const chapter = data.chapter || "CHAPTER 05";
  const heading = data.heading || "What We Kept. What We Changed.";
  const narrative = data.narrative || "We remain rooted in traditional handcraftsmanship, while embracing contemporary architectural design, international precision tolerances, and global collaborations. The result is a unique balance — ancestral heritage with a modern vision.";
  const linkText = data.linkText || "Our Evolution";
  const linkHref = data.linkHref || "/collections";

  const rawTraditional = data.traditionalImage || "/images/craftsmanship/step-02-shape-precision.webp";
  const traditionalSrc = getImageVariantUrl(rawTraditional, "display") || rawTraditional;

  const rawModern = data.modernImage || "/images/collections/architectural.webp";
  const modernSrc = getImageVariantUrl(rawModern, "display") || rawModern;

  return (
    <section id="chapter-05" className={styles.evolutionSection} aria-label="Chapter 05: What We Kept. What We Changed.">
      <Container>
        <div className={styles.evolutionGrid}>
          {/* Left Column: Evolution Narrative */}
          <div className={styles.evolutionContent}>
            <ScrollReveal animation="fade-up">
              <span className={styles.chapterEyebrow}>{chapter}</span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={80}>
              <h2 className={styles.chapterHeading}>{heading}</h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120}>
              <p className={styles.chapterText}>{narrative}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <Link href={linkHref} className={styles.editorialLink}>
                <span>{linkText}</span>
                <span className={styles.editorialLinkArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </ScrollReveal>
          </div>

          {/* Right Column: Comparative Side-by-Side Panels with Arrow */}
          <div className={styles.evolutionPanelsWrapper}>
            {/* Panel 1: Traditional Craft */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className={styles.evolutionPanel}>
                <div className={styles.evolutionImageFrame}>
                  <Image
                    src={traditionalSrc}
                    alt={data.traditionalAlt || "Traditional hand chiseling craftsmanship in Jaipur atelier"}
                    fill
                    unoptimized
                    sizes="(max-width: 991px) 100vw, 25vw"
                    className={styles.evolutionImage}
                  />
                </div>
                <span className={styles.evolutionPanelLabel}>{data.traditionalLabel || "OUR FOUNDATION"}</span>
                <h3 className={styles.evolutionPanelTitle}>{data.traditionalTitle || "Traditional Craft"}</h3>
              </div>
            </ScrollReveal>

            {/* Connecting Arrow */}
            <div className={styles.evolutionArrowCol} aria-hidden="true">
              &rarr;
            </div>

            {/* Panel 2: Contemporary Spaces */}
            <ScrollReveal animation="fade-up" delay={160}>
              <div className={styles.evolutionPanel}>
                <div className={styles.evolutionImageFrame}>
                  <Image
                    src={modernSrc}
                    alt={data.modernAlt || "Contemporary architectural stonework and monumental pavilions"}
                    fill
                    unoptimized
                    sizes="(max-width: 991px) 100vw, 25vw"
                    className={styles.evolutionImage}
                  />
                </div>
                <span className={styles.evolutionPanelLabel}>{data.modernLabel || "NEW POSSIBILITIES"}</span>
                <h3 className={styles.evolutionPanelTitle}>{data.modernTitle || "Contemporary Spaces"}</h3>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
