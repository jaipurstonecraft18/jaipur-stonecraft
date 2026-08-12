"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { categoriesData } from "@/content/categories";
import { designsData } from "@/content/designs";
import styles from "./SearchOverlay.module.css";

const suggestedSearches = [
  { label: "Ganesh Statues", href: "/collections/sculptures-statues/hindu-sculptures/ganesh-ji" },
  { label: "Shiva Statues", href: "/collections/sculptures-statues/hindu-sculptures/shiva-ji" },
  { label: "Marble Mandirs", href: "/collections/temples-architectural-stonework/home-mandirs/marble-home-temples" },
  { label: "Wall Reliefs", href: "/collections/wall-art-reliefs/religious-spiritual-reliefs/temple-wall-murals" },
  { label: "Temple Architecture", href: "/collections/temples-architectural-stonework/temple-architecture/shikhara-domes" },
  { label: "Water Fountains", href: "/collections/fountains-water-features/classical-fountains/tiered-water-fountains" },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus input on open & lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Client-side search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Search Categories
    Object.values(categoriesData).forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)) {
        results.push({
          id: `cat-${cat.slug}`,
          title: `${cat.name} Statues`,
          type: "Category Landing",
          href: `/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`,
        });
      }
    });

    // Search Designs
    Object.values(designsData).forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.shortDescription.toLowerCase().includes(q)) {
        results.push({
          id: `des-${d.slug}`,
          title: d.name,
          type: "Masonic Design",
          href: `/designs/${d.parentCategory}/${d.slug}`,
        });
      }
    });

    return results.slice(0, 8); // Limit to top 8 matches
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} role="dialog" aria-modal="true" aria-label="Site Search">
      {/* Close Button */}
      <button className={styles.closeButton} onClick={onClose} aria-label="Close search overlay">
        &times;
      </button>

      <div className={styles.searchContainer}>
        <h2 className={styles.heading}>What are you looking for?</h2>

        {/* Search Input */}
        <div className={styles.inputWrapper}>
          <svg className={styles.searchIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deity statues, temple arches, marble fountains..."
          />
        </div>

        {/* Live Search Results */}
        {query.trim() !== "" ? (
          <div className={styles.resultsList}>
            {searchResults.length > 0 ? (
              searchResults.map((res) => (
                <Link key={res.id} href={res.href} onClick={onClose} className={styles.resultCard}>
                  <span className={styles.resultTitle}>{res.title}</span>
                  <span className={styles.resultType}>{res.type} &rarr;</span>
                </Link>
              ))
            ) : (
              <div className={styles.noResults}>
                No matching category or design found for &ldquo;{query}&rdquo;.
              </div>
            )}
          </div>
        ) : (
          /* Popular Searches Chips */
          <div className={styles.suggestedSection}>
            <h3 className={styles.suggestedTitle}>Popular Searches</h3>
            <div className={styles.chipsGrid}>
              {suggestedSearches.map((s) => (
                <Link key={s.label} href={s.href} onClick={onClose} className={styles.chip}>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
