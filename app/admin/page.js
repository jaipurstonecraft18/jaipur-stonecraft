import Link from "next/link";
import getDB from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const db = getDB();

  const totalRow = db.prepare("SELECT COUNT(*) as total FROM products").get();
  const publishedRow = db.prepare("SELECT COUNT(*) as total FROM products WHERE status = 'published'").get();
  const draftRow = db.prepare("SELECT COUNT(*) as total FROM products WHERE status = 'draft'").get();
  const archivedRow = db.prepare("SELECT COUNT(*) as total FROM products WHERE status = 'archived'").get();
  const attentionRow = db.prepare("SELECT COUNT(*) as total FROM products WHERE short_description IS NULL OR short_description = '' OR primary_material_id IS NULL").get();

  const totalCount = totalRow ? totalRow.total : 0;
  const publishedCount = publishedRow ? publishedRow.total : 0;
  const draftCount = draftRow ? draftRow.total : 0;
  const archivedCount = archivedRow ? archivedRow.total : 0;
  const attentionCount = attentionRow ? attentionRow.total : 0;

  // Recent 5 products
  const recentRows = db.prepare("SELECT * FROM products ORDER BY updated_at DESC LIMIT 5").all();
  const recentProducts = recentRows.map(formatProductFromRow);

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Real-time snapshot of the Jaipur Stonecraft catalogue
          </p>
        </div>
        <Link href="/admin/products/new" className={styles.primaryBtn}>
          + Add New Product
        </Link>
      </div>

      {/* Snapshot Metrics Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Products</div>
          <div className={styles.statValue}>{totalCount}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Published</div>
          <div className={styles.statValue} style={{ color: "#137333" }}>
            {publishedCount}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Drafts</div>
          <div className={styles.statValue} style={{ color: "#B06000" }}>
            {draftCount}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Archived</div>
          <div className={styles.statValue} style={{ color: "#5F6368" }}>
            {archivedCount}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Needs Attention</div>
          <div className={styles.statValue} style={{ color: "#C5221F" }}>
            {attentionCount}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <Link href="/admin/products" className={styles.secondaryBtn}>
          📋 View Full Products List
        </Link>
        <Link href="/admin/products?status=draft" className={styles.secondaryBtn}>
          📝 View Drafts ({draftCount})
        </Link>
        <Link href="/admin/products?status=archived" className={styles.secondaryBtn}>
          📦 View Archived ({archivedCount})
        </Link>
      </div>

      {/* Recently Edited Products */}
      <div className={styles.tableCard}>
        <div className={styles.tableControls}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Recently Updated Products</h2>
          <Link href="/admin/products" style={{ color: "#9E7B4F", fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }}>
            View All ({totalCount}) →
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Cover</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Material</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={p.imageSrc}
                    alt={p.name}
                    className={styles.thumbImg}
                  />
                </td>
                <td style={{ fontWeight: "600" }}>
                  <Link href={`/admin/products/${p.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {p.name}
                  </Link>
                </td>
                <td><code style={{ fontSize: "0.8rem", color: "#555" }}>{p.sku}</code></td>
                <td>{p.parentCategory}</td>
                <td>{p.primaryMaterial?.name || p.primaryMaterialId}</td>
                <td>
                  <span className={`${styles.badge} ${p.status === "published" ? styles.badgePublished : p.status === "draft" ? styles.badgeDraft : styles.badgeArchived}`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className={styles.secondaryBtn}
                    style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
