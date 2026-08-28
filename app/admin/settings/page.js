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
    telephone: "+91 70147 53278",
    whatsapp: "+91 70147 53278",
    email: "Jaipurstonecraft18@gmail.com",
    address: "30, Industrial Area, Krisna Nagar a, Kartarpura, Gopal Pura Mode, Jaipur, Rajasthan 302015",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India"
  });

  const [social, setSocial] = useState({
    instagram: "https://instagram.com/jaipurstonecraft",
    facebook: "https://facebook.com/jaipurstonecraft",
    pinterest: "https://pinterest.com/jaipurstonecraft",
    youtube: "https://youtube.com/@jaipurstonecraft"
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.announcement_bar) setAnnouncement(data.settings.announcement_bar.value);
          if (data.settings.studio_contact) setContact(data.settings.studio_contact.value);
          if (data.settings.social_links) setSocial(data.settings.social_links.value);
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
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
              1. Header Announcement Bar
            </h3>
            <button
              onClick={() => handleSaveSetting("announcement_bar", announcement)}
              className={styles.primaryBtn}
              disabled={saving}
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
                value={announcement.text}
                onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Button Link Text</label>
              <input
                type="text"
                value={announcement.linkText}
                onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Button Link URL</label>
              <input
                type="text"
                value={announcement.linkUrl}
                onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* 2. STUDIO CONTACT INFORMATION */}
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
              2. Studio Contact Information
            </h3>
            <button
              onClick={() => handleSaveSetting("studio_contact", contact)}
              className={styles.primaryBtn}
              disabled={saving}
            >
              Save Contact Details
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Official Telephone</label>
              <input
                type="text"
                value={contact.telephone}
                onChange={(e) => setContact({ ...contact, telephone: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>WhatsApp Business Number</label>
              <input
                type="text"
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Official Email Address</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Showroom & Workshop Address</label>
              <textarea
                rows={2}
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input
                type="text"
                value={contact.city}
                onChange={(e) => setContact({ ...contact, city: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>State</label>
              <input
                type="text"
                value={contact.state}
                onChange={(e) => setContact({ ...contact, state: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* 3. SOCIAL MEDIA CHANNELS */}
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--color-navy)" }}>
              3. Social Media Channels
            </h3>
            <button
              onClick={() => handleSaveSetting("social_links", social)}
              className={styles.primaryBtn}
              disabled={saving}
            >
              Save Social Links
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Instagram Profile URL</label>
              <input
                type="text"
                value={social.instagram}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Facebook Profile URL</label>
              <input
                type="text"
                value={social.facebook}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Pinterest Profile URL</label>
              <input
                type="text"
                value={social.pinterest}
                onChange={(e) => setSocial({ ...social, pinterest: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>YouTube Channel URL</label>
              <input
                type="text"
                value={social.youtube}
                onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
