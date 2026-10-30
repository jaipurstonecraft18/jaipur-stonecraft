"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils";
import { popularStatuesData, architecturalArtData } from "@/content/discovery-sliders";
import styles from "./DiscoverySliders.module.css";

/**
 * Reusable single horizontal continuous discovery rail
 */
function DiscoveryRail({
  items = [],
  reverse = false,
  cardType = "portrait", // "portrait" | "landscape"
  railAriaLabel = "Discovery rail"
}) {
  const scrollRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const dragStartRef = useRef({ isDown: false, startX: 0, scrollStart: 0, hasDragged: false });

  // Only render active items
  const activeItems = (Array.isArray(items) ? items : []).filter(
    (item) => item && item.isActive !== false
  );

  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Triple items only after mount for seamless loop buffer, keeping initial DOM lean
  const extendedItems = isMounted ? [...activeItems, ...activeItems, ...activeItems] : activeItems;

  // Pause movement for a set duration (e.g. after manual click/touch)
  const temporaryPause = useCallback((durationMs = 2500) => {
    pauseUntilRef.current = Date.now() + durationMs;
  }, []);

  // Continuous linear animation loop using requestAnimationFrame & time delta (Active only when visible in viewport)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let isVisible = false;
    let hasInitializedReverse = false;
    let rafId;
    let lastTimestamp = performance.now();
    const speedPxPerSecond = 28; // Stately, slow, luxurious movement

    const step = (timestamp) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const isPaused = !isVisible || isHoveredRef.current || isInteractingRef.current || Date.now() < pauseUntilRef.current;

      if (!isPaused && el) {
        const moveDist = speedPxPerSecond * delta;
        const currentOneSet = el.scrollWidth / 3;

        if (reverse) {
          el.scrollLeft -= moveDist;
          if (el.scrollLeft <= 0) {
            el.scrollLeft += currentOneSet;
          }
        } else {
          el.scrollLeft += moveDist;
          if (el.scrollLeft >= currentOneSet * 2) {
            el.scrollLeft -= currentOneSet;
          }
        }
      }

      if (isVisible) {
        rafId = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        // Initialize reverse slider at 1/3 of scrollWidth only once when entering viewport
        if (reverse && !hasInitializedReverse && el.scrollLeft <= 5) {
          const oneSetWidth = el.scrollWidth / 3;
          el.scrollLeft = oneSetWidth;
          hasInitializedReverse = true;
        }
        lastTimestamp = performance.now();
        rafId = requestAnimationFrame(step);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
      }
    }, { threshold: 0.05 });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reverse, activeItems.length]);

  // Scroll controls (Previous & Next buttons)
  const scrollByDelta = (direction = 1) => {
    const el = scrollRef.current;
    if (!el) return;
    temporaryPause(3200);

    const cardWidth = cardType === "portrait" ? 270 : 380;
    el.scrollBy({
      left: direction * (cardWidth * 1.3),
      behavior: "smooth"
    });
  };

  // Mouse Drag to scroll
  const handleMouseDown = (e) => {
    // Only primary mouse button
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;

    dragStartRef.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollStart: el.scrollLeft,
      hasDragged: false
    };
    isInteractingRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!dragStartRef.current.isDown) return;
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - dragStartRef.current.startX;

    if (Math.abs(walk) > 6) {
      dragStartRef.current.hasDragged = true;
    }

    el.scrollLeft = dragStartRef.current.scrollStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!dragStartRef.current.isDown) return;
    dragStartRef.current.isDown = false;
    isInteractingRef.current = false;
    temporaryPause(1800);
    setTimeout(() => {
      dragStartRef.current.hasDragged = false;
    }, 60);
  };

  // Touch handlers for mobile
  const handleTouchStart = () => {
    isInteractingRef.current = true;
  };

  const handleTouchEnd = () => {
    isInteractingRef.current = false;
    temporaryPause(2400);
  };

  // Card click interceptor — suppress navigation if user dragged
  const handleCardClick = (e) => {
    if (dragStartRef.current.hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByDelta(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByDelta(1);
    }
  };

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={styles.railWrapper}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; handleMouseUpOrLeave(); }}
    >
      {/* Outer edge subtle navigation controls */}
      <button
        type="button"
        onClick={() => scrollByDelta(-1)}
        className={`${styles.edgeNavButton} ${styles.edgeNavPrev}`}
        aria-label="Scroll rail left"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollByDelta(1)}
        className={`${styles.edgeNavButton} ${styles.edgeNavNext}`}
        aria-label="Scroll rail right"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Track Container */}
      <div
        ref={scrollRef}
        className={styles.scrollTrack}
        role="region"
        aria-label={railAriaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.railInner}>
          {extendedItems.map((item, idx) => {
            const isPortrait = cardType === "portrait";
            const rawSrc = item.customImage || item.imageSrc || item.fallbackImage || "/images/collections/hero-sculptures-group.webp";
            const optimizedSrc = getImageVariantUrl(rawSrc, "card");
            const destinationHref = item.href || "/collections";
            const categoryLabel = item.category || item.subtitle || (isPortrait ? "Marble Statues" : "Architectural Art");

            return (
              <Link
                key={`${item.id || item.title}-${idx}`}
                href={destinationHref}
                prefetch={false}
                className={`${styles.card} ${isPortrait ? styles.cardPortrait : styles.cardLandscape}`}
                onClick={handleCardClick}
              >
                {/* Visual Image Container */}
                <div className={`${styles.imageBox} ${isPortrait ? styles.imageBoxPortrait : styles.imageBoxLandscape}`}>
                  {(idx < 2 || isInView) && (
                    <Image
                      src={optimizedSrc}
                      alt={item.imageAlt || item.title || "Jaipur Stonecraft art"}
                      fill
                      sizes={
                        isPortrait
                          ? "(max-width: 640px) 75vw, (max-width: 1024px) 35vw, 480px"
                          : "(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 540px"
                      }
                      quality={88}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.imageWarmGradient} aria-hidden="true" />
                </div>

                {/* Card Text & Navigation Details */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.cardCategory}>{categoryLabel}</span>
                    <span className={styles.cardArrow} aria-hidden="true">&rarr;</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Discovery Section Component
 * Houses Slider 1 (Popular Statues) & Slider 2 (Murals, Jalis, Mandirs & Architectural Art)
 */
export default function DiscoverySliders({
  statuesConfig = popularStatuesData,
  archConfig = architecturalArtData
}) {
  // Merge with defaults to guarantee all expected fields exist
  const effectiveStatues = {
    ...popularStatuesData,
    ...(statuesConfig || {})
  };
  const effectiveArch = {
    ...architecturalArtData,
    ...(archConfig || {})
  };

  const isStatuesEnabled = effectiveStatues.enabled !== false;
  const isArchEnabled = effectiveArch.enabled !== false;

  const statuesActiveItems = (effectiveStatues.items || []).filter(
    (item) => item && item.isActive !== false
  );
  const archActiveItems = (effectiveArch.items || []).filter(
    (item) => item && item.isActive !== false
  );

  const showStatues = isStatuesEnabled && statuesActiveItems.length > 0;
  const showArch = isArchEnabled && archActiveItems.length > 0;

  // If both sections are disabled or have zero items, render nothing
  if (!showStatues && !showArch) {
    return null;
  }

  return (
    <section className={styles.discoverySection} aria-label="Collections Discovery Gallery">
      {/* 1. Subtle Ornamental Background Linework */}
      <div className={styles.ornamentBackground} aria-hidden="true">
        {/* Soft Architectural Top Arch / Watermark */}
        <svg
          className={styles.bgSvgTop}
          width="100%"
          height="120"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C360,60 1080,-20 1440,20 L1440,0 L0,0 Z"
            fill="none"
            stroke="#B87B31"
            strokeWidth="0.8"
            strokeOpacity="0.12"
          />
          <path
            d="M0,50 C480,95 960,15 1440,55"
            fill="none"
            stroke="#B87B31"
            strokeWidth="0.6"
            strokeDasharray="4 6"
            strokeOpacity="0.09"
          />
        </svg>

        {/* Subtle Watermark Rosette on Side */}
        <svg
          className={styles.watermarkRosette}
          width="360"
          height="360"
          viewBox="0 0 200 200"
          fill="none"
          stroke="#B87B31"
          strokeWidth="0.5"
          strokeOpacity="0.07"
        >
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="72" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="50" />
          <path d="M100 10 L100 190 M10 100 L190 100 M36 36 L164 164 M36 164 L164 36" />
          <circle cx="100" cy="100" r="28" fill="#B87B31" fillOpacity="0.02" />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* SLIDER 1: POPULAR MARBLE STATUES                               */}
      {/* ============================================================== */}
      {showStatues && (
        <>
          <Container>
            <ScrollReveal animation="fade-up">
              <div className={styles.sectionHeader}>
                <span className={styles.eyebrow}>{effectiveStatues.eyebrow || "POPULAR CHOICES"}</span>
                <h2 className={styles.heading}>{effectiveStatues.heading || "Most Sought-After Marble Statues"}</h2>
                <p className={styles.supportingText}>{effectiveStatues.supportingText || "Sacred forms. Timeless craftsmanship."}</p>
                <div className={styles.exploreLinkRow}>
                  <Link href={effectiveStatues.exploreHref || "/collections/sculptures-statues"} className={styles.exploreLink}>
                    <span>{effectiveStatues.exploreText || "EXPLORE ALL STATUES"}</span>
                    <span className={styles.exploreArrow} aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </Container>

          {/* Slider 1 Full Width Track (Moves Right-to-Left) */}
          <div className={styles.sliderContainer}>
            <DiscoveryRail
              items={effectiveStatues.items}
              reverse={false}
              cardType="portrait"
              railAriaLabel="Most sought-after marble statues carousel"
            />
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* CENTRAL DELICATE ATELIER ORNAMENTAL DIVIDER                     */}
      {/* ============================================================== */}
      {showStatues && showArch && (
        <div className={styles.centralOrnament} aria-hidden="true">
          <svg width="240" height="24" viewBox="0 0 240 24" fill="none">
            <line x1="10" y1="12" x2="95" y2="12" stroke="#B87B31" strokeWidth="0.8" strokeOpacity="0.3" />
            <polygon points="120,6 126,12 120,18 114,12" stroke="#B87B31" strokeWidth="0.8" fill="#B87B31" fillOpacity="0.12" />
            <circle cx="105" cy="12" r="1.5" fill="#B87B31" fillOpacity="0.4" />
            <circle cx="135" cy="12" r="1.5" fill="#B87B31" fillOpacity="0.4" />
            <line x1="145" y1="12" x2="230" y2="12" stroke="#B87B31" strokeWidth="0.8" strokeOpacity="0.3" />
          </svg>
        </div>
      )}

      {/* ============================================================== */}
      {/* SLIDER 2: MURALS, JALIS, MANDIRS & ARCHITECTURAL ART           */}
      {/* ============================================================== */}
      {showArch && (
        <>
          <Container>
            <ScrollReveal animation="fade-up">
              <div className={styles.sectionHeader}>
                <span className={styles.eyebrow}>{effectiveArch.eyebrow || "EXPLORE SPACES"}</span>
                <h2 className={styles.heading}>{effectiveArch.heading || "Murals, Jalis, Mandirs & Architectural Art"}</h2>
                <p className={styles.supportingText}>{effectiveArch.supportingText || "Stonework crafted for walls, spaces and sacred places."}</p>
                <div className={styles.exploreLinkRow}>
                  <Link href={effectiveArch.exploreHref || "/collections/temples-architectural-stonework"} className={styles.exploreLink}>
                    <span>{effectiveArch.exploreText || "EXPLORE ALL ARCHITECTURAL ART"}</span>
                    <span className={styles.exploreArrow} aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </Container>

          {/* Slider 2 Full Width Track (Moves Left-to-Right in Opposite Direction) */}
          <div className={styles.sliderContainer}>
            <DiscoveryRail
              items={effectiveArch.items}
              reverse={true}
              cardType="landscape"
              railAriaLabel="Murals, jalis, mandirs and architectural art carousel"
            />
          </div>
        </>
      )}
    </section>
  );
}
