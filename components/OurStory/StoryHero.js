import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

export default function StoryHero({ data = {} }) {
  const eyebrow = data.eyebrow || "OUR STORY";
  const title = data.heading || "A Story Written in Stone";
  const lead = data.subtitle || "Rooted in Rajasthan. Shaped by generations. Carried forward for tomorrow.";
  const ctaText = data.ctaText || "Our Journey";
  const ctaHref = data.ctaHref || "#chapter-01";
  const rawImage = data.imageSrc || "/images/hero/hero-krishna-artisan.webp";
  const imageSrc = getImageVariantUrl(rawImage, "display") || rawImage;

  return (
    <section className={styles.heroSection} aria-label="Our Story — Jaipur Stonecraft">
      <Container>
        <div className={styles.heroGrid}>
          {/* Left Column: Editorial Headline & Narrative */}
          <div className={styles.heroContent}>
            <ScrollReveal animation="fade-up">
              <span className={styles.heroEyebrow}>{eyebrow}</span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={80}>
              <h1 className={styles.heroTitle}>{title}</h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120}>
              <div className={styles.heroRule} aria-hidden="true" />
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <p className={styles.heroLead}>{lead}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={220}>
              <Link href={ctaHref} className={styles.heroCta}>
                <span>{ctaText}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </ScrollReveal>
          </div>

          {/* Right Column: Master Artisan Portrait */}
          <div className={styles.heroVisual}>
            <ScrollReveal animation="fade-up" delay={150}>
              <div className={styles.heroImageFrame}>
                <Image
                  src={imageSrc}
                  alt={data.imageAlt || "Jaipur Stonecraft master artisan carving white marble with hammer and chisel"}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 991px) 100vw, 50vw"
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
