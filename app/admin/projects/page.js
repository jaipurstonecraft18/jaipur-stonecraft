"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State for Create / Edit
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    type: "Custom",
    location: "Jaipur / Global Site",
    year: "2024",
    description: "",
    materials: "Makrana White Marble",
    craftsmanship: "",
    finalResult: "",
    imageSrc: "/images/collections/custom.png"
  });

  const categories = ["All", "Residential", "Hospitality", "Temple", "Garden/Landscape", "Memorial/Tribute", "Custom"];

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) setProjects(data.projects);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditItem(null);
    setFormData({
      slug: "",
      name: "",
      type: "Custom",
      location: "Jaipur / Global Site",
      year: "2024",
      description: "",
      materials: "Makrana White Marble",
      craftsmanship: "",
      finalResult: "",
      imageSrc: "/images/collections/custom.png"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditItem(proj);
    setFormData({
      slug: proj.slug,
      name: proj.name,
      type: proj.type || "Custom",
      location: proj.location || "",
      year: proj.year || "2024",
      description: proj.description || "",
      materials: proj.materials || "",
      craftsmanship: proj.craftsmanship || "",
      finalResult: proj.finalResult || "",
      imageSrc: proj.image_src || proj.imageSrc || "/images/collections/custom.png"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      const url = "/api/admin/projects";
      const method = editItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchProjects();
      } else {
        alert(data.error || "Save failed.");
      }
    } catch (err) {
      alert("Error saving project.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const uploadFormData = new FormData();
    uploadFormData.append("files", file);
    uploadFormData.append("folder", "projects");
    uploadFormData.append("productSlug", formData.slug || "project-case-study");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData
      });
      const data = await res.json();
      if (res.ok && data.success && data.images && data.images.length > 0) {
        setFormData((prev) => ({ ...prev, imageSrc: data.images[0].url }));
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete project "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/projects?slug=${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProjects();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      alert("Error deleting project");
    }
  };

  const filteredProjects = activeType === "All"
    ? projects
    : projects.filter((p) => p.type === activeType);

  return (
    <div>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>🏛️ Projects Portfolio & Case Studies</h1>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.2rem" }}>
            Manage bespoke architectural installations, temple case studies, and site photos.
          </p>
        </div>

        <button onClick={handleOpenCreate} className={styles.primaryBtn}>
          + Add New Case Study
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.studioTabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.studioTab} ${activeType === cat ? styles.studioTabActive : ""}`}
            onClick={() => setActiveType(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading projects...</div>
        ) : filteredProjects.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Project Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <img
                      src={p.image_src || p.imageSrc || "/images/collections/custom.png"}
                      alt={p.name}
                      className={styles.thumbImg}
                    />
                  </td>
                  <td>
                    <strong style={{ display: "block", color: "var(--color-navy)" }}>{p.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>/projects/{p.slug}</span>
                  </td>
                  <td>
                    <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                      {p.type}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "#555" }}>{p.location || "Jaipur / Global"}</td>
                  <td style={{ fontSize: "0.85rem", color: "#555" }}>{p.year}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className={styles.secondaryBtn}
                        style={{ padding: "0.25rem 0.55rem", fontSize: "0.78rem", minHeight: "32px" }}
                      >
                        ✏️ Edit
                      </button>

                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className={styles.publicSiteLink}
                        style={{ padding: "0.25rem 0.55rem", fontSize: "0.78rem" }}
                      >
                        Live ↗
                      </Link>

                      <button
                        onClick={() => handleDelete(p.slug)}
                        className={styles.secondaryBtn}
                        style={{ color: "#C5221F", borderColor: "#FCE8E6", padding: "0.25rem 0.55rem", fontSize: "0.78rem", minHeight: "32px" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
            No projects found under category &ldquo;{activeType}&rdquo;.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem"
        }}>
          <div style={{
            backgroundColor: "#FFF",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "680px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "1.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid #E2DDD5", paddingBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "600", color: "var(--color-navy)" }}>
                {editItem ? `Edit Project: ${editItem.name}` : "Create New Project Case Study"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#666" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label className={styles.label}>Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Traditional Hindu Temple Architecture"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>URL Slug (Auto-generated if blank)</label>
                <input
                  type="text"
                  value={formData.slug}
                  disabled={Boolean(editItem)}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Project Category Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={styles.select}
                >
                  <option value="Residential">Residential</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Temple">Temple / Sacred</option>
                  <option value="Garden/Landscape">Garden / Landscape</option>
                  <option value="Memorial/Tribute">Memorial / Tribute</option>
                  <option value="Custom">Custom / Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Location / Site City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. London, UK / Jaipur, India"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Year Completed</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Stone Materials Used</label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="e.g. Pure White Makrana Marble & Pink Sandstone"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Project Overview & Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Craftsmanship & Carving Details</label>
                <textarea
                  rows={3}
                  value={formData.craftsmanship}
                  onChange={(e) => setFormData({ ...formData, craftsmanship: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <label className={styles.label}>Cover Image URL</label>
                  <span className={styles.aspectBadge}>📐 Recommended Aspect Ratio: 16:9 Landscape (1200 × 675 px)</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                  <input
                    type="text"
                    value={formData.imageSrc}
                    onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })}
                    className={styles.input}
                    style={{ flex: 1 }}
                    placeholder="https://..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div className={styles.formGroupFull} style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={saving}
                >
                  {saving ? "Saving..." : editItem ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
