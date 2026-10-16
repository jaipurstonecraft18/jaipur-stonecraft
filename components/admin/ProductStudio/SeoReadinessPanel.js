"use client";

import { useMemo, useState } from "react";
import {
  evaluateProductIntelligence,
  PIE_RULE_STATUS,
  PIE_DIMENSIONS
} from "@/lib/seo/product-intelligence-engine.js";
import styles from "@/app/admin/admin.module.css";

const DIMENSION_TABS = [
  { id: "all", label: "All Checks" },
  { id: PIE_DIMENSIONS.DATA_INTEGRITY, label: "Data Integrity (P01-P07)" },
  { id: PIE_DIMENSIONS.CONTENT_QUALITY, label: "Content & Intent (C01-C08)" },
  { id: PIE_DIMENSIONS.TECHNICAL_SEO, label: "Technical SEO (S01-S10)" },
  { id: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY, label: "Images & Alt (M01-M06)" },
  { id: PIE_DIMENSIONS.GEO_AEO, label: "GEO / AEO & Trust (G01-G05)" }
];

export default function SeoReadinessPanel({
  productData,
  categories = [],
  onTriggerAiFix,
  inconsistencies = []
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDimension, setActiveDimension] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'blockers' | 'warnings' | 'passed'

  const readiness = useMemo(() => {
    return evaluateProductIntelligence(productData, { knownCategories: categories });
  }, [productData, categories]);

  // Outcome styling helpers
  const getOutcomeStyle = (rawStatus) => {
    switch (rawStatus) {
      case PIE_RULE_STATUS.PASS:
        return {
          bg: "#E6F4EA",
          border: "#CEEAD6",
          color: "#137333",
          icon: "✓",
          label: "PASS"
        };
      case PIE_RULE_STATUS.WARNING:
        return {
          bg: "#FEF7E0",
          border: "#FEEFC3",
          color: "#B06000",
          icon: "⚠",
          label: "WARNING"
        };
      case PIE_RULE_STATUS.BLOCKER:
        return {
          bg: "#FCE8E6",
          border: "#FAD2CF",
          color: "#C5221F",
          icon: "✗",
          label: "BLOCKER"
        };
      case PIE_RULE_STATUS.NOT_APPLICABLE:
      default:
        return {
          bg: "#F1F3F4",
          border: "#E8EAED",
          color: "#5F6368",
          icon: "—",
          label: "N/A"
        };
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return readiness.items.filter(item => {
      // Dimension filter
      if (activeDimension !== "all" && item.dimension !== activeDimension) {
        return false;
      }
      // Status filter
      if (statusFilter === "blockers" && item.rawStatus !== PIE_RULE_STATUS.BLOCKER) return false;
      if (statusFilter === "warnings" && item.rawStatus !== PIE_RULE_STATUS.WARNING) return false;
      if (statusFilter === "passed" && item.rawStatus !== PIE_RULE_STATUS.PASS) return false;
      return true;
    });
  }, [readiness.items, activeDimension, statusFilter]);

  // Badges for 5 Distinct Dimensions
  const pubBadge = readiness.statuses.publicationEligibility === "ELIGIBLE"
    ? { label: "Publication: Eligible", bg: "#E6F4EA", color: "#137333", icon: "✓" }
    : { label: "Publication: Blocked", bg: "#FCE8E6", color: "#C5221F", icon: "✗" };

  const seoBadge = readiness.statuses.seoContentReadiness === "OPTIMAL"
    ? { label: "SEO Content: Optimal", bg: "#E6F4EA", color: "#137333", icon: "✓" }
    : readiness.statuses.seoContentReadiness === "NEEDS_IMPROVEMENT"
      ? { label: "SEO Content: Needs Work", bg: "#FEF7E0", color: "#B06000", icon: "⚠" }
      : { label: "SEO Content: Incomplete", bg: "#FCE8E6", color: "#C5221F", icon: "✗" };

  const indexBadge = readiness.statuses.technicalIndexability === "INDEXABLE"
    ? { label: "Indexability: Valid", bg: "#E6F4EA", color: "#137333", icon: "✓" }
    : readiness.statuses.technicalIndexability === "RESTRICTED"
      ? { label: "Indexability: Restricted", bg: "#FEF7E0", color: "#B06000", icon: "⚠" }
      : { label: "Indexability: Invalid", bg: "#FCE8E6", color: "#C5221F", icon: "✗" };

  const geoBadge = readiness.statuses.geoAeoReadiness === "AI_READY"
    ? { label: "GEO/AEO: AI-Ready", bg: "#E8F0FE", color: "#1A73E8", icon: "✦" }
    : readiness.statuses.geoAeoReadiness === "DEVELOPING"
      ? { label: "GEO/AEO: Developing", bg: "#FEF7E0", color: "#B06000", icon: "⚠" }
      : { label: "GEO/AEO: Unstructured", bg: "#FCE8E6", color: "#C5221F", icon: "✗" };

  const monitorBadge = readiness.statuses.searchMonitoringState === "PUBLISHED_MONITORED"
    ? { label: "Search: Live Monitored", bg: "#E6F4EA", color: "#137333", icon: "●" }
    : { label: "Search: Pre-Publication", bg: "#F1F3F4", color: "#5F6368", icon: "○" };

  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2DDD5",
      borderRadius: "8px",
      padding: "1rem 1.15rem",
      marginBottom: "1.25rem",
      maxWidth: "100%",
      boxSizing: "border-box",
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
    }}>
      {/* Top Header Summary */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "0.85rem"
      }}>
        {/* Title & Engine info */}
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🎯</span>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
              Product Intelligence Engine (PIE)
            </h3>
            <span style={{
              fontSize: "0.7rem",
              fontWeight: "600",
              color: "var(--color-bronze)",
              backgroundColor: "rgba(184, 134, 11, 0.1)",
              padding: "0.15rem 0.45rem",
              borderRadius: "4px"
            }}>
              v2.1 • 36 Checks
            </span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#666", margin: "0.25rem 0 0" }}>
            Rigorous factual quality, Google & Bing SEO, AEO/GEO answer engine clarity, and buyer conversion readiness.
          </p>
        </div>

        {/* Score & Expand Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Health Score Pill */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            backgroundColor: readiness.score >= 80 ? "#E6F4EA" : readiness.score >= 50 ? "#FEF7E0" : "#FCE8E6",
            border: `1px solid ${readiness.score >= 80 ? "#CEEAD6" : readiness.score >= 50 ? "#FEEFC3" : "#FAD2CF"}`,
            borderRadius: "20px",
            padding: "0.3rem 0.75rem"
          }}>
            <span style={{ fontSize: "0.72rem", fontWeight: "600", color: "#555" }}>Weighted Score:</span>
            <span style={{
              fontSize: "0.95rem",
              fontWeight: "800",
              color: readiness.score >= 80 ? "#137333" : readiness.score >= 50 ? "#B06000" : "#C5221F"
            }}>
              {readiness.score}%
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.secondaryBtn}
            style={{
              fontSize: "0.78rem",
              padding: "0.35rem 0.75rem",
              minHeight: "34px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: "600"
            }}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Hide Intelligence Details ▴" : `Inspect Checklist (${readiness.items.length}) ▾`}
          </button>
        </div>
      </div>

      {/* 5 Distinct Status Badges (Always visible for at-a-glance truth) */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.45rem",
        marginTop: "0.85rem",
        paddingTop: "0.75rem",
        borderTop: "1px solid #F0ECE6"
      }}>
        {[pubBadge, seoBadge, indexBadge, geoBadge, monitorBadge].map((badge, idx) => (
          <span
            key={idx}
            style={{
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: "0.74rem",
              fontWeight: "700",
              padding: "0.22rem 0.6rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>{badge.icon}</span>
            {badge.label}
          </span>
        ))}
      </div>

      {/* Dimension Scores Breakdown */}
      {isExpanded && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.5rem",
          marginTop: "0.85rem",
          padding: "0.65rem 0.75rem",
          backgroundColor: "#FAF9F6",
          borderRadius: "6px",
          border: "1px solid #ECE7E1"
        }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#666" }}>Data Integrity (20%)</div>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
              {readiness.dimensionScores?.[PIE_DIMENSIONS.DATA_INTEGRITY] ?? 100}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#666" }}>Content Quality (25%)</div>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
              {readiness.dimensionScores?.[PIE_DIMENSIONS.CONTENT_QUALITY] ?? 100}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#666" }}>Technical SEO (25%)</div>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
              {readiness.dimensionScores?.[PIE_DIMENSIONS.TECHNICAL_SEO] ?? 100}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#666" }}>Images & Alt (15%)</div>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
              {readiness.dimensionScores?.[PIE_DIMENSIONS.MEDIA_ACCESSIBILITY] ?? 100}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#666" }}>GEO / AEO (15%)</div>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
              {readiness.dimensionScores?.[PIE_DIMENSIONS.GEO_AEO] ?? 100}%
            </div>
          </div>
        </div>
      )}

      {/* Expandable 36-Check Intelligence Audit */}
      {isExpanded && (
        <div style={{ marginTop: "1rem" }}>
          {/* Dimension Tabs */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
            marginBottom: "0.65rem"
          }}>
            {DIMENSION_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDimension(tab.id)}
                style={{
                  fontSize: "0.74rem",
                  fontWeight: activeDimension === tab.id ? "700" : "500",
                  backgroundColor: activeDimension === tab.id ? "var(--color-navy)" : "#F5F3EF",
                  color: activeDimension === tab.id ? "#FFFFFF" : "#555",
                  border: "none",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Outcome Filter Pills */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "0.85rem",
            fontSize: "0.74rem"
          }}>
            <span style={{ color: "#777", fontWeight: "600" }}>Filter:</span>
            {[
              { id: "all", label: `All (${readiness.items.length})` },
              { id: "blockers", label: `Blockers (${readiness.missingCount})`, color: "#C5221F" },
              { id: "warnings", label: `Warnings (${readiness.warningCount})`, color: "#B06000" },
              { id: "passed", label: `Passed (${readiness.okCount})`, color: "#137333" }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                style={{
                  fontSize: "0.72rem",
                  fontWeight: statusFilter === f.id ? "700" : "500",
                  backgroundColor: statusFilter === f.id ? "#EAE6DF" : "transparent",
                  color: f.color || "#444",
                  border: "1px solid #E2DDD5",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "12px",
                  cursor: "pointer"
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Checklist Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: "0.75rem",
            minWidth: 0,
            width: "100%",
            boxSizing: "border-box"
          }}>
            {filteredItems.map(item => {
              const outcome = getOutcomeStyle(item.rawStatus);

              return (
                <div
                  key={item.id}
                  style={{
                    padding: "0.75rem 0.85rem",
                    borderRadius: "6px",
                    border: `1px solid ${outcome.border}`,
                    backgroundColor: outcome.bg,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    minWidth: 0,
                    boxSizing: "border-box"
                  }}
                >
                  {/* Top: Code & Title */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem", minWidth: 0, flex: 1 }}>
                      <span style={{
                        fontSize: "0.85rem",
                        fontWeight: "800",
                        color: outcome.color,
                        flexShrink: 0,
                        marginTop: "1px"
                      }}>
                        {outcome.icon}
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: "0.7rem",
                            fontWeight: "800",
                            backgroundColor: "rgba(0,0,0,0.06)",
                            padding: "0.1rem 0.35rem",
                            borderRadius: "3px",
                            color: "var(--color-navy)"
                          }}>
                            {item.code}
                          </span>
                          <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--color-navy)" }}>
                            {item.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#444", marginTop: "0.25rem", wordBreak: "break-word" }}>
                          {item.message}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      color: outcome.color,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      border: `1px solid ${outcome.border}`,
                      padding: "0.15rem 0.4rem",
                      borderRadius: "10px",
                      flexShrink: 0
                    }}>
                      {outcome.label}
                    </span>
                  </div>

                  {/* Guidance & Action Button */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    paddingTop: "0.4rem",
                    borderTop: `1px dashed ${outcome.border}`
                  }}>
                    <div style={{ fontSize: "0.7rem", color: "#666", fontStyle: "italic", flex: 1, wordBreak: "break-word" }}>
                      {item.guidance || "Satisfies standard."}
                    </div>

                    {item.aiActionKey && (
                      <button
                        type="button"
                        onClick={() => onTriggerAiFix(item.aiActionKey)}
                        className={styles.secondaryBtn}
                        style={{
                          fontSize: "0.72rem",
                          padding: "0.25rem 0.55rem",
                          borderColor: "var(--color-bronze)",
                          color: "var(--color-navy)",
                          whiteSpace: "nowrap",
                          minHeight: "28px",
                          flexShrink: 0,
                          fontWeight: "600"
                        }}
                      >
                        ✨ AI Fix
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
