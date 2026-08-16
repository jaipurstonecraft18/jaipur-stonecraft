"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CollectionCard from "@/components/CollectionCard/CollectionCard";
import styles from "./SearchInterface.module.css";

export default function SearchInterface({ initialProducts, materials, collections }) {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [selectedMaterial, setSelectedMaterial] = useState(() => searchParams.get("material") || "");
  const [selectedCollection, setSelectedCollection] = useState(() => searchParams.get("collection") || "");

  // Sync state to URL search parameters seamlessly
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedMaterial) params.set("material", selectedMaterial);
    if (selectedCollection) params.set("collection", selectedCollection);

    const queryString = params.toString();
    const newPath = queryString ? `/products?${queryString}` : "/products";

    if (window.location.search !== (queryString ? `?${queryString}` : "")) {
      window.history.replaceState(null, "", newPath);
    }
  }, [searchQuery, selectedMaterial, selectedCollection]);

  const filteredProducts = initialProducts.filter((product) => {
    if (product.status && product.status !== "published") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = (product.parentCategory || "").toLowerCase().includes(q);
      const matchDesc = (product.shortDescription || "").toLowerCase().includes(q);
      const matchMat = (product.primaryMaterial?.name || "").toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchDesc && !matchMat) return false;
    }

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
            placeholder="Search products by name, deity, or style..."
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
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
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
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.resultsHeader}>
        Showing {filteredProducts.length} design{filteredProducts.length === 1 ? "" : "s"}
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.noResults}>
          No stonecraft designs found matching your search criteria. Please try a different query or material filter.
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((p) => (
            <CollectionCard
              key={`${p.parentCategory}-${p.slug}`}
              name={p.name}
              description={`${p.primaryMaterial ? p.primaryMaterial.shortName : 'Makrana Marble'} • Hand-carved in Jaipur`}
              imageSrc={p.imageSrc}
              href={`/designs/${p.parentCategory}/${p.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
