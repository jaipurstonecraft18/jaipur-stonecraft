"use client";

import styles from "@/app/admin/admin.module.css";

export default function MobileStickyBar({
  status,
  saveStatus,
  lastSavedAt,
  saving,
  onSaveDraft,
  onTogglePublish
}) {
  return (
    <div className={`${styles.mobileStickySaveBar} ${styles.mobileOnly}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
        <span className={`${styles.badge} ${status === "published" ? styles.badgePublished : styles.badgeDraft}`} style={{ fontSize: "0.68rem" }}>
          {status}
        </span>
        <span style={{ fontSize: "0.72rem", color: saveStatus === "saving" ? "var(--color-bronze)" : saveStatus === "dirty" ? "#FFC107" : "#81C784" }}>
          {saveStatus === "saving" ? "⌛ Saving..." : saveStatus === "dirty" ? "● Unsaved" : lastSavedAt ? `✓ ${lastSavedAt}` : "✓ Saved"}
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className={styles.secondaryBtn}
          style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", minHeight: "40px" }}
        >
          Draft
        </button>

        <button
          type="button"
          onClick={onTogglePublish}
          disabled={saving}
          className={styles.primaryBtn}
          style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", minHeight: "40px" }}
        >
          {status === "published" ? "Unpublish" : "🚀 Publish"}
        </button>
      </div>
    </div>
  );
}
