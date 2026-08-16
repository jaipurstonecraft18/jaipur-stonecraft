"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminCataloguePage() {
  const [activeTab, setActiveTab] = useState("materials");
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [editingItem, setEditingItem] = useState(null);
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
      const res = await fetch("/api/admin/catalogue");
      const data = await res.json();
      if (data.materials) setMaterials(data.materials);
      if (data.subjects) setSubjects(data.subjects);
      if (data.productTypes) setProductTypes(data.productTypes);
      if (data.attributes) setAttributes(data.attributes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

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
      ? `Archive "${item.name || item.primaryName}"? It will be hidden from future product dropdowns. (${item.usedByProductsCount || 0} existing products currently use this)`
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

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Catalogue Manager</h1>
          <p style={{ color: "#666", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Manage reusable materials, sacred deity subjects, product types, and attributes
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

      {/* Tabs */}
      <div className={styles.studioTabs}>
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

      {loading ? (
        <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          Loading catalogue definitions...
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
            {materials.map((m) => (
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
                  Used by {m.usedByProductsCount} product(s)
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
            {subjects.map((s) => (
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
                  Used by {s.usedByProductsCount} product(s)
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
          {productTypes.map((pt) => (
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
            {attributes.map((att) => (
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
    </div>
  );
}
