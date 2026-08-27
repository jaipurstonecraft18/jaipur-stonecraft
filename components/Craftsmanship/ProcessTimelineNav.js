"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container/Container";
import styles from "./ProcessTimelineNav.module.css";

const stages = [
  { id: "stage-01", num: "01", label: "Select" },
  { id: "stage-02", num: "02", label: "Model" },
  { id: "stage-03", num: "03", label: "Chisel" },
  { id: "stage-04", num: "04", label: "Refine" },
  { id: "stage-05", num: "05", label: "Inspect" },
  { id: "stage-06", num: "06", label: "Crate" },
  { id: "stage-07", num: "07", label: "Masterpiece" },
];

export default function ProcessTimelineNav() {
  const [activeId, setActiveId] = useState("stage-01");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = stages.length - 1; i >= 0; i--) {
        const stage = stages[i];
        const el = document.getElementById(stage.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(stage.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStage = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Offset for sticky navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className={styles.stickyNav} aria-label="Atelier Process Stages Navigation">
      <Container>
        <div className={styles.navWrapper}>
          <span className={styles.navLabel}>ATELIER PATH:</span>
          <div className={styles.stageList}>
            {stages.map((stage) => {
              const isActive = activeId === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => scrollToStage(stage.id)}
                  className={`${styles.stageBtn} ${isActive ? styles.active : ""}`}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className={styles.stageNum}>{stage.num}</span>
                  <span className={styles.stageName}>{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </nav>
  );
}
