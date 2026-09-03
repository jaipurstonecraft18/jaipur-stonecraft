"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminPageCMS() {
  const [activeTab, setActiveTab] = useState("craftsmanship");
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

  const defaultStoryHeader = {
    eyebrow: "OUR HERITAGE & VISION",
    heading: "Generational Hands, Modern Vision",
    subtitle: "For over three generations, Jaipur Stonecraft has preserved the ancient art of stone carving, shaping sacred deity sculptures, architectural temples, and monumental stone art for sanctuaries worldwide.",
    imageSrc: "/images/hero/hero-krishna-artisan.jpg"
  };

  const defaultStoryLineage = {
    badge: "OUR HERITAGE",
    heading: "Passing Down the Chisel",
    imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg",
    pullQuote: "It never was, nor will be, only about time. It knows not the material gain. Actually, true beauty speaks when a true master crafts every stroke of the hammer.",
    paragraph1: "In the historic stone hubs of Rajasthan, hand carving is far more than an occupation — it is an oral lineage passed down from master to apprentice across generations.",
    paragraph2: "For decades, our family carved sacred deity idols, temple arches, sandstone jali lattices, screens, and palace facades for royal trusts and noble patrons throughout Jaipur, Makrana, and Bharatpur.",
    paragraph3: "This generational foundation taught us how to select stones, how raw blocks are sculpted into human expressions, and everything where marble and bliss converge. The physical mastery of manual chiseling remains the beating heart of our work today."
  };

  const defaultStoryValues = {
    eyebrow: "OUR VALUES",
    heading: "Principles Behind Every Chisel",
    values: [
      { num: "01", title: "Artisan Dignity", desc: "We support fair compensation, health security, and comfortable workspace conditions in our Jaipur studio." },
      { num: "02", title: "In-House Production", desc: "Every statue, wall mural, and architectural piece is carved entirely in our owned Jaipur workshop." },
      { num: "03", title: "Authentic Materials", desc: "We source authentic Makrana white marble, Bansi Paharpur pink sandstone, and Dholpur beige stone directly." },
      { num: "04", title: "Precision & Tolerance", desc: "We bridge ancient Shilpa Shastra proportions with modern 3D CAD modeling for accuracy and installation perfection." }
    ]
  };

  const defaultStoryStats = {
    stats: [
      { value: "3+", label: "Generations of Stone Carving Heritage" },
      { value: "500+", label: "Skilled Artisans Associated Across Rajasthan" },
      { value: "25+", label: "Countries Our Sculptures Have Reached" },
      { value: "1000+", label: "Custom Sculptures & Architectural Projects Delivered" }
    ]
  };

  const defaultStoryVision = {
    eyebrow: "OUR VISION",
    heading: "Carving Indian Heritage for the World",
    imageSrc: "/images/collections/temples-architectural.webp",
    leadQuote: "Our vision is to serve as the global bridge for master Indian stonework — showcasing centuries of hand-carved heritage while creating art that finds its place in spiritual spaces, luxury residences, and public monuments across the world.",
    subcopy: "We partner with architects, interior designers, temple trusts, and private collectors who value raw material integrity, ancestral craftsmanship, and flawless execution."
  };

  const defaultStoryCta = {
    eyebrow: "LET'S CREATE TOGETHER",
    heading: "Bring Your Architectural Vision to Stone",
    desc: "Connect directly with our Jaipur design office to discuss custom commissions, CAD blueprint coordination, or raw stone block selection.",
    imageSrc: "/images/craftsmanship/artisan-hands.png",
    primaryCtaText: "Discuss a Commission",
    primaryCtaHref: "/contact?type=custom",
    secondaryCtaText: "WhatsApp Coordinator"
  };

  const [storyHeader, setStoryHeader] = useState(defaultStoryHeader);
  const [storyLineage, setStoryLineage] = useState(defaultStoryLineage);
  const [storyValues, setStoryValues] = useState(defaultStoryValues);
  const [storyStats, setStoryStats] = useState(defaultStoryStats);
  const [storyVision, setStoryVision] = useState(defaultStoryVision);
  const [storyCta, setStoryCta] = useState(defaultStoryCta);

  const defaultCraftsmanshipSteps = [
    { step: "01", title: "SELECT THE FINEST STONE", description: "Handpicked premium marble chosen for its purity, strength, and timeless beauty.", imageSrc: "/images/craftsmanship/step-01-select-stone.jpg" },
    { step: "02", title: "SHAPE WITH PRECISION", description: "Artisans carve the form with care, bringing the first life to the stone.", imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg" },
    { step: "03", title: "REFINE THE DETAILS", description: "Every detail is meticulously carved to perfection, giving it character and grace.", imageSrc: "/images/craftsmanship/step-03-refine-details.jpg" },
    { step: "04", title: "POLISH TO PERFECTION", description: "Surface is smoothed and polished to enhance the natural beauty of marble.", imageSrc: "/images/craftsmanship/step-04-polish-perfection.jpg" },
    { step: "05", title: "A MASTERPIECE IS BORN", description: "A timeless creation, ready to be cherished for generations.", imageSrc: "/images/brand/heritage-ganesha.jpg" }
  ];

  const defaultCraftsmanshipPageImages = {
    node02: "/images/hero/hero-krishna-artisan.jpg",
    stage03_hero: "/images/hero/hero-krishna-artisan.jpg",
    stage03_sub: "/images/craftsmanship/step-02-shape-precision.jpg",
    stage04_facial: "/images/craftsmanship/step-03-refine-details.jpg",
    stage04_jali: "/images/craftsmanship/artisan-hands.png",
    stage05_honing: "/images/craftsmanship/step-04-polish-perfection.jpg",
    stage07_masterpiece: "/images/brand/heritage-ganesha.jpg"
  };

  const defaultStages = {
    stage01: {
      eyebrow: "QUARRY SELECTION & MINERAL INTEGRITY",
      heading: "Selecting the Solid Block",
      narrative: "Every lasting sculpture begins at the quarry face. We source raw blocks of white Makrana marble, pink Bansi Paharpur sandstone, and Dholpur sandstone directly from historic quarries across Rajasthan.\n\nOur senior quarry inspectors examine raw stone monoliths before extraction. We check each block for mineral density, hairline fractures, and structural stability. Only blocks completely free from internal stress lines are carted to our Jaipur workshop.",
      auditStandard: "Density checks eliminate soft pockets or iron deposits before carving begins. Zero unverified blocks enter our studio."
    },
    stage02: {
      eyebrow: "PROPORTION & ANATOMICAL ACCURACY",
      heading: "From CAD Draft to Chalk Grid",
      narrative: "Before a chisel touches the stone, our master carvers collaborate with client architects and interior design teams. We translate architectural CAD blueprints and hand sketches into full-scale physical grid lines mapped directly across the stone monolith face.\n\nFor complex custom commissions—such as bespoke deity statues, ornate Jali screens, or architectural temple columns—artisans hand-sculpt a full 1:1 clay maquette model first.\n\nThis physical modeling stage allows client approval of subtle facial expressions, crown proportions, and drape folds before stone cutting begins."
    },
    stage03: {
      eyebrow: "PURE HANDCRAFTED PRECISION",
      heading: "Generational Hand Chiseling",
      narrative: "Our carving process relies entirely on traditional manual tools: tempered steel points, flat chisels, claw chisels, and heavy wooden mallets.\n\nBy holding traditional hand chisels, our master masons retain direct tactile feedback from the stone. Every strike responds to the natural calcite grain, creating organic depth and delicate shadow contours that high-speed automated machinery simply cannot duplicate.\n\nArchitectural columns, deity statues, and intricate wall panels are carved centimeter by centimeter, referencing original scale templates at every stage of depth reduction.",
      quote: "Stone has a natural grain and heartbeat. A machine cuts with raw force, but a master mason listens to the stone to release the form sleeping inside.",
      quoteAuthor: "— Master Carver, Jaipur Atelier"
    },
    stage04: {
      eyebrow: "FACIAL EXPRESSION & SACRED ICONOGRAPHY",
      heading: "Refining Serenity, Form & Detail",
      introDesc: "Once main volumes are carved, the sculpture enters its most delicate phase. Senior master carvers use micro-chisels and fine steel rasps to sculpt divine facial expressions, jewelry adornments, and organic floral drapery.",
      facialDesc: "Facial features are sculpted following traditional Shilpa Shastra proportion canons. Gentle eye curvature, serene lips, and lotus crown details require steady hand control.",
      jaliDesc: "Pillar capitals, mantels, and perforated Jali screens are undercut by hand to permit natural light filtration and deep shadow relief."
    },
    stage05: {
      eyebrow: "SURFACE HONING & VERIFICATION",
      heading: "Honing & Quality Inspection",
      narrative: "After carving, stone surfaces are honed by hand using progress-graded water stones—moving from coarse 120-grit up to 1200-grit smooth emery.\n\nThis natural water-honing process highlights the organic depth and translucent calcite luminosity of Makrana marble without using artificial wax or chemical lacquer coatings."
    },
    stage06: {
      eyebrow: "CRATING & SHIPMENT PROTECTION",
      heading: "Custom Wooden Crate Packaging",
      narrative: "Transporting heavy marble sculptures and carved architectural components around the globe requires uncompromising packaging standards.\n\nWe build bespoke wooden crates for each finished creation. Stone elements are floating-braced inside dense shock-absorbing foam beds, ensuring zero surface contact with crate walls."
    },
    stage07: {
      eyebrow: "DEVOTION IN STONE",
      heading: "A Masterpiece Born for Generations",
      narrative: "From quarry monolith to finished art, the journey through our atelier represents hundreds of hours of focused hand chiseling, blueprint alignment, and water-stone honing.\n\nWhether sculpting a sacred deity idol, an architectural column, or a bespoke stone mantel, our promise remains constant: 100% handcrafted craftsmanship carrying timeless grace."
    }
  };

  const defaultClosingCta = {
    heading: "Bring Jaipur Stonecraft to Your Project",
    description: "Collaborate with our master masons to custom-carve white marble deity statues, temple architecture, garden fountains, fireplace mantels, or bespoke stone friezes.",
    primaryCtaText: "Request a Quote",
    primaryCtaHref: "/contact?type=quote",
    secondaryCtaText: "Start Custom Project",
    secondaryCtaHref: "/contact?type=custom"
  };

  const [craftsmanshipHero, setCraftsmanshipHero] = useState({
    eyebrow: "JAIPUR ATELIER & MASONRY",
    heading: "From Raw Stone to Finished Art",
    description: "Inside our Jaipur workshop, generational carvers transform solid Makrana marble monoliths and regional sandstones into divine sculptures, temple architecture, and architectural elements using hand mallets and steel chisels.",
    heroImageSrc: "/images/craftsmanship/artisan-hands.png",
    storyTitle: "Hands That Create.\nHearts That Care.",
    storyDesc: "Our artisans are the soul of Jaipur Stonecraft. With generations of experience and unwavering dedication, they pour their heart into every chisel stroke.",
    storyScriptAccent: "Built on Tradition. Perfected by Time.",
    storyImageSrc: "/images/collections/hero-sculptures-group.webp",
    journeySteps: defaultCraftsmanshipSteps,
    pageImages: defaultCraftsmanshipPageImages,
    stages: defaultStages,
    closingCta: defaultClosingCta
  });

  const [activeStageTab, setActiveStageTab] = useState("stage01");

  const updateCraftStep = (idx, field, value) => {
    setCraftsmanshipHero((prev) => {
      const currentSteps = defaultCraftsmanshipSteps.map((defStep, i) => ({
        ...defStep,
        ...(prev.journeySteps?.[i] || {})
      }));
      currentSteps[idx] = { ...currentSteps[idx], [field]: value };
      return { ...prev, journeySteps: currentSteps };
    });
  };

  const updatePageImage = (field, value) => {
    setCraftsmanshipHero((prev) => ({
      ...prev,
      pageImages: {
        ...defaultCraftsmanshipPageImages,
        ...(prev.pageImages || {}),
        [field]: value
      }
    }));
  };

  const updateStageField = (stageKey, field, value) => {
    setCraftsmanshipHero((prev) => {
      const prevStages = prev.stages || {};
      const targetStage = {
        ...(defaultStages[stageKey] || {}),
        ...(prevStages[stageKey] || {}),
        [field]: value
      };
      return {
        ...prev,
        stages: {
          ...prevStages,
          [stageKey]: targetStage
        }
      };
    });
  };

  const updateClosingCta = (field, value) => {
    setCraftsmanshipHero((prev) => ({
      ...prev,
      closingCta: {
        ...defaultClosingCta,
        ...(prev.closingCta || {}),
        [field]: value
      }
    }));
  };

  // Fetch page sections from API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const t = p.get("tab");
      if (t === "craftsmanship" || t === "story" || t === "homepage") {
        setActiveTab(t);
      }
    }
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
            if (sec.keyName === "story_header") setStoryHeader({ ...defaultStoryHeader, ...sec.content });
            if (sec.keyName === "story_lineage") setStoryLineage({ ...defaultStoryLineage, ...sec.content });
            if (sec.keyName === "story_values") setStoryValues({ ...defaultStoryValues, ...sec.content });
            if (sec.keyName === "story_stats") setStoryStats({ ...defaultStoryStats, ...sec.content });
            if (sec.keyName === "story_vision") setStoryVision({ ...defaultStoryVision, ...sec.content });
            if (sec.keyName === "story_cta") setStoryCta({ ...defaultStoryCta, ...sec.content });
            if (sec.keyName === "craftsmanship_hero") {
              const mergedSteps = defaultCraftsmanshipSteps.map((defStep, idx) => ({
                ...defStep,
                ...(sec.content?.journeySteps?.[idx] || {})
              }));

              const mergedStages = Object.keys(defaultStages).reduce((acc, stageKey) => {
                acc[stageKey] = {
                  ...defaultStages[stageKey],
                  ...(sec.content?.stages?.[stageKey] || {})
                };
                return acc;
              }, {});

              const mergedPageImages = {
                ...defaultCraftsmanshipPageImages,
                ...(sec.content?.pageImages || {})
              };

              const mergedClosingCta = {
                ...defaultClosingCta,
                ...(sec.content?.closingCta || {})
              };

              setCraftsmanshipHero({
                eyebrow: sec.content?.eyebrow || "JAIPUR ATELIER & MASONRY",
                heading: sec.content?.heading || "From Raw Stone to Finished Art",
                description: sec.content?.description || "Inside our Jaipur workshop, generational carvers transform solid Makrana marble monoliths and regional sandstones into divine sculptures, temple architecture, and architectural elements using hand mallets and steel chisels.",
                heroImageSrc: sec.content?.heroImageSrc || "/images/craftsmanship/artisan-hands.png",
                storyTitle: sec.content?.storyTitle || "Hands That Create.\nHearts That Care.",
                storyDesc: sec.content?.storyDesc || "Our artisans are the soul of Jaipur Stonecraft. With generations of experience and unwavering dedication, they pour their heart into every chisel stroke.",
                storyScriptAccent: sec.content?.storyScriptAccent || "Built on Tradition. Perfected by Time.",
                storyImageSrc: sec.content?.storyImageSrc || "/images/collections/hero-sculptures-group.webp",
                journeySteps: mergedSteps,
                pageImages: mergedPageImages,
                stages: mergedStages,
                closingCta: mergedClosingCta
              });
            }
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load page sections", e);
        setLoading(false);
      });
  }, []);

  const handleSaveCraftsmanship = async () => {
    const fullStages = Object.keys(defaultStages).reduce((acc, stageKey) => {
      acc[stageKey] = {
        ...defaultStages[stageKey],
        ...(craftsmanshipHero.stages?.[stageKey] || {})
      };
      return acc;
    }, {});

    const payload = {
      ...craftsmanshipHero,
      stages: fullStages,
      pageImages: {
        ...defaultCraftsmanshipPageImages,
        ...(craftsmanshipHero.pageImages || {})
      },
      closingCta: {
        ...defaultClosingCta,
        ...(craftsmanshipHero.closingCta || {})
      },
      journeySteps: defaultCraftsmanshipSteps.map((defStep, i) => ({
        ...defStep,
        ...(craftsmanshipHero.journeySteps?.[i] || {})
      }))
    };

    await handleSaveSection("craftsmanship_hero", payload);
  };

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
          id="tab-btn-homepage"
          className={`${styles.studioTab} ${activeTab === "homepage" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("homepage")}
        >
          🏠 Homepage Sections
        </button>
        <button
          id="tab-btn-story"
          className={`${styles.studioTab} ${activeTab === "story" ? styles.studioTabActive : ""}`}
          onClick={() => setActiveTab("story")}
        >
          📜 Our Story Page
        </button>
        <button
          id="tab-btn-craftsmanship"
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
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* ============================================================ */}
          {/* 1. STORY HERO & EDITORIAL HEADER                              */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  1. Story Hero &amp; Editorial Header
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on /our-story (Top)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection("story_header", storyHeader)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Story Header"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label className={styles.label}>Eyebrow Tagline</label>
                <input
                  type="text"
                  value={storyHeader.eyebrow || ""}
                  onChange={(e) => setStoryHeader({ ...storyHeader, eyebrow: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Main Heading</label>
                <input
                  type="text"
                  value={storyHeader.heading || ""}
                  onChange={(e) => setStoryHeader({ ...storyHeader, heading: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Subtitle Paragraph</label>
                <textarea
                  rows={3}
                  value={storyHeader.subtitle || ""}
                  onChange={(e) => setStoryHeader({ ...storyHeader, subtitle: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <label className={styles.label}>Hero Image (Right Column)</label>
                  <span className={styles.aspectBadge}>📐 Recommended: 16:9 Landscape (1600 × 900 px)</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                  {storyHeader.imageSrc && (
                    <img
                      src={storyHeader.imageSrc}
                      alt="Story Hero Preview"
                      style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #D0E1F9" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <input
                    type="text"
                    value={storyHeader.imageSrc || ""}
                    onChange={(e) => setStoryHeader({ ...storyHeader, imageSrc: e.target.value })}
                    className={styles.input}
                    style={{ flex: 1 }}
                    placeholder="https://... or /images/..."
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

          {/* ============================================================ */}
          {/* 2. CHAPTER I: OUR HERITAGE (PASSING DOWN THE CHISEL)          */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  2. Chapter I: Our Heritage (Passing Down the Chisel)
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on /our-story (Heritage Section)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection("story_lineage", storyLineage)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Chapter I"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Chapter Badge</label>
                <input
                  type="text"
                  value={storyLineage.badge || ""}
                  onChange={(e) => setStoryLineage({ ...storyLineage, badge: e.target.value })}
                  className={styles.input}
                  placeholder="e.g. OUR HERITAGE"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Chapter Heading</label>
                <input
                  type="text"
                  value={storyLineage.heading || ""}
                  onChange={(e) => setStoryLineage({ ...storyLineage, heading: e.target.value })}
                  className={styles.input}
                  placeholder="e.g. Passing Down the Chisel"
                />
              </div>

              <div className={styles.formGroupFull}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <label className={styles.label}>Heritage Artisan Visual Image</label>
                  <span className={styles.aspectBadge}>📐 Recommended: 4:5 or 1:1 Portrait / Square (800 × 1000 px)</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                  {storyLineage.imageSrc && (
                    <img
                      src={storyLineage.imageSrc}
                      alt="Chapter I Preview"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid #D0E1F9" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <input
                    type="text"
                    value={storyLineage.imageSrc || ""}
                    onChange={(e) => setStoryLineage({ ...storyLineage, imageSrc: e.target.value })}
                    className={styles.input}
                    style={{ flex: 1 }}
                    placeholder="https://... or /images/..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => setStoryLineage({ ...storyLineage, imageSrc: url }))}
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Italic Pull Quote</label>
                <textarea
                  rows={2}
                  value={storyLineage.pullQuote || ""}
                  onChange={(e) => setStoryLineage({ ...storyLineage, pullQuote: e.target.value })}
                  className={styles.textarea}
                  placeholder="It never was, nor will be, only about time..."
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Paragraph 1 (Oral Lineage)</label>
                <textarea
                  rows={2}
                  value={storyLineage.paragraph1 || ""}
                  onChange={(e) => setStoryLineage({ ...storyLineage, paragraph1: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Paragraph 2 (Royal Trusts &amp; Palaces)</label>
                <textarea
                  rows={2}
                  value={storyLineage.paragraph2 || ""}
                  onChange={(e) => setStoryLineage({ ...storyLineage, paragraph2: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Paragraph 3 (Manual Chiseling Heart)</label>
                <textarea
                  rows={2}
                  value={storyLineage.paragraph3 || ""}
                  onChange={(e) => setStoryLineage({ ...storyLineage, paragraph3: e.target.value })}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. CHAPTER II: OUR VALUES (4 CORE PRINCIPLES)                */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  3. Chapter II: Core Values (4 Principles)
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on /our-story (Values Grid)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection("story_values", storyValues)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Values Section"}
              </button>
            </div>

            <div className={styles.formGrid} style={{ marginBottom: "1rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Eyebrow</label>
                <input
                  type="text"
                  value={storyValues.eyebrow || ""}
                  onChange={(e) => setStoryValues({ ...storyValues, eyebrow: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Heading</label>
                <input
                  type="text"
                  value={storyValues.heading || ""}
                  onChange={(e) => setStoryValues({ ...storyValues, heading: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {(storyValues.values || defaultStoryValues.values).map((val, idx) => (
                <div key={idx} style={{ padding: "1rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-bronze)", fontSize: "0.85rem", display: "block", marginBottom: "0.5rem" }}>
                    Principle {val.num || `0${idx + 1}`}
                  </span>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label className={styles.label} style={{ fontSize: "0.75rem" }}>Title</label>
                    <input
                      type="text"
                      value={val.title || ""}
                      onChange={(e) => {
                        const updated = [...(storyValues.values || defaultStoryValues.values)];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setStoryValues({ ...storyValues, values: updated });
                      }}
                      className={styles.input}
                    />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: "0.75rem" }}>Description</label>
                    <textarea
                      rows={2}
                      value={val.desc || ""}
                      onChange={(e) => {
                        const updated = [...(storyValues.values || defaultStoryValues.values)];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setStoryValues({ ...storyValues, values: updated });
                      }}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4. CHAPTER III: HERITAGE STATS STRIP                         */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  4. Chapter III: Heritage Stats Strip
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on /our-story (Dark Stats Strip)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection("story_stats", storyStats)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Stats Strip"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {(storyStats.stats || defaultStoryStats.stats).map((stat, idx) => (
                <div key={idx} style={{ padding: "1rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label className={styles.label} style={{ fontSize: "0.75rem" }}>Stat Metric Value</label>
                    <input
                      type="text"
                      value={stat.value || ""}
                      onChange={(e) => {
                        const updated = [...(storyStats.stats || defaultStoryStats.stats)];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setStoryStats({ ...storyStats, stats: updated });
                      }}
                      className={styles.input}
                      placeholder="e.g. 3+"
                    />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: "0.75rem" }}>Stat Label</label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => {
                        const updated = [...(storyStats.stats || defaultStoryStats.stats)];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setStoryStats({ ...storyStats, stats: updated });
                      }}
                      className={styles.input}
                      placeholder="e.g. Generations of Stone Carving Heritage"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 5. CHAPTER IV: GLOBAL VISION                                  */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  5. Chapter IV: Global Vision ("Carving Indian Heritage for the World")
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on /our-story (Vision Section)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection("story_vision", storyVision)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Chapter IV"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Eyebrow</label>
                <input
                  type="text"
                  value={storyVision.eyebrow || ""}
                  onChange={(e) => setStoryVision({ ...storyVision, eyebrow: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Section Title</label>
                <input
                  type="text"
                  value={storyVision.heading || ""}
                  onChange={(e) => setStoryVision({ ...storyVision, heading: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <label className={styles.label}>Vision Architectural Photo</label>
                  <span className={styles.aspectBadge}>📐 Recommended: 4:5 or 16:9 Landscape / Architecture (1200 × 900 px)</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                  {storyVision.imageSrc && (
                    <img
                      src={storyVision.imageSrc}
                      alt="Vision Preview"
                      style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #D0E1F9" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <input
                    type="text"
                    value={storyVision.imageSrc || ""}
                    onChange={(e) => setStoryVision({ ...storyVision, imageSrc: e.target.value })}
                    className={styles.input}
                    style={{ flex: 1 }}
                    placeholder="https://... or /images/..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => setStoryVision({ ...storyVision, imageSrc: url }))}
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Lead Quote</label>
                <textarea
                  rows={2}
                  value={storyVision.leadQuote || ""}
                  onChange={(e) => setStoryVision({ ...storyVision, leadQuote: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Partnership Subcopy</label>
                <textarea
                  rows={2}
                  value={storyVision.subcopy || ""}
                  onChange={(e) => setStoryVision({ ...storyVision, subcopy: e.target.value })}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 6. CHAPTER V: CLOSING STORY CTA BANNER                       */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  6. Chapter V: Closing Story CTA Card
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 Used on /our-story (Bottom Banner)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection("story_cta", storyCta)}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save CTA Card"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Eyebrow</label>
                <input
                  type="text"
                  value={storyCta.eyebrow || ""}
                  onChange={(e) => setStoryCta({ ...storyCta, eyebrow: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Heading</label>
                <input
                  type="text"
                  value={storyCta.heading || ""}
                  onChange={(e) => setStoryCta({ ...storyCta, heading: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Description</label>
                <textarea
                  rows={2}
                  value={storyCta.desc || storyCta.description || ""}
                  onChange={(e) => setStoryCta({ ...storyCta, desc: e.target.value, description: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <label className={styles.label}>Background Texture Image</label>
                  <span className={styles.aspectBadge}>📐 Recommended: 16:9 Dark / Stone Texture (1600 × 900 px)</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                  {storyCta.imageSrc && (
                    <img
                      src={storyCta.imageSrc}
                      alt="CTA Texture Preview"
                      style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #D0E1F9" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <input
                    type="text"
                    value={storyCta.imageSrc || ""}
                    onChange={(e) => setStoryCta({ ...storyCta, imageSrc: e.target.value })}
                    className={styles.input}
                    style={{ flex: 1 }}
                    placeholder="https://... or /images/..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => setStoryCta({ ...storyCta, imageSrc: url }))}
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Primary Button Label</label>
                <input
                  type="text"
                  value={storyCta.primaryCtaText || ""}
                  onChange={(e) => setStoryCta({ ...storyCta, primaryCtaText: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Primary Button Destination</label>
                <input
                  type="text"
                  value={storyCta.primaryCtaHref || ""}
                  onChange={(e) => setStoryCta({ ...storyCta, primaryCtaHref: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Secondary WhatsApp Button Label</label>
                <input
                  type="text"
                  value={storyCta.secondaryCtaText || ""}
                  onChange={(e) => setStoryCta({ ...storyCta, secondaryCtaText: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CRAFTSMANSHIP PAGE */}
      {activeTab === "craftsmanship" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* ============================================================ */}
          {/* 1. CRAFTSMANSHIP ATELIER HERO                                */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)", display: "inline-block", marginRight: "0.75rem" }}>
                  1. Craftsmanship Atelier Hero
                </h3>
                <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)" }}>
                  📍 USED ON / &amp; /CRAFTSMANSHIP
                </span>
              </div>
              <button
                onClick={handleSaveCraftsmanship}
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
                  value={craftsmanshipHero.eyebrow || ""}
                  onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, eyebrow: e.target.value }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Heading</label>
                <input
                  type="text"
                  value={craftsmanshipHero.heading || ""}
                  onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, heading: e.target.value }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Description</label>
                <textarea
                  rows={3}
                  value={craftsmanshipHero.description || ""}
                  onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                />
              </div>

              {/* HERO MASTER IMAGE EDITING & UPLOAD */}
              <div className={styles.formGroupFull} style={{ marginTop: "0.5rem", padding: "1rem", backgroundColor: "#FAF9F6", borderRadius: "10px", border: "1px solid #E8E5DF" }}>
                <label className={styles.label} style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                  📸 Hero Craftsmanship Master Photo
                </label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative", width: "120px", height: "80px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                    <img
                      src={craftsmanshipHero.heroImageSrc || "/images/craftsmanship/artisan-hands.png"}
                      alt="Hero Master Photo Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <input
                      type="text"
                      value={craftsmanshipHero.heroImageSrc || ""}
                      onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, heroImageSrc: e.target.value }))}
                      className={styles.input}
                      placeholder="/images/craftsmanship/artisan-hands.png"
                      style={{ marginBottom: "0.5rem" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setCraftsmanshipHero((prev) => ({ ...prev, heroImageSrc: url })))}
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. MANUFACTURING & CRAFTING JOURNEY STEPS (5 STAGES)         */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-navy)" }}>
                  2. Manufacturing &amp; Crafting Journey Steps (5 Stages)
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                  Upload custom manufacturing stage photos, update step titles and process descriptions.
                </p>
              </div>
              <button
                onClick={handleSaveCraftsmanship}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Step Changes"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {(craftsmanshipHero.journeySteps || defaultCraftsmanshipSteps).map((stepItem, idx) => (
                <div key={idx} style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "10px", border: "1px solid #E5E1D8" }}>
                  <div style={{ marginBottom: "0.85rem" }}>
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
                        onChange={(e) => updateCraftStep(idx, "title", e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>Step Description</label>
                      <input
                        type="text"
                        value={stepItem.description || ""}
                        onChange={(e) => updateCraftStep(idx, "description", e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* STEP IMAGE EDITING & UPLOAD */}
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", backgroundColor: "#FFFFFF", padding: "0.85rem", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <div style={{ position: "relative", width: "100px", height: "70px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                      <img
                        src={stepItem.imageSrc || defaultCraftsmanshipSteps[idx]?.imageSrc || "/images/craftsmanship/step-01-select-stone.jpg"}
                        alt={`Step ${idx + 1} Preview`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <label className={styles.label} style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Manufacturing Stage Photo</label>
                      <input
                        type="text"
                        value={stepItem.imageSrc || ""}
                        onChange={(e) => updateCraftStep(idx, "imageSrc", e.target.value)}
                        className={styles.input}
                        placeholder="/images/craftsmanship/step-01-select-stone.jpg"
                        style={{ marginBottom: "0.4rem" }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => updateCraftStep(idx, "imageSrc", url))}
                        style={{ fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. BEHIND EVERY CREATION (HUMAN STORY & ARTISAN PROFILE)     */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-navy)" }}>
                  3. Behind Every Creation (Human Story &amp; Artisan Profile)
                </h3>
              </div>
              <button
                onClick={handleSaveCraftsmanship}
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
                  onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, storyTitle: e.target.value }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Story Description</label>
                <textarea
                  rows={3}
                  value={craftsmanshipHero.storyDesc || ""}
                  onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, storyDesc: e.target.value }))}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Script Accent Line</label>
                <input
                  type="text"
                  value={craftsmanshipHero.storyScriptAccent || "Built on Tradition. Perfected by Time."}
                  onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, storyScriptAccent: e.target.value }))}
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
                      onChange={(e) => setCraftsmanshipHero((prev) => ({ ...prev, storyImageSrc: e.target.value }))}
                      className={styles.input}
                      placeholder="/images/collections/hero-sculptures-group.webp"
                      style={{ marginBottom: "0.5rem" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setCraftsmanshipHero((prev) => ({ ...prev, storyImageSrc: url })))}
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4. CRAFTSMANSHIP DETAILED STAGES (STAGES 01–07)              */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem", borderLeft: "4px solid #137333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                    4. Craftsmanship Detailed Stages (Stages 01–07)
                  </h3>
                  <span className={styles.badge} style={{ backgroundColor: "#E6F4EA", color: "#137333", fontWeight: "700" }}>
                    🔒 DEDICATED TO /craftsmanship
                  </span>
                </div>
                <p style={{ fontSize: "0.83rem", color: "#555", marginTop: "0.35rem" }}>
                  Control editorial storytelling and specialized imagery for each of the 7 stages on the `/craftsmanship` page.
                </p>
              </div>
              <button
                id="save-detailed-stages"
                onClick={handleSaveCraftsmanship}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Detailed Stages"}
              </button>
            </div>

            {/* Stage Selector Tabs */}
            <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1.25rem", flexWrap: "wrap", borderBottom: "1px solid #E2DDD5", paddingBottom: "0.5rem" }}>
              {[
                { id: "stage01", label: "01 Raw Stone" },
                { id: "stage02", label: "02 Blueprint" },
                { id: "stage03", label: "03 Hand Chisel" },
                { id: "stage04", label: "04 Fine Sculpt" },
                { id: "stage05", label: "05 Honing" },
                { id: "stage06", label: "06 Logistics" },
                { id: "stage07", label: "07 Masterpiece" },
              ].map((st) => (
                <button
                  key={st.id}
                  id={`tab-${st.id}`}
                  type="button"
                  onClick={() => setActiveStageTab(st.id)}
                  className={`${styles.studioTab} ${activeStageTab === st.id ? styles.studioTabActive : ""}`}
                  style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem", margin: 0 }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* STAGE 01: RAW STONE */}
            {activeStageTab === "stage01" && (
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-navy)" }}>Stage 01: Raw Stone Selection</span>
                  <span className={styles.badge} style={{ backgroundColor: "#E8F4FD", color: "#1D6FBE", fontSize: "0.75rem" }}>
                    📷 Photo linked to Shared Stage 01 photo above
                  </span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage01?.eyebrow ?? defaultStages.stage01.eyebrow}
                      onChange={(e) => updateStageField("stage01", "eyebrow", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading</label>
                    <input
                      id="stage01-heading-input"
                      type="text"
                      value={craftsmanshipHero.stages?.stage01?.heading ?? defaultStages.stage01.heading}
                      onChange={(e) => updateStageField("stage01", "heading", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Geological Narrative &amp; Extraction Details</label>
                    <textarea
                      rows={4}
                      value={craftsmanshipHero.stages?.stage01?.narrative ?? defaultStages.stage01.narrative}
                      onChange={(e) => updateStageField("stage01", "narrative", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 02: BLUEPRINT */}
            {activeStageTab === "stage02" && (
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-navy)" }}>Stage 02: Blueprint Mapping &amp; Modeling</span>
                  <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)", fontSize: "0.75rem" }}>
                    📍 Dedicated to /craftsmanship
                  </span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage02?.eyebrow ?? defaultStages.stage02.eyebrow}
                      onChange={(e) => updateStageField("stage02", "eyebrow", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage02?.heading ?? defaultStages.stage02.heading}
                      onChange={(e) => updateStageField("stage02", "heading", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>CAD &amp; Modeling Narrative</label>
                    <textarea
                      rows={4}
                      value={craftsmanshipHero.stages?.stage02?.narrative ?? defaultStages.stage02.narrative}
                      onChange={(e) => updateStageField("stage02", "narrative", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.formGroupFull} style={{ padding: "0.85rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <label className={styles.label}>Pathway Node 02 Mapping Photograph</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.25rem" }}>
                      <div style={{ position: "relative", width: "100px", height: "70px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                        <img
                          src={craftsmanshipHero.pageImages?.node02 || defaultCraftsmanshipPageImages.node02}
                          alt="Node 02 Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "220px" }}>
                        <input
                          type="text"
                          value={craftsmanshipHero.pageImages?.node02 ?? defaultCraftsmanshipPageImages.node02}
                          onChange={(e) => updatePageImage("node02", e.target.value)}
                          className={styles.input}
                          style={{ marginBottom: "0.4rem" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updatePageImage("node02", url))}
                          style={{ fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 03: HAND CHISEL */}
            {activeStageTab === "stage03" && (
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-navy)" }}>Stage 03: Generational Hand Chiseling</span>
                  <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)", fontSize: "0.75rem" }}>
                    📍 Dedicated to /craftsmanship
                  </span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage03?.eyebrow ?? defaultStages.stage03.eyebrow}
                      onChange={(e) => updateStageField("stage03", "eyebrow", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage03?.heading ?? defaultStages.stage03.heading}
                      onChange={(e) => updateStageField("stage03", "heading", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Chiseling Process Narrative</label>
                    <textarea
                      rows={4}
                      value={craftsmanshipHero.stages?.stage03?.narrative ?? defaultStages.stage03.narrative}
                      onChange={(e) => updateStageField("stage03", "narrative", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Master Carver Quote</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage03?.quote ?? defaultStages.stage03.quote}
                      onChange={(e) => updateStageField("stage03", "quote", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Quote Author Attribution</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage03?.quoteAuthor ?? defaultStages.stage03.quoteAuthor}
                      onChange={(e) => updateStageField("stage03", "quoteAuthor", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ padding: "0.85rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <label className={styles.label}>Primary Stage 03 Hero Photograph</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.25rem" }}>
                      <div style={{ position: "relative", width: "90px", height: "65px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                        <img
                          src={craftsmanshipHero.pageImages?.stage03_hero || defaultCraftsmanshipPageImages.stage03_hero}
                          alt="Stage 03 Hero Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "180px" }}>
                        <input
                          type="text"
                          value={craftsmanshipHero.pageImages?.stage03_hero ?? defaultCraftsmanshipPageImages.stage03_hero}
                          onChange={(e) => updatePageImage("stage03_hero", e.target.value)}
                          className={styles.input}
                          style={{ marginBottom: "0.35rem" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage03_hero", url))}
                          style={{ fontSize: "0.8rem" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.formGroup} style={{ padding: "0.85rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <label className={styles.label}>Secondary Stage 03 Inset Photograph</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.25rem" }}>
                      <div style={{ position: "relative", width: "90px", height: "65px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                        <img
                          src={craftsmanshipHero.pageImages?.stage03_sub || defaultCraftsmanshipPageImages.stage03_sub}
                          alt="Stage 03 Inset Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "180px" }}>
                        <input
                          type="text"
                          value={craftsmanshipHero.pageImages?.stage03_sub ?? defaultCraftsmanshipPageImages.stage03_sub}
                          onChange={(e) => updatePageImage("stage03_sub", e.target.value)}
                          className={styles.input}
                          style={{ marginBottom: "0.35rem" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage03_sub", url))}
                          style={{ fontSize: "0.8rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 04: FINE SCULPT */}
            {activeStageTab === "stage04" && (
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-navy)" }}>Stage 04: Refining / Sacred Detail</span>
                  <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)", fontSize: "0.75rem" }}>
                    📍 Dedicated to /craftsmanship
                  </span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage04?.eyebrow ?? defaultStages.stage04.eyebrow}
                      onChange={(e) => updateStageField("stage04", "eyebrow", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage04?.heading ?? defaultStages.stage04.heading}
                      onChange={(e) => updateStageField("stage04", "heading", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Stage Introduction</label>
                    <textarea
                      rows={2}
                      value={craftsmanshipHero.stages?.stage04?.introDesc ?? defaultStages.stage04.introDesc}
                      onChange={(e) => updateStageField("stage04", "introDesc", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ padding: "0.85rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <label className={styles.label}>Facial Expression Description</label>
                    <textarea
                      rows={3}
                      value={craftsmanshipHero.stages?.stage04?.facialDesc ?? defaultStages.stage04.facialDesc}
                      onChange={(e) => updateStageField("stage04", "facialDesc", e.target.value)}
                      className={styles.textarea}
                      style={{ marginBottom: "0.5rem" }}
                    />
                    <label className={styles.label} style={{ fontSize: "0.78rem" }}>Facial Expression Photograph</label>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "70px", height: "50px", borderRadius: "4px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                        <img
                          src={craftsmanshipHero.pageImages?.stage04_facial || defaultCraftsmanshipPageImages.stage04_facial}
                          alt="Facial Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={craftsmanshipHero.pageImages?.stage04_facial ?? defaultCraftsmanshipPageImages.stage04_facial}
                          onChange={(e) => updatePageImage("stage04_facial", e.target.value)}
                          className={styles.input}
                          style={{ marginBottom: "0.25rem", fontSize: "0.8rem" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage04_facial", url))}
                          style={{ fontSize: "0.75rem" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.formGroup} style={{ padding: "0.85rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <label className={styles.label}>Jali Lattice &amp; Relief Description</label>
                    <textarea
                      rows={3}
                      value={craftsmanshipHero.stages?.stage04?.jaliDesc ?? defaultStages.stage04.jaliDesc}
                      onChange={(e) => updateStageField("stage04", "jaliDesc", e.target.value)}
                      className={styles.textarea}
                      style={{ marginBottom: "0.5rem" }}
                    />
                    <label className={styles.label} style={{ fontSize: "0.78rem" }}>Jali &amp; Pierced Carving Photograph</label>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "70px", height: "50px", borderRadius: "4px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                        <img
                          src={craftsmanshipHero.pageImages?.stage04_jali || defaultCraftsmanshipPageImages.stage04_jali}
                          alt="Jali Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={craftsmanshipHero.pageImages?.stage04_jali ?? defaultCraftsmanshipPageImages.stage04_jali}
                          onChange={(e) => updatePageImage("stage04_jali", e.target.value)}
                          className={styles.input}
                          style={{ marginBottom: "0.25rem", fontSize: "0.8rem" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage04_jali", url))}
                          style={{ fontSize: "0.75rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 05: HONING */}
            {activeStageTab === "stage05" && (
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-navy)" }}>Stage 05: Honing &amp; Quality Inspection</span>
                  <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)", fontSize: "0.75rem" }}>
                    📍 Dedicated to /craftsmanship
                  </span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage05?.eyebrow ?? defaultStages.stage05.eyebrow}
                      onChange={(e) => updateStageField("stage05", "eyebrow", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage05?.heading ?? defaultStages.stage05.heading}
                      onChange={(e) => updateStageField("stage05", "heading", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Water-Honing &amp; Natural Polish Narrative</label>
                    <textarea
                      rows={4}
                      value={craftsmanshipHero.stages?.stage05?.narrative ?? defaultStages.stage05.narrative}
                      onChange={(e) => updateStageField("stage05", "narrative", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.formGroupFull} style={{ padding: "0.85rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <label className={styles.label}>Water-Stone Honing Photograph</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.25rem" }}>
                      <div style={{ position: "relative", width: "100px", height: "70px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                        <img
                          src={craftsmanshipHero.pageImages?.stage05_honing || defaultCraftsmanshipPageImages.stage05_honing}
                          alt="Stage 05 Honing Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "220px" }}>
                        <input
                          type="text"
                          value={craftsmanshipHero.pageImages?.stage05_honing ?? defaultCraftsmanshipPageImages.stage05_honing}
                          onChange={(e) => updatePageImage("stage05_honing", e.target.value)}
                          className={styles.input}
                          style={{ marginBottom: "0.4rem" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage05_honing", url))}
                          style={{ fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 06: LOGISTICS */}
            {activeStageTab === "stage06" && (
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-navy)" }}>Stage 06: Custom Wooden Crate / Packaging</span>
                  <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)", fontSize: "0.75rem" }}>
                    📍 Dedicated to /craftsmanship
                  </span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage06?.eyebrow ?? defaultStages.stage06.eyebrow}
                      onChange={(e) => updateStageField("stage06", "eyebrow", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage06?.heading ?? defaultStages.stage06.heading}
                      onChange={(e) => updateStageField("stage06", "heading", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Packaging &amp; Shock-Absorbing Transit Narrative</label>
                    <textarea
                      rows={4}
                      value={craftsmanshipHero.stages?.stage06?.narrative ?? defaultStages.stage06.narrative}
                      onChange={(e) => updateStageField("stage06", "narrative", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 07: MASTERPIECE */}
            {activeStageTab === "stage07" && (
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--color-navy)" }}>Stage 07: Masterpiece / Installation</span>
                  <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)", fontSize: "0.75rem" }}>
                    📍 Dedicated to /craftsmanship
                  </span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Eyebrow</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage07?.eyebrow ?? defaultStages.stage07.eyebrow}
                      onChange={(e) => updateStageField("stage07", "eyebrow", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Heading</label>
                    <input
                      type="text"
                      value={craftsmanshipHero.stages?.stage07?.heading ?? defaultStages.stage07.heading}
                      onChange={(e) => updateStageField("stage07", "heading", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Conclusion &amp; Legacy Narrative</label>
                    <textarea
                      rows={4}
                      value={craftsmanshipHero.stages?.stage07?.narrative ?? defaultStages.stage07.narrative}
                      onChange={(e) => updateStageField("stage07", "narrative", e.target.value)}
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.formGroupFull} style={{ padding: "0.85rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E8E5DF" }}>
                    <label className={styles.label}>Completed Masterpiece Photograph</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.25rem" }}>
                      <div style={{ position: "relative", width: "100px", height: "70px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#EAE7E1", flexShrink: 0 }}>
                        <img
                          src={craftsmanshipHero.pageImages?.stage07_masterpiece || defaultCraftsmanshipPageImages.stage07_masterpiece}
                          alt="Stage 07 Masterpiece Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "220px" }}>
                        <input
                          type="text"
                          value={craftsmanshipHero.pageImages?.stage07_masterpiece ?? defaultCraftsmanshipPageImages.stage07_masterpiece}
                          onChange={(e) => updatePageImage("stage07_masterpiece", e.target.value)}
                          className={styles.input}
                          style={{ marginBottom: "0.4rem" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage07_masterpiece", url))}
                          style={{ fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 5. OTHER CRAFTSMANSHIP PAGE CONTENT                          */}
          {/* ============================================================ */}
          <div className={styles.tableCard} style={{ padding: "1.5rem", borderLeft: "4px solid var(--color-bronze)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--color-navy)", margin: 0 }}>
                    5. Other Craftsmanship Page Content
                  </h3>
                  <span className={styles.badge} style={{ backgroundColor: "#FAF0E6", color: "var(--color-bronze)", fontWeight: "700" }}>
                    📍 Dedicated to /craftsmanship
                  </span>
                </div>
                <p style={{ fontSize: "0.83rem", color: "#555", marginTop: "0.35rem" }}>
                  Visual assets and conversion banner appearing specifically on `/craftsmanship`.
                </p>
              </div>
              <button
                onClick={handleSaveCraftsmanship}
                className={styles.primaryBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Other Content"}
              </button>
            </div>

            {/* Independent Visual Content Overview */}
            <div style={{ marginBottom: "1.75rem", padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                Visual Assets Across /craftsmanship
              </h4>
              <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: "1rem" }}>
                Each independent photograph across the Craftsmanship page is individually editable and stored as its own field.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {/* Node 02 Image */}
                <div style={{ padding: "0.75rem", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E8E5DF" }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem" }}>Pathway Node 02 (Mapping) Image</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.pageImages?.node02 ?? defaultCraftsmanshipPageImages.node02}
                    onChange={(e) => updatePageImage("node02", e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => updatePageImage("node02", url))}
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>

                {/* Stage 03 Primary */}
                <div style={{ padding: "0.75rem", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E8E5DF" }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem" }}>Stage 03 Primary Carving Image</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.pageImages?.stage03_hero ?? defaultCraftsmanshipPageImages.stage03_hero}
                    onChange={(e) => updatePageImage("stage03_hero", e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage03_hero", url))}
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>

                {/* Stage 03 Secondary */}
                <div style={{ padding: "0.75rem", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E8E5DF" }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem" }}>Stage 03 Secondary Chisel Image</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.pageImages?.stage03_sub ?? defaultCraftsmanshipPageImages.stage03_sub}
                    onChange={(e) => updatePageImage("stage03_sub", e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage03_sub", url))}
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>

                {/* Stage 04 Facial */}
                <div style={{ padding: "0.75rem", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E8E5DF" }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem" }}>Stage 04 Sacred Facial Detail Image</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.pageImages?.stage04_facial ?? defaultCraftsmanshipPageImages.stage04_facial}
                    onChange={(e) => updatePageImage("stage04_facial", e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage04_facial", url))}
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>

                {/* Stage 04 Jali */}
                <div style={{ padding: "0.75rem", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E8E5DF" }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem" }}>Stage 04 Jali &amp; Floral Relief Image</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.pageImages?.stage04_jali ?? defaultCraftsmanshipPageImages.stage04_jali}
                    onChange={(e) => updatePageImage("stage04_jali", e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage04_jali", url))}
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>

                {/* Stage 05 Honing */}
                <div style={{ padding: "0.75rem", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E8E5DF" }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem" }}>Stage 05 Water-Stone Honing Image</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.pageImages?.stage05_honing ?? defaultCraftsmanshipPageImages.stage05_honing}
                    onChange={(e) => updatePageImage("stage05_honing", e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage05_honing", url))}
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>

                {/* Stage 07 Masterpiece */}
                <div style={{ padding: "0.75rem", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E8E5DF" }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem" }}>Stage 07 Completed Masterpiece Image</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.pageImages?.stage07_masterpiece ?? defaultCraftsmanshipPageImages.stage07_masterpiece}
                    onChange={(e) => updatePageImage("stage07_masterpiece", e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => updatePageImage("stage07_masterpiece", url))}
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>
              </div>
            </div>

            {/* Closing Inquiry CTA */}
            <div style={{ padding: "1.25rem", backgroundColor: "#FAF9F6", borderRadius: "8px", border: "1px solid #E5E1D8" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                Closing Inquiry CTA Banner (/craftsmanship)
              </h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>CTA Heading</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.closingCta?.heading ?? defaultClosingCta.heading}
                    onChange={(e) => updateClosingCta("heading", e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>CTA Description</label>
                  <textarea
                    rows={2}
                    value={craftsmanshipHero.closingCta?.description ?? defaultClosingCta.description}
                    onChange={(e) => updateClosingCta("description", e.target.value)}
                    className={styles.textarea}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primary Button Label</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.closingCta?.primaryCtaText ?? defaultClosingCta.primaryCtaText}
                    onChange={(e) => updateClosingCta("primaryCtaText", e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primary Destination URL</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.closingCta?.primaryCtaHref ?? defaultClosingCta.primaryCtaHref}
                    onChange={(e) => updateClosingCta("primaryCtaHref", e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secondary Button Label</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.closingCta?.secondaryCtaText ?? defaultClosingCta.secondaryCtaText}
                    onChange={(e) => updateClosingCta("secondaryCtaText", e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secondary Destination URL</label>
                  <input
                    type="text"
                    value={craftsmanshipHero.closingCta?.secondaryCtaHref ?? defaultClosingCta.secondaryCtaHref}
                    onChange={(e) => updateClosingCta("secondaryCtaHref", e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
