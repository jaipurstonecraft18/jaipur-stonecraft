"use client";

import { useState, useEffect } from "react";
import styles from "@/app/admin/admin.module.css";

export default function AiAssistantModal({
  isOpen,
  onClose,
  productData,
  selectedImages = [],
  onAcceptSuggestions
}) {
  const [status, setStatus] = useState("idle"); // 'idle' | 'analyzing' | 'review' | 'error'
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  
  // AI Output Draft state for editing inside modal before acceptance
  const [aiDraft, setAiDraft] = useState(null);
  
  // Track accepted state for each section
  const [acceptedState, setAcceptedState] = useState({
    shortDescription: false,
    detailedDescription: false,
    seo: false,
    aeo: false,
    attributes: false,
    slug: false
  });

  const [selectedMode, setSelectedMode] = useState("TEXT_OPTIMIZATION"); // "TEXT_OPTIMIZATION" | "FULL_ANALYSIS"
  const [activeReviewTab, setActiveReviewTab] = useState("descriptions"); // "descriptions" | "seo" | "aeo"
  const [analysisMeta, setAnalysisMeta] = useState({ fromCache: false, imagesAnalyzedCount: 0, modelUsed: "", provider: "" });

  const runAnalysis = async (skipCache = false, targetMode = selectedMode) => {
    setStatus("analyzing");
    setErrorMessage("");
    setWarningMessage("");
    setAnalysisProgress("Preparing confirmed product facts...");

    const timers = [
      setTimeout(() => setAnalysisProgress("Analyzing stone material provenance & craft details..."), 1200),
      setTimeout(() => setAnalysisProgress("Generating publication descriptions & high-CTR SEO..."), 2800),
      setTimeout(() => setAnalysisProgress("Structuring AEO entity summary and search phrases..."), 5000),
      setTimeout(() => setAnalysisProgress("Finalizing suggestions..."), 8000)
    ];

    const clearTimers = () => timers.forEach(t => clearTimeout(t));

    try {
      const imagesToAnalyze = targetMode === "FULL_ANALYSIS"
        ? (selectedImages.length > 0
            ? selectedImages
            : productData.imageSrc && !productData.imageSrc.includes("placehold.co")
              ? [productData.imageSrc]
              : [])
        : [];

      const res = await fetch("/api/admin/ai/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productData,
          selectedImages: imagesToAnalyze,
          skipCache,
          mode: targetMode
        })
      });

      clearTimers();

      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatus("error");
        setErrorMessage(json.error || "Failed to analyze product. Please try again.");
        return;
      }

      if (json.warning) {
        setWarningMessage(json.warning);
      }

      setAiDraft(json.data);
      setAnalysisMeta({
        fromCache: Boolean(json.fromCache),
        imagesAnalyzedCount: json.imagesAnalyzedCount || 0,
        modelUsed: json.modelUsed || (targetMode === "TEXT_OPTIMIZATION" ? "Groq (Fast Text)" : "Gemini Vision"),
        provider: json.provider || (targetMode === "TEXT_OPTIMIZATION" ? "groq" : "gemini")
      });
      setStatus("review");

    } catch (err) {
      clearTimers();
      setStatus("error");
      setErrorMessage(err.message || "Network error during AI analysis.");
    }
  };

  // Trigger analysis when modal opens
  useEffect(() => {
    if (isOpen && status === "idle") {
      runAnalysis(false, selectedMode);
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const handleUpdateDraftField = (field, value) => {
    setAiDraft(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateNestedDraft = (parent, field, value) => {
    setAiDraft(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value
      }
    }));
  };

  // Accept specific single field
  const handleApplySingleField = (fieldName, dataValue) => {
    onAcceptSuggestions({ [fieldName]: dataValue });
    setAcceptedState(prev => ({ ...prev, [fieldName]: true }));
  };

  // Accept SEO block
  const handleApplySeo = () => {
    if (!aiDraft) return;
    const seoUpdates = {
      ...(productData.seo || {}),
      title: aiDraft.seo_title || productData.seo?.title || "",
      description: aiDraft.meta_description || productData.seo?.description || "",
      primaryKeyword: aiDraft.primary_keyword || productData.seo?.primaryKeyword || "",
      secondaryKeywords: aiDraft.secondary_keywords?.length > 0 
        ? aiDraft.secondary_keywords 
        : (productData.seo?.secondaryKeywords || []),
      longTailKeywords: aiDraft.long_tail_keywords?.length > 0
        ? aiDraft.long_tail_keywords
        : (productData.seo?.longTailKeywords || []),
      keywords: aiDraft.search_intent_keywords || productData.seo?.keywords || []
    };

    const updates = { seo: seoUpdates };
    if (Array.isArray(aiDraft.discovery_tags) && aiDraft.discovery_tags.length > 0) {
      updates.tags = aiDraft.discovery_tags;
    }
    onAcceptSuggestions(updates);
    setAcceptedState(prev => ({ ...prev, seo: true }));
  };

  // Accept AEO block
  const handleApplyAeo = () => {
    if (!aiDraft) return;
    const existingKl = productData.knowledgeLayer || {};
    const updates = {
      knowledgeLayer: {
        ...existingKl,
        aeoSummary: aiDraft.aeo_summary || existingKl.aeoSummary || ""
      }
    };
    onAcceptSuggestions(updates);
    setAcceptedState(prev => ({ ...prev, aeo: true }));
  };

  // Accept Attributes block
  const handleApplyAttributes = () => {
    if (!aiDraft || !aiDraft.factual_attributes) return;
    const existingAttrs = productData.attributes || {};
    const mergedAttrs = {
      ...existingAttrs,
      stoneVariety: aiDraft.factual_attributes.stoneVariety || existingAttrs.stoneVariety,
      finish: aiDraft.factual_attributes.finish || existingAttrs.finish,
      intendedApplication: aiDraft.factual_attributes.intendedApplication || existingAttrs.intendedApplication
    };
    onAcceptSuggestions({ attributes: mergedAttrs });
    setAcceptedState(prev => ({ ...prev, attributes: true }));
  };

  // Apply suggested URL slug
  const handleApplySlug = () => {
    if (!aiDraft?.suggested_slug) return;
    onAcceptSuggestions({ slug: aiDraft.suggested_slug });
    setAcceptedState(prev => ({ ...prev, slug: true }));
  };

  // Accept All Suggestions
  const handleAcceptAll = () => {
    if (!aiDraft) return;

    const updates = {};
    if (aiDraft.short_description) updates.shortDescription = aiDraft.short_description;
    if (aiDraft.long_description || aiDraft.detailed_description) {
      updates.detailedDescription = aiDraft.long_description || aiDraft.detailed_description;
    }

    // SEO updates
    updates.seo = {
      ...(productData.seo || {}),
      title: aiDraft.seo_title || productData.seo?.title || "",
      description: aiDraft.meta_description || productData.seo?.description || "",
      primaryKeyword: aiDraft.primary_keyword || productData.seo?.primaryKeyword || "",
      secondaryKeywords: aiDraft.secondary_keywords?.length > 0 
        ? aiDraft.secondary_keywords 
        : (productData.seo?.secondaryKeywords || []),
      longTailKeywords: aiDraft.long_tail_keywords?.length > 0
        ? aiDraft.long_tail_keywords
        : (productData.seo?.longTailKeywords || []),
      keywords: aiDraft.search_intent_keywords || productData.seo?.keywords || []
    };

    if (Array.isArray(aiDraft.discovery_tags) && aiDraft.discovery_tags.length > 0) {
      updates.tags = aiDraft.discovery_tags;
    }

    // Knowledge Layer (AEO summary + preserve existing sections and faqs)
    const existingKl = productData.knowledgeLayer || {};
    updates.knowledgeLayer = {
      ...existingKl,
      aeoSummary: aiDraft.aeo_summary || existingKl.aeoSummary || "",
      sections: Array.isArray(existingKl.sections) ? existingKl.sections : [],
      faqs: Array.isArray(existingKl.faqs) ? existingKl.faqs : (Array.isArray(productData.faqs) ? productData.faqs : [])
    };

    // Factual attributes
    if (aiDraft.factual_attributes) {
      const existingAttrs = productData.attributes || {};
      updates.attributes = {
        ...existingAttrs,
        stoneVariety: aiDraft.factual_attributes.stoneVariety || existingAttrs.stoneVariety,
        finish: aiDraft.factual_attributes.finish || existingAttrs.finish,
        intendedApplication: aiDraft.factual_attributes.intendedApplication || existingAttrs.intendedApplication
      };
    }

    onAcceptSuggestions(updates);
    onClose();
  };

  const primaryMat = productData.primaryMaterial?.name || productData.materialName || "Natural Stone";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.75rem"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "980px",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
        border: "1px solid #9E7B4F",
        overflow: "hidden"
      }}>
        {/* Modal Header */}
        <div style={{
          backgroundColor: "var(--color-cream)",
          padding: "0.85rem 1.25rem",
          borderBottom: "1px solid #E2DDD5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>✨</span>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700", color: "var(--color-navy)" }}>
                AI Product Enhancement Studio
              </h3>
              <span style={{
                fontSize: "0.7rem",
                padding: "0.15rem 0.5rem",
                borderRadius: "12px",
                backgroundColor: "#E6F4EA",
                color: "#137333",
                fontWeight: "600"
              }}>
                Natural Stone Guaranteed
              </span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.2rem" }}>
              Product: <strong>{productData.name || "Untitled Product"}</strong> &bull; Material: <strong>{primaryMat}</strong>
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              display: "flex",
              backgroundColor: "#FFF",
              border: "1px solid #E2DDD5",
              borderRadius: "4px",
              padding: "2px"
            }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedMode("TEXT_OPTIMIZATION");
                  if (status === "review") runAnalysis(false, "TEXT_OPTIMIZATION");
                }}
                disabled={status === "analyzing"}
                style={{
                  padding: "0.25rem 0.65rem",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  backgroundColor: selectedMode === "TEXT_OPTIMIZATION" ? "var(--color-navy)" : "transparent",
                  color: selectedMode === "TEXT_OPTIMIZATION" ? "#FFF" : "#666"
                }}
              >
                ⚡ Fast Text (Groq)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedMode("FULL_ANALYSIS");
                  if (status === "review") runAnalysis(false, "FULL_ANALYSIS");
                }}
                disabled={status === "analyzing"}
                style={{
                  padding: "0.25rem 0.65rem",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  backgroundColor: selectedMode === "FULL_ANALYSIS" ? "var(--color-navy)" : "transparent",
                  color: selectedMode === "FULL_ANALYSIS" ? "#FFF" : "#666"
                }}
              >
                👁️ Vision & Multimodal (Gemini)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={status === "analyzing"}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.4rem",
                color: "#666",
                cursor: "pointer",
                padding: "0 0.25rem"
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
          {/* ANALYZING / LOADING STATE */}
          {status === "analyzing" && (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <div className={styles.spinner} style={{ margin: "0 auto 1.25rem", width: "40px", height: "40px" }} />
              <h4 style={{ color: "var(--color-navy)", fontSize: "1.05rem", fontWeight: "700", marginBottom: "0.4rem" }}>
                Analyzing Product & Generating Content
              </h4>
              <p style={{ color: "var(--color-bronze)", fontWeight: "600", fontSize: "0.9rem" }}>
                {analysisProgress}
              </p>
              <p style={{ color: "#888", fontSize: "0.78rem", maxWidth: "440px", margin: "1rem auto 0" }}>
                Writing compelling descriptions, high-intent Google search keywords, and Answer Engine Optimization (AEO) data specifically for <strong>{primaryMat}</strong>.
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {status === "error" && (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{
                backgroundColor: "#FCE8E6",
                border: "1px solid #FAD2CF",
                borderRadius: "6px",
                padding: "1.25rem",
                color: "#C5221F",
                marginBottom: "1.5rem"
              }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.25rem" }}>
                  Generation Encountered an Issue
                </div>
                <div style={{ fontSize: "0.85rem" }}>
                  {errorMessage}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => runAnalysis(true, selectedMode)}
                  className={styles.primaryBtn}
                >
                  🔄 Retry Analysis
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode("TEXT_OPTIMIZATION");
                    runAnalysis(true, "TEXT_OPTIMIZATION");
                  }}
                  className={styles.secondaryBtn}
                >
                  ⚡ Try Fast Text Mode (Groq)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* REVIEW STATE */}
          {status === "review" && aiDraft && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Status Meta Banner */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
                padding: "0.6rem 0.85rem",
                backgroundColor: "#FAF9F6",
                border: "1px solid #E2DDD5",
                borderRadius: "6px",
                fontSize: "0.8rem",
                color: "#555"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#137333"
                  }} />
                  <span>Model: <strong>{analysisMeta.modelUsed}</strong></span>
                  {analysisMeta.imagesAnalyzedCount > 0 && (
                    <span>&bull; Analyzed cover image for visual carving details</span>
                  )}
                  {analysisMeta.fromCache && (
                    <span style={{ color: "var(--color-bronze)", fontWeight: "600" }}>&bull; Cached Result</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => runAnalysis(true, selectedMode)}
                  className={styles.secondaryBtn}
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}
                  title="Force re-generation bypassing cache"
                >
                  🔄 Regenerate
                </button>
              </div>

              {warningMessage && (
                <div style={{
                  padding: "0.6rem 0.85rem",
                  backgroundColor: "#FEF7E0",
                  border: "1px solid #FEEFC3",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  color: "#B06000"
                }}>
                  ⚠️ {warningMessage}
                </div>
              )}

              {/* Review Tabs */}
              <div style={{
                display: "flex",
                gap: "0.4rem",
                borderBottom: "2px solid #E2DDD5",
                paddingBottom: "0.4rem"
              }}>
                <button
                  type="button"
                  onClick={() => setActiveReviewTab("descriptions")}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    backgroundColor: activeReviewTab === "descriptions" ? "var(--color-navy)" : "transparent",
                    color: activeReviewTab === "descriptions" ? "#FFF" : "#666"
                  }}
                >
                  📝 Descriptions (Short & Long)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewTab("seo")}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    backgroundColor: activeReviewTab === "seo" ? "var(--color-navy)" : "transparent",
                    color: activeReviewTab === "seo" ? "#FFF" : "#666"
                  }}
                >
                  🔍 SEO & Search Metadata
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewTab("aeo")}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    backgroundColor: activeReviewTab === "aeo" ? "var(--color-navy)" : "transparent",
                    color: activeReviewTab === "aeo" ? "#FFF" : "#666"
                  }}
                >
                  🤖 AEO & Specifications
                </button>
              </div>

              {/* TAB 1: DESCRIPTIONS */}
              {activeReviewTab === "descriptions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Short Description */}
                  <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                          Short Product Description
                        </h4>
                        <span style={{ fontSize: "0.72rem", color: "#666" }}>
                          Used in product preview cards, mobile headers, and search snippets ({aiDraft?.short_description?.length || 0} chars, target: 150-220)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplySingleField("shortDescription", aiDraft?.short_description)}
                        className={acceptedState.shortDescription ? styles.secondaryBtn : styles.primaryBtn}
                        style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}
                      >
                        {acceptedState.shortDescription ? "✓ Short Desc Applied" : "+ Accept Short Description"}
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#888", marginBottom: "0.25rem" }}>
                          ORIGINAL SHORT DESCRIPTION
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#555", backgroundColor: "#F8F6F2", padding: "0.6rem", borderRadius: "4px", minHeight: "60px" }}>
                          {productData.shortDescription || "(Empty)"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-bronze)", marginBottom: "0.25rem" }}>
                          IMPROVED SHORT DESCRIPTION (Editable)
                        </div>
                        <textarea
                          rows={3}
                          value={aiDraft?.short_description || ""}
                          onChange={(e) => handleUpdateDraftField("short_description", e.target.value)}
                          className={styles.textarea}
                          style={{ fontSize: "0.82rem", width: "100%", borderColor: "var(--color-bronze)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complete Long Description */}
                  <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                          Complete Long Description (Publication-Ready)
                        </h4>
                        <span style={{ fontSize: "0.72rem", color: "#666" }}>
                          Full sculpture narrative covering identity, material grain, hand-chiseling craft, and sanctum placement ({(aiDraft?.long_description || aiDraft?.detailed_description || "").split(/\s+/).filter(Boolean).length} words)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplySingleField("detailedDescription", aiDraft?.long_description || aiDraft?.detailed_description)}
                        className={acceptedState.detailedDescription ? styles.secondaryBtn : styles.primaryBtn}
                        style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}
                      >
                        {acceptedState.detailedDescription ? "✓ Long Desc Applied" : "+ Accept Long Description"}
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#888", marginBottom: "0.25rem" }}>
                          ORIGINAL LONG DESCRIPTION
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#555", backgroundColor: "#F8F6F2", padding: "0.6rem", borderRadius: "4px", minHeight: "140px", whiteSpace: "pre-wrap" }}>
                          {productData.detailedDescription || "(Empty)"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-bronze)", marginBottom: "0.25rem" }}>
                          AI COMPLETE LONG DESCRIPTION (Editable)
                        </div>
                        <textarea
                          rows={8}
                          value={aiDraft?.long_description || aiDraft?.detailed_description || ""}
                          onChange={(e) => {
                            handleUpdateDraftField("long_description", e.target.value);
                            handleUpdateDraftField("detailed_description", e.target.value);
                          }}
                          className={styles.textarea}
                          style={{ fontSize: "0.82rem", width: "100%", borderColor: "var(--color-bronze)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEO & SEARCH METADATA */}
              {activeReviewTab === "seo" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                        SEO Title, Meta Description & High-Intent Search Phrases
                      </h4>
                      <button
                        type="button"
                        onClick={handleApplySeo}
                        className={acceptedState.seo ? styles.secondaryBtn : styles.primaryBtn}
                        style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}
                      >
                        {acceptedState.seo ? "✓ SEO Fields Applied" : "+ Accept All SEO Fields"}
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>
                            SEO Title Tag (Optimal: up to 120 chars, snippet display: 30-65 chars)
                          </label>
                          <span style={{ fontSize: "0.72rem", color: (aiDraft?.seo_title?.length || 0) > 120 ? "#C5221F" : "#137333", fontWeight: "600" }}>
                            {aiDraft?.seo_title?.length || 0} characters
                          </span>
                        </div>
                        <input
                          type="text"
                          value={aiDraft?.seo_title || ""}
                          onChange={(e) => handleUpdateDraftField("seo_title", e.target.value)}
                          className={styles.input}
                          style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                        />
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>
                            Meta Description Tag (Optimal: 140-160 chars)
                          </label>
                          <span style={{ fontSize: "0.72rem", color: (aiDraft?.meta_description?.length || 0) > 165 ? "#C5221F" : "#137333", fontWeight: "600" }}>
                            {aiDraft?.meta_description?.length || 0} characters
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={aiDraft?.meta_description || ""}
                          onChange={(e) => handleUpdateDraftField("meta_description", e.target.value)}
                          className={styles.textarea}
                          style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>
                            Primary Search Keyword:
                          </label>
                          <input
                            type="text"
                            value={aiDraft?.primary_keyword || ""}
                            onChange={(e) => handleUpdateDraftField("primary_keyword", e.target.value)}
                            className={styles.input}
                            style={{ fontSize: "0.85rem", fontWeight: "600", marginTop: "0.2rem" }}
                          />
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>
                              Suggested URL Slug:
                            </label>
                            <button
                              type="button"
                              onClick={handleApplySlug}
                              style={{
                                fontSize: "0.72rem",
                                padding: "0.15rem 0.45rem",
                                borderRadius: "4px",
                                border: "1px solid #E2DDD5",
                                backgroundColor: acceptedState.slug ? "#E6F4EA" : "#FFF",
                                cursor: "pointer",
                                color: acceptedState.slug ? "#137333" : "var(--color-navy)"
                              }}
                            >
                              {acceptedState.slug ? "✓ Slug Applied" : "Apply Slug"}
                            </button>
                          </div>
                          <input
                            type="text"
                            value={aiDraft?.suggested_slug || ""}
                            onChange={(e) => handleUpdateDraftField("suggested_slug", e.target.value)}
                            className={styles.input}
                            style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>

                      {/* Secondary & Long-tail Keywords */}
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>
                          Secondary Keywords & Long-Tail Search Queries:
                        </label>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
                          {[...(aiDraft?.secondary_keywords || []), ...(aiDraft?.long_tail_keywords || [])].map((kw, i) => (
                            <span key={i} style={{ backgroundColor: "#F0EBE1", color: "var(--color-navy)", padding: "0.25rem 0.55rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "500" }}>
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Discovery Tags */}
                      {Array.isArray(aiDraft?.discovery_tags) && aiDraft.discovery_tags.length > 0 && (
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>
                            Discovery Tags:
                          </label>
                          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                            {aiDraft.discovery_tags.map((tag, i) => (
                              <span key={i} style={{ backgroundColor: "#E6F4EA", color: "#137333", padding: "0.15rem 0.5rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600" }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Alt Texts */}
                  {Array.isArray(aiDraft?.image_alt_texts) && aiDraft.image_alt_texts.length > 0 && (
                    <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                        📸 Image Alt Text Recommendations
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {aiDraft.image_alt_texts.map((altItem, i) => (
                          <div key={i} style={{ fontSize: "0.8rem", color: "#555", backgroundColor: "#F8F6F2", padding: "0.5rem", borderRadius: "4px" }}>
                            <strong>View {i + 1}:</strong> {altItem.suggested_alt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AEO & SPECIFICATIONS */}
              {activeReviewTab === "aeo" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* AEO Summary */}
                  <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                          Answer Engine Optimization (AEO) Factual Summary
                        </h4>
                        <span style={{ fontSize: "0.72rem", color: "#666" }}>
                          Entity-dense product definition designed for Google AI Overviews, Perplexity, and AI search engines
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyAeo}
                        className={acceptedState.aeo ? styles.secondaryBtn : styles.primaryBtn}
                        style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}
                      >
                        {acceptedState.aeo ? "✓ AEO Summary Applied" : "+ Accept AEO Summary"}
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={aiDraft?.aeo_summary || ""}
                      onChange={(e) => handleUpdateDraftField("aeo_summary", e.target.value)}
                      className={styles.textarea}
                      style={{ fontSize: "0.85rem", width: "100%", borderColor: "var(--color-bronze)" }}
                    />
                  </div>

                  {/* Factual Attributes */}
                  {aiDraft?.factual_attributes && (
                    <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <div>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                            Factual Stonecraft Attributes
                          </h4>
                          <span style={{ fontSize: "0.72rem", color: "#666" }}>
                            Verified physical and craft specifications mapped to product attributes
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyAttributes}
                          className={acceptedState.attributes ? styles.secondaryBtn : styles.primaryBtn}
                          style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}
                        >
                          {acceptedState.attributes ? "✓ Attributes Applied" : "+ Accept Attributes"}
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>Stone Variety:</label>
                          <input
                            type="text"
                            value={aiDraft?.factual_attributes?.stoneVariety || ""}
                            onChange={(e) => handleUpdateNestedDraft("factual_attributes", "stoneVariety", e.target.value)}
                            className={styles.input}
                            style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>Surface Finish:</label>
                          <input
                            type="text"
                            value={aiDraft?.factual_attributes?.finish || ""}
                            onChange={(e) => handleUpdateNestedDraft("factual_attributes", "finish", e.target.value)}
                            className={styles.input}
                            style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>Craftsmanship Method:</label>
                          <input
                            type="text"
                            value={aiDraft?.factual_attributes?.craftsmanship || ""}
                            onChange={(e) => handleUpdateNestedDraft("factual_attributes", "craftsmanship", e.target.value)}
                            className={styles.input}
                            style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>Intended Placement:</label>
                          <input
                            type="text"
                            value={aiDraft?.factual_attributes?.intendedApplication || ""}
                            onChange={(e) => handleUpdateNestedDraft("factual_attributes", "intendedApplication", e.target.value)}
                            className={styles.input}
                            style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Observable Visual Features (from Image analysis) */}
                  {aiDraft?.image_visual_notes && (
                    <div style={{ backgroundColor: "#FAF9F6", border: "1px solid #ECE7E1", borderRadius: "6px", padding: "0.85rem" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                        👁️ Observable Visual Notes (from Product Cover Image)
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#555", lineHeight: 1.5 }}>
                        {aiDraft.image_visual_notes}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Actions */}
        <div style={{
          backgroundColor: "var(--color-cream)",
          padding: "0.85rem 1.25rem",
          borderTop: "1px solid #E2DDD5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}>
          <button
            type="button"
            onClick={onClose}
            className={styles.secondaryBtn}
            style={{ minHeight: "38px" }}
          >
            Dismiss
          </button>

          {status === "review" && (
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                type="button"
                onClick={handleAcceptAll}
                className={styles.primaryBtn}
                style={{
                  minHeight: "38px",
                  padding: "0.45rem 1.25rem",
                  fontSize: "0.88rem",
                  fontWeight: "700"
                }}
              >
                🚀 Accept All AI Enhancements
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
