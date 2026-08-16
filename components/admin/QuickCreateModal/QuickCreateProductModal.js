"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/admin/admin.module.css";

export default function QuickCreateProductModal({ isOpen, onClose }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("ganesh-ji");
  const [productType, setProductType] = useState("statue");
  const [primaryMaterialId, setPrimaryMaterialId] = useState("makrana-pure-white");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    const timestamp = Date.now();
    const cleanSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sku = `JSC-DRAFT-${timestamp.toString().slice(-6)}`;

    const payload = {
      name: name.trim(),
      slug: cleanSlug || `product-${timestamp}`,
      sku,
      status: "draft",
      isFeatured: false,
      isNewArrival: true,
      productType,
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      parentCategory,
      primaryMaterialId,
      shortDescription: `Hand-carved ${name.trim()} sculpted in Jaipur stonecraft atelier.`,
      imageSrc: "https://placehold.co/800x600/E8E4DF/1A1918?text=Product+Cover+Photo",
      seo: { title: `${name.trim()} | Jaipur Stonecraft` }
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.product) {
        onClose();
        router.push(`/admin/products/${data.product.slug}`);
      } else {
        setError(data.error || "Failed to create new draft product.");
      }
    } catch (err) {
      setError("Network error occurred.");
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
        backgroundColor: "rgba(0,0,0,0.65)",
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
          maxWidth: "480px",
          padding: "2rem",
          backgroundColor: "#FFF",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: "600" }}>
            ⚡ Fast Create New Product Draft
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}>
            &times;
          </button>
        </div>

        <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Enter minimal initial details to create a draft, then complete photographs and specs in Product Studio.
        </p>

        {error && (
          <div style={{ padding: "0.65rem 0.85rem", backgroundColor: "#FCE8E6", color: "#C5221F", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={styles.label}>Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Blessing Ganesh Statue"
              className={styles.input}
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={styles.label}>Product Type *</label>
            <select value={productType} onChange={(e) => setProductType(e.target.value)} className={styles.select}>
              <option value="statue">Deity Statue / Sacred Murti</option>
              <option value="idol">Devotional Murti / Idol</option>
              <option value="sculpture">Artistic & Classical Sculpture</option>
              <option value="bust">Portrait Bust / Head Carving</option>
              <option value="relief">Carved Wall Relief Panel / Mural</option>
              <option value="mandir">Home Temple Architecture</option>
              <option value="fountain">Water Fountain / Lotus Basin</option>
              <option value="architectural_element">Jali Screen / Column / Arch</option>
            </select>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={styles.label}>Primary Stone Material * (Granite strictly excluded)</label>
            <select value={primaryMaterialId} onChange={(e) => setPrimaryMaterialId(e.target.value)} className={styles.select}>
              <option value="makrana-pure-white">Makrana Pure White Marble</option>
              <option value="sangemarmar-white">Sangemarmar White Marble</option>
              <option value="black-bhainslana">Black Bhainslana Marble</option>
              <option value="pink-bansi-paharpur">Pink Bansi Paharpur Sandstone</option>
              <option value="jodhpur-red-sandstone">Jodhpur Royal Red Sandstone</option>
              <option value="dholpur-beige-sandstone">Dholpur Beige Sandstone</option>
              <option value="jaisalmer-yellow-limestone">Jaisalmer Golden Yellow Limestone</option>
            </select>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "1.25rem" }}>
            <label className={styles.label}>Parent Category Slug</label>
            <input
              type="text"
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              placeholder="e.g. ganesh-ji, shiva-ji, home-mandirs"
              className={styles.input}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className={styles.secondaryBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? "Creating Draft..." : "Create Draft & Edit Studio →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
