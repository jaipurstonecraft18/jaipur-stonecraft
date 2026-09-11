import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

export default function StoryPlaceSection({ data = {} }) {
  const chapter = data.chapter || "CHAPTER 01";
  const heading = data.heading || "Born in Rajasthan";
  const paragraph1 = data.paragraph1 || "Our story is deeply connected to the historic stone hubs of Rajasthan — a land where stone is more than a material; it is a part of culture, architecture and everyday life.";
  const paragraph2 = data.paragraph2 || "From the royal monuments of Jaipur to the quiet workshops of generational artisans, this region has nurtured an unbroken stonecraft tradition across centuries.";
  const linkText = data.linkText || "Our Roots in Rajasthan";
  const linkHref = data.linkHref || "/craftsmanship";
  const rawImage = data.imageSrc || "/images/collections/architectural.webp";
  const imageSrc = getImageVariantUrl(rawImage, "display") || rawImage;
  const overlayTitle = data.overlayTitle || "Living Heritage of Rajasthan Stone Art";

  return (
    <section id="chapter-01" className={styles.placeSection} aria-label="Chapter 01: Born in Rajasthan">
      <Container>
        <div className={styles.placeGrid}>
          {/* Left Column: Atmospheric Architectural Panorama with Editorial Caption */}
          <div className={styles.placeVisual}>
            <ScrollReveal animation="fade-up">
              <div className={styles.placeImageFrame}>
                <Image
                  src={imageSrc}
                  alt={data.imageAlt || "Historic Rajasthan stone architecture and royal temple colonnade"}
                  fill
                  unoptimized
                  sizes="(max-width: 991px) 100vw, 55vw"
                  className={styles.placeImage}
                />
                <div className={styles.placeQuoteOverlay}>
                  <p className={styles.placeQuoteText}>{overlayTitle}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Place Narrative */}
          <div className={styles.placeContent}>
            <ScrollReveal animation="fade-up" delay={80}>
              <span className={styles.chapterEyebrow}>{chapter}</span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120}>
              <h2 className={styles.chapterHeading}>{heading}</h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <p className={styles.chapterText}>{paragraph1}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className={styles.chapterText}>{paragraph2}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={240}>
              <Link href={linkHref} className={styles.editorialLink}>
                <span>{linkText}</span>
                <span className={styles.editorialLinkArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
