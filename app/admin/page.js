import Link from "next/link";
import { query, getOne } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let totalCount = 0;
  let publishedCount = 0;
  let draftCount = 0;
  let archivedCount = 0;
  let attentionCount = 0;
  let newInquiriesCount = 0;
  let projectsCount = 0;
  let recentProducts = [];

  try {
    const totalRow = await getOne("SELECT COUNT(*) as total FROM products");
    const publishedRow = await getOne("SELECT COUNT(*) as total FROM products WHERE status = 'published'");
    const draftRow = await getOne("SELECT COUNT(*) as total FROM products WHERE status = 'draft'");
    const archivedRow = await getOne("SELECT COUNT(*) as total FROM products WHERE status = 'archived'");
    const attentionRow = await getOne("SELECT COUNT(*) as total FROM products WHERE short_description IS NULL OR short_description = '' OR primary_material_id IS NULL");
    
    let inquiriesRow = null;
    let projectsRow = null;
    try {
      inquiriesRow = await getOne("SELECT COUNT(*) as total FROM inquiries WHERE status = 'new'");
      projectsRow = await getOne("SELECT COUNT(*) as total FROM projects");
    } catch (tblErr) {}

    totalCount = totalRow ? totalRow.total : 0;
    publishedCount = publishedRow ? publishedRow.total : 0;
    draftCount = draftRow ? draftRow.total : 0;
    archivedCount = archivedRow ? archivedRow.total : 0;
    attentionCount = attentionRow ? attentionRow.total : 0;
    newInquiriesCount = inquiriesRow ? inquiriesRow.total : 0;
    projectsCount = projectsRow ? projectsRow.total : 0;

    const recentRows = await query("SELECT * FROM products ORDER BY updated_at DESC LIMIT 5");
    recentProducts = await Promise.all(recentRows.map(formatProductFromRow));
  } catch (e) {
    console.error("[Admin Dashboard DB Error]:", e);
  }

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Operational command center for Jaipur Stonecraft catalogue, website CMS, and customer leads.
          </p>
        </div>
        <Link href="/admin/products/new" className={styles.primaryBtn}>
          + Add New Product
        </Link>
      </div>

      {/* Snapshot Operational Metrics Grid */}
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
          <div className={styles.statLabel}>Needs Attention</div>
          <div className={styles.statValue} style={{ color: "#C5221F" }}>
            {attentionCount}
          </div>
        </div>

        <div className={styles.statCard} style={{ borderColor: newInquiriesCount > 0 ? "#C5221F" : "#E2DDD5", backgroundColor: newInquiriesCount > 0 ? "#FCE8E6" : "#FFF" }}>
          <div className={styles.statLabel}>New Customer Leads</div>
          <div className={styles.statValue} style={{ color: newInquiriesCount > 0 ? "#C5221F" : "var(--color-navy)" }}>
            {newInquiriesCount}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Portfolio Projects</div>
          <div className={styles.statValue} style={{ color: "var(--color-bronze)" }}>
            {projectsCount}
          </div>
        </div>
      </div>

      {/* Quick Action Workspace Links */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <Link href="/admin/products" className={styles.secondaryBtn}>
          📋 All Products ({totalCount})
        </Link>
        <Link href="/admin/health" className={styles.secondaryBtn} style={{ color: attentionCount > 0 ? "#C5221F" : "inherit" }}>
          🩺 Health Audit ({attentionCount})
        </Link>
        <Link href="/admin/inquiries" className={styles.secondaryBtn} style={{ fontWeight: "600", color: newInquiriesCount > 0 ? "#C5221F" : "inherit" }}>
          📬 Lead Inbox ({newInquiriesCount} New)
        </Link>
        <Link href="/admin/pages" className={styles.secondaryBtn}>
          📄 Website Page CMS
        </Link>
        <Link href="/admin/projects" className={styles.secondaryBtn}>
          🏛️ Projects Portfolio ({projectsCount})
        </Link>
        <Link href="/admin/settings" className={styles.secondaryBtn}>
          ⚙️ Site Settings
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
