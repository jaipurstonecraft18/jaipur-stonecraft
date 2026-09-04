import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils";
import styles from "./HeritageStory.module.css";

export default function HeritageStory({ storyData }) {
  const eyebrow = storyData?.eyebrow || "ABOUT JAIPUR STONECRAFT";
  const heading = storyData?.heading || "Heritage of Indian Stone Art";
  const description = storyData?.paragraph1 || storyData?.description || "Jaipur Stonecraft brings together tradition, devotion and artistic excellence. For over four decades, we have been crafting exquisite marble and stone sculptures, temple art, fountains and custom creations that stand as symbols of faith, beauty and timeless craftsmanship.";
  const imgSrc = storyData?.imageSrc || "/images/brand/heritage-ganesha.webp";
  const imgAlt = "Hand-carved white marble Ganesha statue adorned with marigolds in Jaipur Stonecraft courtyard";

  return (
    <section className={styles.section} aria-label="About Jaipur Stonecraft">
      {/* Decorative Mandala Background Watermark SVG */}
      <div className={styles.mandalaWatermark} aria-hidden="true">
        <svg width="480" height="480" viewBox="0 0 200 200" fill="none" stroke="#B87B31" strokeWidth="0.5" strokeOpacity="0.12">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="70" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="30" />
          <path d="M100 10 L100 190 M10 100 L190 100 M36 36 L164 164 M36 164 L164 36" />
          <path d="M100 30 Q120 60 100 90 Q80 60 100 30Z" fill="#B87B31" fillOpacity="0.04" />
          <path d="M100 110 Q120 140 100 170 Q80 140 100 110Z" fill="#B87B31" fillOpacity="0.04" />
          <path d="M30 100 Q60 120 90 100 Q60 80 30 100Z" fill="#B87B31" fillOpacity="0.04" />
          <path d="M110 100 Q140 120 170 100 Q140 80 110 100Z" fill="#B87B31" fillOpacity="0.04" />
        </svg>
      </div>

      <Container>
        <div className={styles.grid}>
          {/* Left Column: Rounded Ganesha Artwork Image Card */}
          <ScrollReveal animation="fade-up" className={styles.imageCol}>
            <div className={styles.imageCard}>
              <Image
                src={getImageVariantUrl(imgSrc, "display")}
                alt={imgAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={styles.image}
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          {/* Right Column: Editorial Narrative & Feature Badges */}
          <ScrollReveal animation="fade-up" delay={150} className={styles.textCol}>
            <div className={styles.eyebrow}>{eyebrow}</div>

            <h2 className={styles.heading}>
              {heading}
            </h2>

            <div className={styles.dividerLine} aria-hidden="true" />

            <p className={styles.description}>
              {description}
            </p>

            {storyData?.paragraph2 && (
              <p className={styles.description} style={{ marginTop: "0.85rem" }}>
                {storyData.paragraph2}
              </p>
            )}

            {/* 3 Feature Badges Row */}
            <div className={styles.featureGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v18M3 12h18" strokeDasharray="1 2" />
                    <circle cx="12" cy="12" r="4" fill="#B87B31" fillOpacity="0.15" />
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <strong>Authentic</strong>
                  <span>Jaipur Craftsmanship</span>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#B87B31" fillOpacity="0.15" />
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <strong>Custom</strong>
                  <span>Creations</span>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <path d="M12 21C12 21 7 16 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 16 12 21 12 21Z" />
                    <path d="M12 21C12 21 5 18 3 13C2 10.5 3.5 8 6 8C8.5 8 11 10.5 12 13" />
                    <path d="M12 21C12 21 19 18 21 13C22 10.5 20.5 8 18 8C15.5 8 13 10.5 12 13" />
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <strong>Artistry in</strong>
                  <span>Every Detail</span>
                </div>
              </div>
            </div>

            {/* Learn More CTA Button */}
            <div className={styles.ctaWrapper}>
              <Link href="/our-story" className={styles.learnMoreButton}>
                <span>Learn More About Us</span>
                <span className={styles.buttonArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
