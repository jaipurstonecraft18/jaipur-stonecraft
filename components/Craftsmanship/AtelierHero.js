import Image from "next/image";
import Container from "@/components/Container/Container";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./AtelierHero.module.css";

export default function AtelierHero({ data = {} }) {
  const eyebrow = data.eyebrow || "JAIPUR ATELIER & MASONRY";
  const heading = data.heading || "From Raw Stone to Finished Art";
  const description = data.description || "Inside our Jaipur workshop, generational carvers transform solid Makrana marble monoliths and regional sandstones into divine sculptures, temple architecture, and architectural elements using hand mallets and steel chisels.";
  const imageSrc = data.heroImageSrc || "/images/craftsmanship/artisan-hands.webp";

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
              <span className={styles.eyebrow}>{eyebrow}</span>
              <h1 className={styles.heading}>{heading}</h1>
              <div className={styles.editorialDivider} aria-hidden="true">
                <div className={styles.dividerLine} />
                <div className={styles.dividerDiamond}>◆</div>
                <div className={styles.dividerLine} />
              </div>
              <p className={styles.description}>{description}</p>
              <div className={styles.storyCallout}>
                <span className={styles.calloutBadge}>TRADITION</span>
                <p className={styles.calloutText}>
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
                  src={imageSrc}
                  alt={heading || "Master sculptor hands chiseling white marble in Jaipur Stonecraft workshop"}
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
