import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./BlueprintModelingStage.module.css";

export default function BlueprintModelingStage({ data = {} }) {
  const eyebrow = data.eyebrow || "PROPORTION & ANATOMICAL ACCURACY";
  const heading = data.heading || "From CAD Draft to Chalk Grid";
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
          {/* Left Blueprint Diagram Frame */}
          <ScrollReveal animation="fade-up">
            <div className={styles.blueprintFrame}>
              {/* Architectural Grid Background Overlay */}
              <div className={styles.gridOverlay} aria-hidden="true">
                <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="architecturalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4A359" strokeWidth="0.5" strokeOpacity="0.15" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#architecturalGrid)" />
                  {/* Center Line and Measurement Notches */}
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#D4A359" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#D4A359" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
                  <circle cx="50%" cy="50%" r="80" stroke="#D4A359" strokeWidth="1" strokeOpacity="0.25" />
                  <circle cx="50%" cy="50%" r="140" stroke="#D4A359" strokeWidth="0.8" strokeOpacity="0.15" />
                </svg>
              </div>

              {/* Blueprint Content Info */}
              <div className={styles.blueprintInner}>
                <div className={styles.blueprintTag}>
                  <span>CAD SPECIFICATION 1:1</span>
                  <span>JAIPUR ATELIER</span>
                </div>
                <h3 className={styles.blueprintTitle}>Full-Scale Chalk Matrix</h3>
                <p className={styles.blueprintSub}>
                  Architectural elevation grids and 1:1 scale chalk lines mapped directly onto stone monolith faces.
                </p>

                <div className={styles.specsList}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>BLUEPRINT TOLERANCE</span>
                    <span className={styles.specValue}>&plusmn;0.5 mm</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>MODELING METHOD</span>
                    <span className={styles.specValue}>1:1 Clay Maquette</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>MAPPING TOOL</span>
                    <span className={styles.specValue}>Plumb Line & Calipers</span>
                  </div>
                </div>
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
