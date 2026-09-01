import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./MasterpieceBorn.module.css";

export default function MasterpieceBorn() {
  return (
    <section id="stage-07" className={styles.stageSection} aria-label="Stage 07: Masterpiece Born">
      <Container>
        {/* Stage Header Indicator */}
        <div className={styles.stageHeader}>
          <div className={styles.markerBadge}>
            <span className={styles.markerNum}>07</span>
            <span className={styles.markerLine} aria-hidden="true" />
            <span className={styles.markerText}>THE FINISHED CREATION</span>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Masterpiece Image Frame */}
          <ScrollReveal animation="fade-up">
            <div className={styles.imageCol}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/brand/heritage-ganesha.jpg"
                  alt="Completed white marble Ganesha murti masterpiece by Jaipur Stonecraft"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className={styles.masterpieceImage}
                  priority
                />
                <div className={styles.imageBadge}>
                  <span className={styles.imageBadgeTitle}>Completed Atelier Piece</span>
                  <span className={styles.imageBadgeSub}>White Makrana Marble Murti</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Editorial Conclusion & Inquiry CTAs */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.contentCol}>
              <span className={styles.eyebrow}>DEVOTION IN STONE</span>
              <h2 className={styles.heading}>A Masterpiece Born for Generations</h2>

              <div className={styles.narrativeText}>
                <p>
                  From quarry monolith to finished art, the journey through our atelier represents 
                  hundreds of hours of focused hand chiseling, blueprint alignment, and water-stone honing.
                </p>
                <p>
                  Whether sculpting a sacred deity idol, an architectural column, or a bespoke stone mantel, 
                  our promise remains constant: 100% handcrafted craftsmanship carrying timeless grace.
                </p>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionGroup}>
                <Link href="/contact?type=custom" className={styles.primaryCta}>
                  <span>Start a Custom Project</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link href="/collections" className={styles.secondaryCta}>
                  <span>Explore Collections</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
