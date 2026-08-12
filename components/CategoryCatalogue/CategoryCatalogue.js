"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CategoryCatalogue.module.css";

export default function CategoryCatalogue({ designs = [], categoryName = "" }) {
  const [materialFilter, setMaterialFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [finishFilter, setFinishFilter] = useState("all");

  // Collect unique materials, sizes, finishes from designs
  const availableMaterials = useMemo(() => {
    const set = new Set();
    designs.forEach((d) => {
      d.variants?.materials?.forEach((m) => set.add(m));
    });
    return Array.from(set);
  }, [designs]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    designs.forEach((d) => {
      d.variants?.sizes?.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [designs]);

  const availableFinishes = useMemo(() => {
    const set = new Set();
    designs.forEach((d) => {
      d.variants?.finishes?.forEach((f) => set.add(f));
    });
    return Array.from(set);
  }, [designs]);

  // Filter designs dynamically
  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      if (materialFilter !== "all" && !d.variants?.materials?.includes(materialFilter)) {
        return false;
      }
      if (sizeFilter !== "all" && !d.variants?.sizes?.includes(sizeFilter)) {
        return false;
      }
      if (finishFilter !== "all" && !d.variants?.finishes?.includes(finishFilter)) {
        return false;
      }
      return true;
    });
  }, [designs, materialFilter, sizeFilter, finishFilter]);

  return (
    <div>
      {/* Interactive Filters Panel */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterGroupTitle}>Filter Designs</h3>
        <div className={styles.filterGrid}>
          {/* Material Filter */}
          <div className={styles.filterControl}>
            <label htmlFor="material-filter" className={styles.filterLabel}>Material</label>
            <select
              id="material-filter"
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Materials</option>
              {availableMaterials.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className={styles.filterControl}>
            <label htmlFor="size-filter" className={styles.filterLabel}>Size</label>
            <select
              id="size-filter"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Sizes</option>
              {availableSizes.map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>

          {/* Finish Filter */}
          <div className={styles.filterControl}>
            <label htmlFor="finish-filter" className={styles.filterLabel}>Finish</label>
            <select
              id="finish-filter"
              value={finishFilter}
              onChange={(e) => setFinishFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Finishes</option>
              {availableFinishes.map((fn) => (
                <option key={fn} value={fn}>{fn}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.resultsCount}>
        Showing {filteredDesigns.length} of {designs.length} {categoryName} designs
      </div>

      {/* Designs Catalogue Grid */}
      {filteredDesigns.length > 0 ? (
        <div className={styles.designsGrid}>
          {filteredDesigns.map((design, idx) => (
            <ScrollReveal key={design.slug} animation="fade-up" delay={idx * 40}>
              <ProductCard
                name={design.name}
                category={categoryName}
                material={design.variants?.materials?.[0] || "Marble"}
                imageSrc={design.imageSrc}
                href={`/designs/${design.parentCategory}/${design.slug}`}
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No designs match the selected filters. Try clearing your selection.</p>
        </div>
      )}
    </div>
  );
}
