"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./TransformationPathway.module.css";

const transformationNodes = [
  {
    id: "raw-stone",
    step: "01",
    label: "RAW STONE",
    title: "The Uncarved Monolith",
    description: "Extracted from Nagaur & Bharatpur quarries, raw white Makrana marble blocks carry age-old crystalline purity before entering our Jaipur workshop.",
    imageSrc: "/images/craftsmanship/step-01-select-stone.jpg",
    alt: "Raw white marble stone blocks stacked in quarry",
    masonQuote: "In every block of raw Makrana marble, a sculpture is already waiting. Our duty is simply to remove what does not belong.",
  },
  {
    id: "artisan-hand",
    step: "02",
    label: "ARTISAN HAND",
    title: "Chalk Grids & Blueprint Alignment",
    description: "Master carvers translate 2D architectural CAD drawings directly onto stone faces using plumb lines, hand calipers, and chalk grids.",
    imageSrc: "/images/hero/hero-krishna-artisan.jpg",
    alt: "Master artisan aligning chalk grid lines on marble statue",
    masonQuote: "The chalk grid is where architectural precision meets artisan intuition.",
  },
  {
    id: "emerging-form",
    step: "03",
    label: "EMERGING FORM",
    title: "Roughing Out Mass & Contour",
    description: "Tempered steel point chisels strike away major stone volume, revealing the initial silhouette and structural weight of the sculpture.",
    imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg",
    alt: "Artisan hands chiseling initial contours into white marble",
    masonQuote: "Rough chiseling requires confidence and strength. One misplaced blow can fracture a block.",
  },
  {
    id: "sacred-detail",
    step: "04",
    label: "SACRED DETAIL",
    title: "Sculpting Facial Grace & Friezes",
    description: "Micro-chisels and fine rasps outline delicate eyes, serene lips, crown ornaments, and organic floral drape curves.",
    imageSrc: "/images/craftsmanship/step-03-refine-details.jpg",
    alt: "Master carver chiseling intricate deity facial expressions",
    masonQuote: "Facial expressions cannot be rushed. It takes hours of quiet chiseling to capture divine peace in stone.",
  },
  {
    id: "finished-art",
    step: "05",
    label: "FINISHED ART",
    title: "Water-Honed Sacred Masterpiece",
    description: "Polished with natural water stones to reveal translucent calcite luster, inspect-certified, and framed for global transit.",
    imageSrc: "/images/brand/heritage-ganesha.jpg",
    alt: "Completed white marble Ganesha murti masterpiece",
    masonQuote: "When water washes off the final stone dust and the marble shines in the sunlight, the piece is born.",
  },
];

export default function TransformationPathway() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeNode = transformationNodes[activeIdx];

  return (
    <section className={styles.section} aria-label="Transformation Pathway">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.header}>
            <span className={styles.eyebrow}>METAMORPHOSIS OF STONE</span>
            <h2 className={styles.heading}>The Atelier Transformation Pathway</h2>
            <p className={styles.subHeading}>
              Experience how raw quarry stone evolves into a sacred architectural creation 
              through five distinct physical states of craftsmanship.
            </p>
          </div>
        </ScrollReveal>

        {/* Connected Step Node Track */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className={styles.trackContainer}>
            <div className={styles.connectingLine} aria-hidden="true" />
            <div className={styles.nodesWrapper}>
              {transformationNodes.map((node, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`${styles.nodeBtn} ${isActive ? styles.activeNode : ""}`}
                    aria-selected={isActive}
                  >
                    <div className={styles.nodeCircle}>
                      <span>{node.step}</span>
                    </div>
                    <span className={styles.nodeLabel}>{node.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Transformation Stage Showcase Card */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className={styles.showcaseCard}>
            <div className={styles.showcaseGrid}>
              {/* Left Image Feature */}
              <div className={styles.imageCol}>
                <div className={styles.imageFrame}>
                  <Image
                    src={activeNode.imageSrc}
                    alt={activeNode.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className={styles.showcaseImage}
                    priority
                  />
                  <div className={styles.stepBadge}>
                    <span>STAGE {activeNode.step} OF 05</span>
                  </div>
                </div>
              </div>

              {/* Right Content & Mason Wisdom Quote */}
              <div className={styles.contentCol}>
                <span className={styles.stageCategory}>{activeNode.label}</span>
                <h3 className={styles.stageTitle}>{activeNode.title}</h3>
                <p className={styles.stageDesc}>{activeNode.description}</p>

                {/* Tactile Mason Quote */}
                <div className={styles.quoteBox}>
                  <div className={styles.quoteMark} aria-hidden="true">&ldquo;</div>
                  <p className={styles.quoteText}>{activeNode.masonQuote}</p>
                </div>

                {/* Stage Navigation Controls */}
                <div className={styles.controlsRow}>
                  <button
                    onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                    disabled={activeIdx === 0}
                    className={styles.navArrowBtn}
                    aria-label="Previous Transformation Stage"
                  >
                    &larr; Previous Stage
                  </button>
                  <span className={styles.stepCounter}>
                    {activeIdx + 1} / {transformationNodes.length}
                  </span>
                  <button
                    onClick={() => setActiveIdx((prev) => Math.min(transformationNodes.length - 1, prev + 1))}
                    disabled={activeIdx === transformationNodes.length - 1}
                    className={styles.navArrowBtn}
                    aria-label="Next Transformation Stage"
                  >
                    Next Stage &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
