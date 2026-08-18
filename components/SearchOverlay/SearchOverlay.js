"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    productResults: [],
    categoryResults: [],
    totalCount: 0,
    isFallback: false,
    fallbackMessage: ""
  });
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);

  // Focus input on open & lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setDebouncedQuery("");
      setSearchResults({
        productResults: [],
        categoryResults: [],
        totalCount: 0,
        isFallback: false,
        fallbackMessage: ""
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounce query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 150);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch search results via server API
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults({
        productResults: [],
        categoryResults: [],
        totalCount: 0,
        isFallback: false,
        fallbackMessage: ""
      });
      return;
    }

    let active = true;
    setSearching(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setSearchResults({
            productResults: data.products || [],
            categoryResults: data.categoryResults || [],
            totalCount: data.totalCount || 0,
            isFallback: Boolean(data.isFallback),
            fallbackMessage: data.fallbackMessage || ""
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setSearching(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

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

  if (!isOpen) return null;

  const { productResults, categoryResults, totalCount, isFallback, fallbackMessage } = searchResults;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} role="dialog" aria-modal="true" aria-label="Site Search">
      <button className={styles.closeButton} onClick={onClose} aria-label="Close search overlay">
        &times;
      </button>

      <div className={styles.searchContainer}>
        <h2 className={styles.heading}>What stonecraft artwork are you looking for?</h2>

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
            placeholder="Search Makrana marble statues, Bansi Paharpur mandirs, jali screens..."
            aria-label="Search query"
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery("")} aria-label="Clear input">
              &times;
            </button>
          )}
        </div>

        {!debouncedQuery && (
          <div className={styles.suggestionsContainer}>
            <span className={styles.suggestLabel}>Popular Collections:</span>
            <div className={styles.chips}>
              {suggestedSearches.map((s, idx) => (
                <Link key={idx} href={s.href} onClick={onClose} className={styles.chip}>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {searching && (
          <div style={{ textAlign: "center", padding: "1.5rem 0", color: "#888" }}>
            Searching database...
          </div>
        )}

        {!searching && debouncedQuery && (
          <div className={styles.resultsWrapper}>
            {isFallback && fallbackMessage && (
              <div className={styles.fallbackNotice}>
                <span className={styles.fallbackIcon}>💡</span>
                <span>{fallbackMessage}</span>
              </div>
            )}

            {categoryResults.length > 0 && (
              <div className={styles.resultGroup}>
                <h3 className={styles.groupTitle}>Collection Categories</h3>
                <div className={styles.categoryList}>
                  {categoryResults.map((cat) => (
                    <Link key={cat.id} href={cat.href} onClick={onClose} className={styles.categoryResultCard}>
                      <span className={styles.catName}>{cat.title}</span>
                      <span className={styles.catArrow}>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {productResults.length > 0 && (
              <div className={styles.resultGroup}>
                <div className={styles.groupHeader}>
                  <h3 className={styles.groupTitle}>Matching Artworks</h3>
                  <span className={styles.resultCount}>{totalCount} total results</span>
                </div>

                <div className={styles.productGrid}>
                  {productResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className={styles.productCard}
                    >
                      <div className={styles.imgWrapper}>
                        <Image
                          src={getImageVariantUrl(p.imageSrc, "thumb")}
                          alt={p.name}
                          width={60}
                          height={60}
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.prodDetails}>
                        <span className={styles.prodMaterial}>
                          {p.primaryMaterial?.name || "Natural Stone"}
                        </span>
                        <h4 className={styles.prodName}>{p.name}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {categoryResults.length === 0 && productResults.length === 0 && (
              <div className={styles.noResults}>
                <p>No stonecraft creations found matching &quot;<strong>{debouncedQuery}</strong>&quot;.</p>
                <p className={styles.noResultsSub}>
                  Try searching for terms like <em>&quot;Ganesh&quot;</em>, <em>&quot;White Marble&quot;</em>, or <em>&quot;Jali&quot;</em>.
                </p>
              </div>
            )}

            {totalCount > 6 && (
              <div className={styles.viewAllWrapper}>
                <Link
                  href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                  onClick={onClose}
                  className={styles.viewAllBtn}
                >
                  View All {totalCount} Results for &quot;{debouncedQuery}&quot; →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
