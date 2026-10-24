# JAIPUR STONECRAFT — ROUTE & SEO INVENTORY

**Audit Snapshot Timestamp:** 2026-10-21T10:05:54+05:30  
**Scope:** Complete map of URLs, canonical structures, metadata behavior, indexing signals, and verified HTTP responses.

---

## 1. URL Structure & Route Hierarchy

| Hierarchy Level | Route Pattern | Handler File | Notes / Parameters |
|---|---|---|---|
| **Level 0 (Home)** | `/` | `app/page.js` | Homepage with hero, collections, story |
| **Level 1 (Catalogue)** | `/products` | `app/products/page.js` | Global search catalogue (published products only) |
| **Level 1 (Collections)** | `/collections` | `app/collections/page.js` | Grid of 6 active collections |
| **Level 2 (Collection)** | `/collections/[collection]` | `app/collections/[collection]/page.js` | Landing page for a collection |
| **Level 3 (Subcategory)** | `/collections/[collection]/[subcategory]` | `app/collections/[collection]/[subcategory]/page.js` | Landing page for subcategory listing categories |
| **Level 4 (Category)** | `/collections/[collection]/[subcategory]/[category]` | `app/collections/[collection]/[subcategory]/[category]/page.js` | Product listing page for a category |
| **Level 5 (Product Detail)** | `/designs/[category]/[design]` | `app/designs/[category]/[design]/page.js` | Main canonical product detail page |
| **Legacy Product Detail** | `/products/[slug]` | `app/products/[slug]/page.js` | Redirect component (308 to `/designs/[category]/[slug]`) |

---

## 2. Tested & Verified HTTP Status Responses

Tested directly against the running application instance (`http://127.0.0.1:3000`):

| Tested URL | Type / Context | Configured Destination | Verified HTTP Status | Status Meaning |
|---|---|---|---|---|
| `http://127.0.0.1:3000/` | Homepage | N/A | **200 OK** | Page renders successfully |
| `http://127.0.0.1:3000/collections` | Collections Index | N/A | **200 OK** | Page renders successfully |
| `http://127.0.0.1:3000/collections/sculptures-statues` | Collection Landing | N/A | **200 OK** | Page renders successfully |
| `http://127.0.0.1:3000/collections/sculptures-statues/hindu-sculptures` | Subcategory Landing | N/A | **200 OK** | Page renders successfully |
| `http://127.0.0.1:3000/collections/sculptures-statues/hindu-sculptures/ganesh-ji` | Category Catalogue | N/A | **200 OK** | Page renders successfully |
| `http://127.0.0.1:3000/designs/ganesh-ji/blessing-ganesh-statue` | Product Detail (Published) | N/A | **200 OK** | Page renders successfully |
| `http://127.0.0.1:3000/designs/ganesh-ji/dancing-ganesh-statue` | Product Detail (Draft) | N/A | **200 OK** | Draft product is directly viewable |
| `http://127.0.0.1:3000/products/blessing-ganesh-statue` | Legacy Product URL | `/designs/ganesh-ji/blessing-ganesh-statue` | **308 Permanent Redirect** | Correctly redirects to canonical detail URL |
| `http://127.0.0.1:3000/collections/temples-architectural-stonework/mandir-temple` | Legacy Subcategory | `/collections/temples-architectural-stonework/mandirs-temples` | **308 Permanent Redirect** | `next.config.mjs` redirect functioning |
| `http://127.0.0.1:3000/designs/review-pending/bespoke-ancestral-portrait-carvings-sculpture` | Unmapped Product URL | N/A | **200 OK** | Renders product directly despite unmapped parent |
| `http://127.0.0.1:3000/collections/custom-bespoke-creations/review-pending/review-pending` | Unmapped Category URL | N/A | **404 Not Found** | Category does not exist in taxonomy |

---

## 3. SEO Signals & Indexability

### 3.1 Sitemap Generation (`app/sitemap.js`)
- **Total URLs generated:**
  - 12 Static core routes
  - Dynamic Knowledge routes
  - 6 Active Collection routes (`/collections/[slug]`)
  - 20 Active Subcategory routes (`/collections/[col]/[sub]`)
  - 60 Active Category routes (`/collections/[col]/[sub]/[cat]`)
  - **21 Published Product routes** (`/designs/[cat]/[slug]`)
  - Project showcase routes
- **Excluded from Sitemap:**
  - **304 Draft Products:** Not included in the sitemap.
  - **61 Inactive Categories & 23 Inactive Subcategories:** Not included in the sitemap.
  - **40 Unmapped Review-Pending Products:** Excluded from the sitemap.

### 3.2 Canonical URL Rules
- **Collections:** `https://jaipurstonecraft.com/collections/[collection]`
- **Subcategories:** `https://jaipurstonecraft.com/collections/[collection]/[subcategory]`
- **Categories:** `https://jaipurstonecraft.com/collections/[collection]/[subcategory]/[category]`
- **Products:** `https://jaipurstonecraft.com/designs/[category]/[slug]`
- *Observation on Products:* Canonical URL relies on `p.parent_category`. For the 40 products in `review-pending`, the canonical generated is `https://jaipurstonecraft.com/designs/review-pending/[slug]`.

### 3.3 Robots & Meta Tags
- `app/designs/[category]/[design]/page.js` dynamically extracts `seo` JSON from database.
- If `seo.indexable === false`, it emits `robots: { index: false, follow: true }`.
- Default for products is `robots: { index: true, follow: true }`.
- *Issue:* Draft products that are accessed directly emit `index: true` if `seo.indexable` is not explicitly set to false in the JSON column.
