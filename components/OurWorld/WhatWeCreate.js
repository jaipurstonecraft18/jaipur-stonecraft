"use client";

import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./WhatWeCreate.module.css";

// Minimal fine line-art SVG icons consistent with site design tokens
function OfferingIcon({ iconKey }) {
  switch (iconKey) {
    case "sculpture":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3.5-4 4.5C10 9.5 8 8 8 6a4 4 0 0 1 4-4Z" />
          <path d="M6 21v-3a6 6 0 0 1 12 0v3" />
          <path d="M9 14h6" />
        </svg>
      );
    case "architecture":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4h16" />
          <path d="M6 4v16" />
          <path d="M18 4v16" />
          <path d="M3 20h18" />
          <path d="M10 8v8" />
          <path d="M14 8v8" />
        </svg>
      );
    case "fountain":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v6" />
          <path d="M5 8c0 3.87 3.13 7 7 7s7-3.13 7-7H5Z" />
          <path d="M3 15c0 4.42 4.03 8 9 8s9-3.58 9-8H3Z" />
        </svg>
      );
    case "custom":
    default:
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m14 7 3 3-9 9H5v-3l9-9Z" />
          <path d="M17 4l3 3" />
          <circle cx="6" cy="18" r="1" />
        </svg>
      );
  }
}

export default function WhatWeCreate({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Our Stonework Capabilities and Categories">
      <Container>
        {/* Header */}
        <div className={styles.headerWrapper}>
          <ScrollReveal animation="fade-up">
            <span className={styles.eyebrow}>WHAT WE CREATE</span>
            <h2 className={styles.heading}>From Vision to Masterpiece</h2>
          </ScrollReveal>
        </div>

        {/* 4 Offering Cards */}
        <div className={styles.cardsGrid}>
          {items.map((item, idx) => (
            <ScrollReveal key={item.id} animation="fade-up" delay={idx * 100}>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <OfferingIcon iconKey={item.iconKey} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
                <Link href={item.linkHref} className={styles.cardLink}>
                  <span>{item.linkText}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
