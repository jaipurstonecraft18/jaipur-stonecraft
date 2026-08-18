"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminCataloguePage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Modal State for Add / Edit Category or Collection
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("category"); // 'category' | 'collection'
  const [editingItem, setEditingItem] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: "",
    slug: "",
    parentCollection: "sculptures-statues",
    parentSubcategory: "hindu-sculptures",
    description: "",
    imageSrc: "",
    imageAlt: "",
    isActive: true
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "Marble",
    origin: "Rajasthan, India",
    colorFamily: "White",
    durability: "High / Millennial Grade",
    isSacredGrade: true,
    description: "",
    synonyms: "",
    tradition: "Vedic / Sacred",
    dataType: "text",
    options: "",
    appliesToProductTypes: []
  });

  const fetchCatalogue = async () => {
    setLoading(true);
    try {
      const [catRes, categoryRes] = await Promise.all([
        fetch("/api/admin/catalogue"),
        fetch("/api/admin/categories")
      ]);

      const catData = await catRes.json();
      const categoryData = await categoryRes.json();

      if (catData.materials) setMaterials(catData.materials);
      if (catData.subjects) setSubjects(catData.subjects);
      if (catData.productTypes) setProductTypes(catData.productTypes);
      if (catData.attributes) setAttributes(catData.attributes);

      if (categoryData.categories) setCategories(categoryData.categories);
      if (categoryData.collections) setCollections(categoryData.collections);
      if (categoryData.subcategories) setSubcategories(categoryData.subcategories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const openAddModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    setCatFormData({
      name: "",
      slug: "",
      parentCollection: collections[0]?.slug || "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      description: "",
      imageSrc: "",
      imageAlt: "",
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (item, type) => {
    setModalType(type);
    setEditingItem(item);
    setCatFormData({
      name: item.name || "",
      slug: item.slug || "",
      parentCollection: item.parentCollection || item.parent_collection_slug || "sculptures-statues",
      parentSubcategory: item.parentSubcategory || item.parent_subcategory_slug || "hindu-sculptures",
      description: item.description || "",
      imageSrc: item.imageSrc || item.image_src || "",
      imageAlt: item.imageAlt || item.image_alt || "",
      isActive: item.isActive !== undefined ? item.isActive : Boolean(item.is_active ?? 1)
    });
    setModalOpen(true);
  };

  const handleSaveCategoryOrCollection = async (e) => {
    e.preventDefault();
    if (!catFormData.name.trim()) {
      alert("Name is required");
      return;
    }

    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: modalType,
          payload: {
            ...catFormData,
            slug: catFormData.slug.trim() || undefined
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        setModalOpen(false);
        fetchCatalogue();
      } else {
        alert(data.error || "Save failed.");
      }
    } catch (err) {
      alert("Network error saving catalogue item.");
    }
  };

  const handleCoverUpload = async (item, file, type = "category") => {
    if (!file) return;

    setMessage({ type: "", text: "" });
    const uploadFormData = new FormData();
    uploadFormData.append("files", file);
    uploadFormData.append("folder", "categories");
    uploadFormData.append("productSlug", item.slug);

    try {
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData
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
        setMessage({ type: "success", text: `Updated cover image for "${slug}".` });
        fetchCatalogue();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update cover." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save cover image." });
    }
  };

  const handleDeleteCategoryOrCollection = async (item, type) => {
    const usageCount = item.usedByProductsCount || 0;
    const confirmMsg = usageCount > 0
      ? `"${item.name}" is referenced by ${usageCount} product(s). Deleting will archive it safely to avoid breaking products. Proceed?`
      : `Are you sure you want to delete "${item.name}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/categories?slug=${encodeURIComponent(item.slug)}&type=${type}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        fetchCatalogue();
      } else {
        alert(data.error || "Delete operation failed.");
      }
    } catch (e) {
      alert("Network error deleting item.");
    }
  };

  const handleSaveEntity = async (entityType) => {
    if (!formData.name.trim()) return;

    setMessage({ type: "", text: "" });

    const payload = {
      ...formData,
      id: editingItem ? editingItem.id : undefined,
      synonyms: formData.synonyms ? formData.synonyms.split(",").map(s => s.trim()).filter(Boolean) : [],
      options: formData.options ? formData.options.split(",").map(s => s.trim()).filter(Boolean) : []
    };

    try {
      const res = await fetch("/api/admin/catalogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, payload })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        setEditingItem(null);
        setFormData({
          name: "",
          category: "Marble",
          origin: "Rajasthan, India",
          colorFamily: "White",
          durability: "High / Millennial Grade",
          isSacredGrade: true,
          description: "",
          synonyms: "",
          tradition: "Vedic / Sacred",
          dataType: "text",
          options: "",
          appliesToProductTypes: []
        });
        fetchCatalogue();
      } else {
        setMessage({ type: "error", text: data.error || "Save failed" });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error occurred" });
    }
  };

  const handleArchiveToggle = async (entityType, item) => {
    const action = item.isActive ? "archive" : "restore";
    const confirmMsg = item.isActive
      ? `Archive "${item.name || item.primaryName}"? (${item.usedByProductsCount || 0} existing products currently use this)`
      : `Restore "${item.name || item.primaryName}" to active catalogue?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/catalogue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, id: item.id, action })
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        fetchCatalogue();
      } else {
        alert(data.error || "Status update failed");
      }
    } catch (e) {
      alert("Error updating status");
    }
  };

  // Filtered Lists based on Search Query
  const filterBySearch = (list, nameKey = "name") => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter((item) => {
      const nameVal = (item[nameKey] || item.primaryName || "").toLowerCase();
      const slugVal = (item.slug || item.id || "").toLowerCase();
      return nameVal.includes(q) || slugVal.includes(q);
    });
  };

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Catalogue & Hierarchy Manager</h1>
          <p style={{ color: "#666", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Manage collections, categories, stone materials, sacred subjects, product types, and attributes
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

      {/* SEARCH BAR, ACTIONS & TABS */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div className={styles.studioTabs} style={{ marginBottom: 0 }}>
          <button
            className={`${styles.studioTab} ${activeTab === "categories" ? styles.studioTabActive : ""}`}
            onClick={() => { setActiveTab("categories"); setEditingItem(null); }}
          >
            Categories ({categories.length})
          </button>
          <button
            className={`${styles.studioTab} ${activeTab === "collections" ? styles.studioTabActive : ""}`}
            onClick={() => { setActiveTab("collections"); setEditingItem(null); }}
          >
            Collections ({collections.length})
          </button>
          <button
            className={`${styles.studioTab} ${activeTab === "materials" ? styles.studioTabActive : ""}`}
            onClick={() => { setActiveTab("materials"); setEditingItem(null); }}
          >
            Materials ({materials.length})
          </button>
          <button
            className={`${styles.studioTab} ${activeTab === "subjects" ? styles.studioTabActive : ""}`}
            onClick={() => { setActiveTab("subjects"); setEditingItem(null); }}
          >
            Subjects ({subjects.length})
          </button>
          <button
            className={`${styles.studioTab} ${activeTab === "productTypes" ? styles.studioTabActive : ""}`}
            onClick={() => { setActiveTab("productTypes"); setEditingItem(null); }}
          >
            Product Types ({productTypes.length})
          </button>
          <button
            className={`${styles.studioTab} ${activeTab === "attributes" ? styles.studioTabActive : ""}`}
            onClick={() => { setActiveTab("attributes"); setEditingItem(null); }}
          >
            Attributes ({attributes.length})
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {activeTab === "categories" && (
            <button type="button" onClick={() => openAddModal("category")} className={styles.primaryBtn} style={{ fontSize: "0.82rem", padding: "0.4rem 0.85rem" }}>
              + Add Category
            </button>
          )}
          {activeTab === "collections" && (
            <button type="button" onClick={() => openAddModal("collection")} className={styles.primaryBtn} style={{ fontSize: "0.82rem", padding: "0.4rem 0.85rem" }}>
              + Add Collection
            </button>
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className={styles.input}
            style={{ maxWidth: "200px", fontSize: "0.85rem", padding: "0.4rem 0.75rem" }}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          Loading catalogue definitions...
        </div>
      ) : activeTab === "categories" ? (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "70px" }}>Cover</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Parent Collection & Subcategory</th>
                <th>Usage</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterBySearch(categories).map((cat) => (
                <tr key={cat.slug} style={{ opacity: cat.isActive ? 1 : 0.6 }}>
                  <td>
                    <img
                      src={cat.imageSrc || cat.image_src}
                      alt={cat.name}
                      style={{ width: "56px", height: "42px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#E8E4DF" }}
                      onError={(e) => { e.target.src = "https://placehold.co/100x75/E8E4DF/1A1918?text=Cover"; }}
                    />
                  </td>
                  <td style={{ fontWeight: "600" }}>{cat.name}</td>
                  <td><code style={{ fontSize: "0.78rem", color: "#555" }}>{cat.slug}</code></td>
                  <td style={{ fontSize: "0.82rem", color: "#555" }}>
                    <div><strong>Collection:</strong> {cat.parentCollection || cat.parent_collection_slug}</div>
                    <div style={{ fontSize: "0.75rem", color: "#777" }}>Sub: {cat.parentSubcategory || cat.parent_subcategory_slug}</div>
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>{cat.usedByProductsCount || 0} product(s)</td>
                  <td>
                    <span className={`${styles.badge} ${cat.isActive ? styles.badgePublished : styles.badgeArchived}`}>
                      {cat.isActive ? "Active" : "Archived"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(cat, "category")}
                        className={styles.secondaryBtn}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                      >
                        Edit
                      </button>
                      <label className={styles.secondaryBtn} style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", cursor: "pointer" }}>
                        Photo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleCoverUpload(cat, e.target.files[0], "category")}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategoryOrCollection(cat, "category")}
                        className={styles.secondaryBtn}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", color: "#C5221F" }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "collections" ? (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "70px" }}>Cover</th>
                <th>Collection Name</th>
                <th>Slug</th>
                <th>Categories / Products</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterBySearch(collections).map((col) => (
                <tr key={col.slug} style={{ opacity: col.isActive ? 1 : 0.6 }}>
                  <td>
                    <img
                      src={col.imageSrc || col.image_src}
                      alt={col.name}
                      style={{ width: "56px", height: "42px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#E8E4DF" }}
                      onError={(e) => { e.target.src = "https://placehold.co/100x75/E8E4DF/1A1918?text=Cover"; }}
                    />
                  </td>
                  <td style={{ fontWeight: "600" }}>{col.name}</td>
                  <td><code style={{ fontSize: "0.78rem", color: "#555" }}>{col.slug}</code></td>
                  <td style={{ fontSize: "0.8rem", color: "#555" }}>
                    {col.categoryCount || 0} categories • {col.usedByProductsCount || 0} products
                  </td>
                  <td>
                    <span className={`${styles.badge} ${col.isActive ? styles.badgePublished : styles.badgeArchived}`}>
                      {col.isActive ? "Active" : "Archived"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(col, "collection")}
                        className={styles.secondaryBtn}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                      >
                        Edit
                      </button>
                      <label className={styles.secondaryBtn} style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", cursor: "pointer" }}>
                        Photo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleCoverUpload(col, e.target.files[0], "collection")}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategoryOrCollection(col, "collection")}
                        className={styles.secondaryBtn}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", color: "#C5221F" }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "materials" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* Add / Edit Form */}
          <div className={styles.tableCard} style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              {editingItem ? `Edit Material: ${editingItem.name}` : "+ Add New Stone Material"}
            </h3>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.label}>Material Name * (No Granite)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Makrana Pure White Marble"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.label}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={styles.select}
              >
                <option value="Marble">Marble</option>
                <option value="Sandstone">Sandstone</option>
                <option value="Limestone">Limestone</option>
                <option value="Onyx">Natural Translucent Onyx</option>
              </select>
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.label}>Color Family</label>
              <select
                value={formData.colorFamily}
                onChange={(e) => setFormData({ ...formData, colorFamily: e.target.value })}
                className={styles.select}
              >
                <option value="White">Pure White</option>
                <option value="Pink">Blush Pink</option>
                <option value="Red">Royal Red</option>
                <option value="Beige">Cream Beige</option>
                <option value="Black">Obsidian Black</option>
                <option value="Golden Yellow">Golden Yellow</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {editingItem && (
                <button
                  type="button"
                  onClick={() => { setEditingItem(null); setFormData({ name: "", category: "Marble", origin: "Rajasthan, India", colorFamily: "White" }); }}
                  className={styles.secondaryBtn}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSaveEntity("material")}
                className={styles.primaryBtn}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {editingItem ? "Update Material" : "Save Material"}
              </button>
            </div>
          </div>

          {/* List Cards */}
          <div className={styles.mobileCardList}>
            {filterBySearch(materials).map((m) => (
              <div key={m.id} className={styles.mobileProductCard} style={{ opacity: m.isActive ? 1 : 0.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "1rem" }}>{m.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{m.category} • {m.color_family || m.colorFamily}</div>
                  </div>
                  <span className={`${styles.badge} ${m.isActive ? styles.badgePublished : styles.badgeArchived}`}>
                    {m.isActive ? "Active" : "Archived"}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "0.85rem" }}>
                  Used by {m.usedByProductsCount || 0} product(s)
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => {
                      setEditingItem(m);
                      setFormData({
                        name: m.name,
                        category: m.category,
                        origin: m.origin,
                        colorFamily: m.color_family || m.colorFamily,
                        durability: m.durability,
                        isSacredGrade: Boolean(m.is_sacred_grade),
                        description: m.description || ""
                      });
                    }}
                    className={styles.secondaryBtn}
                    style={{ flex: 1, justifyContent: "center", padding: "0.4rem 0.5rem", fontSize: "0.8rem", minHeight: "40px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleArchiveToggle("material", m)}
                    className={styles.secondaryBtn}
                    style={{ flex: 1, justifyContent: "center", padding: "0.4rem 0.5rem", fontSize: "0.8rem", minHeight: "40px" }}
                  >
                    {m.isActive ? "Archive" : "Restore"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "subjects" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          <div className={styles.tableCard} style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              + Add Sacred Deity / Subject
            </h3>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.label}>Primary Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Lord Saraswati"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.label}>Synonyms (Comma Separated)</label>
              <input
                type="text"
                value={formData.synonyms}
                onChange={(e) => setFormData({ ...formData, synonyms: e.target.value })}
                placeholder="Saraswati, Veena Vadini"
                className={styles.input}
              />
            </div>

            <button
              type="button"
              onClick={() => handleSaveEntity("subject")}
              className={styles.primaryBtn}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Save Sacred Subject
            </button>
          </div>

          <div className={styles.mobileCardList}>
            {filterBySearch(subjects, "primary_name").map((s) => (
              <div key={s.id} className={styles.mobileProductCard} style={{ opacity: s.isActive ? 1 : 0.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "1rem" }}>{s.primary_name || s.primaryName}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>Synonyms: {(s.synonyms || []).join(", ") || "None"}</div>
                  </div>
                  <span className={`${styles.badge} ${s.isActive ? styles.badgePublished : styles.badgeArchived}`}>
                    {s.isActive ? "Active" : "Archived"}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "0.85rem" }}>
                  Used by {s.usedByProductsCount || 0} product(s)
                </div>

                <button
                  onClick={() => handleArchiveToggle("subject", s)}
                  className={styles.secondaryBtn}
                  style={{ width: "100%", justifyContent: "center", padding: "0.4rem 0.5rem", fontSize: "0.8rem", minHeight: "40px" }}
                >
                  {s.isActive ? "Archive" : "Restore"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "productTypes" ? (
        <div className={styles.mobileCardList}>
          {filterBySearch(productTypes).map((pt) => (
            <div key={pt.id} className={styles.mobileProductCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "1rem" }}>{pt.name}</div>
                  <code style={{ fontSize: "0.78rem", color: "#555" }}>{pt.id}</code>
                </div>
                <span className={`${styles.badge} ${pt.isActive ? styles.badgePublished : styles.badgeArchived}`}>
                  {pt.isActive ? "Active" : "Archived"}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.85rem" }}>{pt.description}</p>
              <button
                onClick={() => handleArchiveToggle("product_type", pt)}
                className={styles.secondaryBtn}
                style={{ width: "100%", justifyContent: "center", padding: "0.4rem 0.5rem", fontSize: "0.8rem", minHeight: "40px" }}
              >
                {pt.isActive ? "Archive" : "Restore"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          <div className={styles.tableCard} style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              + Add Custom Attribute
            </h3>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.label}>Attribute Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Pump Power Rating"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.label}>Data Type</label>
              <select
                value={formData.dataType}
                onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                className={styles.select}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Yes / No (Boolean)</option>
                <option value="select">Single Select</option>
                <option value="multiselect">Multi Select</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => handleSaveEntity("attribute")}
              className={styles.primaryBtn}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Save Custom Attribute
            </button>
          </div>

          <div className={styles.mobileCardList}>
            {filterBySearch(attributes).map((att) => (
              <div key={att.id} className={styles.mobileProductCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "1rem" }}>{att.name}</div>
                    <code style={{ fontSize: "0.78rem", color: "#555" }}>Type: {att.dataType}</code>
                  </div>
                  <span className={`${styles.badge} ${att.isActive ? styles.badgePublished : styles.badgeArchived}`}>
                    {att.isActive ? "Active" : "Archived"}
                  </span>
                </div>
                <button
                  onClick={() => handleArchiveToggle("attribute", att)}
                  className={styles.secondaryBtn}
                  style={{ width: "100%", justifyContent: "center", padding: "0.4rem 0.5rem", fontSize: "0.8rem", minHeight: "40px" }}
                >
                  {att.isActive ? "Archive" : "Restore"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL FOR ADD / EDIT CATEGORY OR COLLECTION */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#FFF", borderRadius: "8px", maxWidth: "540px", width: "100%", padding: "1.5rem",
            maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                {editingItem ? `Edit ${modalType === "collection" ? "Collection" : "Category"}: ${editingItem.name}` : `+ Add New ${modalType === "collection" ? "Collection" : "Category"}`}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSaveCategoryOrCollection} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name *</label>
                <input
                  type="text"
                  value={catFormData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setCatFormData({ ...catFormData, name: val, slug: editingItem ? catFormData.slug : autoSlug });
                  }}
                  placeholder={`e.g. ${modalType === "collection" ? "Garden Sculptures" : "Saraswati Ji"}`}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Slug (Unique System Identifier)</label>
                <input
                  type="text"
                  value={catFormData.slug}
                  onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                  placeholder="auto-generated-slug"
                  className={styles.input}
                />
              </div>

              {modalType === "category" && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Parent Collection *</label>
                    <select
                      value={catFormData.parentCollection}
                      onChange={(e) => {
                        const colSlug = e.target.value;
                        setCatFormData({ ...catFormData, parentCollection: colSlug, parentSubcategory: `${colSlug}-general` });
                      }}
                      className={styles.select}
                    >
                      {collections.map((col) => (
                        <option key={col.slug} value={col.slug}>{col.name} ({col.slug})</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Parent Subcategory</label>
                    <select
                      value={catFormData.parentSubcategory}
                      onChange={(e) => setCatFormData({ ...catFormData, parentSubcategory: e.target.value })}
                      className={styles.select}
                    >
                      {subcategories.filter((s) => s.parent_collection_slug === catFormData.parentCollection || s.parentCollection === catFormData.parentCollection).map((sub) => (
                        <option key={sub.slug} value={sub.slug}>{sub.name} ({sub.slug})</option>
                      ))}
                      <option value={`${catFormData.parentCollection}-general`}>General {catFormData.parentCollection} Items</option>
                    </select>
                  </div>
                </>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  placeholder="Brief description for public collection / category header..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image URL</label>
                <input
                  type="text"
                  value={catFormData.imageSrc}
                  onChange={(e) => setCatFormData({ ...catFormData, imageSrc: e.target.value })}
                  placeholder="https://placehold.co/800x500..."
                  className={styles.input}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalOpen(false)} className={styles.secondaryBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  {editingItem ? "Update" : "Create & Integrate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
