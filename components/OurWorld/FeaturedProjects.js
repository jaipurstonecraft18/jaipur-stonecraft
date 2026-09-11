"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./FeaturedProjects.module.css";

export default function FeaturedProjects({ projects = [], header = {} }) {
  if (!projects || projects.length === 0) return null;

  const eyebrow = header.eyebrow || "FEATURED PROJECTS";
  const heading = header.heading || "Crafted for Timeless Spaces";

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      const firstChild = scrollRef.current.firstElementChild;
      if (firstChild) {
        const itemWidth = firstChild.getBoundingClientRect().width + 16;
        const current = Math.round(scrollLeft / itemWidth);
        setActiveIndex(Math.min(Math.max(current, 0), projects.length - 1));
      }
    }
  }, [projects.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [checkScroll]);

  const scrollByAmount = (direction) => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild;
      const amount = firstChild ? firstChild.getBoundingClientRect().width + 16 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className={styles.section} aria-label="Featured Projects Portfolio">
      <Container>
        {/* Header with Navigation Controls */}
        <div className={styles.topRow}>
          <div className={styles.headerText}>
            <ScrollReveal animation="fade-up">
              <span className={styles.eyebrow}>{eyebrow}</span>
              <h2 className={styles.heading}>{heading}</h2>
            </ScrollReveal>
          </div>

          <div className={styles.navControls} aria-label="Project carousel controls">
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Previous project"
              disabled={!canScrollLeft}
              onClick={() => scrollByAmount("left")}
            >
              &larr;
            </button>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Next project"
              disabled={!canScrollRight}
              onClick={() => scrollByAmount("right")}
            >
              &rarr;
            </button>
          </div>
        </div>

        {/* Swipeable Projects Rail / Grid */}
        <div
          ref={scrollRef}
          className={styles.projectsGrid}
          role="region"
          aria-label="Featured projects scroll list"
          tabIndex={0}
        >
          {projects.map((project, idx) => {
            const imgSrc = getImageVariantUrl(project.imageSrc, "card") || project.imageSrc;
            return (
              <div key={project.id || project.slug} className={styles.projectCardWrapper}>
                <ScrollReveal
                  animation="fade-up"
                  delay={idx * 80}
                >
                  <Link
                    href={project.href || `/projects/${project.slug}`}
                    className={styles.projectCard}
                    aria-label={`View case study: ${project.title}`}
                  >
                    <div className={styles.imageWrapper}>
                      <Image
                        src={imgSrc}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1100px) 50vw, 25vw"
                        className={styles.projectImage}
                        loading="lazy"
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <span className={styles.cardCategory}>{project.category}</span>
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                      <p className={styles.cardDesc}>{project.description}</p>
                      <div className={styles.linkRow}>
                        <span>Case Study</span>
                        <span aria-hidden="true">&rarr;</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        {/* Mobile Pagination Indicators */}
        <div className={styles.mobileIndicators} aria-hidden="true">
          {projects.map((_, i) => (
            <span
              key={`dot-${i}`}
              className={`${styles.indicatorDot} ${i === activeIndex ? styles.activeDot : ""}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
