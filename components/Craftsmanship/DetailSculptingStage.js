import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./DetailSculptingStage.module.css";

export default function DetailSculptingStage({ facialImageSrc, jaliImageSrc, data = {} }) {
  const eyebrow = data.eyebrow || "FACIAL EXPRESSION & SACRED ICONOGRAPHY";
  const heading = data.heading || "Refining Serenity, Form & Detail";
  const introDesc = data.introDesc || "Once main volumes are carved, the sculpture enters its most delicate phase. Senior master carvers use micro-chisels and fine steel rasps to sculpt divine facial expressions, jewelry adornments, and organic floral drapery.";
  const facialDesc = data.facialDesc || "Facial features are sculpted following traditional Shilpa Shastra proportion canons. Gentle eye curvature, serene lips, and lotus crown details require steady hand control.";
  const jaliDesc = data.jaliDesc || "Pillar capitals, mantels, and perforated Jali screens are undercut by hand to permit natural light filtration and deep shadow relief.";

  return (
    <section id="stage-04" className={styles.stageSection} aria-label="Stage 04: Detail Sculpting">
      <Container>
        {/* Stage Header Indicator */}
        <div className={styles.stageHeader}>
          <div className={styles.markerBadge}>
            <span className={styles.markerNum}>04</span>
            <span className={styles.markerLine} aria-hidden="true" />
            <span className={styles.markerText}>REFINEMENT & FINE SCULPTING</span>
          </div>
        </div>

        <div className={styles.topIntro}>
          <ScrollReveal animation="fade-up">
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.heading}>{heading}</h2>
            <p className={styles.introDesc}>{introDesc}</p>
          </ScrollReveal>
        </div>

        {/* Dual Editorial Card Grid */}
        <div className={styles.editorialGrid}>
          <ScrollReveal animation="fade-up">
            <div className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src={facialImageSrc || "/images/craftsmanship/step-03-refine-details.jpg"}
                  alt="Master carver chiseling intricate deity facial expressions in marble"
                  fill
                  unoptimized
                  sizes="(max-width: 991px) 100vw, 50vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardTag}>DEITY SCULPTURE</span>
                <h3 className={styles.cardTitle}>Sacred Facial Anatomy</h3>
                <p className={styles.cardDesc}>{facialDesc}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src={jaliImageSrc || "/images/craftsmanship/artisan-hands.png"}
                  alt="Artisan hands chiseling delicate relief motifs into stone"
                  fill
                  unoptimized
                  sizes="(max-width: 991px) 100vw, 50vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardTag}>ARCHITECTURAL FAÇADES</span>
                <h3 className={styles.cardTitle}>Ornate Jali & Floral Friezes</h3>
                <p className={styles.cardDesc}>{jaliDesc}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
