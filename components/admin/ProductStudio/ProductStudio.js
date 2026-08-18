"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageStudio from "@/components/admin/ImageStudio/ImageStudio";
import QuickAddModal from "@/components/admin/QuickAddModal/QuickAddModal";
import MobileStickyBar from "@/components/admin/ProductStudio/MobileStickyBar";
import styles from "@/app/admin/admin.module.css";

const DEFAULT_PRODUCT_TYPES = [
  { id: "statue", name: "Deity Statue / Sacred Murti" },
  { id: "idol", name: "Devotional Murti / Idol" },
  { id: "sculpture", name: "Artistic & Classical Sculpture" },
  { id: "bust", name: "Portrait Bust / Head Carving" },
  { id: "figurine", name: "Statuette / Small Accent" },
  { id: "relief", name: "Carved Wall Relief Panel / Mural" },
  { id: "mandir", name: "Home Temple Architecture" },
  { id: "fountain", name: "Water Fountain / Lotus Basin" },
  { id: "architectural_element", name: "Jali Screen / Column / Arch" },
  { id: "decorative_object", name: "Urn / Planter / Plinth" },
  { id: "custom_artwork", name: "Bespoke Commission / Tribute" }
];

const KNOWLEDGE_SUGGESTIONS = [
  "Craftsmanship & Technique",
  "Material Origin & Characteristics",
  "Symbolism / Cultural Context",
  "Suitable Placement",
  "Installation Requirements",
  "Care & Maintenance"
];

function normalizeKnowledgeLayer(kl) {
  if (Array.isArray(kl)) return kl;
  if (kl && typeof kl === "object") {
    const sections = [];
    if (kl.whatIsThis) sections.push({ title: "What Is This Carving?", content: kl.whatIsThis });
    if (kl.materialOrigin) sections.push({ title: "Material Origin & Characteristics", content: kl.materialOrigin });
    if (kl.suitableFor) sections.push({ title: "Suitable Placement & Environments", content: kl.suitableFor });
    if (kl.installationCare) sections.push({ title: "Installation Requirements & Care", content: kl.installationCare });
    if (sections.length > 0) return sections;
  }
  return [
    { title: "Craftsmanship & Technique", content: "" },
    { title: "Material Origin & Characteristics", content: "" }
  ];
}

export default function ProductStudio({ initialProduct, isNew = false }) {
  const router = useRouter();

  // Dynamic Catalogue lists fetched from DB
  const [materialsList, setMaterialsList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [productTypesList, setProductTypesList] = useState(DEFAULT_PRODUCT_TYPES);
  const [attributesList, setAttributesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // QuickAddModal State
  const [quickAddModal, setQuickAddModal] = useState({
    isOpen: false,
    targetField: "",
    fieldLabel: ""
  });

  // Fetch dynamic active catalogue lists and categories from API
  useEffect(() => {
    fetch("/api/admin/catalogue")
      .then((res) => res.json())
      .then((data) => {
        if (data.materials) setMaterialsList(data.materials.filter((m) => m.isActive));
        if (data.subjects) setSubjectsList(data.subjects.filter((s) => s.isActive));
        if (data.productTypes && data.productTypes.length > 0) setProductTypesList(data.productTypes.filter((pt) => pt.isActive));
        if (data.attributes) setAttributesList(data.attributes.filter((a) => a.isActive));
      })
      .catch((e) => console.error("Catalogue fetch error", e));

    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategoriesList(data.categories);
      })
      .catch((e) => console.error("Categories fetch error", e));
  }, []);

  // Form State
  const [formData, setFormData] = useState(() => {
    if (initialProduct) {
      return {
        ...initialProduct,
        knowledgeLayer: normalizeKnowledgeLayer(initialProduct.knowledgeLayer)
      };
    }
    const timestamp = Date.now();
    return {
      name: "",
      slug: "",
      sku: `JSC-DRAFT-${timestamp.toString().slice(-6)}`,
      status: "draft",
      isFeatured: false,
      isNewArrival: true,
      isCustomOnly: false,
      productType: "sculpture",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      parentCategory: "ganesh-ji",
      subjectId: "ganesh",
      primaryMaterialId: "makrana-pure-white",
      shortDescription: "",
      detailedDescription: "",
      imageSrc: "https://placehold.co/800x600/E8E4DF/1A1918?text=Product+Cover+Photo",
      imageGallery: [],
      knowledgeLayer: [
        { title: "Craftsmanship & Technique", content: "" },
        { title: "Material Origin & Characteristics", content: "" }
      ],
      attributes: {
        colorFamily: "White",
        finish: "Hand Honed (Natural Matte)",
        environment: "Indoor & Outdoor Sanctuary",
        customizable: true,
        inquiryOnly: true,
        availableDimensions: [
          { heightInches: 24, heightFeetLabel: "2.0 Feet", customizable: true }
        ]
      },
      tags: ["Single-Block-Marble", "Hand-Carved-Jaipur"],
      seo: { title: "", description: "", keywords: [] }
    };
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Autosave & Dirty State
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved' | 'dirty' | 'saving' | 'error'
  const [lastSavedAt, setLastSavedAt] = useState("");
  const isInitialMount = useRef(true);

  const primaryMatObj = useMemo(() => {
    return materialsList.find((m) => m.id === formData.primaryMaterialId);
  }, [materialsList, formData.primaryMaterialId]);

  // Handle Name changes & auto-slug generation
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (autoSlug && (isNew || prev.status === "draft")) {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return updated;
    });
    setIsDirty(true);
    setSaveStatus("dirty");
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setSaveStatus("dirty");
  };

  const updateNestedField = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value
      }
    }));
    setIsDirty(true);
    setSaveStatus("dirty");
  };

  const handleAddKnowledgeSection = (title = "") => {
    setFormData((prev) => {
      const currentSections = Array.isArray(prev.knowledgeLayer) ? prev.knowledgeLayer : normalizeKnowledgeLayer(prev.knowledgeLayer);
      return {
        ...prev,
        knowledgeLayer: [...currentSections, { title: title || "New Information Section", content: "" }]
      };
    });
    setIsDirty(true);
    setSaveStatus("dirty");
  };

  const handleUpdateKnowledgeSection = (index, field, value) => {
    setFormData((prev) => {
      const currentSections = Array.isArray(prev.knowledgeLayer) ? [...prev.knowledgeLayer] : normalizeKnowledgeLayer(prev.knowledgeLayer);
      currentSections[index] = { ...currentSections[index], [field]: value };
      return { ...prev, knowledgeLayer: currentSections };
    });
    setIsDirty(true);
    setSaveStatus("dirty");
  };

  const handleRemoveKnowledgeSection = (index) => {
    setFormData((prev) => {
      const currentSections = Array.isArray(prev.knowledgeLayer) ? [...prev.knowledgeLayer] : normalizeKnowledgeLayer(prev.knowledgeLayer);
      const updated = [...currentSections];
      updated.splice(index, 1);
      return { ...prev, knowledgeLayer: updated };
    });
    setIsDirty(true);
    setSaveStatus("dirty");
  };

  // Readiness / Completeness Score Calculation
  const readiness = useMemo(() => {
    const checks = [
      { label: "Product Name", ok: Boolean(formData.name.trim()) },
      { label: "Valid Slug", ok: Boolean(formData.slug.trim()) },
      { label: "Short Description", ok: Boolean(formData.shortDescription?.trim()) },
      { label: "Primary Material", ok: Boolean(formData.primaryMaterialId) },
      { label: "Product Category", ok: Boolean(formData.parentCategory) },
      { label: "Cover Image", ok: Boolean(formData.imageSrc && !formData.imageSrc.includes("placehold.co")) },
      { label: "SEO Title Tag", ok: Boolean(formData.seo?.title?.trim()) }
    ];

    const completed = checks.filter((c) => c.ok).length;
    const percentage = Math.round((completed / checks.length) * 100);

    return { percentage, checks };
  }, [formData]);

  // Submit Handler (Save Draft / Publish)
  const handleSave = async (targetStatus, isAutosave = false) => {
    if (isAutosave && (!formData.name || !formData.slug)) return;

    setSaving(true);
    setSaveStatus("saving");
    if (!isAutosave) setMessage({ type: "", text: "" });

    const payload = {
      ...formData,
      status: targetStatus || formData.status
    };

    if (!payload.seo.title) {
      payload.seo.title = `${payload.name} | Jaipur Stonecraft`;
    }

    try {
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${initialProduct.slug}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedAt(timeStr);
        setSaveStatus("saved");
        setIsDirty(false);

        if (!isAutosave) {
          setMessage({ type: "success", text: `Product saved successfully as ${payload.status}!` });
        }

        if (isNew && data.product && !isAutosave) {
          router.push(`/admin/products/${data.product.slug}`);
        }
      } else {
        setSaveStatus("error");
        if (!isAutosave) setMessage({ type: "error", text: data.error || "Failed to save product." });
      }
    } catch (e) {
      setSaveStatus("error");
      if (!isAutosave) setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  // Debounced Autosave Effect (2.5 Seconds after user changes)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isDirty || !formData.slug || isNew) return;

    const timer = setTimeout(() => {
      handleSave(formData.status, true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [formData, isDirty, isNew]);

  const handleDuplicate = async () => {
    if (!initialProduct?.slug) return;
    if (!confirm("Duplicate this product to create a new draft copy?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${initialProduct.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate" })
      });
      const data = await res.json();
      if (data.success && data.product) {
        router.push(`/admin/products/${data.product.slug}`);
      } else {
        alert(data.error || "Failed to duplicate product.");
      }
    } catch (e) {
      alert("Error duplicating product.");
    } finally {
      setSaving(false);
    }
  };

  const applicableAttributes = useMemo(() => {
    const type = formData.productType;
    return attributesList.filter((att) => {
      if (!att.appliesToProductTypes || att.appliesToProductTypes.length === 0) return true;
      return att.appliesToProductTypes.includes(type);
    });
  }, [attributesList, formData.productType]);

  return (
    <div>
      {/* Top Header & Actions Bar */}
      <div className={styles.dashboardHeader}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
            <Link href="/admin/products" style={{ color: "#666", textDecoration: "none", fontSize: "0.85rem" }}>
              ← Back to Products List
            </Link>
            <span className={`${styles.badge} ${formData.status === "published" ? styles.badgePublished : formData.status === "draft" ? styles.badgeDraft : styles.badgeArchived}`}>
              {formData.status}
            </span>

            {/* Autosave Status Pill */}
            <span className={styles.desktopOnly} style={{ fontSize: "0.78rem", fontWeight: "600", color: saveStatus === "saving" ? "var(--color-bronze)" : saveStatus === "dirty" ? "#B06000" : "#137333", marginLeft: "0.5rem" }}>
              {saveStatus === "saving" ? "⌛ Saving draft..." : saveStatus === "dirty" ? "● Unsaved changes..." : lastSavedAt ? `✓ Draft Autosaved ${lastSavedAt}` : "✓ Saved"}
            </span>
          </div>
          <h1 className={styles.pageTitle}>
            {isNew ? "Create New Product Draft" : `Edit: ${formData.name || initialProduct.name}`}
          </h1>
        </div>

        <div className={styles.desktopOnly} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {!isNew && formData.status === "published" && (
            <Link
              href={`/products/${formData.slug}`}
              target="_blank"
              className={styles.publicSiteLink}
              style={{ fontSize: "0.85rem", padding: "0.5rem 0.85rem" }}
            >
              Preview Live Page ↗
            </Link>
          )}

          {!isNew && (
            <button
              type="button"
              onClick={async () => {
                const confirmed = confirm(`Are you sure you want to PERMANENTLY delete "${formData.name}"?\n\nThis will safely remove the product record while preserving shared category and media data.`);
                if (!confirmed) return;
                setSaving(true);
                try {
                  const res = await fetch(`/api/admin/products/${formData.slug}?permanent=true`, { method: "DELETE" });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    alert(`Product "${formData.name}" permanently deleted.`);
                    router.push("/admin/products");
                  } else {
                    alert(data.error || "Delete failed.");
                  }
                } catch (e) {
                  alert("Error deleting product.");
                } finally {
                  setSaving(false);
                }
              }}
              className={styles.secondaryBtn}
              style={{ color: "#C5221F", borderColor: "#FCE8E6" }}
              disabled={saving}
            >
              🗑️ Delete
            </button>
          )}

          {!isNew && (
            <button onClick={handleDuplicate} className={styles.secondaryBtn} disabled={saving}>
              📋 Duplicate Draft
            </button>
          )}

          <button onClick={() => handleSave("draft")} className={styles.secondaryBtn} disabled={saving}>
            Save Draft
          </button>

          <button
            onClick={() => handleSave(formData.status === "published" ? "draft" : "published")}
            className={styles.primaryBtn}
            disabled={saving}
          >
            {formData.status === "published" ? "Unpublish to Draft" : "🚀 Publish Product"}
          </button>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: "0.85rem 1.25rem",
          borderRadius: "4px",
          marginBottom: "1.5rem",
          backgroundColor: message.type === "success" ? "#E6F4EA" : "#FCE8E6",
          color: message.type === "success" ? "#137333" : "#C5221F",
          fontWeight: "600",
          fontSize: "0.875rem"
        }}>
          {message.text}
        </div>
      )}

      {/* Product Completeness Indicator */}
      <div className={styles.readinessBox}>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#555" }}>Product Readiness Score</div>
          <div style={{ fontSize: "1.25rem", fontWeight: "700", fontFamily: "var(--font-display)" }}>
            {readiness.percentage}% Complete
          </div>
        </div>

        <div className={styles.progressBarTrack}>
          <div className={styles.progressBarFill} style={{ width: `${readiness.percentage}%` }} />
        </div>

        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          {readiness.checks.filter(c => !c.ok).length === 0
            ? "✓ Ready for publication"
            : `Missing: ${readiness.checks.filter(c => !c.ok).map(c => c.label).join(", ")}`}
        </div>
      </div>

      {/* Tabbed Navigation Interface */}
      <div className={styles.studioTabs}>
        <button
          className={`${styles.studioTab} ${activeTab === "basic" || activeTab === "knowledge" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("basic")}
        >
          1. Product Details
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "media" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("media")}
        >
          2. 📸 Images
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "taxonomy" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("taxonomy")}
        >
          3. Classification
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "specs" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("specs")}
        >
          4. Specifications
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "seo" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("seo")}
        >
          5. SEO & Content
        </button>
      </div>

      {/* TAB 1: BASIC DETAILS */}
      {activeTab === "basic" && (
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Seated Ganesh with Modak"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                URL Slug *
                <label style={{ fontSize: "0.75rem", fontWeight: "normal", marginLeft: "0.5rem", color: "#666" }}>
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(e) => setAutoSlug(e.target.checked)}
                  /> Auto-sync
                </label>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  updateField("slug", e.target.value);
                }}
                className={styles.input}
              />
              <span style={{ fontSize: "0.75rem", color: "#888" }}>Public URL: /products/{formData.slug || "slug"}</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>SKU Identifier *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Product Lifecycle Status</label>
              <select
                value={formData.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={styles.select}
              >
                <option value="draft">Draft (Private / Invisible)</option>
                <option value="published">Published (Public Website)</option>
                <option value="archived">Archived (Safely Hidden)</option>
              </select>
            </div>

            <div className={styles.formGroup} style={{ justifyContent: "center" }}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                />
                <label htmlFor="isFeatured" className={styles.label}>
                  Featured Product (Homepage Showcase)
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={(e) => updateField("isNewArrival", e.target.checked)}
                />
                <label htmlFor="isNewArrival" className={styles.label}>
                  Mark as New Arrival
                </label>
              </div>
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Short Summary Description</label>
              <textarea
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => updateField("shortDescription", e.target.value)}
                placeholder="Hand-carved Lord Ganesha statue crafted from solid Makrana white marble block..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Detailed Description & Carving Overview</label>
              <textarea
                rows={4}
                value={formData.detailedDescription}
                onChange={(e) => updateField("detailedDescription", e.target.value)}
                placeholder="Full artistic details, facial chiseling techniques, and proportion standards..."
                className={styles.textarea}
              />
            </div>

            {/* PRODUCT KNOWLEDGE & DETAILS SECTION */}
            <div className={styles.formGroupFull} style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #E2DDD5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--color-navy)" }}>
                    📜 Product Knowledge & Details
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#666", marginTop: "0.15rem" }}>
                    Add flexible information blocks for craftsmanship techniques, stone origin, cultural symbolism, or care guides.
                  </p>
                </div>

                {/* Optional Quick Template Suggestion Chips */}
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {KNOWLEDGE_SUGGESTIONS.map((tmpl) => (
                    <button
                      key={tmpl}
                      type="button"
                      onClick={() => handleAddKnowledgeSection(tmpl)}
                      className={styles.secondaryBtn}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.72rem", minHeight: "30px" }}
                    >
                      + {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic List of Information Blocks */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {(Array.isArray(formData.knowledgeLayer) ? formData.knowledgeLayer : normalizeKnowledgeLayer(formData.knowledgeLayer)).map((sec, idx) => (
                  <div key={idx} style={{ border: "1px solid #E2DDD5", borderRadius: "6px", padding: "0.85rem", backgroundColor: "#FFF" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", gap: "0.5rem" }}>
                      <input
                        type="text"
                        value={sec.title || ""}
                        onChange={(e) => handleUpdateKnowledgeSection(idx, "title", e.target.value)}
                        placeholder="Section Title (e.g. Craftsmanship & Technique)"
                        className={styles.input}
                        style={{ fontWeight: "600", fontSize: "0.85rem", flex: 1, padding: "0.35rem 0.6rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveKnowledgeSection(idx)}
                        className={styles.secondaryBtn}
                        style={{ color: "#C5221F", borderColor: "#FCE8E6", fontSize: "0.75rem", padding: "0.25rem 0.55rem", minHeight: "32px" }}
                      >
                        🗑 Remove
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={sec.content || ""}
                      onChange={(e) => handleUpdateKnowledgeSection(idx, "content", e.target.value)}
                      placeholder={`Enter details for ${sec.title || "this section"}...`}
                      className={styles.textarea}
                      style={{ width: "100%", fontSize: "0.85rem", padding: "0.45rem 0.6rem" }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleAddKnowledgeSection("")}
                className={styles.secondaryBtn}
                style={{ marginTop: "0.85rem", width: "100%", justifyContent: "center", borderStyle: "dashed", fontSize: "0.82rem" }}
              >
                + Add Information Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA & IMAGE STUDIO */}
      {activeTab === "media" && (
        <ImageStudio
          productSlug={formData.slug}
          productName={formData.name}
          primaryMaterialName={primaryMatObj?.name || "Natural Stone"}
          imageSrc={formData.imageSrc}
          imageGallery={formData.imageGallery}
          onChange={({ imageSrc, imageGallery }) => {
            setFormData((prev) => ({
              ...prev,
              imageSrc,
              imageGallery
            }));
            setIsDirty(true);
            setSaveStatus("dirty");
          }}
        />
      )}

      {/* TAB 3: TAXONOMY & CLASSIFICATION */}
      {activeTab === "taxonomy" && (
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.label}>Primary Material * (No Granite)</label>
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ isOpen: true, targetField: "primaryMaterialId", fieldLabel: "Material" })}
                  style={{ background: "none", border: "none", color: "var(--color-bronze)", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", minHeight: "44px" }}
                >
                  + Quick Add
                </button>
              </div>
              <select
                value={formData.primaryMaterialId}
                onChange={(e) => updateField("primaryMaterialId", e.target.value)}
                className={styles.select}
              >
                {materialsList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.label}>Product Type *</label>
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ isOpen: true, targetField: "productType", fieldLabel: "Product Type" })}
                  style={{ background: "none", border: "none", color: "var(--color-bronze)", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", minHeight: "44px" }}
                >
                  + Quick Add
                </button>
              </div>
              <select
                value={formData.productType}
                onChange={(e) => updateField("productType", e.target.value)}
                className={styles.select}
              >
                {productTypesList.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Parent Collection *</label>
              <select
                value={formData.parentCollection}
                onChange={(e) => updateField("parentCollection", e.target.value)}
                className={styles.select}
              >
                <option value="sculptures-statues">Sculptures & Statues</option>
                <option value="wall-art-reliefs">Wall Art & Reliefs</option>
                <option value="temples-architectural-stonework">Temples & Architectural Stonework</option>
                <option value="garden-fountains-water-features">Garden Fountains & Water Features</option>
                <option value="decorative-home-accents">Decorative & Home Accents</option>
                <option value="custom-bespoke-creations">Custom Bespoke Creations</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.label}>Parent Category *</label>
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ isOpen: true, targetField: "parentCategory", fieldLabel: "Category" })}
                  style={{ background: "none", border: "none", color: "var(--color-bronze)", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", minHeight: "44px" }}
                >
                  + Quick Add
                </button>
              </div>
              <select
                value={formData.parentCategory}
                onChange={(e) => {
                  const selectedSlug = e.target.value;
                  const catObj = categoriesList.find((c) => c.slug === selectedSlug);
                  if (catObj) {
                    setFormData((prev) => ({
                      ...prev,
                      parentCategory: selectedSlug,
                      parentCollection: catObj.parent_collection_slug || catObj.parentCollection || prev.parentCollection,
                      parentSubcategory: catObj.parent_subcategory_slug || catObj.parentSubcategory || prev.parentSubcategory
                    }));
                    setIsDirty(true);
                    setSaveStatus("dirty");
                  } else {
                    updateField("parentCategory", selectedSlug);
                  }
                }}
                className={styles.select}
              >
                {categoriesList.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.label}>Sacred Deity / Subject Entity</label>
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ isOpen: true, targetField: "subjectId", fieldLabel: "Deity Subject" })}
                  style={{ background: "none", border: "none", color: "var(--color-bronze)", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", minHeight: "44px" }}
                >
                  + Quick Add
                </button>
              </div>
              <select
                value={formData.subjectId || ""}
                onChange={(e) => updateField("subjectId", e.target.value || null)}
                className={styles.select}
              >
                <option value="">-- None / Decorative --</option>
                {subjectsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.primary_name || s.primaryName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Cover Image URL</label>
              <input
                type="text"
                value={formData.imageSrc}
                onChange={(e) => updateField("imageSrc", e.target.value)}
                placeholder="https://..."
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPECIFICATIONS & DYNAMIC ATTRIBUTES */}
      {activeTab === "specs" && (
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Color Family</label>
              <select
                value={formData.attributes.colorFamily || "White"}
                onChange={(e) => updateNestedField("attributes", "colorFamily", e.target.value)}
                className={styles.select}
              >
                <option value="White">Pure White</option>
                <option value="Pink">Blush Pink</option>
                <option value="Red">Jodhpur Terracotta Red</option>
                <option value="Beige">Dholpur Cream Beige</option>
                <option value="Black">Obsidian Black</option>
                <option value="Golden Yellow">Golden Yellow</option>
                <option value="Honey/Amber">Honey / Amber Onyx</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Surface Finishing</label>
              <select
                value={formData.attributes.finish || "Hand Honed (Natural Matte)"}
                onChange={(e) => updateNestedField("attributes", "finish", e.target.value)}
                className={styles.select}
              >
                <option value="Hand Honed (Natural Matte)">Hand Honed (Natural Matte)</option>
                <option value="Mirror Polished (High Gloss)">Mirror Polished (High Gloss)</option>
                <option value="Antique Weathered">Antique Weathered</option>
                <option value="Natural Masonic Chiseled">Natural Masonic Chiseled</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Placement Environment</label>
              <input
                type="text"
                value={formData.attributes.environment || ""}
                onChange={(e) => updateNestedField("attributes", "environment", e.target.value)}
                placeholder="e.g. Indoor Sanctuary & Exterior Landscape"
                className={styles.input}
              />
            </div>

            {applicableAttributes.map((att) => (
              <div key={att.id} className={styles.formGroup}>
                <label className={styles.label}>{att.name}</label>
                {att.dataType === "select" ? (
                  <select
                    value={formData.attributes[att.id] || ""}
                    onChange={(e) => updateNestedField("attributes", att.id, e.target.value)}
                    className={styles.select}
                  >
                    <option value="">-- Select {att.name} --</option>
                    {(att.options || []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : att.dataType === "boolean" ? (
                  <select
                    value={formData.attributes[att.id] ? "yes" : "no"}
                    onChange={(e) => updateNestedField("attributes", att.id, e.target.value === "yes")}
                    className={styles.select}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <input
                    type={att.dataType === "number" ? "number" : "text"}
                    value={formData.attributes[att.id] || ""}
                    onChange={(e) => updateNestedField("attributes", att.id, e.target.value)}
                    className={styles.input}
                  />
                )}
              </div>
            ))}

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Discovery Tags (Comma Separated)</label>
              <input
                type="text"
                value={(formData.tags || []).join(", ")}
                onChange={(e) => {
                  const arr = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                  updateField("tags", arr);
                }}
                placeholder="Single-Block-Marble, Shilpa-Shastra-Proportioned, Export-Ready"
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}



      {/* TAB 6: SEO & METADATA */}
      {activeTab === "seo" && (
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Meta Title Tag *</label>
              <input
                type="text"
                value={formData.seo?.title || ""}
                onChange={(e) => updateNestedField("seo", "title", e.target.value)}
                placeholder={`${formData.name || "Product Name"} | Jaipur Stonecraft`}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Meta Description Tag</label>
              <textarea
                rows={3}
                value={formData.seo?.description || ""}
                onChange={(e) => updateNestedField("seo", "description", e.target.value)}
                placeholder="Hand-carved stone art sculpted by master stone artisans in Jaipur."
                className={styles.textarea}
              />
            </div>
          </div>
        </div>
      )}

      {/* STICKY ACTION FOOTER BAR */}
      <div className={styles.stickyFooterBar}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: saveStatus === "saved" ? "#137333" : "#B06000" }}>
            {saveStatus === "saved" ? "✓ Saved" : "● Unsaved changes"}
          </span>
          {!isNew && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className={styles.secondaryBtn}
              style={{ color: "#C5221F", borderColor: "#FCE8E6", fontSize: "0.78rem", padding: "0.35rem 0.65rem", minHeight: "36px" }}
            >
              🗑 Delete
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Link href="/admin/products" className={styles.secondaryBtn} style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", minHeight: "36px" }}>
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className={styles.secondaryBtn}
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", minHeight: "36px" }}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(formData.status === "published" ? "draft" : "published")}
            className={styles.primaryBtn}
            style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", minHeight: "36px" }}
          >
            {saving ? "Saving..." : formData.status === "published" ? "Unpublish to Draft" : "⚡ Publish Product"}
          </button>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddModal.isOpen}
        targetField={quickAddModal.targetField}
        fieldLabel={quickAddModal.fieldLabel}
        onClose={() => setQuickAddModal({ isOpen: false, targetField: "", fieldLabel: "" })}
        onSuccess={(createdItem) => {
          if (quickAddModal.targetField === "primaryMaterialId") {
            setMaterialsList((prev) => [...prev, createdItem]);
            updateField("primaryMaterialId", createdItem.id);
          } else if (quickAddModal.targetField === "subjectId") {
            setSubjectsList((prev) => [...prev, createdItem]);
            updateField("subjectId", createdItem.id);
          } else if (quickAddModal.targetField === "productType") {
            setProductTypesList((prev) => [...prev, createdItem]);
            updateField("productType", createdItem.id);
          } else if (quickAddModal.targetField === "parentCategory") {
            setCategoriesList((prev) => [...prev, createdItem]);
            setFormData((prev) => ({
              ...prev,
              parentCategory: createdItem.slug || createdItem.id,
              parentCollection: createdItem.parentCollection || prev.parentCollection,
              parentSubcategory: createdItem.parentSubcategory || prev.parentSubcategory
            }));
            setIsDirty(true);
            setSaveStatus("dirty");
          }
        }}
      />
    </div>
  );
}
