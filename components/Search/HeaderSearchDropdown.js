"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./HeaderSearchDropdown.module.css";

const popularTags = [
  { label: "Ganesh Statues", query: "Ganesh" },
  { label: "Krishna Sculptures", query: "Krishna" },
  { label: "Marble Mandirs", query: "Mandir" },
  { label: "Wall Reliefs", query: "Wall Relief" },
  { label: "Water Fountains", query: "Fountain" },
];

export default function HeaderSearchDropdown({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    products: [],
    categories: [],
    collections: [],
    typoSuggestion: null,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({
        products: [],
        categories: [],
        collections: [],
        typoSuggestion: null,
        totalCount: 0,
      });
    }
  }, [isOpen]);

  // Click outside listener to close popover
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle ENTER key form submit -> Navigate directly to http://localhost:3000/products?q=...
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  // Fetch search results on user typing input (zero initial page bundle impact)
  useEffect(() => {
    if (!query.trim()) {
      setResults({
        products: [],
        categories: [],
        collections: [],
        typoSuggestion: null,
        totalCount: 0,
      });
      return;
    }

    let isSubscribed = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=6`)
        .then((res) => res.json())
        .then((data) => {
          if (isSubscribed) {
            setResults(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Search error:", err);
          if (isSubscribed) setLoading(false);
        });
    }, 120);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className={styles.popoverContainer} ref={dropdownRef} role="dialog" aria-label="Search Jaipur Stonecraft">
      {/* Form wrapper for ENTER key navigation to /products catalogue page */}
      <form onSubmit={handleFormSubmit} className={styles.inputBar}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type e.g. 'krshna' and press ENTER for full /products catalogue..."
          aria-label="Search input"
        />
        {query && (
          <button type="button" className={styles.clearBtn} onClick={() => setQuery("")} aria-label="Clear query">
            ✕
          </button>
        )}
      </form>

      {/* Default Popular Tags when no query */}
      {!query && (
        <div className={styles.popularBox}>
          <span className={styles.boxTitle}>POPULAR SEARCHES</span>
          <div className={styles.tagChips}>
            {popularTags.map((tag) => (
              <button
                key={tag.query}
                type="button"
                className={styles.chipBtn}
                onClick={() => setQuery(tag.query)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className={styles.statusBox}>
          <span className={styles.statusText}>Searching Jaipur Stonecraft catalogue...</span>
        </div>
      )}

      {/* Search Results Display */}
      {!loading && query && (
        <div className={styles.resultsBox}>
          {/* Typo Correction Suggestion Bar */}
          {results.typoSuggestion && (
            <div className={styles.typoBanner}>
              <span>Did you mean: </span>
              <button
                type="button"
                className={styles.typoLink}
                onClick={() => setQuery(results.typoSuggestion)}
              >
                &ldquo;{results.typoSuggestion}&rdquo;
              </button>
            </div>
          )}

          {/* Categories Quick Links */}
          {results.categories && results.categories.length > 0 && (
            <div className={styles.categoryGroup}>
              <span className={styles.groupHeader}>MATCHING CATEGORIES</span>
              <div className={styles.categoryPills}>
                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    onClick={onClose}
                    className={styles.catPill}
                  >
                    <span>{cat.name}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products List */}
          {results.products && results.products.length > 0 && (
            <div className={styles.productGroup}>
              <div className={styles.groupTitleRow}>
                <span className={styles.groupHeader}>MATCHING CREATIONS</span>
                <span className={styles.countBadge}>{results.totalCount} found</span>
              </div>

              <div className={styles.productList}>
                {results.products.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className={styles.productRow}
                  >
                    <div className={styles.thumbFrame}>
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        sizes="50px"
                        className={styles.thumbImg}
                      />
                    </div>
                    <div className={styles.prodInfo}>
                      <span className={styles.prodCat}>{item.parentCategoryName} &bull; {item.primaryMaterial}</span>
                      <h4 className={styles.prodTitle}>{item.name}</h4>
                    </div>
                    <span className={styles.arrowIcon} aria-hidden="true">&rarr;</span>
                  </Link>
                ))}
              </div>

              {/* View All Full Catalogue Results Action */}
              <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
                <Link
                  href={`/products?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className={styles.viewFullBtn}
                >
                  View All {results.totalCount} Results in Products Catalogue &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Zero Results State with Smart Recovery */}
          {(!results.products || results.products.length === 0) && (!results.categories || results.categories.length === 0) && (
            <div className={styles.zeroState}>
              <p className={styles.zeroText}>
                No exact match found for &ldquo;<strong>{query}</strong>&rdquo;.
              </p>
              <p className={styles.zeroHint}>
                Press <strong>ENTER</strong> to search /products catalogue or try searching by stone (<em>&quot;White Marble&quot;</em>) or deity (<em>&quot;Krishna&quot;</em>).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
