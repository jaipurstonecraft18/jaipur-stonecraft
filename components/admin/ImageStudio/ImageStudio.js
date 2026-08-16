"use client";

import { useState } from "react";
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
  const [uploadProgress, setUploadProgress] = useState(0);

  // Auto-generate SEO Alt text
  const generateAltText = (index) => {
    const mat = primaryMaterialName || "White Marble";
    const name = productName || "Hand-Carved Statue";
    if (index === 0) return `${name} hand-carved in solid ${mat} block - Main Cover View`;
    if (index === 1) return `Side profile chisel detail of ${name} in ${mat}`;
    if (index === 2) return `Back view and stone texture grain of ${name}`;
    return `Artisan workshop view of ${name} sculpted in Jaipur`;
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("productSlug", productSlug || "draft-product");
    files.forEach((file) => formData.append("files", file));

    try {
      setUploadProgress(50);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setUploadProgress(90);

      if (res.ok && data.success && data.uploadedFiles) {
        const newImages = data.uploadedFiles.map((file, idx) => ({
          src: file.url,
          altText: generateAltText((imageGallery || []).length + idx),
          sortOrder: (imageGallery || []).length + idx + 1,
          role: idx === 0 && (!imageSrc || imageSrc.includes("placehold.co")) ? "cover" : "gallery"
        }));

        const updatedGallery = [...(imageGallery || []), ...newImages];
        const newCoverSrc = imageSrc && !imageSrc.includes("placehold.co") ? imageSrc : newImages[0]?.src || imageSrc;

        onChange({
          imageSrc: newCoverSrc,
          imageGallery: updatedGallery
        });
      } else {
        setError(data.error || "Failed to upload images.");
      }
    } catch (err) {
      setError("Error connecting to upload server.");
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  const setCoverImage = (src) => {
    onChange({
      imageSrc: src,
      imageGallery: (imageGallery || []).map((img) => ({
        ...img,
        role: img.src === src ? "cover" : "gallery"
      }))
    });
  };

  const removeImage = (srcToRemove) => {
    const updatedGallery = (imageGallery || []).filter((img) => img.src !== srcToRemove);
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
    if (targetIndex < 0 || targetIndex >= imageGallery.length) return;

    const updated = [...imageGallery];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChange({
      imageSrc,
      imageGallery: updated.map((img, i) => ({ ...img, sortOrder: i + 1 }))
    });
  };

  return (
    <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>📸 Interactive Product Image Studio</h2>
        <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Upload high-resolution carving photos directly from mobile camera or gallery. Set main cover image and reorder.
        </p>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "#FCE8E6", color: "#C5221F", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          {error}
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
          marginBottom: "2rem",
          cursor: "pointer"
        }}
      >
        <input
          type="file"
          id="photoUploadInput"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <label htmlFor="photoUploadInput" style={{ cursor: "pointer", display: "block" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📷</div>
          <div style={{ fontSize: "1rem", fontWeight: "600", color: "var(--color-bronze)", marginBottom: "0.25rem" }}>
            Tap to Choose / Take Photos
          </div>
          <div style={{ fontSize: "0.8rem", color: "#777" }}>
            Supports JPG, PNG, WEBP multi-photo upload from mobile camera or gallery
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

      {/* Main Cover Photo Showcase */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.75rem" }}>
          Main Product Cover Photo
        </h3>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <img
            src={imageSrc}
            alt="Main Cover"
            style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "2px solid var(--color-bronze)" }}
          />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>Primary Cover Image</div>
            <div style={{ fontSize: "0.78rem", color: "#666", wordBreak: "break-all" }}>{imageSrc}</div>
          </div>
        </div>
      </div>

      {/* Gallery Grid & Reordering */}
      <div>
        <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.75rem" }}>
          Product Photo Gallery ({(imageGallery || []).length} photos)
        </h3>

        {(!imageGallery || imageGallery.length === 0) ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#888", backgroundColor: "#FAFAFA", borderRadius: "6px" }}>
            No gallery images uploaded yet. Use the upload box above to add photos.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {imageGallery.map((img, idx) => (
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
                  style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "4px", marginBottom: "0.65rem" }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`${styles.badge} ${imageSrc === img.src ? styles.badgePublished : styles.badgeDraft}`}>
                      {imageSrc === img.src ? "Cover Photo" : `Photo #${idx + 1}`}
                    </span>
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
                      disabled={idx === imageGallery.length - 1}
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
                      🗑
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
