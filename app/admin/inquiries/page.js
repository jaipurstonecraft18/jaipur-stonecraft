"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchInquiries = () => {
    setLoading(true);
    fetch(`/api/admin/inquiries?status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.inquiries) setInquiries(data.inquiries);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus, notes) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, adminNotes: notes })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus, admin_notes: notes });
        }
        fetchInquiries();
      } else {
        alert(data.error || "Update failed");
      }
    } catch (e) {
      alert("Error updating inquiry");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return styles.badgeIncomplete;
      case "contacted":
        return styles.badgeDraft;
      case "in_progress":
        return styles.badgeAttention;
      case "quoted":
        return styles.badgeHealthy;
      case "closed":
        return styles.badgeArchived;
      default:
        return styles.badgeDraft;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>📬 Customer Inquiries & Quote Requests</h1>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.2rem" }}>
            Operational lead desk for bespoke project inquiries submitted via website contact forms.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.studioTabs}>
        <button
          className={`${styles.studioTab} ${statusFilter === "all" ? styles.studioTabActive : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All Inquiries ({inquiries.length})
        </button>
        <button
          className={`${styles.studioTab} ${statusFilter === "new" ? styles.studioTabActive : ""}`}
          onClick={() => setStatusFilter("new")}
        >
          🔴 New Leads
        </button>
        <button
          className={`${styles.studioTab} ${statusFilter === "contacted" ? styles.studioTabActive : ""}`}
          onClick={() => setStatusFilter("contacted")}
        >
          🟡 Contacted
        </button>
        <button
          className={`${styles.studioTab} ${statusFilter === "quoted" ? styles.studioTabActive : ""}`}
          onClick={() => setStatusFilter("quoted")}
        >
          🟢 Quoted / Active
        </button>
        <button
          className={`${styles.studioTab} ${statusFilter === "closed" ? styles.studioTabActive : ""}`}
          onClick={() => setStatusFilter("closed")}
        >
          ⚪ Closed / Archived
        </button>
      </div>

      {/* Inquiries Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading customer leads...</div>
        ) : inquiries.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Customer Name</th>
                <th>Contact Details</th>
                <th>Inquiry Type</th>
                <th>Date Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadgeClass(inq.status)}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td>
                    <strong style={{ display: "block", color: "var(--color-navy)" }}>{inq.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>ID: {inq.id}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem" }}>
                      <a href={`mailto:${inq.email}`} style={{ color: "var(--color-bronze)", display: "block" }}>
                        ✉️ {inq.email}
                      </a>
                      {inq.phone && (
                        <a href={`tel:${inq.phone}`} style={{ color: "#555", display: "block", fontSize: "0.8rem" }}>
                          📞 {inq.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={styles.badge} style={{ backgroundColor: "#F0ECE6", color: "var(--color-navy)" }}>
                      {inq.inquiry_type || "Custom"}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "#666" }}>
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className={styles.primaryBtn}
                      style={{ padding: "0.3rem 0.65rem", fontSize: "0.78rem", minHeight: "32px" }}
                    >
                      View Details & Notes ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
            No customer inquiries found under status filter &ldquo;{statusFilter}&rdquo;.
          </div>
        )}
      </div>

      {/* DETAIL INSPCTOR DRAWER / MODAL */}
      {selectedInquiry && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem"
        }}>
          <div style={{
            backgroundColor: "#FFF",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "1.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid #E2DDD5", paddingBottom: "0.75rem" }}>
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "600", color: "var(--color-navy)" }}>
                  Inquiry: {selectedInquiry.name}
                </h2>
                <span style={{ fontSize: "0.75rem", color: "#888" }}>Received on {new Date(selectedInquiry.created_at).toLocaleString()}</span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#666" }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "#FAF9F6", borderRadius: "6px", border: "1px solid #E2DDD5" }}>
                <h4 style={{ fontSize: "0.85rem", color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
                  Customer Contact Channels
                </h4>
                <p style={{ margin: "0 0 0.35rem 0", fontSize: "0.95rem", fontWeight: "600" }}>{selectedInquiry.name}</p>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.88rem" }}>✉️ Email: <a href={`mailto:${selectedInquiry.email}`} style={{ color: "var(--color-bronze)" }}>{selectedInquiry.email}</a></p>
                <p style={{ margin: "0", fontSize: "0.88rem" }}>📞 Phone: <a href={`tel:${selectedInquiry.phone}`} style={{ color: "var(--color-bronze)" }}>{selectedInquiry.phone || "Not provided"}</a></p>
              </div>

              <div>
                <h4 style={{ fontSize: "0.85rem", color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.35rem" }}>
                  Project Requirements Message
                </h4>
                <div style={{ padding: "1rem", backgroundColor: "#FFF", borderRadius: "6px", border: "1px solid #E2DDD5", whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Picker & Admin Notes */}
              <div style={{ borderTop: "1px solid #E2DDD5", paddingTop: "1rem" }}>
                <label className={styles.label}>Lead Status</label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value })}
                  className={styles.select}
                  style={{ width: "100%", marginBottom: "1rem" }}
                >
                  <option value="new">🔴 New (Unread / Action Required)</option>
                  <option value="contacted">🟡 Contacted Client</option>
                  <option value="in_progress">🟠 In Progress / Estimating</option>
                  <option value="quoted">🟢 Quoted Sent</option>
                  <option value="closed">⚪ Closed / Archived</option>
                </select>

                <label className={styles.label}>Internal Admin Notes</label>
                <textarea
                  rows={3}
                  value={selectedInquiry.admin_notes || ""}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, admin_notes: e.target.value })}
                  placeholder="e.g. Sent Makrana marble quote for 4ft statue on Aug 26..."
                  className={styles.textarea}
                  style={{ width: "100%", marginBottom: "1rem" }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className={styles.secondaryBtn}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, selectedInquiry.status, selectedInquiry.admin_notes)}
                    className={styles.primaryBtn}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Status & Notes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
