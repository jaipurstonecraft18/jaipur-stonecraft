# JAIPUR STONECRAFT — CURRENT-STATE TAXONOMY & PRODUCT INVENTORY AUDIT
## EXECUTIVE SUMMARY & ACTIONABLE AUDIT REPORT

**Audit Date & Timestamp:** 2026-10-21T10:05:54+05:30  
**Audit Type:** Strict Read-Only Current-State Audit (Zero modifications, zero deployments)  
**Database Snapshot:** Local MySQL Workspace (`jaipur_stonecraft`)  
**Application Base:** Next.js App Router (Active server at `http://localhost:3000/` & Wi-Fi `http://192.168.29.36:3000/`)

---

## 1. Verified Inventory At-A-Glance

```
├── Total Collections:        6 (6 active, 0 inactive)
├── Total Subcategories:     43 (20 active, 23 inactive)
├── Total Categories:       121 (60 active, 61 inactive)
├── Total Products:         325 (21 published, 304 draft, 0 archived)
└── Total Product Images:  1,250 (100% products have images, 100% have primary image)
```

---

## 2. Deliverables Index

All detailed artifacts have been generated in [docs/audits/2026-10-21-taxonomy-audit/](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/):

1. **Master Hierarchy Document:** [`MASTER-HIERARCHY.md`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/MASTER-HIERARCHY.md)  
   Contains complete flowcharts per collection and expandable trees detailing all 325 products.
2. **Product-Level Inventory (CSV):** [`PRODUCT-INVENTORY.csv`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/PRODUCT-INVENTORY.csv)  
   Full 325-row tabular inventory with SKUs, slugs, URLs, canonicals, image counts, and validity flags.
3. **Product-Level Inventory (JSON):** [`PRODUCT-INVENTORY.json`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/PRODUCT-INVENTORY.json)  
   Machine-readable export of all 325 product records.
4. **Taxonomy Inventory:** [`TAXONOMY-INVENTORY.md`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/TAXONOMY-INVENTORY.md) and [`TAXONOMY-INVENTORY.json`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/TAXONOMY-INVENTORY.json)  
   Complete breakdown of all 6 collections, 43 subcategories, and 121 categories.
5. **Disconnected-Page Register:** [`DISCONNECTED-PAGE-REGISTER.md`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/DISCONNECTED-PAGE-REGISTER.md)  
   Complete documentation of empty categories, draft products, unmapped `review-pending` items, and legacy redirects.
6. **Route & SEO Inventory:** [`ROUTE-SEO-INVENTORY.md`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/ROUTE-SEO-INVENTORY.md)  
   Verified URL patterns, HTTP test responses, robots signals, and sitemap generation rules.
7. **Data Reconciliation Report:** [`DATA-RECONCILIATION-REPORT.md`](file:///d:/jsc/jsc%20web1/docs/audits/2026-10-21-taxonomy-audit/DATA-RECONCILIATION-REPORT.md)  
   Detailed reconciliation matrix between MySQL, `content/` static files, and sitemap.

---

## 3. Key Findings & Structural Anomalies

### 3.1 The "Published vs Draft" Disconnect
- Only **21 products** (6.5%) are in `published` status.
- **304 products** (93.5%) are in `draft` status.
- Because `getProductsByCategory` filters with `status = 'published'`, 4 out of the 6 main collections have **ZERO published products** visible to customers on public category listing pages:
  - `wall-art-reliefs`: 52 products in DB, 0 visible.
  - `fountains-water-features`: 36 products in DB, 0 visible.
  - `decorative-stone-art`: 64 products in DB, 0 visible.
  - `custom-bespoke-creations`: 40 products in DB, 0 visible.
- However, if a user accesses `/designs/[category]/[design]` directly via URL, draft products **render 200 OK** because the detail route does not check publication status.

### 3.2 The 40 Unmapped Exception Products
- Exactly 40 products have `parent_subcategory: 'review-pending'` and `parent_category: 'review-pending'`.
- Neither `review-pending` category nor subcategory exists in the database taxonomy tables.
- They are completely orphaned from site navigation, but directly renderable at `/designs/review-pending/[slug]`.

### 3.3 Active Categories with Zero Products
- 8 active categories contain 0 assigned products in the database.
- Example: `marble-tulsi-pots`, `lakshmi-ji`, `bespoke-portrait-busts`.

### 3.4 Inactive Taxonomy Residue
- 61 categories and 23 subcategories in MySQL are marked `is_active = 0` and are completely absent from the static code definitions in `content/`.

---

## 4. Final Validation & Compliance Statement

- [x] Product count verified: exactly 325 products in database snapshot; exactly 325 products exported in master inventory.
- [x] Every product record appears exactly once in the master inventory.
- [x] All 6 collections, 43 subcategories, and 121 categories are accounted for.
- [x] Products with invalid parent assignments are documented in a dedicated exception register.
- [x] All reported URLs are verified from codebase configuration and live HTTP tests.
- [x] **PROTECTED CONSTRAINTS CONFIRMATION:**
  - Zero database records modified, inserted, or deleted.
  - Zero taxonomy definitions or product assignments altered.
  - `sculptures-statues` taxonomy strictly preserved without touch.
  - Zero migration scripts run.

**Status:** Complete. Awaiting user review before any redesign or modification planning.
