"use client";

import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

export default function QuickAddModal({
  isOpen,
  targetField,
  fieldLabel,
  onClose,
  onSuccess
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Marble");
  const [colorFamily, setColorFamily] = useState("White");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/catalogue/quick-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetField,
          name: name.trim(),
          category,
          colorFamily
        })
      });

      const data = await res.json();

      if (data.success && data.item) {
        setName("");
        onSuccess(data.item);
        onClose();
      } else {
        setError(data.error || "Failed to create new item.");
      }
    } catch (err) {
      setError("Error saving item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem"
      }}
    >
      <div
        className={styles.tableCard}
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2rem",
          backgroundColor: "#FFF",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            + Quick Add New {fieldLabel}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}>
            &times;
          </button>
        </div>

        {error && (
          <div style={{ padding: "0.6rem 0.85rem", backgroundColor: "#FCE8E6", color: "#C5221F", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={styles.label}>{fieldLabel} Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`e.g. New ${fieldLabel} name...`}
              className={styles.input}
              required
              autoFocus
            />
          </div>

          {targetField === "primaryMaterialId" && (
            <>
              <div className={styles.formGroup} style={{ marginBottom: "1rem" }}>
                <label className={styles.label}>Stone Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
                  <option value="Marble">Marble</option>
                  <option value="Sandstone">Sandstone</option>
                  <option value="Limestone">Limestone</option>
                  <option value="Onyx">Natural Translucent Onyx</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: "1rem" }}>
                <label className={styles.label}>Color Family</label>
                <select value={colorFamily} onChange={(e) => setColorFamily(e.target.value)} className={styles.select}>
                  <option value="White">Pure White</option>
                  <option value="Pink">Blush Pink</option>
                  <option value="Red">Royal Red</option>
                  <option value="Beige">Cream Beige</option>
                  <option value="Black">Obsidian Black</option>
                  <option value="Golden Yellow">Golden Yellow</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
            <button type="button" onClick={onClose} className={styles.secondaryBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? "Saving..." : "Save & Select"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
