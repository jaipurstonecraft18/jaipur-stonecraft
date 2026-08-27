"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CollectionCard from "@/components/CollectionCard/CollectionCard";
import styles from "./SearchInterface.module.css";

export default function SearchInterface({ initialProducts = [], materials = [], collections = [] }) {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [selectedMaterial, setSelectedMaterial] = useState(() => searchParams.get("material") || "");
  const [selectedCollection, setSelectedCollection] = useState(() => searchParams.get("collection") || "");
  const [smartResults, setSmartResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync state to URL search parameters seamlessly
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedMaterial) params.set("material", selectedMaterial);
    if (selectedCollection) params.set("collection", selectedCollection);

    const queryString = params.toString();
    const newPath = queryString ? `/products?${queryString}` : "/products";

    if (typeof window !== "undefined" && window.location.search !== (queryString ? `?${queryString}` : "")) {
      window.history.replaceState(null, "", newPath);
    }
  }, [searchQuery, selectedMaterial, selectedCollection]);

  // Fetch smart search results with full typo, phonetic, and relevance scoring
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSmartResults(null);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setSmartResults(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Search API error:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [searchQuery]);

  // Safe array fallback to prevent baseProducts.filter is not a function
  const baseProducts = Array.isArray(smartResults?.products)
    ? smartResults.products
    : Array.isArray(initialProducts)
    ? initialProducts
    : [];

  const safeMaterials = Array.isArray(materials) ? materials : Object.values(materials || {});
  const safeCollections = Array.isArray(collections) ? collections : Object.values(collections || {});

  const filteredProducts = baseProducts.filter((product) => {
    if (!product) return false;
    if (product.status && product.status !== "published") return false;

    if (selectedMaterial && product.primaryMaterialId !== selectedMaterial) {
      return false;
    }

    if (selectedCollection && product.parentCollection !== selectedCollection) {
      return false;
    }

    return true;
  });

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchControls}>
        <div className={styles.searchInputGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search full catalogue e.g. 'krshna', 'marble temple', 'wall carving'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">All Natural Materials</option>
            {safeMaterials.map((m) => (
              <option key={m.id || m.name} value={m.id || m.name}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="">All Collections</option>
            {safeCollections.map((c) => (
              <option key={c.slug || c.name} value={c.slug || c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Typo Correction Banner */}
      {smartResults?.typoSuggestion && (
        <div style={{ padding: "0.6rem 1rem", backgroundColor: "var(--color-cream-secondary)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-subtle)", marginBottom: "1rem" }}>
          <span>Showing smart results for: </span>
          <button
            type="button"
            onClick={() => setSearchQuery(smartResults.typoSuggestion)}
            style={{ background: "none", border: "none", color: "var(--color-bronze)", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
          >
            &ldquo;{smartResults.typoSuggestion}&rdquo;
          </button>
        </div>
      )}

      <div className={styles.resultsHeader}>
        {loading ? "Searching full catalogue..." : `Showing ${filteredProducts.length} design${filteredProducts.length === 1 ? "" : "s"}`}
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.noResults}>
          No stonecraft designs found matching &quot;{searchQuery}&quot;. Please try a different query or material filter.
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((p) => {
            const matName = p.primaryMaterial ? (typeof p.primaryMaterial === "string" ? p.primaryMaterial : p.primaryMaterial.name || p.primaryMaterial.shortName) : "Natural Stone";
            const cardHref = p.href || `/designs/${p.parentCategory}/${p.slug}`;
            return (
              <CollectionCard
                key={`${p.parentCategory || "product"}-${p.slug}`}
                name={p.name}
                description={`${matName} • Hand-carved in Jaipur`}
                imageSrc={p.imageSrc}
                href={cardHref}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
