"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container/Container";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./Hero.module.css";

export default function Hero({
  eyebrow = "HANDCRAFTED IN JAIPUR",
  description = "Bespoke white marble sculptures, temple architecture, and custom architectural stonework carved by master artisans in Rajasthan.",
  primaryCtaText = "Explore Collections",
  primaryCtaHref = "/collections",
  secondaryCtaText = "Discuss Your Project",
  secondaryCtaHref = "/contact?type=custom",
  videoSrc = "/videos/herovid.webm",
  imageSrc = "/images/hero/homepage-hero.png",
}) {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className={styles.hero} aria-label="Hero Section">
      {/* Background Media: Video with Image Poster Fallback */}
      {!videoError && videoSrc ? (
        <video
          className={styles.videoBackground}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={imageSrc}
          onError={() => setVideoError(true)}
        >
          <source src={videoSrc} type="video/webm" />
          <source src="/videos/herovid.mp4" type="video/mp4" />
        </video>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageSrc}
          alt="Hand-carved architectural stone sculpture detail"
          className={styles.posterImage}
        />
      )}

      {/* Multi-Layer Nuanced Protection Overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Left-Aligned Editorial Hero Content (Aligned with Global Grid) */}
      <Container style={{ position: "relative", zIndex: 3, width: "100%" }}>
        <div className={styles.contentWrapper}>
          <ScrollReveal animation="fade-up">
            <div className={styles.eyebrowWrapper}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              <span className={styles.eyebrow}>{eyebrow}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className={styles.heading}>
              Where Stone Becomes <span className={styles.accentText}>Legacy.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className={styles.description}>{description}</p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className={styles.ctaGroup}>
              <PrimaryButton href={primaryCtaHref} variant="bronze">
                {primaryCtaText}
              </PrimaryButton>

              <Link href={secondaryCtaHref} className={styles.secondaryCta}>
                <span>{secondaryCtaText}</span>
                <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </Container>

      {/* Subtle Scroll Indicator */}
      <a href="#trust-strip" className={styles.scrollIndicator} aria-label="Scroll to content">
        <span className={styles.scrollIcon} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </span>
        <span>SCROLL</span>
      </a>
    </section>
  );
}
