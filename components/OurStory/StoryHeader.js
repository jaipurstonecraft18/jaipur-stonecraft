import Image from "next/image";
import Container from "@/components/Container/Container";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./OurStory.module.css";

export default function StoryHeader({ eyebrow, heading, subtitle, imageSrc }) {
  return (
    <section className={styles.headerSection}>
      <Container>
        <div className={styles.topBar}>
          <Breadcrumbs items={[{ label: "Our Story" }]} />
        </div>

        <div className={styles.heroGrid}>
          {/* Left Editorial Narrative */}
          <div className={styles.heroContent}>
            <ScrollReveal animation="fade-up">
              <span className={styles.eyebrow}>{eyebrow || "OUR HERITAGE & VISION"}</span>
              <h1 className={styles.title}>
                <span className={styles.desktopTitle}>{heading || "Generational Hands, Modern Vision"}</span>
                <span className={styles.mobileTitle}>
                  Generational Hands,<br />Modern Vision
                </span>
              </h1>
              <p className={styles.leadDescription}>
                <span className={styles.desktopDesc}>
                  {subtitle || "From historic stone hubs in Rajasthan to world-class architectural projects, our family's dedication to chiseling raw natural stone spans decades. Today, we bring this generational craft directly to global architects, sacred trusts, and private collectors without middleman distortion."}
                </span>
                <span className={styles.mobileDesc}>
                  From historic stone hubs in Rajasthan to world-class architectural sanctuaries, our family&apos;s dedication to chiseling raw natural stone spans generations.
                </span>
              </p>
            </ScrollReveal>
          </div>

          {/* Right Hero Image */}
          <div className={styles.heroVisual}>
            <ScrollReveal animation="fade-up" delay={150}>
              <div className={styles.heroImageFrame}>
                <Image
                  src={imageSrc || "/images/collections/hero-sculptures-group.webp"}
                  alt="Jaipur Stonecraft white marble goddess sculpture carved by master artisan"
                  fill
                  priority
                  sizes="(max-width: 991px) 100vw, 45vw"
                  className={styles.heroImage}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
