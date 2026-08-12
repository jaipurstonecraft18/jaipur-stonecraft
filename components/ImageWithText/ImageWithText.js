import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ImageWithText.module.css";

export default function ImageWithText({
  imageSrc,
  imageAlt,
  eyebrow,
  heading,
  children,
  ctaText,
  ctaHref,
  reverse = false,
  imageAspect = "aspect45", // "aspect45" | "aspect169" | "aspect11"
}) {
  return (
    <div className={`${styles.wrapper} ${reverse ? styles.reverse : ""}`}>
      {/* Image Panel */}
      <div className={styles.imageCol}>
        <ScrollReveal animation="fade-scale">
          <div className={`${styles.imageContainer} ${styles[imageAspect]}`}>
            <Image
              src={imageSrc}
              alt={imageAlt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority={false}
            />
          </div>
        </ScrollReveal>
      </div>

      {/* Text Panel */}
      <div className={styles.textCol}>
        <ScrollReveal animation="fade-up" delay={150}>
          <div className={styles.textContainer}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {heading && <h3 className={styles.heading}>{heading}</h3>}
            <div className={styles.bodyContent}>{children}</div>
            {ctaText && ctaHref && (
              <div className={styles.ctaWrapper}>
                <PrimaryButton href={ctaHref} variant="charcoal">
                  {ctaText}
                </PrimaryButton>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
