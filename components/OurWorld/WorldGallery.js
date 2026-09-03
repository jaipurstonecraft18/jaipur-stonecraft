"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./WorldGallery.module.css";

export default function WorldGallery({ items = [], activeCategory = "all" }) {
  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  // Distribute items across columns for asymmetric editorial rhythm
  const columnsData = useMemo(() => {
    // When "all" is selected, arrange in 5 curated editorial columns matching the reference design
    if (activeCategory === "all") {
      const col1 = items.slice(0, 2);   // Shikhara Temple (tall) + Artisan hand chiseling (square)
      const col2 = items.slice(2, 4);   // Floral relief (square) + Lattice jali (square)
      const col3 = items.slice(4, 5);   // Sacred Saraswati/Krishna deities (tall centerpiece)
      const col4 = items.slice(5, 7);   // Pillar capital (square) + Ganesha idol (square)
      const col5 = items.slice(7, 9);   // Tiered fountain (tall) + Colonnade corridor (landscape)
      return [col1, col2, col3, col4, col5];
    }

    // For specific filtered categories, dynamically distribute evenly across up to 3-4 columns
    const colsCount = Math.min(filteredItems.length, 3) || 1;
    const cols = Array.from({ length: colsCount }, () => []);
    filteredItems.forEach((item, idx) => {
      cols[idx % colsCount].push(item);
    });
    return cols;
  }, [items, filteredItems, activeCategory]);

  const getAspectClass = (item) => {
    switch (item.aspectRatio) {
      case "tall":
        return styles.aspectTall;
      case "centerpiece":
        return styles.aspectCenterpiece;
      case "landscape":
        return styles.aspectLandscape;
      case "square":
      default:
        return styles.aspectSquare;
    }
  };

  return (
    <section id="gallery-showcase" className={styles.gallerySection}>
      <Container>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <ScrollReveal animation="fade-up">
            <span className={styles.eyebrow}>EXPLORE OUR WORLD</span>
            <h2 className={styles.heading}>A Glimpse of Our Creations</h2>
            <p className={styles.subcopy}>
              Discover the beauty, detail and diversity of our work across sculptures, architecture and timeless traditions.
            </p>
          </ScrollReveal>
        </div>

        {/* Filter State Indicator */}
        <div className={styles.filterPillBar}>
          <span className={styles.activeFilterBadge}>
            {activeCategory === "all" ? "All Works" : activeCategory}
          </span>
          <span className={styles.filterCount}>
            Showing {filteredItems.length} curated {filteredItems.length === 1 ? "creation" : "creations"}
          </span>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div id="gallery-grid" className={styles.asymmetricGrid}>
          {columnsData.map((col, colIdx) => (
            <div key={`col-${colIdx}`} className={styles.gridCol}>
              {col.map((item, itemIdx) => {
                const imgSrc = getImageVariantUrl(item.imageSrc, "display") || item.imageSrc;
                return (
                  <ScrollReveal
                    key={item.id}
                    animation="fade-up"
                    delay={(colIdx * 80) + (itemIdx * 60)}
                  >
                    <div className={styles.galleryCard}>
                      <div className={`${styles.imageFrame} ${getAspectClass(item)}`}>
                        <Image
                          src={imgSrc}
                          alt={item.altText || item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                          className={styles.image}
                          loading="lazy"
                        />
                        <div className={styles.cardOverlay}>
                          <span className={styles.cardCategory}>{item.categoryLabel}</span>
                          <h3 className={styles.cardTitle}>{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ))}
        </div>

        {/* View Full Gallery CTA */}
        <div className={styles.footerCtaWrapper}>
          <Link href="/collections" className={styles.viewAllButton}>
            <span>View Full Gallery</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
