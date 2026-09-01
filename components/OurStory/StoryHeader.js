import Image from "next/image";
import Container from "@/components/Container/Container";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./OurStory.module.css";

export default function StoryHeader({ eyebrow, heading, subtitle, imageSrc }) {
  return (
    <header className={styles.headerSection}>
      <Container>
        <div className={styles.topBar}>
          <Breadcrumbs items={[{ label: "Our Story" }]} />
        </div>

        <div className={styles.heroGrid}>
          {/* Left Editorial Narrative */}
          <div className={styles.heroContent}>
            <ScrollReveal animation="fade-up">
              <span className={styles.eyebrow}>{eyebrow || "OUR STORY"}</span>
              <h1 className={styles.title}>{heading || "Generational Hands, Modern Vision"}</h1>
              <p className={styles.leadDescription}>
                {subtitle || "From historic stone hubs in Rajasthan to world-class architectural projects, our family's dedication to chiseling raw natural stone spans decades. Today, we bring this generational craft directly to global architects, sacred trusts, and private collectors without middleman distortion."}
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
                  unoptimized
                  priority
                  sizes="(max-width: 991px) 100vw, 45vw"
                  className={styles.heroImage}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </header>
  );
}
