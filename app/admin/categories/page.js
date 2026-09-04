"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminCategoriesCoverPage() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'subcategories' | 'categories' | 'collections'
  const [activeTab, setActiveTab] = useState("subcategories");

  // Filtering State
  const [selectedCollection, setSelectedCollection] = useState("sculptures-statues");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Feedback & Save State
  const [message, setMessage] = useState({ type: "", text: "" });
  const [savingOrder, setSavingOrder] = useState(false);

  // Drag and drop state
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
      if (data.collections) {
        setCollections(data.collections);
        if (!selectedCollection && data.collections.length > 0) {
          setSelectedCollection(data.collections[0].slug);
        }
      }
      if (data.subcategories) {
        setSubcategories(data.subcategories);
        if (!selectedSubcategory && data.subcategories.length > 0) {
          setSelectedSubcategory(data.subcategories[0].slug);
        }
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Failed to load category data." });
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

  // Update selected subcategory when selected collection changes
  useEffect(() => {
    const subsInCol = subcategories.filter(
      (s) => s.parent_collection_slug === selectedCollection || s.parentCollection === selectedCollection
    );
    if (subsInCol.length > 0 && !subsInCol.some((s) => s.slug === selectedSubcategory)) {
      setSelectedSubcategory(subsInCol[0].slug);
    }
  }, [selectedCollection, subcategories]);

  // Upload cover photo
  const handleCoverUpload = async (item, file, type = "subcategory") => {
    if (!file) return;

    setMessage({ type: "info", text: `Uploading image for ${item.name || item.slug}...` });
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

  // Update single cover URL
  const updateCoverUrl = async (slug, imageSrc, imageAlt, type = "subcategory") => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, imageSrc, imageAlt, type })
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: `Updated cover image for ${slug}` });
        // Update local state directly for instant feedback
        if (type === "subcategory") {
          setSubcategories((prev) =>
            prev.map((s) => (s.slug === slug ? { ...s, imageSrc, image_src: imageSrc } : s))
          );
        } else if (type === "category") {
          setCategories((prev) =>
            prev.map((c) => (c.slug === slug ? { ...c, imageSrc, image_src: imageSrc } : c))
          );
        } else {
          setCollections((prev) =>
            prev.map((col) => (col.slug === slug ? { ...col, imageSrc, image_src: imageSrc } : col))
          );
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update cover." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save cover image." });
    }
  };

  // Reorder save function
  const saveReorderedList = async (newList, type) => {
    setSavingOrder(true);
    const items = newList.map((item, idx) => ({
      slug: item.slug,
      sortOrder: idx + 1
    }));

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", type, items })
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: `✓ Order saved successfully!` });
        // Refresh local items with new sort orders
        if (type === "subcategory") {
          setSubcategories((prev) => {
            const map = new Map(newList.map((it, idx) => [it.slug, idx + 1]));
            return prev.map((it) => (map.has(it.slug) ? { ...it, sortOrder: map.get(it.slug) } : it));
          });
        } else if (type === "category") {
          setCategories((prev) => {
            const map = new Map(newList.map((it, idx) => [it.slug, idx + 1]));
            return prev.map((it) => (map.has(it.slug) ? { ...it, sortOrder: map.get(it.slug) } : it));
          });
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save order." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error saving order." });
    } finally {
      setSavingOrder(false);
    }
  };

  // Drag & drop handlers
  const onDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const onDragLeave = () => {
    setDragOverIndex(null);
  };

  const onDrop = async (e, targetIndex, currentList, type) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }

    const updated = [...currentList];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setDragIndex(null);

    await saveReorderedList(updated, type);
  };

  // Up / Down arrow handlers
  const moveItem = async (index, direction, currentList, type) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const updated = [...currentList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    await saveReorderedList(updated, type);
  };

  // Filtered lists for rendering
  const filteredSubcategories = subcategories
    .filter(
      (s) =>
        (!selectedCollection || s.parent_collection_slug === selectedCollection || s.parentCollection === selectedCollection) &&
        (!searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.slug.includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

  const filteredCategories = categories
    .filter((c) => {
      const matchCol = !selectedCollection || c.parent_collection_slug === selectedCollection || c.parentCollection === selectedCollection;
      const matchSub = !selectedSubcategory || c.parent_subcategory_slug === selectedSubcategory || c.parentSubcategory === selectedSubcategory;
      const matchQuery = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.includes(searchQuery.toLowerCase());
      return matchCol && matchSub && matchQuery;
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Nested Categories & Covers Manager</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Manage cover images and drag-and-drop display order for subcategories and individual category collections
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/catalogue" className={styles.secondaryBtn}>
            🏷️ Catalogue & Taxonomy
          </Link>
          <Link href="/collections" target="_blank" className={styles.primaryBtn}>
            View Collections ↗
          </Link>
        </div>
      </div>

      {message.text && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            backgroundColor:
              message.type === "success" ? "#E6F4EA" : message.type === "info" ? "#E8F0FE" : "#FCE8E6",
            color:
              message.type === "success" ? "#137333" : message.type === "info" ? "#1A73E8" : "#C5221F",
            fontWeight: "600",
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ type: "", text: "" })}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TABS */}
      <div className={styles.studioTabs}>
        <button
          className={`${styles.studioTab} ${activeTab === "subcategories" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("subcategories")}
        >
          1. Subcategories / Nested Collections ({subcategories.length})
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "categories" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          2. Categories ({categories.length})
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "collections" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("collections")}
        >
          3. Top Collections ({collections.length})
        </button>
      </div>

      {loading ? (
        <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          Loading taxonomy cover image data...
        </div>
      ) : activeTab === "subcategories" ? (
        /* ========================================================================= */
        /* TAB 1: SUBCATEGORIES (NESTED COLLECTIONS)                                */
        /* ========================================================================= */
        <div>
          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "#FFF",
              borderRadius: "6px",
              border: "1px solid #E2DDD5"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#444" }}>
                Select Parent Collection:
              </label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className={styles.select}
                style={{ minWidth: "240px", fontWeight: "600", padding: "0.4rem 0.75rem" }}
              >
                {collections.map((col) => (
                  <option key={col.slug} value={col.slug}>
                    {col.name} ({col.slug})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subcategory..."
                className={styles.input}
                style={{ maxWidth: "200px", fontSize: "0.85rem", padding: "0.4rem 0.75rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "#666" }}>
                ↕ Drag rows or use ▲/▼ buttons to reorder
              </span>
            </div>
          </div>

          {/* Subcategories Table with Drag-and-Drop */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "40px", textAlign: "center" }}>↕</th>
                  <th style={{ width: "50px", textAlign: "center" }}>Order</th>
                  <th style={{ width: "90px" }}>Cover</th>
                  <th>Subcategory Name</th>
                  <th>Slug</th>
                  <th>Cover Image URL</th>
                  <th style={{ textAlign: "right", width: "160px" }}>Upload / Replace</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubcategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                      No subcategories found for this collection.
                    </td>
                  </tr>
                ) : (
                  filteredSubcategories.map((sub, index) => {
                    const isDragging = dragIndex === index;
                    const isOver = dragOverIndex === index;
                    const coverUrl = sub.imageSrc || sub.image_src;

                    return (
                      <tr
                        key={sub.slug}
                        draggable
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, index, filteredSubcategories, "subcategory")}
                        className={`${styles.dragRow} ${isDragging ? styles.dragRowDragging : ""} ${
                          isOver ? styles.dragRowOver : ""
                        }`}
                      >
                        {/* Drag Handle */}
                        <td style={{ textAlign: "center" }}>
                          <span className={styles.dragHandle} title="Drag to reorder">
                            ⋮⋮
                          </span>
                        </td>

                        {/* Order Position & Up/Down Arrows */}
                        <td style={{ textAlign: "center" }}>
                          <div className={styles.orderControls}>
                            <span className={styles.orderBadge}>{index + 1}</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                              <button
                                type="button"
                                disabled={index === 0 || savingOrder}
                                onClick={() => moveItem(index, -1, filteredSubcategories, "subcategory")}
                                className={styles.orderBtn}
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={index === filteredSubcategories.length - 1 || savingOrder}
                                onClick={() => moveItem(index, 1, filteredSubcategories, "subcategory")}
                                className={styles.orderBtn}
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Cover Preview */}
                        <td>
                          <img
                            src={coverUrl}
                            alt={sub.name}
                            style={{
                              width: "72px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              backgroundColor: "#E8E4DF",
                              border: "1px solid #DDD"
                            }}
                            onError={(e) => {
                              e.target.src = "https://placehold.co/100x75/E8E4DF/1A1918?text=No+Cover";
                            }}
                          />
                        </td>

                        {/* Name & Link */}
                        <td>
                          <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{sub.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#666", marginTop: "2px" }}>
                            {sub.description ? sub.description.substring(0, 60) + "..." : "No description"}
                          </div>
                          <Link
                            href={`/collections/${sub.parent_collection_slug || selectedCollection}/${sub.slug}`}
                            target="_blank"
                            style={{ fontSize: "0.75rem", color: "var(--color-bronze)", textDecoration: "underline" }}
                          >
                            View on Site ↗
                          </Link>
                        </td>

                        {/* Slug */}
                        <td>
                          <code style={{ fontSize: "0.78rem", color: "#555" }}>{sub.slug}</code>
                        </td>

                        {/* Cover Image Input */}
                        <td>
                          <input
                            type="text"
                            value={coverUrl || ""}
                            onChange={(e) => updateCoverUrl(sub.slug, e.target.value, sub.name, "subcategory")}
                            placeholder="Image URL..."
                            className={styles.input}
                            style={{ fontSize: "0.8rem", padding: "0.35rem 0.5rem", width: "100%" }}
                          />
                        </td>

                        {/* Upload Button */}
                        <td style={{ textAlign: "right" }}>
                          <label
                            className={styles.primaryBtn}
                            style={{
                              padding: "0.35rem 0.75rem",
                              fontSize: "0.78rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem"
                            }}
                          >
                            📷 Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleCoverUpload(sub, e.target.files[0], "subcategory")}
                            />
                          </label>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "categories" ? (
        /* ========================================================================= */
        /* TAB 2: CATEGORIES (NESTED IN SUBCATEGORIES)                              */
        /* ========================================================================= */
        <div>
          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "#FFF",
              borderRadius: "6px",
              border: "1px solid #E2DDD5"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#444", display: "block" }}>
                  1. Parent Collection:
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className={styles.select}
                  style={{ minWidth: "200px", padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                >
                  {collections.map((col) => (
                    <option key={col.slug} value={col.slug}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#444", display: "block" }}>
                  2. Subcategory:
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className={styles.select}
                  style={{ minWidth: "220px", fontWeight: "600", padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                >
                  {subcategories
                    .filter(
                      (s) =>
                        s.parent_collection_slug === selectedCollection || s.parentCollection === selectedCollection
                    )
                    .map((sub) => (
                      <option key={sub.slug} value={sub.slug}>
                        {sub.name} ({sub.slug})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className={styles.input}
                style={{ maxWidth: "200px", fontSize: "0.85rem", padding: "0.4rem 0.75rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "#666" }}>
                ↕ Drag rows or use ▲/▼ buttons to reorder
              </span>
            </div>
          </div>

          {/* Categories Table with Drag-and-Drop */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "40px", textAlign: "center" }}>↕</th>
                  <th style={{ width: "50px", textAlign: "center" }}>Order</th>
                  <th style={{ width: "90px" }}>Cover</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Cover Image URL</th>
                  <th style={{ textAlign: "right", width: "160px" }}>Upload / Replace</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                      No categories found in this subcategory.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat, index) => {
                    const isDragging = dragIndex === index;
                    const isOver = dragOverIndex === index;
                    const coverUrl = cat.imageSrc || cat.image_src;

                    return (
                      <tr
                        key={cat.slug}
                        draggable
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, index, filteredCategories, "category")}
                        className={`${styles.dragRow} ${isDragging ? styles.dragRowDragging : ""} ${
                          isOver ? styles.dragRowOver : ""
                        }`}
                      >
                        {/* Drag Handle */}
                        <td style={{ textAlign: "center" }}>
                          <span className={styles.dragHandle} title="Drag to reorder">
                            ⋮⋮
                          </span>
                        </td>

                        {/* Order Position & Up/Down Arrows */}
                        <td style={{ textAlign: "center" }}>
                          <div className={styles.orderControls}>
                            <span className={styles.orderBadge}>{index + 1}</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                              <button
                                type="button"
                                disabled={index === 0 || savingOrder}
                                onClick={() => moveItem(index, -1, filteredCategories, "category")}
                                className={styles.orderBtn}
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={index === filteredCategories.length - 1 || savingOrder}
                                onClick={() => moveItem(index, 1, filteredCategories, "category")}
                                className={styles.orderBtn}
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Cover Preview */}
                        <td>
                          <img
                            src={coverUrl}
                            alt={cat.name}
                            style={{
                              width: "72px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              backgroundColor: "#E8E4DF",
                              border: "1px solid #DDD"
                            }}
                            onError={(e) => {
                              e.target.src = "https://placehold.co/100x75/E8E4DF/1A1918?text=No+Cover";
                            }}
                          />
                        </td>

                        {/* Name & Link */}
                        <td>
                          <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{cat.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#666", marginTop: "2px" }}>
                            {cat.usedByProductsCount || 0} product(s) linked
                          </div>
                          <Link
                            href={`/collections/${cat.parentCollection || selectedCollection}/${cat.parentSubcategory || selectedSubcategory}/${cat.slug}`}
                            target="_blank"
                            style={{ fontSize: "0.75rem", color: "var(--color-bronze)", textDecoration: "underline" }}
                          >
                            View on Site ↗
                          </Link>
                        </td>

                        {/* Slug */}
                        <td>
                          <code style={{ fontSize: "0.78rem", color: "#555" }}>{cat.slug}</code>
                        </td>

                        {/* Cover Image Input */}
                        <td>
                          <input
                            type="text"
                            value={coverUrl || ""}
                            onChange={(e) => updateCoverUrl(cat.slug, e.target.value, cat.image_alt || cat.name, "category")}
                            placeholder="Image URL..."
                            className={styles.input}
                            style={{ fontSize: "0.8rem", padding: "0.35rem 0.5rem", width: "100%" }}
                          />
                        </td>

                        {/* Upload Button */}
                        <td style={{ textAlign: "right" }}>
                          <label
                            className={styles.primaryBtn}
                            style={{
                              padding: "0.35rem 0.75rem",
                              fontSize: "0.78rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem"
                            }}
                          >
                            📷 Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleCoverUpload(cat, e.target.files[0], "category")}
                            />
                          </label>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB 3: TOP COLLECTIONS                                                   */
        /* ========================================================================= */
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Cover</th>
                <th>Collection Name</th>
                <th>Slug</th>
                <th>Cover Image URL</th>
                <th style={{ textAlign: "right", width: "160px" }}>Upload / Replace</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col.slug}>
                  <td>
                    <img
                      src={col.imageSrc || col.image_src}
                      alt={col.name}
                      style={{
                        width: "72px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        backgroundColor: "#E8E4DF",
                        border: "1px solid #DDD"
                      }}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x75/E8E4DF/1A1918?text=No+Cover";
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{col.name}</div>
                    <Link
                      href={`/collections/${col.slug}`}
                      target="_blank"
                      style={{ fontSize: "0.75rem", color: "var(--color-bronze)", textDecoration: "underline" }}
                    >
                      View Collection ↗
                    </Link>
                  </td>
                  <td>
                    <code style={{ fontSize: "0.8rem", color: "#555" }}>{col.slug}</code>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={col.imageSrc || col.image_src || ""}
                      onChange={(e) => updateCoverUrl(col.slug, e.target.value, col.name, "collection")}
                      placeholder="Image URL..."
                      className={styles.input}
                      style={{ fontSize: "0.8rem", padding: "0.35rem 0.5rem", width: "100%" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <label
                      className={styles.primaryBtn}
                      style={{
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}
                    >
                      📷 Upload Photo
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
