"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import QuickCreateProductModal from "@/components/admin/QuickCreateModal/QuickCreateProductModal";
import styles from "../admin.module.css";

export default function AdminProductsListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [healthCounts, setHealthCounts] = useState({ total: 0, healthy: 0, needsAttention: 0, incomplete: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter States
  const statusFilter = searchParams.get("status") || "all";
  const healthFilter = searchParams.get("health") || "all";
  const issueFilter = searchParams.get("issue") || "all";
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(searchQuery);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        health: healthFilter,
        issue: issueFilter,
        search: searchQuery,
        category: categoryFilter,
        page: page.toString(),
        pageSize: "16"
      });

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();

      if (data.products) {
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        if (data.healthCounts) {
          setHealthCounts(data.healthCounts);
        }
      }
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, healthFilter, searchQuery, categoryFilter, page]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) fetchProducts();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchProducts]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Execute bulk action '${action}' on ${selectedIds.length} selected product(s)?`)) return;

    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, productIds: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        fetchProducts();
      } else {
        alert(data.error || "Bulk action failed");
      }
    } catch (e) {
      alert("Error executing bulk action");
    }
  };

  const handleDuplicate = async (slug) => {
    if (!confirm("Duplicate this product record to create a new draft copy?")) return;

    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate" })
      });
      const data = await res.json();
      if (data.success && data.product) {
        router.push(`/admin/products/${data.product.slug}`);
      } else {
        alert(data.error || "Failed to duplicate product");
      }
    } catch (e) {
      alert("Error duplicating product");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products Catalogue</h1>
          <p style={{ color: "#666", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Manage, edit, publish, bulk update, and duplicate products in your persistent store
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", width: "100%", maxWidth: "340px" }}>
          <button onClick={() => setIsQuickCreateOpen(true)} className={styles.primaryBtn} style={{ flex: 1, justifyContent: "center" }}>
            ⚡ + Fast Draft
          </button>
          <Link href="/admin/products/new" className={styles.secondaryBtn} style={{ flex: 1, justifyContent: "center" }}>
            + Full Studio
          </Link>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div style={{
          padding: "0.85rem 1.25rem",
          backgroundColor: "#1A1918",
          color: "#FFF",
          borderRadius: "6px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>
            {selectedIds.length} product(s) selected
          </span>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={() => handleBulkAction("publish")} className={styles.primaryBtn} style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", minHeight: "38px" }}>
              🚀 Publish
            </button>
            <button onClick={() => handleBulkAction("feature")} className={styles.secondaryBtn} style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", minHeight: "38px" }}>
              ★ Feature
            </button>
            <button onClick={() => handleBulkAction("archive")} className={styles.secondaryBtn} style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", color: "#FF6B6B", minHeight: "38px" }}>
              📦 Archive
            </button>
          </div>
        </div>
      )}

      {/* COMPACT PRODUCT HEALTH DISCOVERY BAR */}
      <div style={{
        backgroundColor: "#FAF9F6",
        border: "1px solid #E2DDD5",
        borderRadius: "6px",
        padding: "0.75rem 1.25rem",
        marginBottom: "1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-navy)" }}>
            🏥 Health Discovery:
          </span>
          <span style={{ fontSize: "0.78rem", color: "#666" }}>
            Filter products by content & SEO readiness
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button
            onClick={() => updateFilters({ health: "all", page: 1 })}
            className={styles.secondaryBtn}
            style={{
              padding: "0.25rem 0.65rem",
              fontSize: "0.78rem",
              fontWeight: healthFilter === "all" ? "700" : "500",
              backgroundColor: healthFilter === "all" ? "var(--color-navy)" : "#FFF",
              color: healthFilter === "all" ? "#FFF" : "#333",
              borderColor: healthFilter === "all" ? "var(--color-navy)" : "#E2DDD5"
            }}
          >
            All ({healthCounts.total})
          </button>

          <button
            onClick={() => updateFilters({ health: "healthy", page: 1 })}
            className={styles.secondaryBtn}
            style={{
              padding: "0.25rem 0.65rem",
              fontSize: "0.78rem",
              fontWeight: healthFilter === "healthy" ? "700" : "500",
              backgroundColor: healthFilter === "healthy" ? "#137333" : "#FFF",
              color: healthFilter === "healthy" ? "#FFF" : "#137333",
              borderColor: healthFilter === "healthy" ? "#137333" : "#CEEAD6"
            }}
          >
            ✓ Healthy ({healthCounts.healthy})
          </button>

          <button
            onClick={() => updateFilters({ health: "needs_attention", page: 1 })}
            className={styles.secondaryBtn}
            style={{
              padding: "0.25rem 0.65rem",
              fontSize: "0.78rem",
              fontWeight: healthFilter === "needs_attention" ? "700" : "500",
              backgroundColor: healthFilter === "needs_attention" ? "#B06000" : "#FFF",
              color: healthFilter === "needs_attention" ? "#FFF" : "#B06000",
              borderColor: healthFilter === "needs_attention" ? "#B06000" : "#FCE8E6"
            }}
          >
            ⚠ Needs Attention ({healthCounts.needsAttention})
          </button>

          <button
            onClick={() => updateFilters({ health: "incomplete", page: 1 })}
            className={styles.secondaryBtn}
            style={{
              padding: "0.25rem 0.65rem",
              fontSize: "0.78rem",
              fontWeight: healthFilter === "incomplete" ? "700" : "500",
              backgroundColor: healthFilter === "incomplete" ? "#C5221F" : "#FFF",
              color: healthFilter === "incomplete" ? "#FFF" : "#C5221F",
              borderColor: healthFilter === "incomplete" ? "#C5221F" : "#FCE8E6"
            }}
          >
            ⛔ Critical / Incomplete ({healthCounts.incomplete})
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className={styles.tableCard}>
        <div className={styles.tableControls}>
          {/* Desktop Filter Pills */}
          <div className={`${styles.filterGroup} ${styles.desktopOnly}`}>
            <button
              onClick={() => updateFilters({ status: "all", page: 1 })}
              className={`${styles.secondaryBtn} ${statusFilter === "all" ? styles.primaryBtn : ""}`}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
            >
              All Statuses
            </button>
            <button
              onClick={() => updateFilters({ status: "published", page: 1 })}
              className={`${styles.secondaryBtn} ${statusFilter === "published" ? styles.primaryBtn : ""}`}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
            >
              Published
            </button>
            <button
              onClick={() => updateFilters({ status: "draft", page: 1 })}
              className={`${styles.secondaryBtn} ${statusFilter === "draft" ? styles.primaryBtn : ""}`}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
            >
              Drafts
            </button>
            <button
              onClick={() => updateFilters({ status: "archived", page: 1 })}
              className={`${styles.secondaryBtn} ${statusFilter === "archived" ? styles.primaryBtn : ""}`}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
            >
              Archived
            </button>
          </div>

          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className={`${styles.secondaryBtn} ${styles.mobileOnly}`}
            style={{ padding: "0.5rem 0.85rem", fontSize: "0.85rem", flex: 1, justifyContent: "center" }}
          >
            ⚙️ Filter: {statusFilter.toUpperCase()}
          </button>

          {/* Issue Category Select Dropdown */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select
              value={issueFilter}
              onChange={(e) => updateFilters({ issue: e.target.value, page: 1 })}
              className={styles.select}
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem", minWidth: "180px", cursor: "pointer" }}
            >
              <option value="all">Filter by Issue (All)</option>
              <option value="primary_image">📷 Missing Primary Image</option>
              <option value="product_images">🖼 Missing Product Images</option>
              <option value="meta_description">📝 Missing Meta Description</option>
              <option value="primary_keyword">🔍 Missing Primary Search Phrase</option>
              <option value="image_alt_texts">🏷 Missing Image Alt Texts</option>
              <option value="short_description">📄 Missing Short Description</option>
              <option value="detailed_description">📖 Missing Detailed Copy</option>
              <option value="seo_title">🏷 Suboptimal SEO Title</option>
              <option value="category">📁 Missing Category Placement</option>
              <option value="primary_material">🪨 Missing Primary Material</option>
            </select>
          </div>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters({ search: searchInput, page: 1 });
            }}
            style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: "340px" }}
          >
            <input
              type="text"
              placeholder="Smart search (typo tolerant)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
              style={{ flex: 1 }}
            />
            <button type="submit" className={styles.secondaryBtn} style={{ padding: "0.5rem 0.85rem" }}>
              Search
            </button>
          </form>
        </div>

        {/* DESKTOP TABLE VIEW (> 768px) */}
        <div className={styles.desktopOnly}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={products.length > 0 && selectedIds.length === products.length}
                  />
                </th>
                <th style={{ width: "60px" }}>Cover</th>
                <th>Product Name</th>
                <th>SKU / Slug</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ width: "210px" }}>Health Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
                    Loading product catalogue...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleSelectRow(p.id)}
                      />
                    </td>
                    <td>
                      <img src={p.imageSrc} alt={p.name} className={styles.thumbImg} />
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      <Link href={`/admin/products/${p.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {p.name}
                      </Link>
                    </td>
                    <td>
                      <code style={{ fontSize: "0.78rem", color: "#555" }}>{p.sku}</code>
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>/{p.slug}</div>
                    </td>
                    <td>{p.parentCategory}</td>
                    <td>
                      <span className={`${styles.badge} ${p.status === "published" ? styles.badgePublished : p.status === "draft" ? styles.badgeDraft : styles.badgeArchived}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span className={`${styles.badge} ${
                          p.health?.status === "ready" 
                            ? styles.badgeHealthy 
                            : p.health?.status === "needs_attention" 
                            ? styles.badgeAttention 
                            : styles.badgeIncomplete
                        }`}>
                          {p.health?.status === "ready" ? "✓ Healthy" : p.health?.status === "needs_attention" ? "⚠ Attention" : "⛔ Incomplete"}
                        </span>
                        {p.health?.issueSummary && p.health?.status !== "ready" && (
                          <span style={{ fontSize: "0.72rem", color: "#777", lineHeight: "1.2" }}>
                            {p.health.issueSummary}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                        <Link
                          href={`/admin/products/${p.slug}`}
                          className={styles.secondaryBtn}
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", minHeight: "36px" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p.slug)}
                          className={styles.secondaryBtn}
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", minHeight: "36px" }}
                          title="Duplicate Product Draft"
                        >
                          📋 Clone
                        </button>
                        {p.status === "published" && (
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className={styles.secondaryBtn}
                            style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem", minHeight: "36px" }}
                            title="Preview Public Page"
                          >
                            ↗
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW (<= 768px) */}
        <div className={`${styles.mobileCardList} ${styles.mobileOnly}`}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2.5rem", color: "#888" }}>
              Loading product catalogue...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem", color: "#888" }}>
              No products found matching criteria.
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className={styles.mobileProductCard}>
                <div className={styles.mobileCardHeader}>
                  <img src={p.imageSrc} alt={p.name} className={styles.mobileCardImg} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <h3 className={styles.mobileCardTitle}>
                        <Link href={`/admin/products/${p.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {p.name}
                        </Link>
                      </h3>
                      <span className={`${styles.badge} ${p.status === "published" ? styles.badgePublished : p.status === "draft" ? styles.badgeDraft : styles.badgeArchived}`}>
                        {p.status}
                      </span>
                    </div>

                    <div className={styles.mobileCardMeta}>
                      <code>{p.sku}</code>
                      <span>•</span>
                      <span>{p.parentCategory}</span>
                    </div>

                    <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span className={`${styles.badge} ${
                        p.health?.status === "ready" 
                          ? styles.badgeHealthy 
                          : p.health?.status === "needs_attention" 
                          ? styles.badgeAttention 
                          : styles.badgeIncomplete
                      }`}>
                        {p.health?.status === "ready" ? "✓ Healthy" : p.health?.status === "needs_attention" ? "⚠ Attention" : "⛔ Incomplete"}
                      </span>
                      {p.health?.issueSummary && p.health?.status !== "ready" && (
                        <span style={{ fontSize: "0.72rem", color: "#777", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.health.issueSummary}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.mobileCardActions}>
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className={`${styles.secondaryBtn} ${styles.mobileCardBtn}`}
                  >
                    Edit Studio →
                  </Link>
                  <button
                    onClick={() => handleDuplicate(p.slug)}
                    className={`${styles.secondaryBtn} ${styles.mobileCardBtn}`}
                  >
                    📋 Clone
                  </button>
                  {p.status === "published" && (
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className={`${styles.secondaryBtn} ${styles.mobileCardBtn}`}
                      style={{ flex: "0 0 44px" }}
                    >
                      ↗
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Bar */}
        <div className={styles.pagination}>
          <div>
            Page {page} of {totalPages} ({totalCount} items)
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              disabled={page <= 1}
              onClick={() => updateFilters({ page: page - 1 })}
              className={styles.secondaryBtn}
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", minHeight: "40px" }}
            >
              ← Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => updateFilters({ page: page + 1 })}
              className={styles.secondaryBtn}
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", minHeight: "40px" }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET */}
      {isFilterSheetOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end"
          }}
          onClick={() => setIsFilterSheetOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Filter Catalogue Products</h3>
              <button onClick={() => setIsFilterSheetOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem" }}>
                &times;
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <button
                onClick={() => { updateFilters({ status: "all", page: 1 }); setIsFilterSheetOpen(false); }}
                className={`${styles.secondaryBtn} ${statusFilter === "all" ? styles.primaryBtn : ""}`}
                style={{ justifyContent: "center", width: "100%", minHeight: "48px" }}
              >
                All Products ({totalCount})
              </button>
              <button
                onClick={() => { updateFilters({ status: "published", page: 1 }); setIsFilterSheetOpen(false); }}
                className={`${styles.secondaryBtn} ${statusFilter === "published" ? styles.primaryBtn : ""}`}
                style={{ justifyContent: "center", width: "100%", minHeight: "48px" }}
              >
                Published Products
              </button>
              <button
                onClick={() => { updateFilters({ status: "draft", page: 1 }); setIsFilterSheetOpen(false); }}
                className={`${styles.secondaryBtn} ${statusFilter === "draft" ? styles.primaryBtn : ""}`}
                style={{ justifyContent: "center", width: "100%", minHeight: "48px" }}
              >
                Draft Products
              </button>
              <button
                onClick={() => { updateFilters({ status: "archived", page: 1 }); setIsFilterSheetOpen(false); }}
                className={`${styles.secondaryBtn} ${statusFilter === "archived" ? styles.primaryBtn : ""}`}
                style={{ justifyContent: "center", width: "100%", minHeight: "48px" }}
              >
                Archived Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fast Create Modal */}
      <QuickCreateProductModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />
    </div>
  );
}
