"use client";

import { useMemo, useState } from "react";
import { evaluateSeoReadiness } from "@/lib/seo/readiness-checker.js";
import styles from "@/app/admin/admin.module.css";

export default function SeoReadinessPanel({
  productData,
  onTriggerAiFix,
  inconsistencies = []
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const readiness = useMemo(() => {
    return evaluateSeoReadiness(productData);
  }, [productData]);

  const getStatusBadge = () => {
    if (readiness.overallStatus === "ready") {
      return { label: "✓ Ready for Publication", bg: "#E6F4EA", color: "#137333" };
    }
    if (readiness.overallStatus === "needs_attention") {
      return { label: "⚠ Needs Attention", bg: "#FEF7E0", color: "#B06000" };
    }
    return { label: "✗ Incomplete", bg: "#FCE8E6", color: "#C5221F" };
  };

  const statusBadge = getStatusBadge();

  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2DDD5",
      borderRadius: "6px",
      padding: "0.85rem 1rem",
      marginBottom: "1.25rem",
      maxWidth: "100%",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      {/* Header Summary */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.6rem"
      }}>
        <div style={{ minWidth: 0, flex: "1 1 240px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--color-navy)", margin: 0, wordBreak: "break-word" }}>
            🎯 Product SEO Readiness & Quality Checklist
          </h3>
          <p style={{ fontSize: "0.78rem", color: "#666", margin: "0.2rem 0 0", wordBreak: "break-word" }}>
            Actionable criteria evaluation for search discovery and client clarity.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{
            backgroundColor: statusBadge.bg,
            color: statusBadge.color,
            fontSize: "0.78rem",
            fontWeight: "700",
            padding: "0.25rem 0.65rem",
            borderRadius: "14px",
            whiteSpace: "nowrap"
          }}>
            {statusBadge.label}
          </span>
          <span style={{ fontSize: "0.78rem", color: "#666", whiteSpace: "nowrap" }}>
            {readiness.okCount} Passed • {readiness.warningCount} Warnings • {readiness.missingCount} Missing
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.secondaryBtn}
            style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.6rem",
              minHeight: "32px",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Hide Details ▴" : `View Checklist (${readiness.items.length}) ▾`}
          </button>
        </div>
      </div>

      {/* Actionable Checklist (Collapsible) */}
      {isExpanded && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(270px, 100%), 1fr))",
          gap: "0.65rem",
          marginTop: "1rem",
          paddingTop: "0.85rem",
          borderTop: "1px solid #EAE6DF",
          minWidth: 0,
          width: "100%",
          boxSizing: "border-box"
        }}>
          {readiness.items.map(item => (
            <div
              key={item.id}
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: "4px",
                border: `1px solid ${item.status === "ok" ? "#E2DDD5" : item.status === "warning" ? "#FFE082" : "#F5C6CB"}`,
                backgroundColor: item.status === "ok" ? "#FAF9F6" : item.status === "warning" ? "#FFFDE7" : "#FDF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                minWidth: 0,
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0, flex: 1 }}>
                <span style={{
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  flexShrink: 0,
                  color: item.status === "ok" ? "#137333" : item.status === "warning" ? "#B06000" : "#C5221F"
                }}>
                  {item.status === "ok" ? "✓" : item.status === "warning" ? "⚠" : "✗"}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--color-navy)", wordBreak: "break-word" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#555", wordBreak: "break-word" }}>
                    {item.message}
                  </div>
                </div>
              </div>

              {item.aiActionKey && (
                <button
                  type="button"
                  onClick={() => onTriggerAiFix(item.aiActionKey)}
                  className={styles.secondaryBtn}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.2rem 0.5rem",
                    borderColor: "var(--color-bronze)",
                    color: "var(--color-navy)",
                    whiteSpace: "nowrap",
                    minHeight: "28px",
                    flexShrink: 0
                  }}
                >
                  ✨ AI Fix
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* NON-INTRUSIVE CONSISTENCY REVIEW FLAGS */}
      {Array.isArray(inconsistencies) && inconsistencies.length > 0 && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 0.85rem",
          backgroundColor: "#FFF8E1",
          border: "1px solid #FFE082",
          borderRadius: "6px",
          maxWidth: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#B06000", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>🔍</span> Review Suggested (Possible Content Inconsistencies)
          </div>
          <p style={{ fontSize: "0.76rem", color: "#666", marginBottom: "0.5rem" }}>
            The AI noticed potential items requiring manual verification. Confirmed manual product data remains untouched.
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.78rem", color: "#444" }}>
            {inconsistencies.map((flag, idx) => (
              <li key={idx} style={{ marginBottom: "0.2rem", wordBreak: "break-word" }}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
