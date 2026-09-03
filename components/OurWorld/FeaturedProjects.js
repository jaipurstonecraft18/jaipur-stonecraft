"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./FeaturedProjects.module.css";

export default function FeaturedProjects({ projects = [] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Featured Projects Portfolio">
      <Container>
        {/* Header with Navigation Controls */}
        <div className={styles.topRow}>
          <div className={styles.headerText}>
            <ScrollReveal animation="fade-up">
              <span className={styles.eyebrow}>FEATURED PROJECTS</span>
              <h2 className={styles.heading}>Crafted for Timeless Spaces</h2>
            </ScrollReveal>
          </div>

          <div className={styles.navControls} aria-hidden="true">
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Previous project"
              disabled
            >
              &larr;
            </button>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Next project"
            >
              &rarr;
            </button>
          </div>
        </div>

        {/* 4 Real Featured Project Cards */}
        <div className={styles.projectsGrid}>
          {projects.map((project, idx) => {
            const imgSrc = getImageVariantUrl(project.imageSrc, "card") || project.imageSrc;
            return (
              <ScrollReveal
                key={project.id || project.slug}
                animation="fade-up"
                delay={idx * 100}
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
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
            );
          })}
        </div>
      </Container>
    </section>
  );
}
