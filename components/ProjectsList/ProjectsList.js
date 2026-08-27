"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { projectsData } from "@/content/projects";
import styles from "./ProjectsList.module.css";

export default function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const projectsList = Object.values(projectsData);

  const categories = [
    "All",
    "Residential",
    "Hospitality",
    "Temple",
    "Garden/Landscape",
    "Memorial/Tribute",
    "Custom"
  ];

  // Reuse shared smart search engine via API (Step 3 Requirement - Zero Client Bundle Overhead)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    let isSubscribed = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&scope=projects`)
        .then((res) => res.json())
        .then((res) => {
          if (isSubscribed) {
            setSearchResults(res);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Projects search error:", err);
          if (isSubscribed) setLoading(false);
        });
    }, 120);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  let displayProjects = projectsList;

  if (searchResults && searchResults.projects && searchQuery.trim()) {
    displayProjects = searchResults.projects.map((sp) => {
      return projectsData[sp.slug] || sp;
    });
  }

  if (activeCategory !== "All") {
    displayProjects = displayProjects.filter((proj) => proj.type === activeCategory);
  }

  return (
    <>
      {/* Intelligent Projects Search Bar (Reusing Shared Search Engine) */}
      <ScrollReveal animation="fade-up" delay={50}>
        <div className={styles.searchBarWrapper}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search projects e.g. 'temple project', 'marbel temple', 'krshna', 'jali'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.clearBtn} onClick={() => setSearchQuery("")} aria-label="Clear project search">
              ✕
            </button>
          )}
        </div>

        {searchResults?.typoSuggestion && (
          <div className={styles.typoBanner}>
            <span>Showing results for: </span>
            <button
              onClick={() => setSearchQuery(searchResults.typoSuggestion)}
              className={styles.typoLink}
            >
              &ldquo;{searchResults.typoSuggestion}&rdquo;
            </button>
          </div>
        )}
      </ScrollReveal>

      {/* Filter buttons bar */}
      <ScrollReveal animation="fade-up" delay={100}>
        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterButton} ${activeCategory === cat ? styles.active : ""}`}
              aria-label={`Filter projects by ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Projects Grid */}
      <div className={styles.projectsGrid}>
        {loading ? (
          <div className={styles.emptyState}>
            <p>Searching projects database...</p>
          </div>
        ) : displayProjects.length > 0 ? (
          displayProjects.map((proj, idx) => (
            <ScrollReveal key={proj.slug} animation="fade-up" delay={idx * 50}>
              <ProjectCard
                name={proj.name}
                type={proj.type}
                location={proj.location && proj.location !== "[LOCATION]" ? proj.location : "Jaipur / Global Site"}
                description={proj.description ? proj.description.replace(/\[|\]/g, "") : null}
                imageSrc={proj.imageSrc}
                href={`/projects/${proj.slug}`}
                variant={idx === 0 && activeCategory === "All" && !searchQuery ? "featured" : "standard"}
              />
            </ScrollReveal>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No projects found matching &ldquo;{searchQuery}&rdquo;.</p>
          </div>
        )}
      </div>
    </>
  );
}
