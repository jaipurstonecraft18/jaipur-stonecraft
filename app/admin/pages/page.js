"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminPageCMS() {
  const [activeTab, setActiveTab] = useState("homepage");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Page Sections Data
  const defaultHeroSlides = [
    {
      eyebrow: "TIMELESS ART. CARVED BY HAND.",
      headingTitle: "Where Stone",
      headingAccent: "Becomes Art",
      description: "Handcrafted sculptures, architectural stonework, and timeless creations shaped by master artisans with devotion and precision.",
      primaryCtaText: "Explore Our Collections",
      primaryCtaHref: "/collections",
      secondaryCtaText: "Start a Custom Project",
      secondaryCtaHref: "/contact?type=custom",
      imageSrc: "/images/hero/hero-krishna-artisan.jpg"
    },
    {
      eyebrow: "DIVINE SACRED MASONRY",
      headingTitle: "Temples &",
      headingAccent: "Architectural Art",
      description: "Pure Makrana white marble mandirs, hand-carved stone pillars, and grand temple arches built to traditional iconographic standards.",
      primaryCtaText: "View Temples",
      primaryCtaHref: "/collections/temples-architectural-stonework",
      secondaryCtaText: "Consult Artisan",
      secondaryCtaHref: "/contact?type=quote",
      imageSrc: "/images/collections/temples-architectural.jpg"
    },
    {
      eyebrow: "HERITAGE STONE RELIEFS",
      headingTitle: "Wall Murals &",
      headingAccent: "High Reliefs",
      description: "Spiritual high-relief stone panels, lattice jali screens, and bespoke architectural carvings for modern and classical residences.",
      primaryCtaText: "Discover Wall Art",
      primaryCtaHref: "/collections/wall-art-reliefs",
      secondaryCtaText: "Custom Commission",
      secondaryCtaHref: "/contact?type=custom",
      imageSrc: "/images/collections/wall-art-relief.jpg"
    }
  ];

  const [activeHeroSlideIdx, setActiveHeroSlideIdx] = useState(0);
  const [homepageHero, setHomepageHero] = useState({
    slides: defaultHeroSlides
  });

  const [homepageTrustStrip, setHomepageTrustStrip] = useState({
    stats: [
      { label: "Generations of Craft", value: "3+" },
      { label: "Master Artisans in Atelier", value: "500+" },
      { label: "Countries Shipped & Installed", value: "25+" },
      { label: "Bespoke Commissions Delivered", value: "1000+" }
    ]
  });

  const [homepageStory, setHomepageStory] = useState({
    eyebrow: "",
    heading: "",
    paragraph1: "",
    paragraph2: "",
    quote: "",
    imageSrc: ""
  });

  const [homepageCta, setHomepageCta] = useState({
    heading: "",
    description: "",
    primaryCtaText: "",
    primaryCtaHref: "",
    secondaryCtaText: "",
    secondaryCtaHref: ""
  });

  const defaultReviews = [
    {
      id: "1",
      stars: 5,
      quote: "Exceptional craftsmanship and top-notch quality. The statue has brought so much divinity to our home.",
      author: "Anjali Sharma",
      location: "Jaipur, India",
      imageSrc: "",
      initials: "AS"
    },
    {
      id: "2",
      stars: 5,
      quote: "From design to delivery, everything was seamless. Highly professional and very cooperative team.",
      author: "Vikram Mehta",
      location: "Delhi, India",
      imageSrc: "",
      initials: "VM"
    },
    {
      id: "3",
      stars: 5,
      quote: "The marble finish and detailing are simply breathtaking. Thank you Jaipur Stonecraft!",
      author: "Neetu Agarwal",
      location: "Mumbai, India",
      imageSrc: "",
      initials: "NA"
    },
    {
      id: "4",
      stars: 5,
      quote: "We received our custom temple on time and the quality exceeded our expectations.",
      author: "Suresh Reddy",
      location: "Hyderabad, India",
      imageSrc: "",
      initials: "SR"
    }
  ];

  const [homepageReviews, setHomepageReviews] = useState({
    eyebrow: "WHAT OUR CLIENTS SAY",
    heading: "Trusted by Devotees. Loved for Generations.",
    reviews: defaultReviews
  });

  const [storyHeader, setStoryHeader] = useState({
    eyebrow: "",
    heading: "",
    subtitle: "",
    imageSrc: ""
  });

  const [craftsmanshipHero, setCraftsmanshipHero] = useState({
    eyebrow: "",
    heading: "",
    description: ""
  });

  // Fetch page sections from API
  useEffect(() => {
    fetch("/api/admin/pages")
      .then((res) => res.json())
      .then((data) => {
        if (data.sections) {
          data.sections.forEach((sec) => {
            if (sec.keyName === "homepage_hero") {
              let slidesList = defaultHeroSlides;
              if (sec.content && Array.isArray(sec.content.slides) && sec.content.slides.length > 0) {
                slidesList = sec.content.slides;
              } else if (sec.content && sec.content.imageSrc) {
                slidesList = [
                  { ...defaultHeroSlides[0], ...sec.content },
                  defaultHeroSlides[1],
                  defaultHeroSlides[2]
                ];
              }
              setHomepageHero({ slides: slidesList });
            }
            if (sec.keyName === "homepage_trust_strip") setHomepageTrustStrip(sec.content);
            if (sec.keyName === "homepage_story") setHomepageStory(sec.content);
            if (sec.keyName === "homepage_cta") setHomepageCta(sec.content);
            if (sec.keyName === "homepage_reviews") {
              setHomepageReviews({
                eyebrow: sec.content?.eyebrow || "WHAT OUR CLIENTS SAY",
                heading: sec.content?.heading || "Trusted by Devotees. Loved for Generations.",
                reviews: Array.isArray(sec.content?.reviews) && sec.content.reviews.length > 0 ? sec.content.reviews : defaultReviews
              });
            }
            if (sec.keyName === "story_header") setStoryHeader(sec.content);
            if (sec.keyName === "craftsmanship_hero") setCraftsmanshipHero(sec.content);
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load page sections", e);
        setLoading(false);
      });
  }, []);

  const handleSaveSection = async (keyName, contentData) => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName, content: contentData })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: `Successfully saved "${data.message}"!` });
      } else {
        setMessage({ type: "error", text: data.error || "Save failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error saving section." });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", "categories");
    formData.append("productSlug", "cms-image");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && (data.displayUrl || (data.images && data.images.length > 0))) {
        const uploadedUrl = data.displayUrl || data.images[0].displayUrl || data.images[0].url;
        callback(uploadedUrl);
        setMessage({ type: "success", text: "Image uploaded successfully!" });
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setSaving(false);
      // Reset input value so re-selecting same file triggers onChange
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading Website Page CMS...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>📄 Website Page CMS Manager</h1>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.2rem" }}>
            Control editorial copy, hero banners, stats, and text content displayed on live website pages.
          </p>
        </div>

        <Link href="/" target="_blank" className={styles.publicSiteLink}>
          View Live Website ↗
        </Link>
      </div>

      {message.text && (
        <div style={{
          padding: "0.85rem 1.25rem",
          borderRadius: "4px",
          marginBottom: "1.5rem",
          backgroundColor: message.type === "success" ? "#E6F4EA" : "#FCE8E6",
          color: message.type === "success" ? "#137333" : "#C5221F",
          fontWeight: "600",
          fontSize: "0.875rem"
        }}>
          {message.text}
        </div>
      )}

      {/* Studio Tabs */}
      <div className={styles.studioTabs}>
        <button
          className={`${styles.studioTab} ${activeTab === "homepage" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("homepage")}
        >
          🏠 Homepage Sections
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "story" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("story")}
        >
          📜 Our Story Page
        </button>
        <button
          className={`${styles.studioTab} ${activeTab === "craftsmanship" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("craftsmanship")}
        >
          🗿 Craftsmanship Page
        </button>
      </div>

      {/* TAB 1: HOMEPAGE */}
      {activeTab === "homepage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* SECTION 1: HERO BANNER */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  1. Homepage Hero Banner & Copy
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on Homepage (/)
                </span>
              </div>
              <button
                onClick={() => handleSaveSection("homepage_hero", homepageHero)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Hero Section"}
              </button>
            </div>

            {/* Slide Selector Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "1px solid #E2DDD5", paddingBottom: "0.75rem", flexWrap: "wrap" }}>
              {(homepageHero.slides || defaultHeroSlides).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveHeroSlideIdx(idx)}
                  className={`${styles.studioTab} ${activeHeroSlideIdx === idx ? styles.studioTabActive : ""}`}
                  style={{ padding: "0.45rem 0.95rem", fontSize: "0.82rem", margin: 0 }}
                >
                  🖼️ Slide 0{idx + 1}: {s.headingTitle || `Slide ${idx + 1}`}
                </button>
              ))}
            </div>

            {(() => {
              const slides = homepageHero.slides || defaultHeroSlides;
              const curSlide = slides[activeHeroSlideIdx] || slides[0] || defaultHeroSlides[0];

              const updateSlideField = (field, val) => {
                const updated = [...slides];
                updated[activeHeroSlideIdx] = { ...updated[activeHeroSlideIdx], [field]: val };
                setHomepageHero({ slides: updated });
              };

              return (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow Tagline (Slide 0{activeHeroSlideIdx + 1})</label>
                    <input
                      type="text"
                      value={curSlide.eyebrow || ""}
                      onChange={(e) => updateSlideField("eyebrow", e.target.value)}
                      className={styles.input}
                      placeholder="e.g. TIMELESS ART. CARVED BY HAND."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading Title</label>
                    <input
                      type="text"
                      value={curSlide.headingTitle || ""}
                      onChange={(e) => updateSlideField("headingTitle", e.target.value)}
                      className={styles.input}
                      placeholder="e.g. Where Stone"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading Accent Text (Gold italic)</label>
                    <input
                      type="text"
                      value={curSlide.headingAccent || ""}
                      onChange={(e) => updateSlideField("headingAccent", e.target.value)}
                      className={styles.input}
                      placeholder="e.g. Becomes Art"
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Slide Description / Subtitle Copy</label>
                    <textarea
                      rows={2}
                      value={curSlide.description || ""}
                      onChange={(e) => updateSlideField("description", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={curSlide.primaryCtaText || ""}
                      onChange={(e) => updateSlideField("primaryCtaText", e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Primary CTA Destination URL</label>
                    <input
                      type="text"
                      value={curSlide.primaryCtaHref || ""}
                      onChange={(e) => updateSlideField("primaryCtaHref", e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Secondary CTA Button Text</label>
                    <input
                      type="text"
                      value={curSlide.secondaryCtaText || ""}
                      onChange={(e) => updateSlideField("secondaryCtaText", e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Secondary CTA Destination URL</label>
                    <input
                      type="text"
                      value={curSlide.secondaryCtaHref || ""}
                      onChange={(e) => updateSlideField("secondaryCtaHref", e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                      <label className={styles.label}>Slide 0{activeHeroSlideIdx + 1} Background Image</label>
                      <span className={styles.aspectBadge}>📐 Recommended Aspect Ratio: 16:9 Landscape (1920 × 1080 px)</span>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                      <img
                        src={curSlide.imageSrc}
                        alt="Preview"
                        style={{ width: "80px", height: "45px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#E8E4DF" }}
                        onError={(e) => { e.target.src = "https://placehold.co/160x90/E8E4DF/1A1918?text=Hero"; }}
                      />
                      <input
                        type="text"
                        value={curSlide.imageSrc || ""}
                        onChange={(e) => updateSlideField("imageSrc", e.target.value)}
                        className={styles.input}
                        style={{ flex: 1 }}
                        placeholder="https://..."
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => updateSlideField("imageSrc", url))}
                        style={{ fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* SECTION 2: TRUST / STATISTICS BAR */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  2. Floating Statistics & Achievements Bar
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on Homepage Floating Strip
                </span>
              </div>
              <button
                onClick={() => handleSaveSection("homepage_trust_strip", homepageTrustStrip)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Statistics Bar"}
              </button>
            </div>

            <div className={styles.formGrid}>
              {homepageTrustStrip.stats.map((st, idx) => (
                <div key={idx} className={styles.formGroup} style={{ border: "1px solid #E2DDD5", padding: "0.85rem", borderRadius: "6px", backgroundColor: "#FAF9F6" }}>
                  <label className={styles.label}>Stat #{idx + 1} Value</label>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => {
                      const updated = [...homepageTrustStrip.stats];
                      updated[idx].value = e.target.value;
                      setHomepageTrustStrip({ stats: updated });
                    }}
                    className={styles.input}
                    style={{ fontWeight: "700", fontSize: "1.1rem" }}
                  />
                  <label className={styles.label} style={{ marginTop: "0.5rem" }}>Stat #{idx + 1} Label</label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const updated = [...homepageTrustStrip.stats];
                      updated[idx].label = e.target.value;
                      setHomepageTrustStrip({ stats: updated });
                    }}
                    className={styles.input}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: HERITAGE STORY */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  3. Heritage & Lineage Story Section
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on Homepage Story Block
                </span>
              </div>
              <button
                onClick={() => handleSaveSection("homepage_story", homepageStory)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Heritage Story"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Eyebrow</label>
                <input
                  type="text"
                  value={homepageStory.eyebrow}
                  onChange={(e) => setHomepageStory({ ...homepageStory, eyebrow: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Heading</label>
                <input
                  type="text"
                  value={homepageStory.heading}
                  onChange={(e) => setHomepageStory({ ...homepageStory, heading: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Paragraph 1</label>
                <textarea
                  rows={3}
                  value={homepageStory.paragraph1}
                  onChange={(e) => setHomepageStory({ ...homepageStory, paragraph1: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Paragraph 2</label>
                <textarea
                  rows={3}
                  value={homepageStory.paragraph2}
                  onChange={(e) => setHomepageStory({ ...homepageStory, paragraph2: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Italic Pull-Quote</label>
                <input
                  type="text"
                  value={homepageStory.quote}
                  onChange={(e) => setHomepageStory({ ...homepageStory, quote: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <label className={styles.label}>Heritage Story Side Image</label>
                  <span className={styles.aspectBadge}>📐 Recommended Aspect Ratio: 4:3 Standard (1200 × 900 px)</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                  <img
                    src={homepageStory.imageSrc || "/images/brand/heritage-ganesha.jpg"}
                    alt="Preview"
                    style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px", backgroundColor: "#E8E4DF", border: "1px solid #D8CFC2" }}
                    onError={(e) => { e.target.src = "https://placehold.co/160x120/E8E4DF/1A1918?text=Story"; }}
                  />
                  <input
                    type="text"
                    value={homepageStory.imageSrc || ""}
                    onChange={(e) => setHomepageStory({ ...homepageStory, imageSrc: e.target.value })}
                    className={styles.input}
                    style={{ flex: 1 }}
                    placeholder="https://... or upload image"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => setHomepageStory({ ...homepageStory, imageSrc: url }))}
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: CLOSING CONVERSION CTA */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  4. Closing Conversion CTA Banner
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on Homepage Footer CTA
                </span>
              </div>
              <button
                onClick={() => handleSaveSection("homepage_cta", homepageCta)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save CTA Banner"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label className={styles.label}>Heading</label>
                <input
                  type="text"
                  value={homepageCta.heading}
                  onChange={(e) => setHomepageCta({ ...homepageCta, heading: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Description Copy</label>
                <textarea
                  rows={2}
                  value={homepageCta.description}
                  onChange={(e) => setHomepageCta({ ...homepageCta, description: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Primary CTA Button Text</label>
                <input
                  type="text"
                  value={homepageCta.primaryCtaText}
                  onChange={(e) => setHomepageCta({ ...homepageCta, primaryCtaText: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Primary CTA Destination URL</label>
                <input
                  type="text"
                  value={homepageCta.primaryCtaHref}
                  onChange={(e) => setHomepageCta({ ...homepageCta, primaryCtaHref: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Secondary CTA Button Text</label>
                <input
                  type="text"
                  value={homepageCta.secondaryCtaText}
                  onChange={(e) => setHomepageCta({ ...homepageCta, secondaryCtaText: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Secondary CTA Destination URL</label>
                <input
                  type="text"
                  value={homepageCta.secondaryCtaHref}
                  onChange={(e) => setHomepageCta({ ...homepageCta, secondaryCtaHref: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: CLIENT TESTIMONIALS & REVIEWS */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  5. Client Testimonials & Reviews
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on Homepage (/)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection("homepage_reviews", homepageReviews)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Reviews Section"}
              </button>
            </div>

            <div className={styles.formGrid} style={{ marginBottom: "1.5rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Section Eyebrow Tagline</label>
                <input
                  type="text"
                  value={homepageReviews.eyebrow || ""}
                  onChange={(e) => setHomepageReviews({ ...homepageReviews, eyebrow: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Section Heading</label>
                <input
                  type="text"
                  value={homepageReviews.heading || ""}
                  onChange={(e) => setHomepageReviews({ ...homepageReviews, heading: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--color-navy)", margin: 0 }}>
                Client Reviews List ({(homepageReviews.reviews || []).length})
              </h4>
              <button
                type="button"
                className={styles.secondaryBtn}
                style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}
                onClick={() => {
                  const newRev = {
                    id: Date.now().toString(),
                    stars: 5,
                    quote: "Outstanding white marble carving and exquisite detailing. Highly recommended atelier!",
                    author: "New Client",
                    location: "New Delhi, India",
                    imageSrc: "",
                    initials: "NC"
                  };
                  setHomepageReviews({ ...homepageReviews, reviews: [...(homepageReviews.reviews || []), newRev] });
                }}
              >
                ➕ Add New Review
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(homepageReviews.reviews || []).map((rev, idx) => (
                <div key={rev.id || idx} style={{ border: "1px solid #E2DDD5", borderRadius: "8px", padding: "1rem", backgroundColor: "#FAF8F5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--color-bronze)" }}>
                      Review #{idx + 1}: {rev.author || "Anonymous"} ({rev.stars || 5} ★)
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {idx > 0 && (
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                          onClick={() => {
                            const updated = [...homepageReviews.reviews];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setHomepageReviews({ ...homepageReviews, reviews: updated });
                          }}
                        >
                          ⬆️ Move Up
                        </button>
                      )}
                      {idx < (homepageReviews.reviews.length - 1) && (
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                          onClick={() => {
                            const updated = [...homepageReviews.reviews];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setHomepageReviews({ ...homepageReviews, reviews: updated });
                          }}
                        >
                          ⬇️ Move Down
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.dangerBtn}
                        style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem", backgroundColor: "#FFEBEB", color: "#C0392B", border: "1px solid #F5C6CB" }}
                        onClick={() => {
                          const updated = homepageReviews.reviews.filter((_, i) => i !== idx);
                          setHomepageReviews({ ...homepageReviews, reviews: updated });
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Client Name / Author</label>
                      <input
                        type="text"
                        value={rev.author || ""}
                        onChange={(e) => {
                          const updated = [...homepageReviews.reviews];
                          updated[idx] = { ...updated[idx], author: e.target.value };
                          setHomepageReviews({ ...homepageReviews, reviews: updated });
                        }}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Location / City</label>
                      <input
                        type="text"
                        value={rev.location || ""}
                        onChange={(e) => {
                          const updated = [...homepageReviews.reviews];
                          updated[idx] = { ...updated[idx], location: e.target.value };
                          setHomepageReviews({ ...homepageReviews, reviews: updated });
                        }}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Star Rating</label>
                      <select
                        value={rev.stars || 5}
                        onChange={(e) => {
                          const updated = [...homepageReviews.reviews];
                          updated[idx] = { ...updated[idx], stars: parseInt(e.target.value, 10) };
                          setHomepageReviews({ ...homepageReviews, reviews: updated });
                        }}
                        className={styles.select}
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★☆</option>
                        <option value={3}>3 Stars ★★★☆☆</option>
                        <option value={2}>2 Stars ★★☆☆☆</option>
                        <option value={1}>1 Star ★☆☆☆☆</option>
                      </select>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Review / Quote Copy</label>
                      <textarea
                        rows={2}
                        value={rev.quote || ""}
                        onChange={(e) => {
                          const updated = [...homepageReviews.reviews];
                          updated[idx] = { ...updated[idx], quote: e.target.value };
                          setHomepageReviews({ ...homepageReviews, reviews: updated });
                        }}
                        className={styles.textarea}
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                        <label className={styles.label}>Client Photo / Review Image (Optional)</label>
                        <span className={styles.aspectBadge}>📐 Recommended Aspect Ratio: 1:1 Square (500 × 500 px)</span>
                      </div>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                        {rev.imageSrc ? (
                          <img
                            src={rev.imageSrc}
                            alt="Preview"
                            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid #B87B31" }}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#E8E4DF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", color: "#1A1918" }}>
                            {rev.initials || (rev.author ? rev.author.substring(0, 2).toUpperCase() : 'JS')}
                          </div>
                        )}
                        <input
                          type="text"
                          value={rev.imageSrc || ""}
                          onChange={(e) => {
                            const updated = [...homepageReviews.reviews];
                            updated[idx] = { ...updated[idx], imageSrc: e.target.value };
                            setHomepageReviews({ ...homepageReviews, reviews: updated });
                          }}
                          className={styles.input}
                          style={{ flex: 1 }}
                          placeholder="https://... or upload client photo"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const updated = [...homepageReviews.reviews];
                            updated[idx] = { ...updated[idx], imageSrc: url };
                            setHomepageReviews({ ...homepageReviews, reviews: updated });
                          })}
                          style={{ fontSize: "0.85rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OUR STORY PAGE */}
      {activeTab === "story" && (
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                Our Story → Hero & Editorial Header
              </h3>
              <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                📍 Used on /our-story
              </span>
            </div>
            <button
              onClick={() => handleSaveSection("story_header", storyHeader)}
              className={styles.primaryBtn}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Story Header"}
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Eyebrow</label>
              <input
                type="text"
                value={storyHeader.eyebrow}
                onChange={(e) => setStoryHeader({ ...storyHeader, eyebrow: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Heading</label>
              <input
                type="text"
                value={storyHeader.heading}
                onChange={(e) => setStoryHeader({ ...storyHeader, heading: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={storyHeader.subtitle}
                onChange={(e) => setStoryHeader({ ...storyHeader, subtitle: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroupFull}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <label className={styles.label}>Hero Image URL</label>
                <span className={styles.aspectBadge}>📐 Recommended Aspect Ratio: 16:9 Landscape (1600 × 900 px)</span>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                <input
                  type="text"
                  value={storyHeader.imageSrc}
                  onChange={(e) => setStoryHeader({ ...storyHeader, imageSrc: e.target.value })}
                  className={styles.input}
                  style={{ flex: 1 }}
                  placeholder="https://..."
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setStoryHeader({ ...storyHeader, imageSrc: url }))}
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CRAFTSMANSHIP PAGE */}
      {activeTab === "craftsmanship" && (
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                Craftsmanship → Atelier Manifesto Hero
              </h3>
              <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                📍 Used on /craftsmanship
              </span>
            </div>
            <button
              onClick={() => handleSaveSection("craftsmanship_hero", craftsmanshipHero)}
              className={styles.primaryBtn}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Craftsmanship Hero"}
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Eyebrow</label>
              <input
                type="text"
                value={craftsmanshipHero.eyebrow}
                onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, eyebrow: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Heading</label>
              <input
                type="text"
                value={craftsmanshipHero.heading}
                onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, heading: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Description</label>
              <textarea
                rows={3}
                value={craftsmanshipHero.description}
                onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, description: e.target.value })}
                className={styles.textarea}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
