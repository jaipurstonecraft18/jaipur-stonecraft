"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ProductHero.module.css";

export default function ProductHero({ design, category, collection, subcategory }) {
  // Gallery images array: main image + gallery images
  const allImages = [
    { src: design.imageSrc, alt: design.imageAlt || `${design.name} — Main View` },
    ...(Array.isArray(design.imageGallery)
      ? design.imageGallery.map((img, idx) =>
          typeof img === "string"
            ? { src: img, alt: `${design.name} — View ${idx + 2}` }
            : { src: img.url || img.src, alt: img.alt || `${design.name} — View ${idx + 2}` }
        )
      : []),
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentImage = allImages[activeImageIndex] || allImages[0];

  const whatsappMessage = encodeURIComponent(
    `Hello Jaipur Stonecraft, I am interested in custom ordering the "${design.name}". Please provide details on sizing, pricing, and turnaround.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className={styles.heroWrapper}>
      {/* Top Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Collections", href: "/collections" },
          ...(collection ? [{ label: collection.name, href: `/collections/${collection.slug}` }] : []),
          ...(subcategory ? [{ label: subcategory.name, href: `/collections/${collection?.slug}/${subcategory.slug}` }] : []),
          ...(category ? [{ label: category.name, href: `/collections/${collection?.slug}/${subcategory?.slug}/${category.slug}` }] : []),
          { label: design.name },
        ]}
      />

      <div className={styles.productGrid}>
        {/* Left Column: Vertical Thumbnails + Dominant Primary Image */}
        <div className={styles.galleryContainer}>
          {/* Vertical Thumbnail Rail */}
          {allImages.length > 1 && (
            <div className={styles.verticalThumbRail} aria-label="Product thumbnail gallery">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`${styles.thumbBtn} ${idx === activeImageIndex ? styles.activeThumb : ""}`}
                  aria-label={`View perspective ${idx + 1}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="80px"
                    className={styles.thumbImage}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Dominant Primary Image Frame */}
          <div className={styles.mainImageFrame}>
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              priority
              sizes="(max-width: 991px) 100vw, 48vw"
              className={styles.mainImage}
            />

            {/* Gallery Control Overlay Icons (Zoom & Fullscreen) */}
            <div className={styles.galleryControls}>
              <button
                onClick={() => setIsFullscreen(true)}
                className={styles.controlIconBtn}
                title="Expand Fullscreen View"
                aria-label="Expand Fullscreen View"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className={styles.controlIconBtn}
                title="Fullscreen Toggle"
                aria-label="Fullscreen Toggle"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reference-Aligned Product Information */}
        <div className={styles.infoContainer}>
          <ScrollReveal animation="fade-up">
            {/* Eyebrow & Name */}
            <span className={styles.eyebrow}>
              {category ? category.name.toUpperCase() : "HINDU SCULPTURE"}
            </span>
            <h1 className={styles.productTitle}>{design.name}</h1>
            <p className={styles.subtitle}>
              Hand-Carved {design.primaryMaterial ? design.primaryMaterial.name : "Marble Statue"}
            </p>

            {/* Rating Summary Bar */}
            <div className={styles.ratingBar}>
              <span className={styles.stars} aria-hidden="true">★★★★★</span>
              <span className={styles.ratingText}>5.0 (18 Reviews)</span>
            </div>

            {/* Product Description */}
            <p className={styles.description}>
              {design.shortDescription || design.detailedDescription}
            </p>

            {/* 4 Circular Feature Badges Row */}
            <div className={styles.featureBadgesRow}>
              <div className={styles.badgeItem}>
                <div className={styles.badgeCircle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v10M7 12h10" />
                  </svg>
                </div>
                <span className={styles.badgeLabel}>100% Natural {design.primaryMaterial ? design.primaryMaterial.name : "Makrana Marble"}</span>
              </div>

              <div className={styles.badgeItem}>
                <div className={styles.badgeCircle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <span className={styles.badgeLabel}>Hand-Carved by Master Artisans</span>
              </div>

              <div className={styles.badgeItem}>
                <div className={styles.badgeCircle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <path d="M21 3H3v18h18V3zM9 3v18M15 3v18" />
                  </svg>
                </div>
                <span className={styles.badgeLabel}>Custom Size Available</span>
              </div>

              <div className={styles.badgeItem}>
                <div className={styles.badgeCircle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className={styles.badgeLabel}>Worldwide Delivery</span>
              </div>
            </div>

            {/* Reference-Style Custom Size Available Box */}
            <div className={styles.customSizeBox}>
              <h3 className={styles.customSizeTitle}>CUSTOM SIZE AVAILABLE</h3>
              <p className={styles.customSizeText}>
                We create statues according to your required dimensions. 
                The final weight varies based on the size and stone.
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className={styles.actionRow}>
              <Link href={`/contact?type=quote&design=${design.slug}`} className={styles.primaryActionBtn}>
                Request a Quote
              </Link>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappActionBtn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.484 1.332 5.001L2 22l5.127-1.341c1.46.797 3.109 1.217 4.885 1.218h.004c5.505 0 9.988-4.478 9.989-9.984.001-2.668-1.034-5.176-2.92-7.062A9.923 9.923 0 0012.012 2z" />
                </svg>
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Delivery Estimate Note */}
            <div className={styles.deliveryNote}>
              <span className={styles.truckIcon}>📦</span>
              <span>Estimated Delivery: 30 – 45 Days</span>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {isFullscreen && (
        <div className={styles.lightboxModal} onClick={() => setIsFullscreen(false)}>
          <button className={styles.closeModalBtn} onClick={() => setIsFullscreen(false)} aria-label="Close Fullscreen View">
            ✕
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
