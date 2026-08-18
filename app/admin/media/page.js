"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [summary, setSummary] = useState({ totalCount: 0, usedCount: 0, unusedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'used' | 'unused'
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deletingUrl, setDeletingUrl] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
        setSummary({
          totalCount: data.totalCount || 0,
          usedCount: data.usedCount || 0,
          unusedCount: data.unusedCount || 0
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [searchQuery]);

  const handleDeleteMedia = async (mediaItem) => {
    if (mediaItem.isUsed) {
      alert(`Cannot delete media "${mediaItem.filename}" because it is actively referenced by: ${mediaItem.references.map(r => `${r.type}: ${r.name}`).join(", ")}`);
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to permanently delete unused media file "${mediaItem.filename}"?`);
    if (!confirmDelete) return;

    setDeletingUrl(mediaItem.url);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`/api/admin/media?url=${encodeURIComponent(mediaItem.url)}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        fetchMedia();
      } else {
        setMessage({ type: "error", text: data.error || "Delete failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error deleting file." });
    } finally {
      setDeletingUrl(null);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    if (filter === "used") return m.isUsed;
    if (filter === "unused") return !m.isUsed;
    return true;
  });

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Shared Media & Reference Inspector</h1>
          <p style={{ color: "#666", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Inspect uploaded images, verify product/category references, and safely delete unreferenced files
          </p>
        </div>
        <Link href="/admin/products" className={styles.secondaryBtn}>
          ← Back to Products
        </Link>
      </div>

      {message.text && (
        <div style={{
          padding: "0.75rem 1rem",
          borderRadius: "4px",
          marginBottom: "1.5rem",
          backgroundColor: message.type === "success" ? "#E6F4EA" : "#FCE8E6",
          color: message.type === "success" ? "#137333" : "#C5221F",
          fontWeight: "600",
          fontSize: "0.85rem"
        }}>
          {message.text}
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className={styles.statsGrid}>
        <div
          className={styles.statCard}
          style={{ cursor: "pointer", borderLeft: filter === "all" ? "4px solid var(--color-bronze)" : "1px solid #E2DDD5" }}
          onClick={() => setFilter("all")}
        >
          <div className={styles.statLabel}>Total Uploaded Media</div>
          <div className={styles.statValue}>{summary.totalCount}</div>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Processed WebP variants</span>
        </div>

        <div
          className={styles.statCard}
          style={{ cursor: "pointer", borderLeft: filter === "used" ? "4px solid #137333" : "1px solid #E2DDD5" }}
          onClick={() => setFilter("used")}
        >
          <div className={styles.statLabel}>Actively Referenced</div>
          <div className={styles.statValue} style={{ color: "#137333" }}>{summary.usedCount}</div>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>In products/categories</span>
        </div>

        <div
          className={styles.statCard}
          style={{ cursor: "pointer", borderLeft: filter === "unused" ? "4px solid #C5221F" : "1px solid #E2DDD5" }}
          onClick={() => setFilter("unused")}
        >
          <div className={styles.statLabel}>Unused Media</div>
          <div className={styles.statValue} style={{ color: "#C5221F" }}>{summary.unusedCount}</div>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>Safe to prune</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div className={styles.studioTabs} style={{ marginBottom: 0 }}>
          <button
            className={`${styles.studioTab} ${filter === "all" ? styles.studioTabActive : ""}`}
            onClick={() => setFilter("all")}
          >
            All Media ({summary.totalCount})
          </button>
          <button
            className={`${styles.studioTab} ${filter === "used" ? styles.studioTabActive : ""}`}
            onClick={() => setFilter("used")}
          >
            Referenced ({summary.usedCount})
          </button>
          <button
            className={`${styles.studioTab} ${filter === "unused" ? styles.studioTabActive : ""}`}
            onClick={() => setFilter("unused")}
          >
            Unused ({summary.unusedCount})
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter filename..."
          className={styles.input}
          style={{ maxWidth: "240px", fontSize: "0.85rem", padding: "0.4rem 0.75rem" }}
        />
      </div>

      {loading ? (
        <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          Scanning media directory & database references...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          No media files found matching the current filter.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {filteredMedia.map((item) => (
            <div key={item.url} className={styles.tableCard} style={{ padding: "1rem", display: "flex", flexDirection: "column" }}>
              <img
                src={item.url}
                alt={item.filename}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#E8E4DF", marginBottom: "0.75rem" }}
                onError={(e) => { e.target.src = "https://placehold.co/400x300/E8E4DF/1A1918?text=Image+Unavailable"; }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.85rem", wordBreak: "break-all" }}>{item.filename}</div>
                  <div style={{ fontSize: "0.75rem", color: "#666" }}>Folder: {item.folder} • {item.sizeKb} KB</div>
                </div>
                <span className={`${styles.badge} ${item.isUsed ? styles.badgePublished : styles.badgeArchived}`}>
                  {item.isUsed ? "Used" : "Unused"}
                </span>
              </div>

              {/* Reference Details */}
              <div style={{ fontSize: "0.78rem", color: "#555", backgroundColor: "#FAFAFA", padding: "0.5rem", borderRadius: "4px", marginBottom: "0.85rem", flexGrow: 1 }}>
                {item.isUsed ? (
                  <div>
                    <div style={{ fontWeight: "600", color: "#137333", marginBottom: "0.2rem" }}>✓ Active References:</div>
                    {item.references.map((r, i) => (
                      <div key={i} style={{ wordBreak: "break-all" }}>
                        • {r.type.toUpperCase()}: {r.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#C5221F", fontWeight: "500" }}>
                    ⚠️ No active database references. Safe to prune.
                  </div>
                )}
              </div>

              {!item.isUsed && (
                <button
                  type="button"
                  disabled={deletingUrl === item.url}
                  onClick={() => handleDeleteMedia(item)}
                  className={styles.secondaryBtn}
                  style={{ width: "100%", justifyContent: "center", color: "#C5221F", borderColor: "#FCE8E6", fontSize: "0.78rem", padding: "0.35rem 0.5rem", minHeight: "36px" }}
                >
                  {deletingUrl === item.url ? "Deleting..." : "🗑 Delete Unused File"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
