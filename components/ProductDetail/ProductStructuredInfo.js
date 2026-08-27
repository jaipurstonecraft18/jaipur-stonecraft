"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ProductStructuredInfo.module.css";

export default function ProductStructuredInfo({ design }) {
  const [activeTab, setActiveTab] = useState("material");

  const tabs = [
    { id: "material", label: "Material & Origin" },
    { id: "custom", label: "Custom Sizing" },
    { id: "technique", label: "Crafting Technique" },
    { id: "care", label: "Care & Maintenance" },
    { id: "shipping", label: "Packaging & Delivery" },
  ];

  return (
    <section className={styles.infoSection} aria-label="Detailed Specifications">
      <ScrollReveal animation="fade-up">
        <div className={styles.header}>
          <span className={styles.eyebrow}>FACTUAL SPECIFICATIONS</span>
          <h2 className={styles.heading}>Product Specifications & Details</h2>
        </div>

        <div className={styles.tabsWrapper}>
          {/* Tab Navigation */}
          <div className={styles.tabList} role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className={styles.panelContainer}>
            {activeTab === "material" && (
              <div className={styles.panelContent}>
                <h3 className={styles.panelTitle}>Material & Origin</h3>
                <p className={styles.panelText}>
                  Sculpted from <strong>{design.primaryMaterial ? design.primaryMaterial.name : "White Makrana Marble"}</strong>, 
                  sourced directly from regional quarries in Rajasthan, India. Makrana marble is renowned worldwide for its 
                  high calcite purity (98%+), fine crystalline density, and natural resistance to discoloration over time.
                </p>
                <div className={styles.gridList}>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Primary Stone</span>
                    <span className={styles.itemVal}>{design.primaryMaterial ? design.primaryMaterial.name : "White Makrana Marble"}</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Quarry Origin</span>
                    <span className={styles.itemVal}>{design.primaryMaterial ? design.primaryMaterial.origin : "Nagaur / Bharatpur, Rajasthan"}</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Calcite Purity</span>
                    <span className={styles.itemVal}>98%+ Natural Crystalline</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Weathering</span>
                    <span className={styles.itemVal}>High Climate Resistance</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "custom" && (
              <div className={styles.panelContent}>
                <h3 className={styles.panelTitle}>Custom Dimensions & Scale Model</h3>
                <p className={styles.panelText}>
                  Jaipur Stonecraft produces each artwork custom to order. We do not restrict sculptures to a single fixed height or weight. 
                  Whether you require a compact 2-foot home shrine murti or an imposing 8-foot architectural entrance sculpture, 
                  our artisans carve the piece to your exact blueprints. Total structural weight varies proportionally based on final dimensions.
                </p>
                <div className={styles.gridList}>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Height Range</span>
                    <span className={styles.itemVal}>Custom (12 inches to 12+ feet)</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Proportion Mapping</span>
                    <span className={styles.itemVal}>1:1 Chalk Grid & Clay Maquette</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Weight</span>
                    <span className={styles.itemVal}>Calculated per custom size & stone density</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Blueprint Matching</span>
                    <span className={styles.itemVal}>CAD & Hand Sketch Support</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "technique" && (
              <div className={styles.panelContent}>
                <h3 className={styles.panelTitle}>Generational Carving Technique</h3>
                <p className={styles.panelText}>
                  Carved completely by hand using tempered steel point chisels, flat chisels, claw chisels, and wooden mallets. 
                  Surface finishing is achieved using progressive silicon carbide water stones (120 to 1200 grit) to reveal a smooth 
                  matte or polished luster without synthetic chemical lacquer coats.
                </p>
                <div className={styles.gridList}>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Carving Method</span>
                    <span className={styles.itemVal}>100% Manual Steel Chisel</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Surface Finish</span>
                    <span className={styles.itemVal}>Water-Stone Honed / Velvet Matte</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Detailing</span>
                    <span className={styles.itemVal}>Hand-carved facial serenity & relief depth</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Chemical Coating</span>
                    <span className={styles.itemVal}>None (Pure Natural Stone Surface)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <div className={styles.panelContent}>
                <h3 className={styles.panelTitle}>Placement & Maintenance</h3>
                <p className={styles.panelText}>
                  Suitable for both indoor sanctuaries and outdoor garden spaces. Natural marble requires minimal care: 
                  clean periodically with plain water and a soft cotton cloth. Avoid harsh acidic chemical cleaners or bleach. 
                  For outdoor placement, an optional food-safe hydrophobic stone sealer can be applied upon request.
                </p>
                <div className={styles.gridList}>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Suitable Placement</span>
                    <span className={styles.itemVal}>{design.attributes ? design.attributes.environment : "Indoor & Outdoor Sanctuary"}</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Cleaning</span>
                    <span className={styles.itemVal}>Fresh water & soft cotton cloth</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Stain Protection</span>
                    <span className={styles.itemVal}>Optional Hydrophobic Sealing</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className={styles.panelContent}>
                <h3 className={styles.panelTitle}>Export Crating & Delivery</h3>
                <p className={styles.panelText}>
                  All sculptures are encased in tailor-made ISPM 15 heat-treated export wooden crates. Inside the crate, 
                  pieces are secured with high-density EVA shock-absorbing foam inserts and moisture-sealed foil wrap to prevent transit damage during sea or air freight.
                </p>
                <div className={styles.gridList}>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Crate Standard</span>
                    <span className={styles.itemVal}>ISPM 15 Heat-Treated Timber</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Internal Cushioning</span>
                    <span className={styles.itemVal}>High-Density EVA Foam Inserts</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.itemLabel}>Global Transit</span>
                    <span className={styles.itemVal}>Door-to-door / Port delivery (US, UK, UAE, etc.)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
