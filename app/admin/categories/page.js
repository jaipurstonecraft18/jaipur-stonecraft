"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminCategoriesCoverPage() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
      if (data.collections) setCollections(data.collections);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) fetchCategoryData();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const handleCoverUpload = async (item, file, type = "category") => {
    if (!file) return;

    setMessage({ type: "", text: "" });
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", "categories");
    formData.append("productSlug", item.slug);

    try {
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.success && uploadData.images && uploadData.images.length > 0) {
        const newUrl = uploadData.images[0].url;
        await updateCoverUrl(item.slug, newUrl, item.image_alt || item.name, type);
      } else {
        setMessage({ type: "error", text: uploadData.error || "Upload failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error uploading cover image." });
    }
  };

  const updateCoverUrl = async (slug, imageSrc, imageAlt, type = "category") => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, imageSrc, imageAlt, type })
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: `Updated cover image for ${slug}` });
        fetchCategoryData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update cover." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save cover image." });
    }
  };

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Category & Collection Cover Manager</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Upload and update primary hero cover images for collections and categories
          </p>
        </div>
        <Link href="/admin/catalogue" className={styles.primaryBtn}>
          🏷️ Open Catalogue & Taxonomy Manager →
        </Link>
      </div>

      {/* Unified Taxonomy Notice Banner */}
      <div style={{
        padding: "1rem 1.25rem",
        backgroundColor: "#FAF0E6",
        border: "1px solid var(--color-bronze)",
        borderRadius: "6px",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <strong style={{ color: "var(--color-navy)", display: "block", marginBottom: "0.2rem" }}>
            💡 Category & Collection Management is Unified in Catalogue & Taxonomy
          </strong>
          <span style={{ fontSize: "0.85rem", color: "#555" }}>
            You can manage cover images, subcategory assignments, materials, subjects, and descriptions directly inside the Catalogue & Taxonomy Manager.
          </span>
        </div>
        <Link href="/admin/catalogue" className={styles.secondaryBtn} style={{ borderColor: "var(--color-bronze)", fontWeight: "600" }}>
          Go to Catalogue & Taxonomy
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

      {/* Tabs */}
      <div className={styles.studioTabs}>
        <button
          className={`${styles.studioTab} ${activeTab === "categories" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories ({categories.length})
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "collections" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("collections")}
        >
          Top Collections ({collections.length})
        </button>
      </div>

      {loading ? (
        <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          Loading taxonomy cover image data...
        </div>
      ) : activeTab === "categories" ? (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Preview</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Parent Collection</th>
                <th>Cover Image URL</th>
                <th style={{ textAlign: "right" }}>Upload New Cover <span style={{ fontSize: "0.72rem", color: "#888", display: "block" }}>📐 4:3 (800 × 600 px)</span></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.slug}>
                  <td>
                    <img
                      src={cat.image_src}
                      alt={cat.name}
                      style={{ width: "64px", height: "48px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#E8E4DF" }}
                      onError={(e) => { e.target.src = "https://placehold.co/100x75/E8E4DF/1A1918?text=Cover"; }}
                    />
                  </td>
                  <td style={{ fontWeight: "600" }}>{cat.name}</td>
                  <td><code style={{ fontSize: "0.8rem", color: "#555" }}>{cat.slug}</code></td>
                  <td>{cat.parent_collection_slug}</td>
                  <td>
                    <input
                      type="text"
                      value={cat.image_src || ""}
                      onChange={(e) => updateCoverUrl(cat.slug, e.target.value, cat.image_alt, "category")}
                      className={styles.input}
                      style={{ fontSize: "0.8rem", padding: "0.3rem 0.5rem" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <label className={styles.secondaryBtn} style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", cursor: "pointer" }}>
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleCoverUpload(cat, e.target.files[0], "category")}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Preview</th>
                <th>Collection Name</th>
                <th>Slug</th>
                <th>Cover Image URL</th>
                <th style={{ textAlign: "right" }}>Upload New Cover <span style={{ fontSize: "0.72rem", color: "#888", display: "block" }}>📐 4:3 (800 × 600 px)</span></th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col.slug}>
                  <td>
                    <img
                      src={col.image_src}
                      alt={col.name}
                      style={{ width: "64px", height: "48px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#E8E4DF" }}
                      onError={(e) => { e.target.src = "https://placehold.co/100x75/E8E4DF/1A1918?text=Cover"; }}
                    />
                  </td>
                  <td style={{ fontWeight: "600" }}>{col.name}</td>
                  <td><code style={{ fontSize: "0.8rem", color: "#555" }}>{col.slug}</code></td>
                  <td>
                    <input
                      type="text"
                      value={col.image_src || ""}
                      onChange={(e) => updateCoverUrl(col.slug, e.target.value, "", "collection")}
                      className={styles.input}
                      style={{ fontSize: "0.8rem", padding: "0.3rem 0.5rem" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <label className={styles.secondaryBtn} style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", cursor: "pointer" }}>
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleCoverUpload(col, e.target.files[0], "collection")}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
