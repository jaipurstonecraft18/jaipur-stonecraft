import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ExportLogisticsStage.module.css";

const crateFeatures = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "ISPM 15 Fumigated Timber",
    desc: "Export-certified heat-treated wooden framing for smooth customs clearance worldwide."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "High-Density Foam Lining",
    desc: "Custom-contoured shock absorbing inserts preventing movement or corner impact."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
      </svg>
    ),
    title: "Moisture Barrier Wrapping",
    desc: "Sealed anti-humidity foil shielding stone surfaces during ocean freight transit."
  }
];

export default function ExportLogisticsStage({ data = {} }) {
  const eyebrow = data.eyebrow || "CRATING & SHIPMENT PROTECTION";
  const heading = data.heading || "Custom Wooden Crate Packaging";
  const paragraphs = data.narrative
    ? data.narrative.split("\n\n").filter(Boolean)
    : [
        "Transporting heavy marble sculptures and carved architectural components around the globe requires uncompromising packaging standards.",
        "We build bespoke wooden crates for each finished creation. Stone elements are floating-braced inside dense shock-absorbing foam beds, ensuring zero surface contact with crate walls."
      ];

  return (
    <section id="stage-06" className={styles.stageSection} aria-label="Stage 06: Export Logistics">
      <Container>
        {/* Stage Header Indicator */}
        <div className={styles.stageHeader}>
          <div className={styles.markerBadge}>
            <span className={styles.markerNum}>06</span>
            <span className={styles.markerLine} aria-hidden="true" />
            <span className={styles.markerText}>SAFE INTERNATIONAL LOGISTICS</span>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Narrative */}
          <ScrollReveal animation="fade-up">
            <div className={styles.contentCol}>
              <span className={styles.eyebrow}>{eyebrow}</span>
              <h2 className={styles.heading}>{heading}</h2>
              
              <div className={styles.narrativeText}>
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className={styles.ctaGroup}>
                <Link href="/export" className={styles.exportBtn}>
                  <span>Explore Export & Shipping Guidelines</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Crate Features Grid */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.featuresCol}>
              <div className={styles.featuresGrid}>
                {crateFeatures.map((feat) => (
                  <div key={feat.title} className={styles.featureCard}>
                    <div className={styles.featureIcon}>{feat.icon}</div>
                    <h3 className={styles.featureTitle}>{feat.title}</h3>
                    <p className={styles.featureDesc}>{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
