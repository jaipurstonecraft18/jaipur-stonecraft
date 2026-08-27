"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ProductPerspectiveGallery.module.css";

export default function ProductPerspectiveGallery({ design }) {
  const gallery = Array.isArray(design?.imageGallery) ? design.imageGallery : [];
  const [activeModalImage, setActiveModalImage] = useState(null);

  // If no gallery images, show primary image + variants or fallback
  const displayImages = gallery.length > 0 ? gallery : [design.imageSrc];

  return (
    <section className={styles.gallerySection} aria-label="Multiple Perspectives">
      <div className={styles.container}>
        <ScrollReveal animation="fade-up">
          <div className={styles.header}>
            <h2 className={styles.heading}>Multiple Perspectives</h2>
            <div className={styles.ornamentDivider} aria-hidden="true">✦</div>
          </div>
        </ScrollReveal>

        {/* 5-Image Horizontal View Track */}
        <div className={styles.trackWrapper}>
          <div className={styles.galleryGrid}>
            {displayImages.map((img, idx) => {
              const imgSrc = typeof img === "string" ? img : img.url || img.src;
              const imgAlt = typeof img === "string" 
                ? `${design?.name || "Statue"} — Perspective angle ${idx + 1}` 
                : img.alt || `${design?.name || "Statue"} — Perspective angle ${idx + 1}`;

              return (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
                  <div className={styles.card} onClick={() => setActiveModalImage(imgSrc)}>
                    <div className={styles.imageFrame}>
                      <Image
                        src={imgSrc}
                        alt={imgAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className={styles.perspectiveImage}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* View Full Screen Gallery Button */}
        <div className={styles.btnRow}>
          <button 
            onClick={() => setActiveModalImage(displayImages[0] ? (typeof displayImages[0] === "string" ? displayImages[0] : displayImages[0].url) : design.imageSrc)}
            className={styles.fullscreenBtn}
          >
            <span>🔍 View Full Screen Gallery</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalImage && (
        <div className={styles.modalOverlay} onClick={() => setActiveModalImage(null)}>
          <button className={styles.closeBtn} onClick={() => setActiveModalImage(null)}>✕</button>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Image src={activeModalImage} alt="Expanded gallery view" fill style={{ objectFit: "contain" }} />
          </div>
        </div>
      )}
    </section>
  );
}
