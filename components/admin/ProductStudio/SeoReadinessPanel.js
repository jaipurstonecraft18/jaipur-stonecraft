"use client";

import { useEffect, useMemo, useState } from "react";
import {
  evaluateProductIntelligence,
  PIE_RULE_STATUS,
  PIE_DIMENSIONS,
  DEFAULT_SEO_AUDIT_CONFIG
} from "@/lib/seo/product-intelligence-engine.js";
import styles from "@/app/admin/admin.module.css";

const DIMENSION_TABS = [
  { id: "all", label: "All Checks" },
  { id: PIE_DIMENSIONS.DATA_INTEGRITY, label: "Deterministic Data (Layer A)" },
  { id: PIE_DIMENSIONS.CONTENT_QUALITY, label: "Content & Intent (Layer B)" },
  { id: PIE_DIMENSIONS.TECHNICAL_SEO, label: "Technical SEO (Layer A/B)" },
  { id: PIE_DIMENSIONS.MEDIA_ACCESSIBILITY, label: "Media & Alt Text" },
  { id: PIE_DIMENSIONS.GEO_AEO, label: "Optional Knowledge (Layer C)" }
];

export default function SeoReadinessPanel({
  productData,
  categories = [],
  onTriggerAiFix,
  inconsistencies = [],
  auditConfig: propAuditConfig
}) {
  const [showTechnicalAudit, setShowTechnicalAudit] = useState(false);
  const [showOptionalEnhancements, setShowOptionalEnhancements] = useState(false);
  const [activeDimension, setActiveDimension] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeAuditConfig, setActiveAuditConfig] = useState(propAuditConfig || DEFAULT_SEO_AUDIT_CONFIG);

  useEffect(() => {
    if (propAuditConfig) {
      setActiveAuditConfig(propAuditConfig);
      return;
    }
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.seo_audit_settings) {
          setActiveAuditConfig((prev) => ({
            ...prev,
            ...data.settings.seo_audit_settings
          }));
        }
      })
      .catch((err) => {
        console.warn("[SeoReadinessPanel] Failed to fetch settings, using defaults:", err);
      });
  }, [propAuditConfig]);

  const readiness = useMemo(() => {
    try {
      const res = evaluateProductIntelligence(productData || {}, {
        knownCategories: categories || [],
        seoConfig: activeAuditConfig
      });
      if (res && typeof res.score === "number") return res;
    } catch (err) {
      console.error("[SeoReadinessPanel] Evaluation error:", err);
    }
    return {
      score: 100,
      dimensionScores: {},
      isClean: true,
      blockers: [],
      recommendations: [],
      optionalEnhancements: [],
      items: [],
      missingCount: 0,
      warningCount: 0,
      optionalCount: 0,
      okCount: 0
    };
  }, [productData, categories, activeAuditConfig]);

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
      case PIE_RULE_STATUS.RECOMMENDED:
      case "WARNING":
        return {
          bg: "#FEF7E0",
          border: "#FEEFC3",
          color: "#B06000",
          icon: "⚠",
          label: "RECOMMENDED"
        };
      case PIE_RULE_STATUS.BLOCKER:
        return {
          bg: "#FCE8E6",
          border: "#FAD2CF",
          color: "#C5221F",
          icon: "✗",
          label: "BLOCKER"
        };
      case PIE_RULE_STATUS.OPTIONAL:
        return {
          bg: "#F1F5F9",
          border: "#E2E8F0",
          color: "#475569",
          icon: "✦",
          label: "OPTIONAL"
        };
      case PIE_RULE_STATUS.NOT_APPLICABLE:
      default:
        return {
          bg: "#F8FAFC",
          border: "#E2E8F0",
          color: "#94A3B8",
          icon: "—",
          label: "N/A"
        };
    }
  };

  // Filter items for advanced audit view
  const filteredItems = useMemo(() => {
    return readiness.items.filter(item => {
      if (activeDimension !== "all" && item.dimension !== activeDimension) return false;
      if (statusFilter === "blockers" && item.rawStatus !== PIE_RULE_STATUS.BLOCKER) return false;
      if (statusFilter === "recommended" && item.rawStatus !== PIE_RULE_STATUS.RECOMMENDED) return false;
      if (statusFilter === "optional" && item.rawStatus !== PIE_RULE_STATUS.OPTIONAL) return false;
      if (statusFilter === "passed" && item.rawStatus !== PIE_RULE_STATUS.PASS) return false;
      return true;
    });
  }, [readiness.items, activeDimension, statusFilter]);

  const hasBlockers = readiness.blockers?.length > 0;
  const hasRecommendations = readiness.recommendations?.length > 0;
  const hasOptionals = readiness.optionalEnhancements?.length > 0;
  const isClean = readiness.isClean;

  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2DDD5",
      borderRadius: "8px",
      padding: "1.15rem 1.25rem",
      marginBottom: "1.25rem",
      maxWidth: "100%",
      boxSizing: "border-box",
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
    }}>
      {/* 1. TOP STATUS CARD — Answers Question 1: Is this product ready? */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid #F0ECE6"
      }}>
        {/* Readiness Status Narrative */}
        <div style={{ minWidth: 0, flex: "1 1 340px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.35rem" }}>
              {isClean ? "✓" : (hasBlockers ? "✗" : "⚠")}
            </span>
            <h3 style={{
              fontSize: "1.05rem",
              fontWeight: "700",
              color: isClean ? "#137333" : (hasBlockers ? "#C5221F" : "#B06000"),
              margin: 0
            }}>
              {isClean
                ? "Ready for Publication — No Changes Needed"
                : (hasBlockers
                  ? `Publication Blocked (${readiness.blockers.length} Essential Issue${readiness.blockers.length > 1 ? 's' : ''})`
                  : `Publishable — ${readiness.recommendations.length} Recommended Correction${readiness.recommendations.length > 1 ? 's' : ''}`
                )}
            </h3>
            <span style={{
              fontSize: "0.7rem",
              fontWeight: "700",
              color: "var(--color-bronze)",
              backgroundColor: "rgba(184, 134, 11, 0.1)",
              padding: "0.15rem 0.45rem",
              borderRadius: "4px"
            }}>
              PIE v3.0
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.3rem 0 0" }}>
            {isClean
              ? "All essential data integrity, taxonomy, natural stone authenticity, and search requirements are satisfied."
              : (hasBlockers
                ? "Resolve the critical blocker(s) below to ensure product data integrity and technical indexability."
                : "Product meets publication standards. The recommended items below can optionally enhance presentation."
              )}
          </p>
        </div>

        {/* Score & Toggle Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            backgroundColor: (readiness?.score ?? 100) >= 90 ? "#E6F4EA" : ((readiness?.score ?? 100) >= 70 ? "#FEF7E0" : "#FCE8E6"),
            border: `1px solid ${(readiness?.score ?? 100) >= 90 ? "#CEEAD6" : ((readiness?.score ?? 100) >= 70 ? "#FEEFC3" : "#FAD2CF")}`,
            borderRadius: "20px",
            padding: "0.35rem 0.85rem"
          }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#555" }}>Quality & SEO:</span>
            <span style={{
              fontSize: "1.05rem",
              fontWeight: "800",
              color: (readiness?.score ?? 100) >= 90 ? "#137333" : ((readiness?.score ?? 100) >= 70 ? "#B06000" : "#C5221F")
            }}>
              {readiness?.score ?? 100}%
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTechnicalAudit(!showTechnicalAudit)}
            className={styles.secondaryBtn}
            style={{
              fontSize: "0.78rem",
              padding: "0.35rem 0.75rem",
              minHeight: "34px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: "600"
            }}
          >
            {showTechnicalAudit ? "Hide Technical Audit ▴" : "Technical Audit ▾"}
          </button>
        </div>
      </div>

      {/* 2. CRITICAL BLOCKERS (LAYER A) — Answers Question 2: Is there a genuine problem? */}
      {hasBlockers && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{
            fontSize: "0.82rem",
            fontWeight: "700",
            color: "#C5221F",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}>
            <span>✗</span> Essential Blockers (Action Required)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {readiness.blockers.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  padding: "0.65rem 0.85rem",
                  backgroundColor: "#FCE8E6",
                  border: "1px solid #FAD2CF",
                  borderRadius: "6px"
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      backgroundColor: "#C5221F",
                      color: "#FFFFFF",
                      padding: "0.1rem 0.35rem",
                      borderRadius: "3px"
                    }}>
                      {b.code}
                    </span>
                    <strong style={{ fontSize: "0.82rem", color: "#C5221F" }}>{b.label}</strong>
                    {b.fieldTarget && (
                      <span style={{ fontSize: "0.72rem", color: "#666" }}>
                        ({b.fieldTarget})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#333", marginTop: "0.2rem" }}>
                    {b.message}
                  </div>
                </div>

                {b.aiActionKey && (
                  <button
                    type="button"
                    onClick={() => onTriggerAiFix(b.aiActionKey)}
                    className={styles.secondaryBtn}
                    style={{
                      fontSize: "0.74rem",
                      padding: "0.25rem 0.65rem",
                      borderColor: "#C5221F",
                      color: "#C5221F",
                      fontWeight: "700",
                      minHeight: "30px",
                      backgroundColor: "#FFFFFF"
                    }}
                  >
                    ✨ AI Fix
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDED IMPROVEMENTS (LAYER B) — Answers Question 3: What is the most valuable correction? */}
      {hasRecommendations && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{
            fontSize: "0.82rem",
            fontWeight: "700",
            color: "#B06000",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}>
            <span>⚠</span> Recommended Corrections (Valuable Improvements)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {readiness.recommendations.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  padding: "0.65rem 0.85rem",
                  backgroundColor: "#FEF7E0",
                  border: "1px solid #FEEFC3",
                  borderRadius: "6px"
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      backgroundColor: "#B06000",
                      color: "#FFFFFF",
                      padding: "0.1rem 0.35rem",
                      borderRadius: "3px"
                    }}>
                      {r.code}
                    </span>
                    <strong style={{ fontSize: "0.82rem", color: "#B06000" }}>{r.label}</strong>
                    {r.fieldTarget && (
                      <span style={{ fontSize: "0.72rem", color: "#666" }}>
                        ({r.fieldTarget})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#444", marginTop: "0.2rem" }}>
                    {r.message}
                  </div>
                </div>

                {r.aiActionKey && (
                  <button
                    type="button"
                    onClick={() => onTriggerAiFix(r.aiActionKey)}
                    className={styles.secondaryBtn}
                    style={{
                      fontSize: "0.74rem",
                      padding: "0.25rem 0.65rem",
                      borderColor: "var(--color-bronze)",
                      color: "var(--color-navy)",
                      fontWeight: "700",
                      minHeight: "30px",
                      backgroundColor: "#FFFFFF"
                    }}
                  >
                    ✨ AI Assist
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. OPTIONAL ENHANCEMENTS ACCORDION (LAYER C) — 0 score penalty! */}
      {hasOptionals && (
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setShowOptionalEnhancements(!showOptionalEnhancements)}
            style={{
              background: "none",
              border: "none",
              padding: "0.4rem 0",
              fontSize: "0.78rem",
              fontWeight: "600",
              color: "#64748B",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>{showOptionalEnhancements ? "▾" : "▸"}</span>
            Optional Enhancements ({readiness.optionalEnhancements.length}) — No score penalty
          </button>

          {showOptionalEnhancements && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "0.5rem",
              marginTop: "0.5rem",
              padding: "0.65rem",
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "6px"
            }}>
              {readiness.optionalEnhancements.map((opt) => (
                <div
                  key={opt.id}
                  style={{
                    padding: "0.5rem 0.65rem",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "4px",
                    fontSize: "0.75rem"
                  }}
                >
                  <div style={{ fontWeight: "600", color: "#334155", marginBottom: "0.2rem" }}>
                    {opt.label}
                  </div>
                  <div style={{ color: "#64748B", fontSize: "0.72rem" }}>
                    {opt.message}
                  </div>
                  {opt.aiActionKey && (
                    <button
                      type="button"
                      onClick={() => onTriggerAiFix(opt.aiActionKey)}
                      style={{
                        marginTop: "0.4rem",
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontSize: "0.72rem",
                        color: "var(--color-bronze)",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      ✨ Generate with AI →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. ADVANCED TECHNICAL AUDIT ACCORDION (For Developers & Diagnostics) */}
      {showTechnicalAudit && (
        <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px dashed #E2DDD5" }}>
          {/* Dimension Scores Breakdown */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "0.5rem",
            marginBottom: "0.85rem",
            padding: "0.65rem 0.75rem",
            backgroundColor: "#FAF9F6",
            borderRadius: "6px",
            border: "1px solid #ECE7E1"
          }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Data Integrity</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
                {readiness.dimensionScores?.[PIE_DIMENSIONS.DATA_INTEGRITY] ?? 100}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Content Quality</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
                {readiness.dimensionScores?.[PIE_DIMENSIONS.CONTENT_QUALITY] ?? 100}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Technical SEO</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
                {readiness.dimensionScores?.[PIE_DIMENSIONS.TECHNICAL_SEO] ?? 100}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Media & Alt</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
                {readiness.dimensionScores?.[PIE_DIMENSIONS.MEDIA_ACCESSIBILITY] ?? 100}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Optional Knowledge</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
                {readiness.dimensionScores?.[PIE_DIMENSIONS.GEO_AEO] ?? 100}%
              </div>
            </div>
          </div>

          {/* Dimension Filter Tabs */}
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
                  fontSize: "0.72rem",
                  fontWeight: activeDimension === tab.id ? "700" : "500",
                  backgroundColor: activeDimension === tab.id ? "var(--color-navy)" : "#F5F3EF",
                  color: activeDimension === tab.id ? "#FFFFFF" : "#555",
                  border: "none",
                  padding: "0.25rem 0.55rem",
                  borderRadius: "4px",
                  cursor: "pointer"
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
            fontSize: "0.72rem",
            flexWrap: "wrap"
          }}>
            <span style={{ color: "#777", fontWeight: "600" }}>Filter:</span>
            {[
              { id: "all", label: `All (${readiness.items.length})` },
              { id: "blockers", label: `Blockers (${readiness.missingCount})`, color: "#C5221F" },
              { id: "recommended", label: `Recommended (${readiness.warningCount})`, color: "#B06000" },
              { id: "optional", label: `Optional (${readiness.optionalCount || 0})`, color: "#475569" },
              { id: "passed", label: `Passed (${readiness.okCount})`, color: "#137333" }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: statusFilter === f.id ? "700" : "500",
                  backgroundColor: statusFilter === f.id ? "#EAE6DF" : "transparent",
                  color: f.color || "#444",
                  border: "1px solid #E2DDD5",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "12px",
                  cursor: "pointer"
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: "0.65rem"
          }}>
            {filteredItems.map(item => {
              const outcome = getOutcomeStyle(item.rawStatus);
              return (
                <div
                  key={item.id}
                  style={{
                    padding: "0.65rem 0.75rem",
                    borderRadius: "6px",
                    border: `1px solid ${outcome.border}`,
                    backgroundColor: outcome.bg,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.4rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem", minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "800", color: outcome.color, marginTop: "1px" }}>
                        {outcome.icon}
                      </span>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <span style={{
                            fontSize: "0.68rem",
                            fontWeight: "800",
                            backgroundColor: "rgba(0,0,0,0.06)",
                            padding: "0.1rem 0.3rem",
                            borderRadius: "3px"
                          }}>
                            {item.code}
                          </span>
                          <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--color-navy)" }}>
                            {item.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#444", marginTop: "0.2rem" }}>
                          {item.message}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: "0.65rem",
                      fontWeight: "700",
                      color: outcome.color,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      border: `1px solid ${outcome.border}`,
                      padding: "0.1rem 0.35rem",
                      borderRadius: "8px",
                      flexShrink: 0
                    }}>
                      {outcome.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Flags */}
      {Array.isArray(inconsistencies) && inconsistencies.length > 0 && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 0.85rem",
          backgroundColor: "#FFF8E1",
          border: "1px solid #FFE082",
          borderRadius: "6px"
        }}>
          <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#B06000", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>🔍</span> Manual Review Advisory
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.76rem", color: "#444" }}>
            {inconsistencies.map((flag, idx) => (
              <li key={idx} style={{ marginBottom: "0.2rem" }}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
