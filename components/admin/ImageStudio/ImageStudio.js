"use client";

import { useState, useRef } from "react";
import styles from "@/app/admin/admin.module.css";

export default function ImageStudio({
  productSlug,
  productName,
  primaryMaterialName,
  imageSrc,
  imageGallery = [],
  onChange
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastFiles, setLastFiles] = useState(null);
  const [isGeneratingAlts, setIsGeneratingAlts] = useState(false);
  const fileInputRef = useRef(null);

  // Normalize gallery items: handle both string URLs and object items
  const normalizedGallery = (imageGallery || []).map((img, idx) => {
    if (typeof img === "string") {
      return {
        src: img,
        altText: `${productName || "Product"} image ${idx + 1}`,
        sortOrder: idx + 1,
        role: img === imageSrc ? "cover" : "gallery"
      };
    }
    return {
      src: img?.src || img?.url || "",
      altText: img?.altText || `${productName || "Product"} image ${idx + 1}`,
      sortOrder: img?.sortOrder || idx + 1,
      role: (img?.src || img?.url) === imageSrc ? "cover" : (img?.role || "gallery")
    };
  }).filter((img) => Boolean(img.src));

  // Auto-generate SEO Alt text
  const generateAltText = (index) => {
    const mat = primaryMaterialName || "White Marble";
    const name = productName || "Hand-Carved Statue";
    if (index === 0) return `${name} hand-carved in solid ${mat} block - Main Cover View`;
    if (index === 1) return `Side profile chisel detail of ${name} in ${mat}`;
    if (index === 2) return `Back view and stone texture grain of ${name}`;
    return `Artisan workshop view of ${name} sculpted in Jaipur`;
  };

  const uploadFiles = async (filesToUpload) => {
    if (!filesToUpload || filesToUpload.length === 0) return;

    setUploading(true);
    setError("");
    setSuccessMessage("");
    setUploadProgress(15);
    setLastFiles(filesToUpload);

    const formData = new FormData();
    formData.append("productSlug", productSlug || "draft-product");
    filesToUpload.forEach((file) => formData.append("files", file));

    try {
      setUploadProgress(45);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      setUploadProgress(85);
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse server response:", jsonErr);
      }

      if (res.ok && data.success && (data.images || data.uploadedFiles)) {
        const uploadedList = data.images || data.uploadedFiles;
        const newImages = uploadedList.map((file, idx) => ({
          src: file.url,
          altText: generateAltText(normalizedGallery.length + idx),
          sortOrder: normalizedGallery.length + idx + 1,
          role: idx === 0 && (!imageSrc || imageSrc.includes("placehold.co")) ? "cover" : "gallery"
        }));

        const updatedGallery = [...normalizedGallery, ...newImages];
        const newCoverSrc = imageSrc && !imageSrc.includes("placehold.co") ? imageSrc : newImages[0]?.src || imageSrc;

        onChange({
          imageSrc: newCoverSrc,
          imageGallery: updatedGallery
        });

        setSuccessMessage(`✓ Successfully uploaded ${newImages.length} image(s).`);
        setLastFiles(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        if (res.status === 401) {
          setError("Session expired or unauthorized. Please re-login to upload photos.");
        } else if (res.status === 400) {
          setError(data.error || "Unsupported file format or file size exceeded.");
        } else if (res.status === 500) {
          setError(data.error || "Server storage error while saving image. Please try again.");
        } else {
          setError(data.error || `Upload failed (Status code: ${res.status}).`);
        }
      }
    } catch (err) {
      console.error("Upload network exception:", err);
      setError("Network connection issue. Please check your internet connectivity and try again.");
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    uploadFiles(files);
  };

  const handleRetry = () => {
    if (lastFiles) {
      uploadFiles(lastFiles);
    }
  };

  const setCoverImage = (src) => {
    onChange({
      imageSrc: src,
      imageGallery: normalizedGallery.map((img) => ({
        ...img,
        role: img.src === src ? "cover" : "gallery"
      }))
    });
  };

  const removeImage = (srcToRemove) => {
    const confirmRemove = confirm("Remove this photo from the gallery?");
    if (!confirmRemove) return;

    const updatedGallery = normalizedGallery.filter((img) => img.src !== srcToRemove);
    let updatedCover = imageSrc;

    if (imageSrc === srcToRemove) {
      updatedCover = updatedGallery[0]?.src || "https://placehold.co/800x600/E8E4DF/1A1918?text=Product+Cover+Photo";
    }

    onChange({
      imageSrc: updatedCover,
      imageGallery: updatedGallery
    });
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= normalizedGallery.length) return;

    const updated = [...normalizedGallery];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChange({
      imageSrc,
      imageGallery: updated.map((img, i) => ({ ...img, sortOrder: i + 1 }))
    });
  };

  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();
    const newImage = {
      src: url,
      altText: generateAltText(normalizedGallery.length),
      sortOrder: normalizedGallery.length + 1,
      role: !imageSrc || imageSrc.includes("placehold.co") ? "cover" : "gallery"
    };

    const updatedGallery = [...normalizedGallery, newImage];
    const newCoverSrc = imageSrc && !imageSrc.includes("placehold.co") ? imageSrc : url;

    onChange({
      imageSrc: newCoverSrc,
      imageGallery: updatedGallery
    });

    setManualUrl("");
    setShowUrlFallback(false);
    setSuccessMessage("✓ External image URL added to gallery.");
  };

  const handleUpdateAltText = (index, newAlt) => {
    const updated = [...normalizedGallery];
    updated[index] = { ...updated[index], altText: newAlt };
    onChange({
      imageSrc,
      imageGallery: updated
    });
  };

  const handleBatchGenerateAltTexts = async () => {
    if (normalizedGallery.length === 0) return;
    setIsGeneratingAlts(true);
    setError("");

    try {
      const res = await fetch("/api/admin/ai/generate-alt-texts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          materialName: primaryMaterialName,
          images: normalizedGallery.map(img => img.src)
        })
      });

      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.images)) {
        const updated = normalizedGallery.map((img, i) => {
          const match = json.images.find(m => m.url === img.src) || json.images[i];
          return {
            ...img,
            altText: match?.suggestedAlt || img.altText
          };
        });

        onChange({
          imageSrc,
          imageGallery: updated
        });
        setSuccessMessage(`✓ Generated AI Image Alt Texts for ${json.images.length} photo(s).`);
      } else {
        setError(json.error || "Failed to generate AI image alt texts.");
      }
    } catch {
      setError("Network error during AI image alt text generation.");
    } finally {
      setIsGeneratingAlts(false);
    }
  };

  return (
    <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>📸 Interactive Product Image Studio</h2>
        <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Upload high-resolution carving photos directly from mobile camera or desktop gallery. Set main cover image and reorder.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "#E6F4EA", color: "#137333", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1.25rem", fontWeight: "600" }}>
          {successMessage}
        </div>
      )}

      {/* Error Banner & Retry Button */}
      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#FCE8E6", color: "#C5221F", borderRadius: "6px", fontSize: "0.875rem", marginBottom: "1.25rem", border: "1px solid #F8D7DA" }}>
          <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>⚠️ Upload Failed</div>
          <div>{error}</div>
          {lastFiles && (
            <button
              type="button"
              onClick={handleRetry}
              className={styles.secondaryBtn}
              style={{ marginTop: "0.75rem", padding: "0.4rem 0.85rem", fontSize: "0.8rem", backgroundColor: "#FFF", color: "#C5221F", borderColor: "#C5221F", fontWeight: "600", cursor: "pointer" }}
            >
              🔄 Retry Upload
            </button>
          )}
        </div>
      )}

      {/* Multi-File Upload Dropzone / Touch Trigger */}
      <div
        style={{
          border: "2px dashed #9E7B4F",
          borderRadius: "8px",
          padding: "2rem 1rem",
          textAlign: "center",
          backgroundColor: "#FAF8F5",
          marginBottom: "1.5rem",
          cursor: "pointer"
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="photoUploadInput"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <label htmlFor="photoUploadInput" style={{ cursor: "pointer", display: "block" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📷</div>
          <div style={{ fontSize: "1rem", fontWeight: "600", color: "var(--color-bronze)", marginBottom: "0.25rem" }}>
            Tap to Choose / Take Photos
          </div>
          <div style={{ fontSize: "0.8rem", color: "#777" }}>
            Supports JPG, PNG, WEBP, AVIF (Max 15MB per file) from mobile camera or gallery
          </div>
        </label>

        {uploading && (
          <div style={{ marginTop: "1rem", width: "100%", maxWidth: "300px", margin: "1rem auto 0" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--color-bronze)", fontWeight: "600", marginBottom: "0.35rem" }}>
              Uploading photos ({uploadProgress}%)...
            </div>
            <div className={styles.progressBarTrack} style={{ maxWidth: "100%" }}>
              <div className={styles.progressBarFill} style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Secondary URL Entry Fallback Toggle */}
      <div style={{ marginBottom: "2rem", textAlign: "right" }}>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          style={{ background: "none", border: "none", color: "#888", fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline" }}
        >
          {showUrlFallback ? "Hide URL Input" : "Paste image URL manually (Secondary Fallback)"}
        </button>

        {showUrlFallback && (
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className={styles.input}
              style={{ maxWidth: "360px", fontSize: "0.8rem" }}
            />
            <button type="button" onClick={handleAddManualUrl} className={styles.secondaryBtn} style={{ fontSize: "0.8rem" }}>
              Add URL
            </button>
          </div>
        )}
      </div>

      {/* Main Cover Photo Showcase */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.75rem" }}>
          Main Product Cover Photo
        </h3>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <img
            src={imageSrc}
            alt="Main Cover"
            style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "2px solid var(--color-bronze)", backgroundColor: "#E8E4DF" }}
            onError={(e) => { e.target.src = "https://placehold.co/800x600/E8E4DF/1A1918?text=Product+Cover+Photo"; }}
          />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>Primary Cover Image</div>
            <div style={{ fontSize: "0.78rem", color: "#666", wordBreak: "break-all" }}>{imageSrc}</div>
          </div>
        </div>
      </div>

      {/* Gallery Grid & Reordering */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "600", margin: 0 }}>
            Product Photo Gallery ({normalizedGallery.length} photos)
          </h3>

          {normalizedGallery.length > 0 && (
            <button
              type="button"
              disabled={isGeneratingAlts}
              onClick={handleBatchGenerateAltTexts}
              className={styles.secondaryBtn}
              style={{ fontSize: "0.78rem", borderColor: "var(--color-bronze)", color: "var(--color-navy)", fontWeight: "600" }}
            >
              {isGeneratingAlts ? "⌛ Analyzing Images..." : "✨ AI Generate Alt Text for All Images"}
            </button>
          )}
        </div>

        {normalizedGallery.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#888", backgroundColor: "#FAFAFA", borderRadius: "6px" }}>
            No gallery images uploaded yet. Use the upload box above to add photos.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {normalizedGallery.map((img, idx) => (
              <div
                key={img.src + idx}
                style={{
                  border: imageSrc === img.src ? "2px solid var(--color-bronze)" : "1px solid #E2DDD5",
                  borderRadius: "6px",
                  padding: "0.85rem",
                  backgroundColor: "#FFF"
                }}
              >
                <img
                  src={img.src}
                  alt={img.altText || "Gallery item"}
                  style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "4px", marginBottom: "0.65rem", backgroundColor: "#E8E4DF" }}
                  onError={(e) => { e.target.src = "https://placehold.co/400x300/E8E4DF/1A1918?text=Photo+Unavailable"; }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`${styles.badge} ${imageSrc === img.src ? styles.badgePublished : styles.badgeDraft}`}>
                      {imageSrc === img.src ? "Cover Photo" : `Photo #${idx + 1}`}
                    </span>
                  </div>

                  {/* Alt Text Input */}
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: "600", color: "#666" }}>Image Alt Text (SEO):</label>
                    <input
                      type="text"
                      value={img.altText || ""}
                      onChange={(e) => handleUpdateAltText(idx, e.target.value)}
                      placeholder="Descriptive image alt text..."
                      className={styles.input}
                      style={{ fontSize: "0.78rem", padding: "0.25rem 0.45rem", marginTop: "0.15rem" }}
                    />
                  </div>

                  {/* Touch Actions */}
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                    {imageSrc !== img.src && (
                      <button
                        type="button"
                        onClick={() => setCoverImage(img.src)}
                        className={styles.secondaryBtn}
                        style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", minHeight: "40px", flex: 1, justifyContent: "center" }}
                      >
                        ★ Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, -1)}
                      className={styles.secondaryBtn}
                      style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", minHeight: "40px" }}
                      title="Move Left"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={idx === normalizedGallery.length - 1}
                      onClick={() => moveImage(idx, 1)}
                      className={styles.secondaryBtn}
                      style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", minHeight: "40px" }}
                      title="Move Right"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(img.src)}
                      className={styles.secondaryBtn}
                      style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", minHeight: "40px", color: "#C5221F" }}
                      title="Remove Photo"
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
