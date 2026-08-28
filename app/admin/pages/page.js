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

  const defaultHomepageSocial = {
    enabled: true,
    eyebrow: "FOLLOW THE CRAFT",
    heading: "Beyond the Gallery",
    description: "There is more to our craft than the finished piece. Discover our world across our social channels.",
    videoTitle: "CRAFT IN MOTION",
    videoMessage: "See the craft come to life.",
    videoDescription: "From raw stone to timeless beauty – watch the hands, tools and traditions behind every creation.",
    videoSrc: "/videos/herovid.webm",
    videoPoster: "/images/craftsmanship/artisan-hands.png",
    youtubeCtaText: "Watch more on YouTube \u2197",
    instagramCard: {
      title: "Instagram",
      description: "Latest creations & studio moments.",
      ctaText: "Explore Instagram \u2192",
      imageSrc: "/images/brand/heritage-ganesha.jpg"
    },
    pinterestCard: {
      title: "Pinterest",
      description: "Stonework ideas & inspiration for every space.",
      ctaText: "Explore Pinterest \u2192",
      imageSrc: "/images/collections/wall-art-relief.webp"
    },
    facebookCard: {
      title: "Facebook",
      description: "Projects, updates & our journey together.",
      ctaText: "Visit Facebook \u2192",
      imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg"
    }
  };

  const [homepageSocial, setHomepageSocial] = useState(defaultHomepageSocial);

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
            if (sec.keyName === "homepage_social") setHomepageSocial({ ...defaultHomepageSocial, ...sec.content });
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

          {/* SECTION 4: SOCIAL MEDIA SHOWCASE (BEYOND THE GALLERY) */}
          <div style={{
            backgroundColor: "#FAF7F2",
            border: "2px solid #D8CFC2",
            borderRadius: "14px",
            padding: "1.75rem",
            marginBottom: "2rem",
            boxShadow: "0 10px 32px rgba(184, 123, 49, 0.08)"
          }}>
            {/* Header Banner */}
            <div style={{
              background: "linear-gradient(135deg, #1C1917 0%, #2A2521 100%)",
              color: "#FFFFFF",
              padding: "1.25rem 1.5rem",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.75rem",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)"
            }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "600", color: "#D4A359", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>🌐</span> 4. Social Media Showcase (Beyond the Gallery)
                </h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)", margin: "0.35rem 0 0 0" }}>
                  Manage the homepage video feature, section titles, and social channel cards (Instagram, Pinterest, Facebook)
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ backgroundColor: "rgba(212, 163, 89, 0.2)", color: "#E6C594", padding: "0.3rem 0.75rem", borderRadius: "20px", fontSize: "0.78rem", border: "1px solid rgba(212, 163, 89, 0.4)" }}>
                  📍 Used on Homepage (/)
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveSection("homepage_social", homepageSocial)}
                  style={{
                    backgroundColor: "#B87B31",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0.55rem 1.25rem",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(184, 123, 49, 0.3)"
                  }}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Social Section"}
                </button>
              </div>
            </div>

            {/* Sub-Panel 1: Header Copy & Bottom Banner */}
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD5", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.92rem", fontWeight: "600", color: "#B87B31", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>📝</span> Section Header Copy & Accent Text
              </h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroupFull}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="enableSocial"
                      checked={homepageSocial.enabled !== false}
                      onChange={(e) => setHomepageSocial({ ...homepageSocial, enabled: e.target.checked })}
                    />
                    <label htmlFor="enableSocial" className={styles.label} style={{ fontWeight: "600", color: "#1C1917" }}>
                      Enable "Beyond the Gallery" Social Section on Homepage
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Section Eyebrow Tagline</label>
                  <input
                    type="text"
                    value={homepageSocial.eyebrow || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, eyebrow: e.target.value })}
                    className={styles.input}
                    placeholder="FOLLOW THE CRAFT"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Main Section Heading</label>
                  <input
                    type="text"
                    value={homepageSocial.heading || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, heading: e.target.value })}
                    className={styles.input}
                    placeholder="Beyond the Gallery"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Supporting Subtitle Copy</label>
                  <textarea
                    rows={2}
                    value={homepageSocial.description || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, description: e.target.value })}
                    className={styles.textarea}
                    placeholder="There is more to our craft than the finished piece. Discover our world across our social channels."
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Footer Accent Sub-strip Text (Bottom Banner)</label>
                  <input
                    type="text"
                    value={homepageSocial.footerStripText || "FOLLOW • EXPLORE • GET INSPIRED"}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, footerStripText: e.target.value })}
                    className={styles.input}
                    placeholder="FOLLOW • EXPLORE • GET INSPIRED"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Panel 2: Craft in Motion Video Banner (Dark Studio Panel) */}
            <div style={{ backgroundColor: "#181512", border: "1px solid #3A332B", borderRadius: "10px", padding: "1.35rem", marginBottom: "1.5rem", color: "#FFFFFF" }}>
              <h4 style={{ fontSize: "0.92rem", fontWeight: "600", color: "#D4A359", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>🎥</span> Craft in Motion — Cinematic Video Feature Banner
              </h4>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ color: "#D4A359" }}>Video Title Tagline</label>
                  <input
                    type="text"
                    value={homepageSocial.videoTitle || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, videoTitle: e.target.value })}
                    className={styles.input}
                    style={{ backgroundColor: "#24201C", borderColor: "#4A4035", color: "#FFFFFF" }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ color: "#D4A359" }}>Video Main Message</label>
                  <input
                    type="text"
                    value={homepageSocial.videoMessage || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, videoMessage: e.target.value })}
                    className={styles.input}
                    style={{ backgroundColor: "#24201C", borderColor: "#4A4035", color: "#FFFFFF" }}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label} style={{ color: "#D4A359" }}>Video Description Copy</label>
                  <textarea
                    rows={2}
                    value={homepageSocial.videoDescription || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, videoDescription: e.target.value })}
                    className={styles.textarea}
                    style={{ backgroundColor: "#24201C", borderColor: "#4A4035", color: "#FFFFFF" }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ color: "#D4A359" }}>YouTube CTA Button Text</label>
                  <input
                    type="text"
                    value={homepageSocial.youtubeCtaText || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, youtubeCtaText: e.target.value })}
                    className={styles.input}
                    style={{ backgroundColor: "#24201C", borderColor: "#4A4035", color: "#FFFFFF" }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ color: "#D4A359" }}>YouTube Destination Link (Optional Override)</label>
                  <input
                    type="text"
                    value={homepageSocial.youtubeUrl || ""}
                    onChange={(e) => setHomepageSocial({ ...homepageSocial, youtubeUrl: e.target.value })}
                    className={styles.input}
                    style={{ backgroundColor: "#24201C", borderColor: "#4A4035", color: "#FFFFFF" }}
                    placeholder="https://youtube.com/@jaipurstonecraft"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label} style={{ color: "#D4A359" }}>Video File URL (.webm or .mp4)</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                    <input
                      type="text"
                      value={homepageSocial.videoSrc || ""}
                      onChange={(e) => setHomepageSocial({ ...homepageSocial, videoSrc: e.target.value })}
                      className={styles.input}
                      style={{ flex: 1, backgroundColor: "#24201C", borderColor: "#4A4035", color: "#FFFFFF" }}
                      placeholder="/videos/herovid.webm or upload video"
                    />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleImageUpload(e, (url) => setHomepageSocial({ ...homepageSocial, videoSrc: url }))}
                      style={{ fontSize: "0.82rem", color: "#D4A359" }}
                    />
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label} style={{ color: "#D4A359" }}>Video Poster / Fallback Image</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                    <img
                      src={homepageSocial.videoPoster || "/images/craftsmanship/artisan-hands.png"}
                      alt="Poster Preview"
                      style={{ width: "80px", height: "45px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#24201C", border: "1px solid #4A4035" }}
                      onError={(e) => { e.target.src = "https://placehold.co/160x90/24201C/FFFFFF?text=Poster"; }}
                    />
                    <input
                      type="text"
                      value={homepageSocial.videoPoster || ""}
                      onChange={(e) => setHomepageSocial({ ...homepageSocial, videoPoster: e.target.value })}
                      className={styles.input}
                      style={{ flex: 1, backgroundColor: "#24201C", borderColor: "#4A4035", color: "#FFFFFF" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setHomepageSocial({ ...homepageSocial, videoPoster: url }))}
                      style={{ fontSize: "0.82rem", color: "#D4A359" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Panel 3: 3 Social Destination Cards */}
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD5", borderRadius: "10px", padding: "1.25rem" }}>
              <h4 style={{ fontSize: "0.92rem", fontWeight: "600", color: "#B87B31", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>🎴</span> 3 Destination Cards (Instagram, Pinterest, Facebook)
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
                {/* Instagram Card */}
                <div style={{ border: "1px solid #E8CFE4", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FDF8FC" }}>
                  <div style={{ background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F56040)", color: "#FFFFFF", padding: "0.6rem 1rem", fontWeight: "600", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>📷</span> 1. Instagram Card
                  </div>
                  <div style={{ padding: "1rem" }} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Title</label>
                      <input
                        type="text"
                        value={homepageSocial.instagramCard?.title || "Instagram"}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          instagramCard: { ...homepageSocial.instagramCard, title: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>CTA Label</label>
                      <input
                        type="text"
                        value={homepageSocial.instagramCard?.ctaText || "Explore Instagram \u2192"}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          instagramCard: { ...homepageSocial.instagramCard, ctaText: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Description</label>
                      <input
                        type="text"
                        value={homepageSocial.instagramCard?.description || ""}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          instagramCard: { ...homepageSocial.instagramCard, description: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Destination URL Override</label>
                      <input
                        type="text"
                        value={homepageSocial.instagramCard?.url || ""}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          instagramCard: { ...homepageSocial.instagramCard, url: e.target.value }
                        })}
                        className={styles.input}
                        placeholder="https://instagram.com/jaipurstonecraft"
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Card Image</label>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <img
                          src={homepageSocial.instagramCard?.imageSrc || "/images/brand/heritage-ganesha.jpg"}
                          alt="Instagram Card"
                          style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #E8CFE4" }}
                        />
                        <input
                          type="text"
                          value={homepageSocial.instagramCard?.imageSrc || ""}
                          onChange={(e) => setHomepageSocial({
                            ...homepageSocial,
                            instagramCard: { ...homepageSocial.instagramCard, imageSrc: e.target.value }
                          })}
                          className={styles.input}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => setHomepageSocial({
                            ...homepageSocial,
                            instagramCard: { ...homepageSocial.instagramCard, imageSrc: url }
                          }))}
                          style={{ fontSize: "0.78rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pinterest Card */}
                <div style={{ border: "1px solid #F3D0D3", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCF6F6" }}>
                  <div style={{ background: "#BD081C", color: "#FFFFFF", padding: "0.6rem 1rem", fontWeight: "600", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>📌</span> 2. Pinterest Card
                  </div>
                  <div style={{ padding: "1rem" }} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Title</label>
                      <input
                        type="text"
                        value={homepageSocial.pinterestCard?.title || "Pinterest"}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          pinterestCard: { ...homepageSocial.pinterestCard, title: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>CTA Label</label>
                      <input
                        type="text"
                        value={homepageSocial.pinterestCard?.ctaText || "Explore Pinterest \u2192"}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          pinterestCard: { ...homepageSocial.pinterestCard, ctaText: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Description</label>
                      <input
                        type="text"
                        value={homepageSocial.pinterestCard?.description || ""}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          pinterestCard: { ...homepageSocial.pinterestCard, description: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Destination URL Override</label>
                      <input
                        type="text"
                        value={homepageSocial.pinterestCard?.url || ""}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          pinterestCard: { ...homepageSocial.pinterestCard, url: e.target.value }
                        })}
                        className={styles.input}
                        placeholder="https://pinterest.com/jaipurstonecraft"
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Card Image</label>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <img
                          src={homepageSocial.pinterestCard?.imageSrc || "/images/collections/temples-architectural.webp"}
                          alt="Pinterest Card"
                          style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #F3D0D3" }}
                        />
                        <input
                          type="text"
                          value={homepageSocial.pinterestCard?.imageSrc || ""}
                          onChange={(e) => setHomepageSocial({
                            ...homepageSocial,
                            pinterestCard: { ...homepageSocial.pinterestCard, imageSrc: e.target.value }
                          })}
                          className={styles.input}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => setHomepageSocial({
                            ...homepageSocial,
                            pinterestCard: { ...homepageSocial.pinterestCard, imageSrc: url }
                          }))}
                          style={{ fontSize: "0.78rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facebook Card */}
                <div style={{ border: "1px solid #D0E1F9", borderRadius: "8px", overflow: "hidden", backgroundColor: "#F6F9FE" }}>
                  <div style={{ background: "#1877F2", color: "#FFFFFF", padding: "0.6rem 1rem", fontWeight: "600", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>👍</span> 3. Facebook Card
                  </div>
                  <div style={{ padding: "1rem" }} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Title</label>
                      <input
                        type="text"
                        value={homepageSocial.facebookCard?.title || "Facebook"}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          facebookCard: { ...homepageSocial.facebookCard, title: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>CTA Label</label>
                      <input
                        type="text"
                        value={homepageSocial.facebookCard?.ctaText || "Visit Facebook \u2192"}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          facebookCard: { ...homepageSocial.facebookCard, ctaText: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Description</label>
                      <input
                        type="text"
                        value={homepageSocial.facebookCard?.description || ""}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          facebookCard: { ...homepageSocial.facebookCard, description: e.target.value }
                        })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Destination URL Override</label>
                      <input
                        type="text"
                        value={homepageSocial.facebookCard?.url || ""}
                        onChange={(e) => setHomepageSocial({
                          ...homepageSocial,
                          facebookCard: { ...homepageSocial.facebookCard, url: e.target.value }
                        })}
                        className={styles.input}
                        placeholder="https://facebook.com/jaipurstonecraft"
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Card Image</label>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <img
                          src={homepageSocial.facebookCard?.imageSrc || "/images/craftsmanship/step-02-shape-precision.jpg"}
                          alt="Facebook Card"
                          style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #D0E1F9" }}
                        />
                        <input
                          type="text"
                          value={homepageSocial.facebookCard?.imageSrc || ""}
                          onChange={(e) => setHomepageSocial({
                            ...homepageSocial,
                            facebookCard: { ...homepageSocial.facebookCard, imageSrc: e.target.value }
                          })}
                          className={styles.input}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => setHomepageSocial({
                            ...homepageSocial,
                            facebookCard: { ...homepageSocial.facebookCard, imageSrc: url }
                          }))}
                          style={{ fontSize: "0.78rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* 1. CRAFTSMANSHIP HERO SECTION */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  1. Craftsmanship Atelier Hero
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on / & /craftsmanship
                </span>
              </div>
              <button
                onClick={() => handleSaveSection("craftsmanship_hero", craftsmanshipHero)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save All Craftsmanship Changes"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label className={styles.label}>Eyebrow</label>
                <input
                  type="text"
                  value={craftsmanshipHero.eyebrow || "THE ART OF CRAFTSMANSHIP"}
                  onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, eyebrow: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Heading</label>
                <input
                  type="text"
                  value={craftsmanshipHero.heading || "Where Tradition Meets Mastery."}
                  onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, heading: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Description</label>
                <textarea
                  rows={3}
                  value={craftsmanshipHero.description || ""}
                  onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, description: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              {/* HERO MAIN ARTISAN PHOTO */}
              <div className={styles.formGroupFull} style={{ marginTop: "0.5rem", padding: "1rem", backgroundColor: "#FAF9F6", borderRadius: "10px", border: "1px solid #E8E5DF" }}>
                <label className={styles.label} style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                  📸 Hero Craftsmanship Master Photo
                </label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative", width: "120px", height: "80px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                    <img
                      src={craftsmanshipHero.heroImageSrc || "/images/hero/hero-krishna-artisan.jpg"}
                      alt="Hero Craftsmanship Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <input
                      type="text"
                      value={craftsmanshipHero.heroImageSrc || "/images/hero/hero-krishna-artisan.jpg"}
                      onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, heroImageSrc: e.target.value })}
                      className={styles.input}
                      placeholder="/images/hero/hero-krishna-artisan.jpg"
                      style={{ marginBottom: "0.5rem" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setCraftsmanshipHero({ ...craftsmanshipHero, heroImageSrc: url }))}
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. THE 5 MANUFACTURING & CRAFTING JOURNEY STEPS */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  2. Manufacturing & Crafting Journey Steps (5 Stages)
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#666", marginTop: "0.2rem" }}>
                  Upload custom manufacturing stage photos, update step titles and process descriptions.
                </p>
              </div>
              <button
                onClick={() => handleSaveSection("craftsmanship_hero", craftsmanshipHero)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Step Changes"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {(craftsmanshipHero.journeySteps || [
                { step: "01", title: "SELECT THE FINEST STONE", description: "Handpicked premium marble chosen for its purity, strength, and timeless beauty.", imageSrc: "/images/craftsmanship/step-01-select-stone.jpg" },
                { step: "02", title: "SHAPE WITH PRECISION", description: "Artisans carve the form with care, bringing the first life to the stone.", imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg" },
                { step: "03", title: "REFINE THE DETAILS", description: "Every detail is meticulously carved to perfection, giving it character and grace.", imageSrc: "/images/craftsmanship/step-03-refine-details.jpg" },
                { step: "04", title: "POLISH TO PERFECTION", description: "Surface is smoothed and polished to enhance the natural beauty of marble.", imageSrc: "/images/craftsmanship/step-04-polish-perfection.jpg" },
                { step: "05", title: "A MASTERPIECE IS BORN", description: "A timeless creation, ready to be cherished for generations.", imageSrc: "/images/brand/heritage-ganesha.jpg" }
              ]).map((stepItem, idx) => (
                <div key={idx} style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "12px", border: "1px solid #E5E1D8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-bronze)", letterSpacing: "0.08em" }}>
                      STAGE {stepItem.step || `0${idx + 1}`}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label className={styles.label}>Step Title</label>
                      <input
                        type="text"
                        value={stepItem.title || ""}
                        onChange={(e) => {
                          const updated = [...(craftsmanshipHero.journeySteps || [])];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setCraftsmanshipHero({ ...craftsmanshipHero, journeySteps: updated });
                        }}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>Step Description</label>
                      <input
                        type="text"
                        value={stepItem.description || ""}
                        onChange={(e) => {
                          const updated = [...(craftsmanshipHero.journeySteps || [])];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setCraftsmanshipHero({ ...craftsmanshipHero, journeySteps: updated });
                        }}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* STEP IMAGE EDITING & UPLOAD */}
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", backgroundColor: "#FFFFFF", padding: "0.85rem", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <div style={{ position: "relative", width: "100px", height: "70px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                      <img
                        src={stepItem.imageSrc || "/images/craftsmanship/step-01-select-stone.jpg"}
                        alt={`Step ${idx + 1} Preview`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <label className={styles.label} style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Manufacturing Stage Photo</label>
                      <input
                        type="text"
                        value={stepItem.imageSrc || ""}
                        onChange={(e) => {
                          const updated = [...(craftsmanshipHero.journeySteps || [])];
                          updated[idx] = { ...updated[idx], imageSrc: e.target.value };
                          setCraftsmanshipHero({ ...craftsmanshipHero, journeySteps: updated });
                        }}
                        className={styles.input}
                        placeholder="/images/craftsmanship/step-01-select-stone.jpg"
                        style={{ marginBottom: "0.4rem" }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => {
                          const updated = [...(craftsmanshipHero.journeySteps || [])];
                          updated[idx] = { ...updated[idx], imageSrc: url };
                          setCraftsmanshipHero({ ...craftsmanshipHero, journeySteps: updated });
                        })}
                        style={{ fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. BEHIND EVERY CREATION STORY SECTION */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-navy)" }}>
                  3. Behind Every Creation (Human Story & Artisan Profile)
                </h3>
              </div>
              <button
                onClick={() => handleSaveSection("craftsmanship_hero", craftsmanshipHero)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Story Changes"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label className={styles.label}>Story Section Title</label>
                <input
                  type="text"
                  value={craftsmanshipHero.storyTitle || "Hands That Create. Hearts That Care."}
                  onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, storyTitle: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Story Description</label>
                <textarea
                  rows={3}
                  value={craftsmanshipHero.storyDesc || ""}
                  onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, storyDesc: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Script Accent Line</label>
                <input
                  type="text"
                  value={craftsmanshipHero.storyScriptAccent || "Built on Tradition. Perfected by Time."}
                  onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, storyScriptAccent: e.target.value })}
                  className={styles.input}
                />
              </div>

              {/* STORY IMAGE EDITING & UPLOAD */}
              <div className={styles.formGroupFull} style={{ marginTop: "0.5rem", padding: "1rem", backgroundColor: "#FAF9F6", borderRadius: "10px", border: "1px solid #E8E5DF" }}>
                <label className={styles.label} style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                  📸 Story Feature Photo (Goddess Profile / Atelier Sculpture)
                </label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative", width: "120px", height: "80px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                    <img
                      src={craftsmanshipHero.storyImageSrc || "/images/collections/hero-sculptures-group.webp"}
                      alt="Story Feature Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <input
                      type="text"
                      value={craftsmanshipHero.storyImageSrc || "/images/collections/hero-sculptures-group.webp"}
                      onChange={(e) => setCraftsmanshipHero({ ...craftsmanshipHero, storyImageSrc: e.target.value })}
                      className={styles.input}
                      placeholder="/images/collections/hero-sculptures-group.webp"
                      style={{ marginBottom: "0.5rem" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setCraftsmanshipHero({ ...craftsmanshipHero, storyImageSrc: url }))}
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
