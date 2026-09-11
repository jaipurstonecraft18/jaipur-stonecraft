import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

export default function StoryFutureSection({ data = {} }) {
  const chapter = data.chapter || "CHAPTER 06";
  const heading = data.heading || "Carving Indian Heritage for the World";
  const narrative = data.subcopy || "We envision a future where the timeless stone artistry of Rajasthan continues to inspire architectural, sacred, and cultural spaces across the globe — creating meaningful, enduring monuments in natural stone.";
  const linkText = data.linkText || "Our Vision";
  const linkHref = data.linkHref || "/contact?type=custom";
  const rawImage = data.imageSrc || "/images/collections/temples-architectural.webp";
  const imageSrc = getImageVariantUrl(rawImage, "display") || rawImage;
  const visionStatement = data.visionStatement || "A Global Bridge for Master Indian Stonework";

  return (
    <section id="chapter-06" className={styles.futureSection} aria-label="Chapter 06: Carving Indian Heritage for the World">
      <Container>
        <div className={styles.futureGrid}>
          {/* Left Column: Chapter Narrative */}
          <div className={styles.futureContentCol}>
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

          {/* Right Column: Monumental Temple Photo with Vignette Statement */}
          <div className={styles.futureVisualWrap}>
            <ScrollReveal animation="fade-up" delay={120}>
              <Image
                src={imageSrc}
                alt={data.imageAlt || "Grand hand-carved stone temple architecture and shikhara"}
                fill
                unoptimized
                sizes="(max-width: 991px) 100vw, 55vw"
                className={styles.futureImage}
              />
              <div className={styles.futureQuoteOverlay}>
                <p className={styles.futureQuoteText}>{visionStatement}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
