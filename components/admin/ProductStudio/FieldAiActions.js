"use client";

import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

export default function FieldAiActions({
  fieldLabel,
  currentValue,
  contextData,
  onApply
}) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTriggerAction = async (actionType) => {
    setLoading(true);
    setIsOpen(true);
    setSuggestion(null);

    try {
      const res = await fetch("/api/admin/ai/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            ...contextData,
            [fieldLabel === "Short Description" ? "shortDescription" : "detailedDescription"]: currentValue
          },
          manualNotes: `Action requested: ${actionType} for field ${fieldLabel}. Preserve confirmed facts strictly.`
        })
      });

      const json = await res.json();

      if (json.success && json.data) {
        const val = fieldLabel === "Short Description" ? json.data.short_description : json.data.detailed_description;
        setSuggestion(val || "Unable to refine field.");
      } else {
        setSuggestion("AI refine service unavailable.");
      }
    } catch {
      setSuggestion("Error processing action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", position: "relative" }}>
      <button
        type="button"
        onClick={() => handleTriggerAction("Improve Writing")}
        style={{
          background: "none",
          border: "1px solid #E2DDD5",
          borderRadius: "12px",
          padding: "0.15rem 0.5rem",
          fontSize: "0.72rem",
          fontWeight: "600",
          color: "var(--color-bronze)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem"
        }}
      >
        ✨ Improve Writing
      </button>

      <button
        type="button"
        onClick={() => handleTriggerAction("Optimize SEO Wording")}
        style={{
          background: "none",
          border: "1px solid #E2DDD5",
          borderRadius: "12px",
          padding: "0.15rem 0.5rem",
          fontSize: "0.72rem",
          fontWeight: "600",
          color: "var(--color-navy)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem"
        }}
      >
        ✨ Enhance SEO Wording
      </button>

      {/* Popover Preview Card */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          zIndex: 100,
          marginTop: "0.35rem",
          backgroundColor: "#FFFFFF",
          border: "1px solid #9E7B4F",
          borderRadius: "6px",
          padding: "0.85rem",
          width: "340px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--color-navy)", marginBottom: "0.35rem" }}>
            ✨ AI Refined {fieldLabel} Suggestion
          </div>

          {loading ? (
            <div style={{ fontSize: "0.8rem", color: "#666", padding: "0.5rem 0" }}>
              ⌛ Generating suggestion...
            </div>
          ) : (
            <div>
              <textarea
                rows={4}
                value={suggestion || ""}
                onChange={(e) => setSuggestion(e.target.value)}
                className={styles.textarea}
                style={{ fontSize: "0.8rem", width: "100%", marginBottom: "0.5rem" }}
              />
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={styles.secondaryBtn}
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (suggestion) onApply(suggestion);
                    setIsOpen(false);
                  }}
                  className={styles.primaryBtn}
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}
                >
                  ✓ Accept Wording
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
