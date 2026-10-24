"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [announcement, setAnnouncement] = useState({
    active: true,
    text: "✨ Worldwide Safe Export Shipping Available for Custom Marble Mandirs & Deity Statues",
    linkText: "Enquire Now",
    linkUrl: "/contact?type=custom"
  });

  const [contact, setContact] = useState({
    telephone: "+91 9664388920",
    whatsapp: "+91 9664388920",
    email: "Jaipurstonecraft18@gmail.com",
    address: "30, Industrial Area, Krisna Nagar a, Kartarpura, Gopal Pura Mode, Jaipur, Rajasthan 302015",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India"
  });

  const [social, setSocial] = useState({
    instagram: "",
    facebook: "",
    pinterest: "",
    youtube: ""
  });

  const [seoAudit, setSeoAudit] = useState({
    requireExactPrimarySearchPhrasePlacement: false,
    minTitleLength: 20,
    maxTitleLength: 120,
    recommendedSnippetDisplayMin: 30,
    recommendedSnippetDisplayMax: 65
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.announcement_bar?.value) {
            const val = data.settings.announcement_bar.value;
            setAnnouncement({
              active: val.active !== undefined ? Boolean(val.active) : true,
              text: val.text ?? "",
              linkText: val.linkText ?? "",
              linkUrl: val.linkUrl ?? ""
            });
          }
          if (data.settings.studio_contact?.value) {
            const val = data.settings.studio_contact.value;
            setContact({
              telephone: val.telephone ?? "",
              whatsapp: val.whatsapp ?? "",
              email: val.email ?? "",
              address: val.address ?? "",
              city: val.city ?? "",
              state: val.state ?? "",
              country: val.country ?? ""
            });
          }
          if (data.settings.social_links?.value) {
            const val = data.settings.social_links.value;
            setSocial({
              instagram: val.instagram ?? "",
              facebook: val.facebook ?? "",
              pinterest: val.pinterest ?? "",
              youtube: val.youtube ?? ""
            });
          }
          if (data.settings.seo_audit_settings?.value) {
            const val = data.settings.seo_audit_settings.value;
            setSeoAudit({
              requireExactPrimarySearchPhrasePlacement: Boolean(val.requireExactPrimarySearchPhrasePlacement),
              minTitleLength: val.minTitleLength !== undefined ? Number(val.minTitleLength) : 20,
              maxTitleLength: val.maxTitleLength !== undefined ? Number(val.maxTitleLength) : 120,
              recommendedSnippetDisplayMin: val.recommendedSnippetDisplayMin !== undefined ? Number(val.recommendedSnippetDisplayMin) : 30,
              recommendedSnippetDisplayMax: val.recommendedSnippetDisplayMax !== undefined ? Number(val.recommendedSnippetDisplayMax) : 65
            });
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleSaveSetting = async (keyName, valueData) => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName, value: valueData })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: `Successfully updated "${data.message}"!` });
      } else {
        setMessage({ type: "error", text: data.error || "Save failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Error saving settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading site settings...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>⚙️ Global Site Settings & Contact Details</h1>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.2rem" }}>
            Manage header announcement bar, studio telephone numbers, email address, and showroom location.
          </p>
        </div>

        <Link href="/contact" target="_blank" className={styles.publicSiteLink}>
          View Contact Page ↗
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

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* 1. HEADER ANNOUNCEMENT BAR */}
        <div className={styles.tabContentCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
              1. Header Announcement Bar
            </h3>
            <button
              onClick={() => handleSaveSetting("announcement_bar", announcement)}
              className={styles.primaryBtn}
              disabled={saving}
              style={{ minHeight: "44px" }}
            >
              Save Announcement
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="activeAnno"
                  checked={announcement.active}
                  onChange={(e) => setAnnouncement({ ...announcement, active: e.target.checked })}
                />
                <label htmlFor="activeAnno" className={styles.label}>
                  Show Announcement Bar on Top Navigation Header
                </label>
              </div>
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Announcement Text</label>
              <input
                type="text"
                value={announcement.text ?? ""}
                onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Button Link Text</label>
              <input
                type="text"
                value={announcement.linkText ?? ""}
                onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Button Link URL</label>
              <input
                type="text"
                value={announcement.linkUrl ?? ""}
                onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* 2. STUDIO CONTACT INFORMATION */}
        <div className={styles.tabContentCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
              2. Studio Contact Information
            </h3>
            <button
              onClick={() => handleSaveSetting("studio_contact", contact)}
              className={styles.primaryBtn}
              disabled={saving}
              style={{ minHeight: "44px" }}
            >
              Save Contact Details
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Official Telephone</label>
              <input
                type="text"
                value={contact.telephone ?? ""}
                onChange={(e) => setContact({ ...contact, telephone: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>WhatsApp Business Number</label>
              <input
                type="text"
                value={contact.whatsapp ?? ""}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Official Email Address</label>
              <input
                type="email"
                value={contact.email ?? ""}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Showroom & Workshop Address</label>
              <textarea
                rows={2}
                value={contact.address ?? ""}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input
                type="text"
                value={contact.city ?? ""}
                onChange={(e) => setContact({ ...contact, city: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>State</label>
              <input
                type="text"
                value={contact.state ?? ""}
                onChange={(e) => setContact({ ...contact, state: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* 3. SOCIAL MEDIA CHANNELS */}
        <div className={styles.tabContentCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
              3. Social Media Channels
            </h3>
            <button
              onClick={() => handleSaveSetting("social_links", social)}
              className={styles.primaryBtn}
              disabled={saving}
              style={{ minHeight: "44px" }}
            >
              Save Social Links
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Instagram Profile URL</label>
              <input
                type="text"
                value={social.instagram ?? ""}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Facebook Profile URL</label>
              <input
                type="text"
                value={social.facebook ?? ""}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Pinterest Profile URL</label>
              <input
                type="text"
                value={social.pinterest ?? ""}
                onChange={(e) => setSocial({ ...social, pinterest: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>YouTube Channel URL</label>
              <input
                type="text"
                value={social.youtube ?? ""}
                onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* 4. SEO QUALITY & AUDIT CONFIGURATION */}
        <div className={styles.tabContentCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
                4. SEO Quality & Audit Configuration
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.2rem 0 0" }}>
                Configure validation rules, character thresholds, and primary search phrase enforcement for catalogue SEO audits.
              </p>
            </div>
            <button
              onClick={() => handleSaveSetting("seo_audit_settings", seoAudit)}
              className={styles.primaryBtn}
              disabled={saving}
              style={{ minHeight: "44px" }}
            >
              Save SEO Settings
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="requireExactPlacement"
                  checked={seoAudit.requireExactPrimarySearchPhrasePlacement}
                  onChange={(e) => setSeoAudit({ ...seoAudit, requireExactPrimarySearchPhrasePlacement: e.target.checked })}
                />
                <label htmlFor="requireExactPlacement" className={styles.label}>
                  Require Exact Primary Search Phrase Placement
                </label>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#666", margin: "0.3rem 0 0 1.6rem" }}>
                When disabled (recommended), the primary search phrase serves as a valuable semantic reference for AI content generation and search intent without penalizing the product score or generating warnings when not placed verbatim in product title, summary, or name.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Maximum SEO Title Length (Characters)</label>
              <input
                type="number"
                min="50"
                max="250"
                value={seoAudit.maxTitleLength ?? 120}
                onChange={(e) => setSeoAudit({ ...seoAudit, maxTitleLength: parseInt(e.target.value, 10) || 120 })}
                className={styles.input}
              />
              <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "0.25rem" }}>
                Titles up to this limit remain valid descriptive metadata (recommended: 120 chars). Search engine snippets typically display 30–65 characters.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Minimum SEO Title Length (Characters)</label>
              <input
                type="number"
                min="10"
                max="60"
                value={seoAudit.minTitleLength ?? 20}
                onChange={(e) => setSeoAudit({ ...seoAudit, minTitleLength: parseInt(e.target.value, 10) || 20 })}
                className={styles.input}
              />
              <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "0.25rem" }}>
                Titles shorter than this threshold will be flagged as insufficiently descriptive (recommended: 20 chars).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
