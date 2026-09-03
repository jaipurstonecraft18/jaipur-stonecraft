"use client";

import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurWorldHero.module.css";

export default function OurWorldHero({ data = {} }) {
  const eyebrow = data.eyebrow || "THE WORLD OF JAIPUR STONECRAFT";
  const heading = data.heading || "Stone, Culture. Timeless Beauty.";
  const description = data.description || "From sacred sculptures to architectural masterpieces, our work reflects centuries of heritage, the skill of master artisans, and a devotion to perfection.";
  const ctaText = data.primaryCtaText || "DISCOVER OUR WORLD";
  const ctaHref = data.primaryCtaHref || "#gallery-showcase";
  const bgImage = data.backgroundImage || "/images/collections/temples-architectural.webp";
  const optimizedBg = getImageVariantUrl(bgImage, "display") || bgImage;

  const handleScrollToGallery = (e) => {
    if (ctaHref.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(ctaHref);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* Cinematic Finished-Piece Background */}
      <div className={styles.bgWrapper}>
        <Image
          src={optimizedBg}
          alt="Jaipur Stonecraft hand-carved stone temple colonnade"
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.overlayGradient} />
      </div>

      <Container className={styles.contentContainer}>
        <div className={styles.contentWrapper}>
          <ScrollReveal animation="fade-up">
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.description}>{description}</p>
            <a
              href={ctaHref}
              onClick={handleScrollToGallery}
              className={styles.ctaButton}
            >
              <span>{ctaText}</span>
              <span className={styles.arrowIcon} aria-hidden="true">&rarr;</span>
            </a>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
