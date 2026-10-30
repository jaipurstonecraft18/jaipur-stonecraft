"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CategoryCatalogue.module.css";

export default function CategoryCatalogue({ designs = [], categoryName = "" }) {
  const [materialFilter, setMaterialFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [finishFilter, setFinishFilter] = useState("all");

  // Helper to extract effective material from product
  const getProductMaterials = (d) => {
    if (Array.isArray(d.variants?.materials) && d.variants.materials.length > 0) {
      return d.variants.materials;
    }
    const mat = d.attributes?.stoneVariety || d.primaryMaterial?.name || "Makrana Pure White Marble";
    return [mat];
  };

  // Helper to extract effective sizes from product
  const getProductSizes = (d) => {
    if (Array.isArray(d.variants?.sizes) && d.variants.sizes.length > 0) {
      return d.variants.sizes;
    }
    const h = d.attributes?.dimensions?.heightInches || d.attributes?.dimensions_height_inches;
    if (h) return [`${h} Inches`];
    return [];
  };

  // Helper to extract effective finishes from product
  const getProductFinishes = (d) => {
    if (Array.isArray(d.variants?.finishes) && d.variants.finishes.length > 0) {
      return d.variants.finishes;
    }
    const f = d.attributes?.finish;
    if (f) return [f];
    return [];
  };

  // Collect unique materials, sizes, finishes from designs
  const availableMaterials = useMemo(() => {
    const set = new Set();
    designs.forEach((d) => {
      getProductMaterials(d).forEach((m) => set.add(m));
    });
    return Array.from(set);
  }, [designs]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    designs.forEach((d) => {
      getProductSizes(d).forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [designs]);

  const availableFinishes = useMemo(() => {
    const set = new Set();
    designs.forEach((d) => {
      getProductFinishes(d).forEach((f) => set.add(f));
    });
    return Array.from(set);
  }, [designs]);

  // Filter designs dynamically
  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      if (materialFilter !== "all") {
        const mats = getProductMaterials(d);
        if (!mats.includes(materialFilter)) return false;
      }
      if (sizeFilter !== "all") {
        const sizes = getProductSizes(d);
        if (!sizes.includes(sizeFilter)) return false;
      }
      if (finishFilter !== "all") {
        const finishes = getProductFinishes(d);
        if (!finishes.includes(finishFilter)) return false;
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
                material={getProductMaterials(design)[0] || "Makrana Pure White Marble"}
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
