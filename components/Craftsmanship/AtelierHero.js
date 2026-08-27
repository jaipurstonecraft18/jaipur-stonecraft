import Image from "next/image";
import Container from "@/components/Container/Container";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./AtelierHero.module.css";

export default function AtelierHero() {
  return (
    <section className={styles.heroSection}>
      <Container>
        {/* Top Navigation Breadcrumbs */}
        <div className={styles.topBar}>
          <Breadcrumbs items={[{ label: "Craftsmanship" }]} />
        </div>

        {/* Visual-First Editorial Split Layout */}
        <div className={styles.heroGrid}>
          {/* Left Column: Heading & Atelier Story */}
          <div className={styles.contentCol}>
            <ScrollReveal animation="fade-up">
              <span className={styles.eyebrow}>JAIPUR ATELIER & MASONRY</span>
              <h1 className={styles.heading}>From Raw Stone to Finished Art</h1>
              <p className={styles.leadDescription}>
                Inside our Jaipur workshop, generational carvers transform solid Makrana marble 
                monoliths and regional sandstones into divine sculptures, temple architecture, 
                and architectural elements using hand mallets and steel chisels.
              </p>
              
              <div className={styles.atelierNote}>
                <span className={styles.noteLine} aria-hidden="true" />
                <p className={styles.noteText}>
                  Follow the physical journey of stone through raw selection, chalk grid mapping, 
                  generational chiseling, and export packaging.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Strong Workshop Visual */}
          <div className={styles.visualCol}>
            <ScrollReveal animation="fade-up" delay={150}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/craftsmanship/artisan-hands.png"
                  alt="Master sculptor hands chiseling white marble in Jaipur Stonecraft workshop"
                  fill
                  sizes="(max-width: 991px) 100vw, 45vw"
                  className={styles.heroImage}
                  priority
                />
                <div className={styles.imageOverlayBadge}>
                  <div className={styles.badgeDot} aria-hidden="true" />
                  <div>
                    <span className={styles.badgeTitle}>HAND CARVED IN JAIPUR</span>
                    <span className={styles.badgeSub}>Master Artisan Hands at Work</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
