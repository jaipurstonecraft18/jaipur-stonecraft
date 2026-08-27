"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminHealthPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeQueue, setActiveQueue] = useState("missingCover");

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      const data = await res.json();
      setHealthData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) fetchHealth();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  if (loading || !healthData) {
    return (
      <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
        Scanning catalogue quality & product health metrics...
      </div>
    );
  }

  const { summary } = healthData;
  const currentList = healthData[activeQueue] || [];

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Product Health & Quality Queue</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Actionable work queue identifying missing product information, photos, and incomplete drafts
          </p>
        </div>
        <Link href="/admin/products" className={styles.secondaryBtn}>
          ← Back to Products List
        </Link>
      </div>

      {/* Actionable Health Metric Cards */}
      <div className={styles.statsGrid}>
        <div
          className={styles.statCard}
          style={{ cursor: "pointer", borderLeft: activeQueue === "missingCover" ? "4px solid #C5221F" : "1px solid #E2DDD5" }}
          onClick={() => setActiveQueue("missingCover")}
        >
          <div className={styles.statLabel}>Missing Cover Photos</div>
          <div className={styles.statValue} style={{ color: "#C5221F" }}>{summary.missingCoverCount}</div>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Using placeholder photos</span>
        </div>

        <div
          className={styles.statCard}
          style={{ cursor: "pointer", borderLeft: activeQueue === "missingDescription" ? "4px solid #B06000" : "1px solid #E2DDD5" }}
          onClick={() => setActiveQueue("missingDescription")}
        >
          <div className={styles.statLabel}>Incomplete Descriptions</div>
          <div className={styles.statValue} style={{ color: "#B06000" }}>{summary.missingDescriptionCount}</div>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Missing summary text</span>
        </div>

        <div
          className={styles.statCard}
          style={{ cursor: "pointer", borderLeft: activeQueue === "missingClassification" ? "4px solid #5F6368" : "1px solid #E2DDD5" }}
          onClick={() => setActiveQueue("missingClassification")}
        >
          <div className={styles.statLabel}>Untagged Classification</div>
          <div className={styles.statValue} style={{ color: "#5F6368" }}>{summary.missingClassificationCount}</div>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Missing material / category</span>
        </div>

        <div
          className={styles.statCard}
          style={{ cursor: "pointer", borderLeft: activeQueue === "draftQueue" ? "4px solid #137333" : "1px solid #E2DDD5" }}
          onClick={() => setActiveQueue("draftQueue")}
        >
          <div className={styles.statLabel}>Draft Queue</div>
          <div className={styles.statValue} style={{ color: "#137333" }}>{summary.draftQueueCount}</div>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Awaiting publication</span>
        </div>
      </div>

      {/* Actionable Product Queue Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableControls}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            Action Queue: {activeQueue === "missingCover" ? "Products Missing Cover Photos" : activeQueue === "missingDescription" ? "Products Needing Descriptions" : activeQueue === "missingClassification" ? "Products Needing Classification" : "Draft Products Awaiting Publication"}
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>
            Showing {currentList.length} items needing attention
          </span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Cover</th>
              <th>Product Name</th>
              <th>SKU / Slug</th>
              <th>Category</th>
              <th>Material</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#137333", fontWeight: "600" }}>
                  ✓ Great job! No products currently need attention in this queue.
                </td>
              </tr>
            ) : (
              currentList.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.imageSrc} alt={p.name} className={styles.thumbImg} />
                  </td>
                  <td style={{ fontWeight: "600" }}>
                    <Link href={`/admin/products/${p.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {p.name}
                    </Link>
                  </td>
                  <td><code style={{ fontSize: "0.78rem", color: "#555" }}>{p.sku}</code></td>
                  <td>{p.parentCategory}</td>
                  <td>{p.primaryMaterial?.name || p.primaryMaterialId}</td>
                  <td>
                    <span className={`${styles.badge} ${p.status === "published" ? styles.badgePublished : styles.badgeDraft}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link
                      href={`/admin/products/${p.slug}`}
                      className={styles.primaryBtn}
                      style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                    >
                      Fix Product →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
