"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminContentPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Homepage");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [updatingKey, setUpdatingKey] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.slots) setSlots(data.slots);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) fetchContent();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const handleMediaUpload = async (slot, file) => {
    if (!file) return;

    setMessage({ type: "", text: "" });
    setUpdatingKey(slot.key_name);

    const uploadFormData = new FormData();
    uploadFormData.append("files", file);
    uploadFormData.append("folder", "content");
    uploadFormData.append("productSlug", slot.key_name);

    try {
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.success && uploadData.images && uploadData.images.length > 0) {
        const newUrl = uploadData.images[0].url;
        await handleSaveSlot(slot.key_name, newUrl, slot.alt_text);
      } else {
        setMessage({ type: "error", text: uploadData.error || "Upload failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error uploading image." });
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleSaveSlot = async (keyName, value, altText) => {
    setMessage({ type: "", text: "" });
    setUpdatingKey(keyName);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName, value, altText })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        fetchContent();
      } else {
        setMessage({ type: "error", text: data.error || "Save failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error saving content." });
    } finally {
      setUpdatingKey(null);
    }
  };

  const pagesList = Array.from(new Set(slots.map((s) => s.page)));
  const currentSlots = slots.filter((s) => s.page === activeTab);

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Website Media Slot Inspector (Legacy)</h1>
          <p style={{ color: "#666", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Managed editorial image slots for static website page key/value references
          </p>
        </div>
        <Link href="/admin/pages" className={styles.primaryBtn}>
          📄 Open Full Page CMS Manager →
        </Link>
      </div>

      {/* Unified Page CMS Notice Banner */}
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
            💡 Looking to edit Website Headings, Copy, Hero Banners & Stats?
          </strong>
          <span style={{ fontSize: "0.85rem", color: "#555" }}>
            All website page sections (Homepage, Our Story, Craftsmanship) are now managed under the unified Page CMS.
          </span>
        </div>
        <Link href="/admin/pages" className={styles.secondaryBtn} style={{ borderColor: "var(--color-bronze)", fontWeight: "600" }}>
          Go to Page CMS Manager
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

      {/* Page Tabs */}
      <div className={styles.studioTabs}>
        {pagesList.map((pg) => (
          <button
            key={pg}
            className={`${styles.studioTab} ${activeTab === pg ? styles.studioTabActive : ""}`}
            onClick={() => setActiveTab(pg)}
          >
            {pg} ({slots.filter((s) => s.page === pg).length} slots)
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.tableCard} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          Loading predefined content slots...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {currentSlots.map((slot) => (
            <div key={slot.key_name} className={styles.tableCard} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
                    {slot.label}
                  </h3>
                  <code style={{ fontSize: "0.78rem", color: "#666" }}>Key: {slot.key_name}</code>
                </div>
                <span className={`${styles.badge} ${styles.badgePublished}`}>
                  Legacy Slot
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 240px) 1fr", gap: "1.5rem", alignItems: "flex-start" }}>
                {/* Image Preview & Upload Trigger */}
                <div>
                  <img
                    src={slot.value}
                    alt={slot.alt_text || slot.label}
                    style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "6px", border: "1px solid #E2DDD5", backgroundColor: "#E8E4DF", marginBottom: "0.75rem" }}
                    onError={(e) => { e.target.src = "https://placehold.co/800x600/E8E4DF/1A1918?text=Image+Unavailable"; }}
                  />
                  <label
                    className={styles.secondaryBtn}
                    style={{ width: "100%", justifyContent: "center", padding: "0.45rem 0.75rem", fontSize: "0.8rem", cursor: "pointer" }}
                  >
                    {updatingKey === slot.key_name ? "Uploading..." : "📷 Replace Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleMediaUpload(slot, e.target.files[0])}
                    />
                  </label>
                </div>

                {/* Slot Details & Manual URL / Alt Inputs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Active Media Image URL</label>
                    <input
                      type="text"
                      value={slot.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlots((prev) => prev.map((s) => s.key_name === slot.key_name ? { ...s, value: val } : s));
                      }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>SEO Accessibility Alt Text</label>
                    <input
                      type="text"
                      value={slot.alt_text || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlots((prev) => prev.map((s) => s.key_name === slot.key_name ? { ...s, alt_text: val } : s));
                      }}
                      placeholder="Descriptive image alt text for accessibility and SEO..."
                      className={styles.input}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      disabled={updatingKey === slot.key_name}
                      onClick={() => handleSaveSlot(slot.key_name, slot.value, slot.alt_text)}
                      className={styles.primaryBtn}
                      style={{ minWidth: "140px", justifyContent: "center" }}
                    >
                      {updatingKey === slot.key_name ? "Saving..." : "Save Slot Media"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
