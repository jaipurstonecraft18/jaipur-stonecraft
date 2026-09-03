"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./BespokeCTA.module.css";

export default function BespokeCTA({ data = {} }) {
  const eyebrow = data.eyebrow || "LET'S CREATE SOMETHING TIMELESS";
  const heading = data.heading || "Have a Vision in Mind?";
  const description = data.description || "Whether it's a statement sculpture, an architectural temple element, or a bespoke stone commission, our Jaipur atelier welcomes your vision.";
  const primaryText = data.primaryCtaText || "DISCUSS A BESPOKE PROJECT";
  const primaryHref = data.primaryCtaHref || "/contact?type=custom";
  const secondaryText = data.secondaryCtaText || "VISIT OUR WORKSHOP";
  const secondaryHref = data.secondaryCtaHref || "/contact?type=visit";
  const rawImage = data.imageSrc || "/images/craftsmanship/artisan-hands.png";
  const imageSrc = getImageVariantUrl(rawImage, "display") || rawImage;

  return (
    <section className={styles.section} aria-label="Bespoke Project Inquiry">
      <div className={styles.splitGrid}>
        {/* Left Side: Artisan Stonework Close-up */}
        <div className={styles.imageCol}>
          <Image
            src={imageSrc}
            alt="Master sculptor hands chiseling natural stone in Jaipur atelier"
            fill
            sizes="(max-width: 991px) 100vw, 50vw"
            className={styles.artisanImage}
            loading="lazy"
          />
          <div className={styles.imageGradientOverlay} />
        </div>

        {/* Right Side: Inquiry Copy & Actions */}
        <div className={styles.contentCol}>
          <ScrollReveal animation="fade-up">
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.heading}>{heading}</h2>
            <p className={styles.description}>{description}</p>
            <div className={styles.buttonGroup}>
              <Link href={primaryHref} className={styles.primaryGoldButton}>
                {primaryText}
              </Link>
              <Link href={secondaryHref} className={styles.secondaryOutlineButton}>
                {secondaryText}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
