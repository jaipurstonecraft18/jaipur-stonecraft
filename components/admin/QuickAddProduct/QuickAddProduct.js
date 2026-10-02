"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CategorySearchSelect from "@/components/admin/CategorySearchSelect/CategorySearchSelect";
import QuickAddModal from "@/components/admin/QuickAddModal/QuickAddModal";
import styles from "./QuickAddProduct.module.css";

const STONE_MATERIALS = [
  { id: "makrana-pure-white", name: "Makrana Pure White Marble", short: "White Marble", color: "White" },
  { id: "sangemarmar-white", name: "Sangemarmar White Marble", short: "Sangemarmar", color: "White" },
  { id: "black-bhainslana", name: "Black Bhainslana Marble", short: "Black Marble", color: "Black" },
  { id: "pink-bansi-paharpur", name: "Pink Bansi Paharpur Sandstone", short: "Pink Sandstone", color: "Pink" },
  { id: "jodhpur-red-sandstone", name: "Jodhpur Royal Red Sandstone", short: "Red Sandstone", color: "Red" },
  { id: "dholpur-beige-sandstone", name: "Dholpur Beige Sandstone", short: "Beige Sandstone", color: "Beige" },
  { id: "jaisalmer-yellow-limestone", name: "Jaisalmer Golden Yellow Limestone", short: "Golden Yellow", color: "Golden Yellow" }
];

const PRODUCT_TYPES = [
  { id: "statue", name: "Deity Statue / Murti", icon: "🕉️" },
  { id: "idol", name: "Devotional Idol", icon: "✨" },
  { id: "relief", name: "Wall Relief Panel", icon: "🖼️" },
  { id: "mandir", name: "Home Temple Architecture", icon: "🛕" },
  { id: "fountain", name: "Water Fountain & Basin", icon: "⛲" },
  { id: "sculpture", name: "Artistic Sculpture", icon: "🗿" },
  { id: "architectural_element", name: "Jali Screen / Column", icon: "🏛️" }
];

export default function QuickAddProduct({ onSwitchToAdvanced }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Step state: 1 = Photos, 2 = Details, 3 = Review, 4 = Success
  const [step, setStep] = useState(1);

  // Media state
  const [images, setImages] = useState([]); // [{ url, displayUrl, altText, isPrimary }]
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // AI & Vision analysis state
  const [analyzingVision, setAnalyzingVision] = useState(false);
  const [visionState, setVisionState] = useState(null); // 'FULL_SUCCESS' | 'PARTIAL_SUCCESS' | 'COMPLETE_FAILURE'
  const [aiSuggestions, setAiSuggestions] = useState({});

  // Form Details state
  const [name, setName] = useState("");
  const [primaryMaterialId, setPrimaryMaterialId] = useState("makrana-pure-white");
  const [productType, setProductType] = useState("statue");
  const [subject, setSubject] = useState("");
  const [parentCategory, setParentCategory] = useState("ganesh-ji");
  const [parentSubcategory, setParentSubcategory] = useState("hindu-sculptures");
  const [parentCollection, setParentCollection] = useState("sculptures-statues");
  const [shortDescription, setShortDescription] = useState("");
  const [targetStatus, setTargetStatus] = useState("published"); // 'published' | 'draft'

  // Dynamic catalogue list from server
  const [categoriesList, setCategoriesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  // Save / Submit state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);

  // Quick Add Category Modal state
  const [quickAddModal, setQuickAddModal] = useState({
    isOpen: false,
    targetField: "",
    fieldLabel: ""
  });

  // Fetch categories and subjects for selection
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategoriesList(data.categories.filter((c) => c.isActive !== false));
      })
      .catch(() => {});

    fetch("/api/admin/catalogue")
      .then((res) => res.json())
      .then((data) => {
        if (data.subjects) setSubjectsList(data.subjects.filter((s) => s.isActive !== false));
      })
      .catch(() => {});
  }, []);

  // Handle Photo Selection & Upload
  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("folder", "products");
      formData.append("productSlug", "quick-add");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.images)) {
        const newImages = data.images.map((img, idx) => ({
          url: img.url,
          displayUrl: img.displayUrl || img.url,
          altText: img.altText || "Product photo",
          isPrimary: images.length === 0 && idx === 0
        }));

        setImages((prev) => {
          const existingUrls = new Set(prev.map((p) => p.url));
          const uniqueNew = newImages.filter((img) => !existingUrls.has(img.url));
          const combined = [...prev, ...uniqueNew];
          // Ensure first image is marked primary
          if (!combined.some((img) => img.isPrimary) && combined.length > 0) {
            combined[0].isPrimary = true;
          }
          return combined;
        });
      } else {
        setUploadError(data.error || "Photo couldn't be uploaded. Check your connection and try again.");
      }
    } catch (err) {
      setUploadError("Photo couldn't be uploaded. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const handleSetCover = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    );
  };

  const handleSkipToDetails = () => {
    setAnalyzingVision(false);
    if (!visionState) setVisionState("COMPLETE_FAILURE");
    setStep(2);
  };

  // Step 1 -> Step 2: Trigger Vision Analysis & Move Forward
  const handleContinueToDetails = async () => {
    if (images.length === 0) {
      setUploadError("Please add at least one product photo to continue.");
      return;
    }

    setAnalyzingVision(true);
    setUploadError("");

    // Maximum 5s timeout to guarantee UI never hangs on AI
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const primaryImage = images.find((img) => img.isPrimary) || images[0];
      const res = await fetch("/api/admin/ai/vision-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          imageUrls: [primaryImage.url, ...images.map((i) => i.url).filter((u) => u !== primaryImage.url)]
        })
      });
      clearTimeout(timer);

      const result = await res.json();

      if (result.success && result.facts) {
        setVisionState(result.state);
        setAiSuggestions(result.facts);

        if (result.facts.suggestedTitle && !name) {
          setName(result.facts.suggestedTitle);
        }
        if (result.taxonomy?.primaryMaterialId) {
          setPrimaryMaterialId(result.taxonomy.primaryMaterialId);
        }
        if (result.taxonomy?.productType) {
          setProductType(result.taxonomy.productType);
        }
        if (result.taxonomy?.parentCategory) {
          const matchedSlug = result.taxonomy.parentCategory;
          setParentCategory(matchedSlug);
          const foundCat = categoriesList.find((c) => c.slug === matchedSlug);
          if (foundCat) {
            if (foundCat.parentSubcategory || foundCat.parent_subcategory_slug) {
              setParentSubcategory(foundCat.parentSubcategory || foundCat.parent_subcategory_slug);
            }
            if (foundCat.parentCollection || foundCat.parent_collection_slug) {
              setParentCollection(foundCat.parentCollection || foundCat.parent_collection_slug);
            }
          }
        }
        if (result.facts.subject) {
          setSubject(result.facts.subject);
        }
        if (result.facts.suggestedTitle && !shortDescription) {
          setShortDescription(`Hand-carved ${result.facts.suggestedTitle} crafted by master artisans in Jaipur.`);
        }
      } else {
        setVisionState("COMPLETE_FAILURE");
      }
    } catch {
      clearTimeout(timer);
      // Graceful fallback: Never block user on AI failure
      setVisionState("COMPLETE_FAILURE");
    } finally {
      clearTimeout(timer);
      setAnalyzingVision(false);
      setStep(2);
    }
  };

  // Save Product (Either as Draft from any step, or Publish from Review)
  const handleSaveProduct = async (statusOverride = null) => {
    if (images.length === 0) {
      setSaveError("Please add at least one product photo before saving.");
      return;
    }
    setSaving(true);
    setSaveError("");

    const finalStatus = statusOverride || targetStatus;
    const timestamp = Date.now();
    const finalName = name.trim() || "Untitled Product Draft";
    const slug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `draft-${timestamp}`;
    const primaryImg = images.find((i) => i.isPrimary) || images[0];

    const payload = {
      name: finalName,
      slug,
      status: finalStatus,
      primaryMaterialId,
      productType,
      parentCategory,
      parentCollection: parentCollection || "sculptures-statues",
      parentSubcategory: parentSubcategory || "hindu-sculptures",
      subjectId: subject ? subject.toLowerCase().replace(/[^a-z0-9]+/g, "-") : null,
      shortDescription: shortDescription || `Hand-carved ${finalName} sculpted in Jaipur Stonecraft atelier.`,
      imageSrc: primaryImg ? primaryImg.url : "https://placehold.co/800x600/E8E4DF/1A1918?text=Product+Photo",
      imageGallery: images.map((img, idx) => ({
        url: img.url,
        altText: img.altText || `${finalName} view ${idx + 1}`,
        isPrimary: img.isPrimary
      })),
      attributes: {
        dimensions: { heightInches: 24, widthInches: 16, depthInches: 10 },
        dimensions_height_inches: 24,
        dimensions_width_inches: 16,
        dimensions_depth_inches: 10,
        availabilityStatus: "ready_stock",
        customizationAvailable: true
      },
      seo: {
        title: `${finalName} | Jaipur Stonecraft`,
        description: shortDescription || `Hand-carved ${finalName} in natural stone.`
      }
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.product) {
        setCreatedProduct(data.product);

        // Queue asynchronous background AI enrichment (Grok / Gemini)
        fetch("/api/admin/ai/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productSlug: data.product.slug,
            facts: {
              subject,
              material: STONE_MATERIALS.find((m) => m.id === primaryMaterialId)?.name,
              productType,
              suggestedTitle: finalName,
              userShortDescription: shortDescription?.trim() || ""
            }
          })
        }).catch(() => {});

        setStep(4); // Success screen
      } else {
        setSaveError(data.error || "Failed to save product draft. Please try again.");
      }
    } catch {
      setSaveError("Network error. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetForNextProduct = () => {
    setImages([]);
    setName("");
    setSubject("");
    setShortDescription("");
    setVisionState(null);
    setAiSuggestions({});
    setStep(1);
    setCreatedProduct(null);
  };

  return (
    <div className={styles.container}>
      {/* Top Header Bar */}
      <div className={styles.topBar}>
        <Link href="/admin/products" className={styles.backLink}>
          ← Products
        </Link>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {step < 4 && (
            <button
              type="button"
              onClick={() => handleSaveProduct("draft")}
              disabled={saving || images.length === 0}
              className={styles.saveDraftLink}
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
          )}
          {onSwitchToAdvanced && (
            <button
              type="button"
              onClick={onSwitchToAdvanced}
              style={{
                background: "none",
                border: "none",
                color: "#8C6D46",
                fontSize: "0.78rem",
                fontWeight: "600",
                cursor: "pointer",
                padding: "0.25rem 0.5rem"
              }}
            >
              Advanced Studio →
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator (Steps 1, 2, 3) */}
      {step < 4 && (
        <div className={styles.stepBar}>
          <div className={`${styles.stepItem} ${step === 1 ? styles.stepActive : step > 1 ? styles.stepDone : ""}`}>
            <span className={styles.stepCircle}>{step > 1 ? "✓" : "1"}</span>
            <span>Photos</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepItem} ${step === 2 ? styles.stepActive : step > 2 ? styles.stepDone : ""}`}>
            <span className={styles.stepCircle}>{step > 2 ? "✓" : "2"}</span>
            <span>Details</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepItem} ${step === 3 ? styles.stepActive : ""}`}>
            <span className={styles.stepCircle}>3</span>
            <span>Publish</span>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {(uploadError || saveError) && (
        <div style={{
          padding: "0.85rem 1rem",
          backgroundColor: "#FCE8E6",
          color: "#C5221F",
          borderRadius: "8px",
          marginBottom: "1.25rem",
          fontSize: "0.88rem",
          lineHeight: "1.4"
        }}>
          {uploadError || saveError}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: ADD PRODUCT PHOTOS */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Add Product Photos</h1>
            <p className={styles.subtitle}>
              Take photos with your phone camera or select photos from your gallery.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            multiple
            style={{ display: "none" }}
          />

          {images.length === 0 ? (
            <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
              <div className={styles.uploadIcon}>📷</div>
              <button type="button" className={styles.uploadBtn} disabled={uploading}>
                {uploading ? "Uploading Photos..." : "+ Add Product Photos"}
              </button>
              <div className={styles.dropzoneSpecs}>
                <span className={styles.dropzoneBadge}>📐 1:1 Square Ratio (Best)</span>
                <span className={styles.dropzoneBadge}>📏 1200 × 1200 px (Min 800×800)</span>
                <span className={styles.dropzoneBadge}>📁 Max 15MB</span>
              </div>
              <span className={styles.uploadHint}>Camera or Gallery • Tap to upload single or multiple photos</span>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#555" }}>
                  {images.length} {images.length === 1 ? "Photo" : "Photos"} Added
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: "none", border: "none", color: "#8C6D46", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer" }}
                >
                  + Add More
                </button>
              </div>

              <div className={styles.photoGrid}>
                {images.map((img, idx) => (
                  <div key={idx} className={`${styles.photoThumbCard} ${img.isPrimary ? styles.photoThumbCardCover : ""}`}>
                    <img src={img.displayUrl} alt={img.altText} className={styles.thumbImg} />
                    {img.isPrimary && <span className={styles.coverBadge}>Main</span>}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className={styles.removePhotoBtn}
                      title="Remove Photo"
                    >
                      ✕
                    </button>
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        className={styles.setCoverBtn}
                      >
                        Set Main
                      </button>
                    )}
                  </div>
                ))}

                <div className={styles.addMoreThumb} onClick={() => fileInputRef.current?.click()}>
                  <span style={{ fontSize: "1.25rem" }}>+</span>
                  <span>Add Photo</span>
                </div>
              </div>
            </div>
          )}

          {/* Simple & Straightforward Photo Framing & Size Guide */}
          <div className={styles.guidanceBox}>
            <div className={styles.guidanceHeader}>
              <h3 className={styles.guidanceTitle}>
                <span>📐</span> Photo Size & Framing Guidelines
              </h3>
              <span style={{ fontSize: "0.74rem", color: "#666", fontWeight: "500" }}>
                Simple tips for clean catalog & product pages
              </span>
            </div>

            <div className={styles.guidanceBadgeRow}>
              <div className={`${styles.guidanceBadge} ${styles.guidanceBadgeHighlight}`}>
                <strong>Ratio:</strong> 1:1 Square (Recommended) or 4:3
              </div>
              <div className={styles.guidanceBadge}>
                <strong>Ideal Resolution:</strong> 1200 × 1200 px (Min 800 × 800)
              </div>
              <div className={styles.guidanceBadge}>
                <strong>Formats:</strong> JPG, PNG, WebP (Max 15MB)
              </div>
            </div>

            <ul className={styles.guidanceList}>
              <li className={styles.guidanceItem}>
                <span className={styles.guidanceIcon}>🎯</span>
                <div>
                  <strong>Center Framing & Margins:</strong> Place the whole statue in the center. Leave 10–15% breathing space around all sides so crowns (<em>mukut</em>), weapons, and base pedestals are not cut off.
                </div>
              </li>
              <li className={styles.guidanceItem}>
                <span className={styles.guidanceIcon}>📸</span>
                <div>
                  <strong>Straight Eye/Chest Level:</strong> Hold camera level with the statue's chest rather than angling down from above, ensuring true divine proportions.
                </div>
              </li>
              <li className={styles.guidanceItem}>
                <span className={styles.guidanceIcon}>🖼️</span>
                <div>
                  <strong>Clean Contrasting Background:</strong> A solid dark/black cloth or studio backdrop makes Makrana white marble chiseling and relief details stand out.
                </div>
              </li>
              <li className={styles.guidanceItem}>
                <span className={styles.guidanceIcon}>⭐</span>
                <div>
                  <strong>Set Best View as "Main":</strong> Your full front view should be set as <strong>Main</strong> (first image). Use extra photos for 45° angle, side profile, and carving close-ups.
                </div>
              </li>
            </ul>
          </div>

          {/* Action Bar (Fixed on mobile, natural inside card on desktop PC) */}
          <div className={styles.bottomBarWrapper}>
            {saveError && (
              <div style={{
                padding: "0.6rem 0.85rem",
                backgroundColor: "#FCE8E6",
                color: "#C5221F",
                borderRadius: "6px",
                marginBottom: "0.75rem",
                fontSize: "0.82rem",
                fontWeight: "500"
              }}>
                ⚠️ {saveError}
              </div>
            )}

            <div className={styles.bottomBar}>
              <button
                type="button"
                onClick={() => handleSaveProduct("draft")}
                disabled={images.length === 0 || saving || uploading}
                className={styles.secondaryActionBtn}
              >
                {saving ? (
                  <>
                    <span className={`${styles.btnSpinner} ${styles.btnSpinnerDark}`} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Draft</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleContinueToDetails}
                disabled={images.length === 0 || uploading || analyzingVision}
                className={styles.primaryActionBtn}
              >
                {analyzingVision ? (
                  <>
                    <span className={styles.btnSpinner} />
                    <span>✨ Identifying Details...</span>
                  </>
                ) : (
                  <span>Next: Check Details →</span>
                )}
              </button>
            </div>

            {analyzingVision && (
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleSkipToDetails}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8C6D46",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0.25rem"
                  }}
                >
                  Skip AI identification and enter details manually →
                </button>
              </div>
            )}

            {images.length === 0 && (
              <p className={styles.actionHelperHint}>
                📷 Add at least 1 product photo above to enable Save Draft and Continue
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CHECK PRODUCT DETAILS */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Check Product Details</h1>
            <p className={styles.subtitle}>
              {visionState === "FULL_SUCCESS"
                ? "We've identified the product details from your photos. Please check them and correct anything that is incorrect."
                : "Some details could not be identified automatically. Please answer the simple questions below so we can continue."}
            </p>
          </div>

          {/* AI Banner */}
          {visionState === "FULL_SUCCESS" ? (
            <div className={styles.aiNoticeBox}>
              ✨ <strong>AI identified your product:</strong> Values below are pre-filled based on your photos. You can easily edit any of them.
            </div>
          ) : visionState === "PARTIAL_SUCCESS" ? (
            <div className={styles.aiNoticeBox}>
              🔍 <strong>Partially identified:</strong> Please confirm the stone material and deity below.
            </div>
          ) : (
            <div className={styles.aiWarningBox}>
              ℹ️ <strong>Quick Details Needed:</strong> Please select the stone type and subject below.
            </div>
          )}

          {/* Product Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Product Name *
              {aiSuggestions.suggestedTitle && <span className={styles.aiBadge}>✨ AI suggested</span>}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. White Marble Blessing Ganesh Statue"
              className={styles.input}
              required
            />
          </div>

          {/* Stone Material (Touch Chips) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Stone Material * (Granite strictly excluded)
              {aiSuggestions.material && <span className={styles.aiBadge}>✨ AI suggested</span>}
            </label>
            <div className={styles.chipGroup}>
              {STONE_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setPrimaryMaterialId(mat.id)}
                  className={`${styles.chip} ${primaryMaterialId === mat.id ? styles.chipSelected : ""}`}
                >
                  {mat.short}
                </button>
              ))}
            </div>
          </div>

          {/* Product Type (Touch Chips) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Product Type *
              {aiSuggestions.productType && <span className={styles.aiBadge}>✨ AI suggested</span>}
            </label>
            <div className={styles.chipGroup}>
              {PRODUCT_TYPES.map((pt) => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setProductType(pt.id)}
                  className={`${styles.chip} ${productType === pt.id ? styles.chipSelected : ""}`}
                >
                  <span>{pt.icon}</span>
                  <span>{pt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Searchable Category Selector with Quick Add */}
          <div className={styles.formGroup}>
            <CategorySearchSelect
              categories={categoriesList}
              value={parentCategory}
              onChange={(selectedSlug, catObj) => {
                setParentCategory(selectedSlug);
                if (catObj) {
                  if (catObj.parentSubcategory || catObj.parent_subcategory_slug) {
                    setParentSubcategory(catObj.parentSubcategory || catObj.parent_subcategory_slug);
                  }
                  if (catObj.parentCollection || catObj.parent_collection_slug) {
                    setParentCollection(catObj.parentCollection || catObj.parent_collection_slug);
                  }
                }
              }}
              label="Product Category"
              required
              onQuickAdd={() => setQuickAddModal({ isOpen: true, targetField: "parentCategory", fieldLabel: "Category" })}
              helperText="Search by deity or category name (e.g., Ganesh, Buddha, Mandir, Jali)"
            />
          </div>

          {/* Short Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Short Summary Description
              <span className={styles.aiBadge} style={{ background: "#EBF5FF", color: "#1E40AF" }}>
                ✨ AI will polish & SEO optimize
              </span>
            </label>
            <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.78rem", color: "#78716C" }}>
              Type rough notes or words in your own style. AI will fix typos, spelling, and enrich it for Google SEO ranking.
            </p>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. whiet marbl ganesh statu for puja room 2 feet"
              className={styles.textarea}
            />
          </div>

          {/* Action Bar */}
          <div className={styles.bottomBarWrapper}>
            {saveError && (
              <div style={{
                padding: "0.6rem 0.85rem",
                backgroundColor: "#FCE8E6",
                color: "#C5221F",
                borderRadius: "6px",
                marginBottom: "0.75rem",
                fontSize: "0.82rem",
                fontWeight: "500"
              }}>
                ⚠️ {saveError}
              </div>
            )}
            <div className={styles.bottomBar}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className={styles.secondaryActionBtn}
              >
                ← Photos
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!name.trim()}
                className={styles.primaryActionBtn}
              >
                Next: Review & Publish →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: REVIEW & PUBLISH */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Review & Publish</h1>
            <p className={styles.subtitle}>
              Verify your product summary before saving to the atelier catalog.
            </p>
          </div>

          {/* Review Summary Box */}
          <div className={styles.reviewBox}>
            {images.length > 0 && (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                <img
                  src={(images.find((i) => i.isPrimary) || images[0]).displayUrl}
                  alt={name}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div>
                  <div style={{ fontWeight: "700", fontSize: "1.05rem", color: "#1A1918" }}>{name}</div>
                  <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.2rem" }}>
                    {images.length} {images.length === 1 ? "Photo" : "Photos"} uploaded
                  </div>
                </div>
              </div>
            )}

            <div className={styles.reviewRow}>
              <span className={styles.reviewLabel}>Material:</span>
              <span className={styles.reviewValue}>
                {STONE_MATERIALS.find((m) => m.id === primaryMaterialId)?.name || primaryMaterialId}
              </span>
            </div>
            <div className={styles.reviewRow}>
              <span className={styles.reviewLabel}>Product Type:</span>
              <span className={styles.reviewValue}>
                {PRODUCT_TYPES.find((pt) => pt.id === productType)?.name || productType}
              </span>
            </div>
            <div className={styles.reviewRow}>
              <span className={styles.reviewLabel}>Category:</span>
              <span className={styles.reviewValue}>
                {categoriesList.find((c) => c.slug === parentCategory)?.name || parentCategory}
              </span>
            </div>
            {shortDescription && (
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Summary:</span>
                <span className={styles.reviewValue} style={{ fontSize: "0.82rem" }}>
                  {shortDescription}
                </span>
              </div>
            )}
          </div>

          {/* Status Choice */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Publishing Option</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem",
                borderRadius: "8px",
                border: targetStatus === "published" ? "2px solid #8C6D46" : "1.5px solid #D5CFC7",
                backgroundColor: targetStatus === "published" ? "#F4EFE6" : "#FFF",
                cursor: "pointer"
              }}>
                <input
                  type="radio"
                  name="productStatus"
                  value="published"
                  checked={targetStatus === "published"}
                  onChange={() => setTargetStatus("published")}
                />
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>🚀 Publish to Website</div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>Visible to clients on public catalogue immediately</div>
                </div>
              </label>

              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem",
                borderRadius: "8px",
                border: targetStatus === "draft" ? "2px solid #8C6D46" : "1.5px solid #D5CFC7",
                backgroundColor: targetStatus === "draft" ? "#F4EFE6" : "#FFF",
                cursor: "pointer"
              }}>
                <input
                  type="radio"
                  name="productStatus"
                  value="draft"
                  checked={targetStatus === "draft"}
                  onChange={() => setTargetStatus("draft")}
                />
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>💾 Save as Private Draft</div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>Saved safely for later editing before publishing</div>
                </div>
              </label>
            </div>
          </div>

          {/* Note on background AI */}
          <div style={{ fontSize: "0.82rem", color: "#666", backgroundColor: "#FAF9F6", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem" }}>
            ℹ️ Full descriptions, craftsmanship details, FAQs, and SEO tags will be automatically generated in the background after saving.
          </div>

          {/* Action Bar */}
          <div className={styles.bottomBarWrapper}>
            {saveError && (
              <div style={{
                padding: "0.6rem 0.85rem",
                backgroundColor: "#FCE8E6",
                color: "#C5221F",
                borderRadius: "6px",
                marginBottom: "0.75rem",
                fontSize: "0.82rem",
                fontWeight: "500"
              }}>
                ⚠️ {saveError}
              </div>
            )}
            <div className={styles.bottomBar}>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={saving}
                className={styles.secondaryActionBtn}
              >
                ← Edit
              </button>
              <button
                type="button"
                onClick={() => handleSaveProduct(targetStatus)}
                disabled={saving}
                className={styles.primaryActionBtn}
              >
                {saving ? (
                  <>
                    <span className={styles.btnSpinner} />
                    <span>Saving Product...</span>
                  </>
                ) : targetStatus === "published" ? (
                  "🚀 Publish Product"
                ) : (
                  "💾 Save Draft"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: SUCCESS CONFIRMATION SCREEN */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>
            {targetStatus === "published" ? "Product Published!" : "Draft Saved!"}
          </h2>
          <p className={styles.successText}>
            <strong>&quot;{createdProduct?.name}&quot;</strong> has been successfully saved to the catalogue.
            <br />
            <span style={{ fontSize: "0.85rem", color: "#8C6D46" }}>
              ✨ AI is currently generating full descriptions, craftsmanship details, and SEO in the background.
            </span>
          </p>

          <div className={styles.successActions}>
            <button
              type="button"
              onClick={handleResetForNextProduct}
              className={styles.primaryActionBtn}
            >
              ➕ Upload Another Product
            </button>

            {createdProduct?.slug && (
              <Link
                href={`/admin/products/${createdProduct.slug}`}
                className={styles.secondaryActionBtn}
                style={{ textAlign: "center", textDecoration: "none", margin: 0 }}
              >
                🛠️ Open in Full Product Editor
              </Link>
            )}

            <Link
              href="/admin/products"
              style={{
                color: "#666",
                fontSize: "0.9rem",
                textDecoration: "none",
                marginTop: "0.5rem"
              }}
            >
              View Products List →
            </Link>
          </div>
        </div>
      )}

      {/* Quick Add Category Modal */}
      <QuickAddModal
        isOpen={quickAddModal.isOpen}
        targetField={quickAddModal.targetField}
        fieldLabel={quickAddModal.fieldLabel}
        onClose={() => setQuickAddModal({ isOpen: false, targetField: "", fieldLabel: "" })}
        onSuccess={(createdItem) => {
          if (quickAddModal.targetField === "parentCategory") {
            setCategoriesList((prev) => {
              const alreadyExists = prev.some((c) => c.slug === createdItem.slug || c.id === createdItem.id);
              return alreadyExists ? prev : [...prev, createdItem];
            });
            setParentCategory(createdItem.slug || createdItem.id);
            if (createdItem.parentSubcategory || createdItem.parent_subcategory_slug) {
              setParentSubcategory(createdItem.parentSubcategory || createdItem.parent_subcategory_slug);
            }
            if (createdItem.parentCollection || createdItem.parent_collection_slug) {
              setParentCollection(createdItem.parentCollection || createdItem.parent_collection_slug);
            }
          }
        }}
      />
    </div>
  );
}
