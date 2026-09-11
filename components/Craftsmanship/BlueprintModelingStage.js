import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./BlueprintModelingStage.module.css";

export default function BlueprintModelingStage({ imageSrc, data = {} }) {
  const eyebrow = data.eyebrow || "PROPORTION & ANATOMICAL ACCURACY";
  const heading = data.heading || "From CAD Draft to Chalk Grid";
  const rawImage = imageSrc || data.imageSrc || "/images/craftsmanship/stage-02-blueprint-grid.jpg";
  const finalImageSrc = getImageVariantUrl(rawImage, "display") || rawImage;
  const paragraphs = data.narrative
    ? data.narrative.split("\n\n").filter(Boolean)
    : [
        "Before a chisel touches the stone, our master carvers collaborate with client architects and interior design teams. We translate architectural CAD blueprints and hand sketches into full-scale physical grid lines mapped directly across the stone monolith face.",
        "For complex custom commissions—such as bespoke deity statues, ornate Jali screens, or architectural temple columns—artisans hand-sculpt a full 1:1 clay maquette model first.",
        "This physical modeling stage allows client approval of subtle facial expressions, crown proportions, and drape folds before stone cutting begins."
      ];

  return (
    <section id="stage-02" className={styles.stageSection} aria-label="Stage 02: Design & Modeling">
      <Container>
        {/* Stage Header Indicator */}
        <div className={styles.stageHeader}>
          <div className={styles.markerBadge}>
            <span className={styles.markerNum}>02</span>
            <span className={styles.markerLine} aria-hidden="true" />
            <span className={styles.markerText}>BLUEPRINT MAPPING & MODELING</span>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Blueprint Photograph Frame */}
          <ScrollReveal animation="fade-up">
            <div className={styles.blueprintFrame}>
              <Image
                src={finalImageSrc}
                alt={data.imageAlt || "Master stone sculptor drafting technical CAD blueprint and chalk grid measurements onto raw marble"}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className={styles.blueprintImage}
              />
              <div className={styles.imageOverlayBadge}>
                <span className={styles.badgeSub}>CAD SPECIFICATION 1:1</span>
                <span className={styles.badgeTitle}>Full-Scale Chalk Matrix</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Narrative */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.contentCol}>
              <span className={styles.eyebrow}>{eyebrow}</span>
              <h2 className={styles.heading}>{heading}</h2>
              
              <div className={styles.narrativeText}>
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className={styles.stepsList}>
                <div className={styles.stepPoint}>
                  <span className={styles.stepBullet}>A</span>
                  <div>
                    <h4 className={styles.stepPointTitle}>2D Blueprint Conversion</h4>
                    <p className={styles.stepPointDesc}>CAD files scaled to physical block dimensions.</p>
                  </div>
                </div>
                <div className={styles.stepPoint}>
                  <span className={styles.stepBullet}>B</span>
                  <div>
                    <h4 className={styles.stepPointTitle}>Clay Maquette Validation</h4>
                    <p className={styles.stepPointDesc}>3D clay bust sculpted to confirm depth and shadow.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
