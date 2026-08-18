"use client";

import { useMemo } from "react";
import { evaluateSeoReadiness } from "@/lib/seo/readiness-checker.js";
import styles from "@/app/admin/admin.module.css";

export default function SeoReadinessPanel({
  productData,
  onTriggerAiFix,
  inconsistencies = []
}) {
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
      padding: "1.25rem",
      marginBottom: "1.5rem"
    }}>
      {/* Header Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
            🎯 Product SEO Readiness & Quality Checklist
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.2rem 0 0" }}>
            Actionable criteria evaluation for search discovery and client clarity.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{
            backgroundColor: statusBadge.bg,
            color: statusBadge.color,
            fontSize: "0.82rem",
            fontWeight: "700",
            padding: "0.3rem 0.75rem",
            borderRadius: "14px"
          }}>
            {statusBadge.label}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#666" }}>
            {readiness.okCount} Passed • {readiness.warningCount} Warnings • {readiness.missingCount} Missing
          </span>
        </div>
      </div>

      {/* Actionable Checklist */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "0.75rem" }}>
        {readiness.items.map(item => (
          <div
            key={item.id}
            style={{
              padding: "0.65rem 0.85rem",
              borderRadius: "4px",
              border: `1px solid ${item.status === "ok" ? "#E2DDD5" : item.status === "warning" ? "#FFE082" : "#F5C6CB"}`,
              backgroundColor: item.status === "ok" ? "#FAF9F6" : item.status === "warning" ? "#FFFDE7" : "#FDF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: item.status === "ok" ? "#137333" : item.status === "warning" ? "#B06000" : "#C5221F"
              }}>
                {item.status === "ok" ? "✓" : item.status === "warning" ? "⚠" : "✗"}
              </span>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--color-navy)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#555" }}>
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
                  minHeight: "28px"
                }}
              >
                ✨ AI Fix
              </button>
            )}
          </div>
        ))}
      </div>

      {/* NON-INTRUSIVE CONSISTENCY REVIEW FLAGS */}
      {Array.isArray(inconsistencies) && inconsistencies.length > 0 && (
        <div style={{
          marginTop: "1rem",
          padding: "0.85rem 1rem",
          backgroundColor: "#FFF8E1",
          border: "1px solid #FFE082",
          borderRadius: "6px"
        }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#B06000", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>🔍</span> Review Suggested (Possible Content Inconsistencies)
          </div>
          <p style={{ fontSize: "0.78rem", color: "#666", marginBottom: "0.5rem" }}>
            The AI noticed potential items requiring manual verification. Confirmed manual product data remains untouched.
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8rem", color: "#444" }}>
            {inconsistencies.map((flag, idx) => (
              <li key={idx} style={{ marginBottom: "0.2rem" }}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
