# JAIPUR STONECRAFT — DATA RECONCILIATION REPORT

**Audit Snapshot Timestamp:** 2026-10-21T10:05:54+05:30  
**Methodology:** Side-by-side reconciliation of MySQL database tables against static code files, product relationships, routing handlers, and the sitemap.

---

## 1. High-Level Entity Reconciliation Matrix

| Entity Type | MySQL Total | MySQL Active | MySQL Inactive | Static Code (`content/`) | In Sitemap | Discrepancy / Explanation |
|---|---|---|---|---|---|---|
| **Collections** | 6 | 6 | 0 | 6 | 6 | **100% Reconciled**. All 6 exist in both DB and `content/collections.js`. |
| **Subcategories** | 43 | 20 | 23 | 20 | 20 | **23 inactive subcategories** in MySQL are omitted from static code and sitemap. |
| **Categories** | 121 | 60 | 61 | 60 | 60 | **61 inactive categories** in MySQL are omitted from static code and sitemap. |
| **Products** | 325 | 21 (pub) | 304 (draft) | 0 (all in DB) | 21 | **304 draft products** excluded from sitemap & catalogue; 40 products parked in `review-pending`. |
| **Product Images** | 1250 | 1250 | 0 | 0 (all in DB) | N/A | **100% Covered**. Every product has at least 1 image; 0 products have missing primary images. |

---

## 2. Product Counts by Collection

| Collection Slug | Database Records | Published | Draft | Archived | Populated Categories | Empty Active Categories |
|---|---|---|---|---|---|---|
| `sculptures-statues` | 131 | 19 | 112 | 0 | 20 | 6 |
| `temples-architectural-stonework` | 42 | 2 | 40 | 0 | 8 | 0 |
| `wall-art-reliefs` | 52 | 0 | 52 | 0 | 9 | 0 |
| `fountains-water-features` | 36 | 0 | 36 | 0 | 5 | 0 |
| `decorative-stone-art` | 36 *(+28 unmapped)* | 0 | 36 *(+28)* | 0 | 5 | 1 |
| `custom-bespoke-creations` | 28 *(+12 unmapped)* | 0 | 28 *(+12)* | 0 | 5 | 1 |
| **TOTALS** | **325** | **21** | **304** | **0** | **52** | **8** |

---

## 3. Detailed Discrepancy Log

### Discrepancy D-01: 40 Products Assigned to Non-Existent Taxonomy (`review-pending`)
- **Found in:** MySQL `products` table.
- **Details:** 40 product records have `parent_subcategory: 'review-pending'` and `parent_category: 'review-pending'`.
- **Root Cause:** Batch imports or data staging scripts inserted records with placeholder taxonomy pending client categorization.
- **Impact:** These products are live in the database and have direct URLs (`/designs/review-pending/[slug]`), but cannot be reached via navigation or sitemap.

### Discrepancy D-02: 304 Products Remain in Draft Status
- **Found in:** MySQL `products` table.
- **Details:** 93.5% of the catalog (304 out of 325 products) has `status = 'draft'`.
- **Impact:** Only 21 products appear in category listings and the public sitemap. The entire `wall-art-reliefs` (52 items), `fountains-water-features` (36 items), `decorative-stone-art` (64 items), and `custom-bespoke-creations` (40 items) collections have 0 published products on public category pages.

### Discrepancy D-03: 61 Inactive Categories & 23 Inactive Subcategories in MySQL
- **Found in:** MySQL `categories` and `subcategories` tables.
- **Details:** 61 category rows and 23 subcategory rows have `is_active = 0`. None of these records are defined in `content/categories.js` or `content/collections.js`.
- **Impact:** These represent legacy taxonomy nodes from an earlier schema version. They occupy database IDs but do not affect public front-end rendering.

### Discrepancy D-04: 8 Active Categories Have 0 Products
- **Found in:** Active categories list.
- **Details:** The following active categories currently have 0 assigned products:
  1. `marble-tulsi-pots` (`decorative-stone-art`)
  2. `custom-animal-figures` (`custom-bespoke-creations`)
  3. `abstract-form-sculptures` (`sculptures-statues`)
  4. `modernist-carvings` (`sculptures-statues`)
  5. `lakshmi-ji` (`sculptures-statues`)
  6. `bespoke-portrait-busts` (`sculptures-statues`)
  7. `full-body-figures` (`sculptures-statues`)
  8. `artisan-figures` (`sculptures-statues`)
- **Impact:** Visitors browsing these categories see empty product grids.

### Discrepancy D-05: Product URL Pattern vs Category Listing URL Pattern
- **Found in:** Routing architecture.
- **Details:** Category product listings follow `/collections/[collection]/[subcategory]/[category]`, but individual product detail pages follow `/designs/[category]/[design]`.
- **Impact:** The URL hierarchy flattens from 4 segments down to 2 segments. `/products/[slug]` redirects via 308 to `/designs/[category]/[slug]`.
