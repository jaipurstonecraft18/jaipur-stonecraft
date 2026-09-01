import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./StoneSourcingStage.module.css";

const stoneTypes = [
  {
    name: "Makrana White Marble",
    origin: "Nagaur District, Rajasthan",
    characteristics: "98%+ pure crystalline calcite, non-porous structure, age-resistant high luster.",
    colorAccent: "#F2EFE9",
    borderAccent: "#DCD6CB",
  },
  {
    name: "Bansi Paharpur Pink Sandstone",
    origin: "Bharatpur District, Rajasthan",
    characteristics: "Warm terracotta-rose grain, exceptional weather durability for temples and arches.",
    colorAccent: "#E5BBB0",
    borderAccent: "#D09E93",
  },
  {
    name: "Dholpur Beige Sandstone",
    origin: "Dholpur District, Rajasthan",
    characteristics: "Uniform beige-biscuit texture, ideal for detailed relief carving and Jali screens.",
    colorAccent: "#E7D8C4",
    borderAccent: "#D1BFAB",
  },
];

export default function StoneSourcingStage() {
  return (
    <section id="stage-01" className={styles.stageSection} aria-label="Stage 01: Stone Selection">
      <Container>
        {/* Stage Header Indicator */}
        <div className={styles.stageHeader}>
          <div className={styles.markerBadge}>
            <span className={styles.markerNum}>01</span>
            <span className={styles.markerLine} aria-hidden="true" />
            <span className={styles.markerText}>RAW MATERIAL SELECTION</span>
          </div>
        </div>

        {/* Stage Main Layout */}
        <div className={styles.mainGrid}>
          {/* Left Editorial Narrative */}
          <ScrollReveal animation="fade-up">
            <div className={styles.contentCol}>
              <span className={styles.eyebrow}>QUARRY SELECTION & MINERAL INTEGRITY</span>
              <h2 className={styles.heading}>Selecting the Solid Block</h2>
              
              <div className={styles.narrativeText}>
                <p>
                  Every lasting sculpture begins at the quarry face. We source raw blocks of white Makrana marble, 
                  pink Bansi Paharpur sandstone, and Dholpur sandstone directly from historic quarries across Rajasthan.
                </p>
                <p>
                  Our senior quarry inspectors examine raw stone monoliths before extraction. We check each block 
                  for mineral density, hairline fractures, and structural stability. Only blocks completely free from 
                  internal stress lines are carted to our Jaipur workshop.
                </p>
              </div>

              {/* Technical Callout Box */}
              <div className={styles.technicalBox}>
                <div className={styles.techHeader}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                  <span className={styles.techTitle}>Block Audit Standard</span>
                </div>
                <p className={styles.techDesc}>
                  Density checks eliminate soft pockets or iron deposits before carving begins. Zero unverified blocks enter our studio.
                </p>
              </div>

              <div className={styles.ctaLinkGroup}>
                <Link href="/our-story" className={styles.storyLink}>
                  <span>Read About Our Heritage Sourcing</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Visual Image */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.imageCol}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/craftsmanship/step-01-select-stone.jpg"
                  alt="Raw white marble quarry stone blocks selected in Rajasthan"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className={styles.stageImage}
                  priority
                />
                <div className={styles.imageBadge}>
                  <span className={styles.imageBadgeLabel}>Quarry Inspection</span>
                  <span className={styles.imageBadgeSub}>Nagaur & Bharatpur Quarries</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Specimen Swatch Grid */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className={styles.swatchSection}>
            <h3 className={styles.swatchHeading}>Approved Atelier Stone Species</h3>
            <div className={styles.swatchGrid}>
              {stoneTypes.map((stone) => (
                <div key={stone.name} className={styles.swatchCard}>
                  <div className={styles.swatchColorHeader}>
                    <div 
                      className={styles.swatchCircle} 
                      style={{ backgroundColor: stone.colorAccent, borderColor: stone.borderAccent }}
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className={styles.swatchName}>{stone.name}</h4>
                      <span className={styles.swatchOrigin}>{stone.origin}</span>
                    </div>
                  </div>
                  <p className={styles.swatchDesc}>{stone.characteristics}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
