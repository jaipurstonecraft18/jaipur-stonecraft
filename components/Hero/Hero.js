"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils";
import { siteConfig } from "@/content/site";
import styles from "./Hero.module.css";

const heroSlides = [
  {
    eyebrow: "TIMELESS ART. CARVED BY HAND.",
    headingTitle: "Where Stone",
    headingAccent: "Becomes Art",
    description: "Handcrafted sculptures, architectural stonework, and timeless creations shaped by master artisans with devotion and precision.",
    primaryCtaText: "Explore Collections",
    primaryCtaHref: "/collections",
    secondaryCtaText: "Custom Project",
    secondaryCtaHref: "/contact?type=custom",
    imageSrc: "/images/hero/hero-krishna-artisan.webp",
    imageAlt: "Master white marble sculpture of Lord Krishna carved by artisan in studio",
  },
  {
    eyebrow: "DIVINE SACRED MASONRY",
    headingTitle: "Temples &",
    headingAccent: "Architectural Art",
    description: "Pure Makrana white marble mandirs, hand-carved stone pillars, and grand temple arches built to traditional iconographic standards.",
    primaryCtaText: "View Temples",
    primaryCtaHref: "/collections/temples-architectural-stonework",
    secondaryCtaText: "Call Now",
    secondaryCtaHref: `tel:${(siteConfig?.contact?.phone || "+91 9664388920").replace(/\s+/g, "")}`,
    imageSrc: "/images/collections/temples-architectural.webp",
    imageAlt: "Intricately carved stone temple architecture",
  },
  {
    eyebrow: "HERITAGE STONE RELIEFS",
    headingTitle: "Wall Murals &",
    headingAccent: "High Reliefs",
    description: "Spiritual high-relief stone panels, lattice jali screens, and bespoke architectural carvings for modern and classical residences.",
    primaryCtaText: "Discover Wall Art",
    primaryCtaHref: "/collections/wall-art-reliefs",
    secondaryCtaText: "Custom Commission",
    secondaryCtaHref: "/contact?type=custom",
    imageSrc: "/images/collections/wall-art-relief.webp",
    imageAlt: "Hand-carved sandstone wall relief mural",
  },
];

export default function Hero(props) {
  const dynamicSlides = Array.isArray(props.slides) && props.slides.length > 0
    ? props.slides
    : (props.content?.slides && Array.isArray(props.content.slides) && props.content.slides.length > 0)
    ? props.content.slides
    : heroSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (dynamicSlides.length <= 1) return;
    // Stately luxury atelier timing: give visitors 12 seconds to absorb the craftsmanship
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [dynamicSlides.length]);

  const slide = dynamicSlides[currentSlide] || dynamicSlides[0] || heroSlides[0];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
  };

  return (
    <section className={styles.hero} aria-label="Hero Section">
      {/* Hero Background Image (Pristine LCP Element) */}
      <div className={styles.heroBannerBgWrapper}>
        <Image
          src={getImageVariantUrl(slide.imageSrc || "/images/hero/hero-krishna-artisan.webp", "display")}
          alt={slide.imageAlt || slide.headingTitle || "Jaipur Stonecraft Atelier"}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={88}
          className={styles.heroImage}
        />
      </div>

      {/* Atmospheric Warm Multi-Layer Overlay Gradient */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Hero Content Container */}
      <Container style={{ position: "relative", zIndex: 3, width: "100%" }}>
        <div className={styles.contentWrapper}>
          <ScrollReveal animation="fade-up" key={`eyebrow-${currentSlide}`}>
            <div className={styles.eyebrowWrapper}>
              <span className={styles.eyebrow}>{slide.eyebrow}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100} key={`heading-${currentSlide}`}>
            <h1 className={styles.heading}>
              {slide.headingTitle || "Where Stone"}{" "}
              <br className={styles.desktopBreak} />
              <span className={styles.accentText}>{slide.headingAccent || "Becomes Art"}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200} key={`desc-${currentSlide}`}>
            <p className={styles.description}>{slide.description}</p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300} key={`cta-${currentSlide}`}>
            <div className={styles.ctaGroup}>
              <Link href={slide.primaryCtaHref || "/collections"} prefetch={false} className={styles.primaryCta}>
                <span>{slide.primaryCtaText || "Explore Our Collections"}</span>
                <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
              </Link>

              {(() => {
                const secHref = slide.secondaryCtaHref || "/contact?type=custom";
                const isQuote = String(slide.secondaryCtaText || "").toLowerCase().includes("quote") || String(secHref).includes("type=quote");
                const finalHref = isQuote ? `tel:${(siteConfig?.contact?.phone || "+91 9664388920").replace(/\s+/g, "")}` : secHref;
                const finalText = isQuote ? "Call Now" : (slide.secondaryCtaText || "Start a Custom Project");

                if (finalHref.startsWith("tel:")) {
                  return (
                    <a
                      href={finalHref}
                      className={styles.secondaryCta}
                      aria-label={`Call Jaipur Stonecraft at ${siteConfig.contact.phone}`}
                    >
                      <span>{finalText}</span>
                    </a>
                  );
                }
                return (
                  <Link href={finalHref} prefetch={false} className={styles.secondaryCta}>
                    <span>{finalText}</span>
                  </Link>
                );
              })()}
            </div>
          </ScrollReveal>

          {/* Interactive Mobile & Desktop Slider Controls */}
          <div className={styles.sliderControls} aria-label="Hero Slide Controls">
            <button
              onClick={handlePrev}
              className={styles.sliderArrow}
              aria-label="Previous Slide"
            >
              &#8592;
            </button>
            <div className={styles.slideCounter}>
              <span className={styles.activeSlide}>0{currentSlide + 1}</span>
              <span className={styles.slideDivider}>/</span>
              <span className={styles.totalSlides}>0{dynamicSlides.length}</span>
            </div>
            <div className={styles.slideDots}>
              {dynamicSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`${styles.dot} ${idx === currentSlide ? styles.activeDot : ""}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className={styles.sliderArrow}
              aria-label="Next Slide"
            >
              &#8594;
            </button>
          </div>
        </div>
      </Container>

      {/* Organic Soft Curve Transition into Heritage Section Background */}
      <div className={styles.bottomCurve} aria-hidden="true">
        <svg viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none">
          <path d="M0,45 C480,95 960,15 1440,55 L1440,90 L0,90 Z" fill="#F7F2EB" />
        </svg>
      </div>
    </section>
  );
}

