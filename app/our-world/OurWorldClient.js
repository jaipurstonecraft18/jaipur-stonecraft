"use client";

import { useState } from "react";
import OurWorldHero from "@/components/OurWorld/OurWorldHero";
import WorldCategoryTabs from "@/components/OurWorld/WorldCategoryTabs";
import WorldGallery from "@/components/OurWorld/WorldGallery";
import FeaturedProjects from "@/components/OurWorld/FeaturedProjects";
import CraftProcess from "@/components/CraftProcess/CraftProcess";
import WhatWeCreate from "@/components/OurWorld/WhatWeCreate";
import BespokeCTA from "@/components/OurWorld/BespokeCTA";

export default function OurWorldClient({ initialData = {}, craftsmanshipData = {} }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const {
    hero = {},
    categories = [],
    galleryHeader = {},
    gallery = [],
    featuredProjectsHeader = {},
    featuredProjects = [],
    whatWeCreateHeader = {},
    whatWeCreate = [],
    closingCta = {}
  } = initialData;

  const handleSelectTab = (catId) => {
    setActiveCategory(catId);
    const target = document.getElementById("gallery-showcase");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      {/* 1. EDITORIAL HERO WITH FINISHED CINEMATIC ART */}
      <OurWorldHero data={hero} />

      {/* 2. CATEGORY TABS NAVIGATION */}
      <WorldCategoryTabs
        categories={categories}
        activeTab={activeCategory}
        onSelectTab={handleSelectTab}
      />

      {/* 3. CORE ASYMMETRIC CREATION GALLERY */}
      <WorldGallery
        items={gallery}
        activeCategory={activeCategory}
        header={galleryHeader}
      />

      {/* 4. FEATURED REAL PROJECTS */}
      <FeaturedProjects
        projects={featuredProjects}
        header={featuredProjectsHeader}
      />

      {/* 5. SHARED CRAFTSMANSHIP PROCESS (ONE CMS UNIT ACROSS HOME, OUR WORLD & CRAFTSMANSHIP) */}
      <CraftProcess sectionData={craftsmanshipData} />

      {/* 6. WHAT WE CREATE (4 ARCHITECTURAL CATEGORY CARDS) */}
      <WhatWeCreate
        items={whatWeCreate}
        header={whatWeCreateHeader}
      />

      {/* 7. CONVERSION INQUIRY CLOSE */}
      <BespokeCTA
        data={closingCta}
      />
    </div>
  );
}
