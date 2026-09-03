import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./HandChiselingStage.module.css";

const toolSet = [
  { name: "Point Chisel (Tanki)", use: "Roughing out major monolith volume & mass reduction." },
  { name: "Flat Chisel (Chheni)", use: "Precision planes, straight architectural edges, and smooth relief contours." },
  { name: "Claw Chisel (Kanda)", use: "Texture mapping & organic stone surface gradient control." },
  { name: "Wooden Mallet (Mugri)", use: "Delicate force distribution to protect crystalline marble structure." },
];

export default function HandChiselingStage({ heroImageSrc, subImageSrc, data = {} }) {
  const eyebrow = data.eyebrow || "PURE HANDCRAFTED PRECISION";
  const heading = data.heading || "Generational Hand Chiseling";
  const quote = data.quote || "Stone has a natural grain and heartbeat. A machine cuts with raw force, but a master mason listens to the stone to release the form sleeping inside.";
  const quoteAuthor = data.quoteAuthor || "— Master Carver, Jaipur Atelier";
  const paragraphs = data.narrative
    ? data.narrative.split("\n\n").filter(Boolean)
    : [
        "Our carving process relies entirely on traditional manual tools: tempered steel points, flat chisels, claw chisels, and heavy wooden mallets.",
        "By holding traditional hand chisels, our master masons retain direct tactile feedback from the stone. Every strike responds to the natural calcite grain, creating organic depth and delicate shadow contours that high-speed automated machinery simply cannot duplicate.",
        "Architectural columns, deity statues, and intricate wall panels are carved centimeter by centimeter, referencing original scale templates at every stage of depth reduction."
      ];

  return (
    <section id="stage-03" className={styles.stageSection} aria-label="Stage 03: Hand Chiseling">
      <Container>
        {/* Stage Header Indicator */}
        <div className={styles.stageHeader}>
          <div className={styles.markerBadge}>
            <span className={styles.markerNum}>03</span>
            <span className={styles.markerLine} aria-hidden="true" />
            <span className={styles.markerText}>GENERATIONAL HAND CARVING</span>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Content */}
          <ScrollReveal animation="fade-up">
            <div className={styles.contentCol}>
              <span className={styles.eyebrow}>{eyebrow}</span>
              <h2 className={styles.heading}>{heading}</h2>

              <div className={styles.narrativeText}>
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Master Sculptor Quote Box */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteMark} aria-hidden="true">&ldquo;</div>
                <blockquote className={styles.quoteText}>
                  {quote}
                </blockquote>
                <div className={styles.quoteAuthor}>{quoteAuthor}</div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Dual Staggered Visual Showcase */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.visualCol}>
              <div className={styles.mainImageFrame}>
                <Image
                  src={heroImageSrc || "/images/hero/hero-krishna-artisan.jpg"}
                  alt="Master artisan chiseling white marble statue in Jaipur workshop"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className={styles.heroImage}
                  priority
                />
              </div>

              <div className={styles.staggeredImageFrame}>
                <Image
                  src={subImageSrc || "/images/craftsmanship/step-02-shape-precision.jpg"}
                  alt="Artisan hands chiseling initial contours into white marble block"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 80vw, 30vw"
                  className={styles.subImage}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Hand Tools Showcase Grid */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className={styles.toolsSection}>
            <h3 className={styles.toolsHeading}>Traditional Atelier Toolset</h3>
            <div className={styles.toolsGrid}>
              {toolSet.map((tool) => (
                <div key={tool.name} className={styles.toolCard}>
                  <div className={styles.toolHeader}>
                    <span className={styles.toolDot} aria-hidden="true" />
                    <h4 className={styles.toolName}>{tool.name}</h4>
                  </div>
                  <p className={styles.toolUse}>{tool.use}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
