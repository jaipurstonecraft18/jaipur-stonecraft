"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { projectsData } from "@/content/projects";
import styles from "./ProjectsList.module.css";

export default function ProjectsList() {
  const [activeCategory, setActiveCategory] = useState("All");
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

  const filteredProjects = activeCategory === "All"
    ? projectsList
    : projectsList.filter((proj) => proj.type === activeCategory);

  return (
    <>
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
        {filteredProjects.length > 0 ? (
          filteredProjects.map((proj, idx) => (
            <ScrollReveal key={proj.slug} animation="fade-up" delay={idx * 50}>
              <ProjectCard
                name={proj.name}
                type={proj.type}
                location={proj.location}
                imageSrc={proj.imageSrc}
                href={`/projects/${proj.slug}`}
              />
            </ScrollReveal>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>
    </>
  );
}
