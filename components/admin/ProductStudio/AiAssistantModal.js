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
  
  // AI Output Draft state for editing inside modal before acceptance
  const [aiDraft, setAiDraft] = useState(null);
  
  // Track accepted state for each section
  const [acceptedState, setAcceptedState] = useState({
    shortDescription: false,
    detailedDescription: false,
    knowledgeSections: [], // array of booleans per section
    seoTitle: false,
    metaDescription: false,
    altTexts: false
  });

  const [activeReviewTab, setActiveReviewTab] = useState("descriptions");

  // Trigger analysis when modal opens
  useEffect(() => {
    if (isOpen && status === "idle") {
      runAnalysis();
    }
  }, [isOpen]);

  const runAnalysis = async () => {
    setStatus("analyzing");
    setErrorMessage("");
    setAnalysisProgress("Gathering product specs & category hierarchy...");

    try {
      setAnalysisProgress("Sending payload to Gemini AI Content Intelligence...");

      const imagesToAnalyze = selectedImages.length > 0
        ? selectedImages
        : productData.imageSrc && !productData.imageSrc.includes("placehold.co")
          ? [productData.imageSrc]
          : [];

      const res = await fetch("/api/admin/ai/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productData,
          selectedImages: imagesToAnalyze
        })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatus("error");
        setErrorMessage(json.error || "Failed to analyze product. Please try again.");
        return;
      }

      setAiDraft(json.data);
      setAcceptedState({
        shortDescription: false,
        detailedDescription: false,
        knowledgeSections: (json.data.suggested_knowledge_sections || []).map(() => false),
        seoTitle: false,
        metaDescription: false,
        altTexts: false
      });
      setStatus("review");

    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Network error during AI analysis.");
    }
  };

  if (!isOpen) return null;

  const handleUpdateDraftField = (field, value) => {
    setAiDraft(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateKnowledgeSection = (index, key, value) => {
    setAiDraft(prev => {
      const updated = [...(prev.suggested_knowledge_sections || [])];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, suggested_knowledge_sections: updated };
    });
  };

  const handleRemoveKnowledgeSection = (index) => {
    setAiDraft(prev => {
      const updated = [...(prev.suggested_knowledge_sections || [])];
      updated.splice(index, 1);
      return { ...prev, suggested_knowledge_sections: updated };
    });
  };

  // Accept specific single section or field
  const handleApplySingleField = (fieldName, dataValue) => {
    onAcceptSuggestions({ [fieldName]: dataValue });
    setAcceptedState(prev => ({ ...prev, [fieldName]: true }));
  };

  // Accept Knowledge Sections
  const handleApplyKnowledgeSection = (index) => {
    const sec = aiDraft.suggested_knowledge_sections[index];
    if (!sec) return;

    const currentKnowledge = Array.isArray(productData.knowledgeLayer) ? [...productData.knowledgeLayer] : [];
    // Check if section with same title exists, update or append
    const existingIdx = currentKnowledge.findIndex(k => k.title.toLowerCase() === sec.title.toLowerCase());
    if (existingIdx >= 0) {
      currentKnowledge[existingIdx] = { ...sec };
    } else {
      currentKnowledge.push({ ...sec });
    }

    onAcceptSuggestions({ knowledgeLayer: currentKnowledge });
    setAcceptedState(prev => {
      const updatedKs = [...prev.knowledgeSections];
      updatedKs[index] = true;
      return { ...prev, knowledgeSections: updatedKs };
    });
  };

  // Accept All Verified Suggestions
  const handleAcceptAll = () => {
    if (!aiDraft) return;

    const updates = {};
    if (aiDraft.short_description) updates.shortDescription = aiDraft.short_description;
    if (aiDraft.detailed_description) updates.detailedDescription = aiDraft.detailed_description;
    
    if (Array.isArray(aiDraft.suggested_knowledge_sections) && aiDraft.suggested_knowledge_sections.length > 0) {
      const currentKnowledge = Array.isArray(productData.knowledgeLayer) ? [...productData.knowledgeLayer] : [];
      aiDraft.suggested_knowledge_sections.forEach(sec => {
        const idx = currentKnowledge.findIndex(k => k.title.toLowerCase() === sec.title.toLowerCase());
        if (idx >= 0) {
          currentKnowledge[idx] = { ...sec };
        } else {
          currentKnowledge.push({ ...sec });
        }
      });
      updates.knowledgeLayer = currentKnowledge;
    }

    if (aiDraft.seo_title || aiDraft.meta_description) {
      updates.seo = {
        ...(productData.seo || {}),
        title: aiDraft.seo_title || productData.seo?.title || "",
        description: aiDraft.meta_description || productData.seo?.description || "",
        keywords: aiDraft.search_intent_keywords || productData.seo?.keywords || []
      };
    }

    onAcceptSuggestions(updates);
    onClose();
  };

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
      padding: "1rem"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "960px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
        border: "1px solid #9E7B4F",
        overflow: "hidden"
      }}>
        {/* Modal Header */}
        <div style={{
          padding: "1rem 1.5rem",
          backgroundColor: "#111110",
          color: "#FAF8F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #222220"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.25rem" }}>✨</span>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "600", fontFamily: "var(--font-display)", color: "#FAF8F5", margin: 0 }}>
                AI Content Intelligence & SEO Assistant
              </h2>
              <p style={{ fontSize: "0.78rem", color: "#A09D98", margin: 0 }}>
                 Jaipur Stonecraft • Preview & Review Draft
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {status === "review" && (
              <button
                type="button"
                onClick={handleAcceptAll}
                className={styles.primaryBtn}
                style={{ fontSize: "0.82rem", padding: "0.4rem 0.85rem", backgroundColor: "var(--color-bronze)", color: "#FFF" }}
              >
                ✓ Accept All Suggestions
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{ background: "none", border: "none", color: "#A09D98", fontSize: "1.5rem", cursor: "pointer", padding: "0 0.5rem" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, backgroundColor: "#F8F6F2" }}>

          {/* STATE 1: ANALYZING */}
          {status === "analyzing" && (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", animation: "pulse 1.5s infinite" }}>✨</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                Analyzing Product & Generating Intelligence
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#666", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
                {analysisProgress}
              </p>
              <div style={{
                width: "240px",
                height: "6px",
                backgroundColor: "#E2DDD5",
                borderRadius: "3px",
                margin: "0 auto",
                overflow: "hidden",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "60%",
                  backgroundColor: "var(--color-bronze)",
                  borderRadius: "3px",
                  animation: "shimmer 1.5s infinite linear"
                }} />
              </div>
            </div>
          )}

          {/* STATE 2: ERROR */}
          {status === "error" && (
            <div style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#C5221F", marginBottom: "0.5rem" }}>
                AI Analysis Request Failed
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#555", maxWidth: "550px", margin: "0 auto 1.5rem", backgroundColor: "#FCE8E6", padding: "0.85rem", borderRadius: "6px" }}>
                {errorMessage}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={runAnalysis}
                  className={styles.primaryBtn}
                  style={{ fontSize: "0.85rem" }}
                >
                  🔄 Retry Analysis
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.secondaryBtn}
                  style={{ fontSize: "0.85rem" }}
                >
                  Close Assistant
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: REVIEW DRAFT */}
          {status === "review" && aiDraft && (
            <div>
              {/* Readiness Banner & Inconsistency Alerts */}
              <div style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "6px",
                padding: "1rem 1.25rem",
                border: "1px solid #E2DDD5",
                marginBottom: "1.25rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "12px",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      backgroundColor: aiDraft.content_readiness.score >= 80 ? "#E6F4EA" : "#FEF7E0",
                      color: aiDraft.content_readiness.score >= 80 ? "#137333" : "#B06000"
                    }}>
                      Readiness Score: {aiDraft.content_readiness.score}/100 ({aiDraft.content_readiness.status})
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>
                      {aiDraft.product_summary}
                    </span>
                  </div>
                </div>

                {aiDraft.possible_inconsistencies && aiDraft.possible_inconsistencies.length > 0 && (
                  <div style={{ width: "100%", backgroundColor: "#FFF8E1", border: "1px solid #FFE082", borderRadius: "4px", padding: "0.65rem 0.85rem", marginTop: "0.5rem" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#B06000", marginBottom: "0.25rem" }}>
                      ⚠️ Verification Items Flagged for Human Review ({aiDraft.possible_inconsistencies.length}):
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.78rem", color: "#555" }}>
                      {aiDraft.possible_inconsistencies.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Review Tabs */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid #E2DDD5", paddingBottom: "0.5rem" }}>
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
                  📝 Descriptions & Copy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewTab("knowledge")}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    backgroundColor: activeReviewTab === "knowledge" ? "var(--color-navy)" : "transparent",
                    color: activeReviewTab === "knowledge" ? "#FFF" : "#666"
                  }}
                >
                  📜 Knowledge Sections ({aiDraft.suggested_knowledge_sections.length})
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
                  🔍 SEO & Alt Texts
                </button>
              </div>

              {/* TAB 1: DESCRIPTIONS */}
              {activeReviewTab === "descriptions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Short Description Block */}
                  <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                        Short Product Description
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleApplySingleField("shortDescription", aiDraft.short_description)}
                        className={acceptedState.shortDescription ? styles.secondaryBtn : styles.primaryBtn}
                        style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
                      >
                        {acceptedState.shortDescription ? "✓ Applied" : "+ Accept Short Description"}
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#888", marginBottom: "0.25rem" }}>CURRENT VERSION</div>
                        <div style={{ fontSize: "0.82rem", color: "#555", backgroundColor: "#F8F6F2", padding: "0.6rem", borderRadius: "4px", minHeight: "60px" }}>
                          {productData.shortDescription || "(Empty)"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-bronze)", marginBottom: "0.25rem" }}>AI ENHANCED SUGGESTION (Editable)</div>
                        <textarea
                          rows={3}
                          value={aiDraft.short_description}
                          onChange={(e) => handleUpdateDraftField("short_description", e.target.value)}
                          className={styles.textarea}
                          style={{ fontSize: "0.82rem", width: "100%", borderColor: "var(--color-bronze)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detailed Description Block */}
                  <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                        Detailed Product Description & Heritage Copy
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleApplySingleField("detailedDescription", aiDraft.detailed_description)}
                        className={acceptedState.detailedDescription ? styles.secondaryBtn : styles.primaryBtn}
                        style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
                      >
                        {acceptedState.detailedDescription ? "✓ Applied" : "+ Accept Detailed Description"}
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#888", marginBottom: "0.25rem" }}>CURRENT VERSION</div>
                        <div style={{ fontSize: "0.82rem", color: "#555", backgroundColor: "#F8F6F2", padding: "0.6rem", borderRadius: "4px", minHeight: "120px", whiteSpace: "pre-wrap" }}>
                          {productData.detailedDescription || "(Empty)"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-bronze)", marginBottom: "0.25rem" }}>AI ENHANCED SUGGESTION (Editable)</div>
                        <textarea
                          rows={6}
                          value={aiDraft.detailed_description}
                          onChange={(e) => handleUpdateDraftField("detailed_description", e.target.value)}
                          className={styles.textarea}
                          style={{ fontSize: "0.82rem", width: "100%", borderColor: "var(--color-bronze)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KNOWLEDGE SECTIONS */}
              {activeReviewTab === "knowledge" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {aiDraft.suggested_knowledge_sections.map((sec, idx) => (
                    <div key={idx} style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateKnowledgeSection(idx, "title", e.target.value)}
                          style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--color-navy)", border: "1px solid #E2DDD5", borderRadius: "4px", padding: "0.25rem 0.5rem", width: "60%" }}
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveKnowledgeSection(idx)}
                            className={styles.secondaryBtn}
                            style={{ fontSize: "0.75rem", color: "#C5221F", padding: "0.25rem 0.55rem" }}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyKnowledgeSection(idx)}
                            className={acceptedState.knowledgeSections[idx] ? styles.secondaryBtn : styles.primaryBtn}
                            style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
                          >
                            {acceptedState.knowledgeSections[idx] ? "✓ Section Applied" : "+ Accept Section"}
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleUpdateKnowledgeSection(idx, "content", e.target.value)}
                        className={styles.textarea}
                        style={{ fontSize: "0.82rem", width: "100%" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: SEO & ALT TEXTS */}
              {activeReviewTab === "seo" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                        SEO Meta Tags & Search Intent Keywords
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleApplySingleField("seo", {
                          ...(productData.seo || {}),
                          title: aiDraft.seo_title,
                          description: aiDraft.meta_description,
                          keywords: aiDraft.search_intent_keywords
                        })}
                        className={acceptedState.seoTitle ? styles.secondaryBtn : styles.primaryBtn}
                        style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
                      >
                        {acceptedState.seoTitle ? "✓ SEO Tags Applied" : "+ Accept All SEO Meta Tags"}
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>SEO Title Tag ({aiDraft.seo_title.length} chars):</label>
                        <input
                          type="text"
                          value={aiDraft.seo_title}
                          onChange={(e) => handleUpdateDraftField("seo_title", e.target.value)}
                          className={styles.input}
                          style={{ fontSize: "0.85rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>Meta Description Tag ({aiDraft.meta_description.length} chars):</label>
                        <textarea
                          rows={2}
                          value={aiDraft.meta_description}
                          onChange={(e) => handleUpdateDraftField("meta_description", e.target.value)}
                          className={styles.textarea}
                          style={{ fontSize: "0.85rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#555" }}>Suggested Natural Search Intent Terms:</label>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                          {aiDraft.search_intent_keywords.map((kw, i) => (
                            <span key={i} style={{ backgroundColor: "#F0EBE1", color: "var(--color-navy)", padding: "0.2rem 0.5rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600" }}>
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Alt Texts */}
                  {aiDraft.image_alt_texts && aiDraft.image_alt_texts.length > 0 && (
                    <div style={{ backgroundColor: "#FFF", border: "1px solid #E2DDD5", borderRadius: "6px", padding: "1rem" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                        📸 Image Alt Text Suggestions
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {aiDraft.image_alt_texts.map((altItem, i) => (
                          <div key={i} style={{ fontSize: "0.8rem", color: "#555", backgroundColor: "#F8F6F2", padding: "0.5rem", borderRadius: "4px" }}>
                            <strong>Image {i + 1}:</strong> {altItem.suggested_alt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
