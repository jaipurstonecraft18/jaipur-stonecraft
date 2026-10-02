"use client";

import { useState } from "react";
import QuickAddProduct from "@/components/admin/QuickAddProduct/QuickAddProduct";
import ProductStudio from "@/components/admin/ProductStudio/ProductStudio";

export default function NewProductDraftPage() {
  const [mode, setMode] = useState("quick"); // 'quick' | 'advanced'

  return (
    <div>
      {/* Mode Switcher Banner */}
      <div style={{
        maxWidth: "680px",
        margin: "0 auto 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF9F6",
        border: "1px solid #E8E4DF",
        borderRadius: "8px",
        padding: "0.4rem",
        gap: "0.5rem"
      }}>
        <button
          type="button"
          onClick={() => setMode("quick")}
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: mode === "quick" ? "#1A1918" : "transparent",
            color: mode === "quick" ? "#FFF" : "#666",
            fontWeight: "600",
            fontSize: "0.85rem",
            cursor: "pointer",
            minHeight: "40px"
          }}
        >
          ⚡ Quick Add (Mobile Friendly)
        </button>
        <button
          type="button"
          onClick={() => setMode("advanced")}
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: mode === "advanced" ? "#1A1918" : "transparent",
            color: mode === "advanced" ? "#FFF" : "#666",
            fontWeight: "600",
            fontSize: "0.85rem",
            cursor: "pointer",
            minHeight: "40px"
          }}
        >
          🛠️ Advanced Full Studio
        </button>
      </div>

      {mode === "quick" ? (
        <QuickAddProduct onSwitchToAdvanced={() => setMode("advanced")} />
      ) : (
        <ProductStudio isNew={true} onSwitchToQuick={() => setMode("quick")} />
      )}
    </div>
  );
}
