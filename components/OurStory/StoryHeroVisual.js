import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./OurStory.module.css";

export default function StoryHeroVisual({ imageSrc, imageAlt }) {
  const finalImageSrc = imageSrc || "/images/craftsmanship/artisan-hands.png";
  const finalAlt = imageAlt || "Artisan hands carving white marble statue with traditional chisel in Jaipur Stonecraft workshop";

  return (
    <section className={styles.visualSection} aria-label="Artisan Hands at Work">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.visualFrame}>
            <div className={styles.visualImageContainer}>
              <Image
                src={finalImageSrc}
                alt={finalAlt}
                fill
                sizes="(max-width: 1200px) 100vw, 1100px"
                className={styles.visualImage}
                priority
              />
            </div>
            <div className={styles.visualCaptionOverlay}>
              <span className={styles.captionText}>Master Sculptor Chiseling Makrana White Marble</span>
              <span className={styles.captionLocation}>Jaipur Atelier Workshop &bull; Rajasthan</span>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
