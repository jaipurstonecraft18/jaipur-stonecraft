"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./InspectionHoningStage.module.css";

const auditChecklist = [
  {
    id: "dim",
    title: "1. Dimensional Blueprint Tolerance",
    summary: "Verification against architectural CAD blueprints.",
    details: "Master masons measure edge lengths, diagonal symmetry, and carved depth against original CAD blueprints to ensure a maximum tolerance variance of ±0.5mm."
  },
  {
    id: "struct",
    title: "2. Structural Integrity & Micro-Vein Audit",
    summary: "Checking for internal fissures and stress fractures.",
    details: "Every carved piece undergoes acoustic resonance and visual surface inspection under high-intensity lamps to verify zero hairline cracks exist."
  },
  {
    id: "seal",
    title: "3. Hydrophobic Sealing & Stain Guard",
    summary: "Breathable water honeycomb protective sealer.",
    details: "For marble bathtubs, pedestal basins, and dining tables, food-safe invisible penetrating stone sealer is applied to prevent water spots and oil stains."
  },
  {
    id: "bevel",
    title: "4. Edge Fillet & Tactile Beveling",
    summary: "Hand-honed radius edges for tactile safety.",
    details: "All exposed arrises and corners are hand-beveled with fine silicon carbide stones to eliminate sharp edges while retaining crisp architectural lines."
  }
];

export default function InspectionHoningStage() {
  const [openId, setOpenId] = useState("dim");

  return (
    <section id="stage-05" className={styles.stageSection} aria-label="Stage 05: Inspection & Honing">
      <Container>
        {/* Stage Header Indicator */}
        <div className={styles.stageHeader}>
          <div className={styles.markerBadge}>
            <span className={styles.markerNum}>05</span>
            <span className={styles.markerLine} aria-hidden="true" />
            <span className={styles.markerText}>HONING & QUALITY INSPECTION</span>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Visual Image */}
          <ScrollReveal animation="fade-up">
            <div className={styles.imageCol}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/craftsmanship/step-04-polish-perfection.jpg"
                  alt="Hand polishing smooth white marble sculpture surface with water in Jaipur"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className={styles.stageImage}
                />
                <div className={styles.imageBadge}>
                  <span className={styles.imageBadgeLabel}>Water Stone Honing</span>
                  <span className={styles.imageBadgeSub}>Natural Silicon Carbide Stones</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Narrative & Interactive Checklist */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.contentCol}>
              <span className={styles.eyebrow}>SURFACE HONING & VERIFICATION</span>
              <h2 className={styles.heading}>Honing & Quality Inspection</h2>

              <div className={styles.narrativeText}>
                <p>
                  After carving, stone surfaces are honed by hand using progress-graded water stones—moving 
                  from coarse 120-grit up to 1200-grit smooth emery.
                </p>
                <p>
                  This natural water-honing process highlights the organic depth and translucent calcite 
                  luminosity of Makrana marble without using artificial wax or chemical lacquer coatings.
                </p>
              </div>

              {/* Interactive Audit Accordion */}
              <div className={styles.accordionContainer}>
                <h3 className={styles.accordionTitle}>Atelier Quality Audit Checklist</h3>
                <div className={styles.accordionList}>
                  {auditChecklist.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                      <div 
                        key={item.id} 
                        className={`${styles.accordionItem} ${isOpen ? styles.open : ""}`}
                      >
                        <button
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                          className={styles.accordionBtn}
                          aria-expanded={isOpen}
                        >
                          <span className={styles.itemTitle}>{item.title}</span>
                          <span className={styles.accordionIcon} aria-hidden="true">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className={styles.accordionBody}>
                            <p>{item.details}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
