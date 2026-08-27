# JAIPUR STONECRAFT — ADMIN PANEL PRESERVATION & INTEGRATION PLAN
**Document Version**: 1.0.0  
**Date**: August 26, 2026  
**Status**: AUDIT & PLANNING COMPLETE — NO CODE OR DATABASE CHANGES IMPLEMENTED  
**Guiding Principle**: **EXTEND + CONNECT + MODERNIZE** (Zero destruction of existing Product Studio or Taxonomy workflows)

---

## 1. EXECUTIVE SUMMARY

### Strategic Objective
The Jaipur Stonecraft website has recently undergone a major editorial, architectural, and visual redesign. The purpose of this Integration Plan is to modernize the Admin Studio so that **100% of public website sections, page copy, case studies, lead inquiries, and media are manageable from Admin**, while **strictly protecting and preserving the existing, highly-developed Product Studio and Catalogue Taxonomy workflows**.

### Absolute Preservation Mandate
As established by project directives and code analysis:
* **DO NOT rebuild the Admin Panel from scratch.**
* **DO NOT replace or simplify Product Studio** (`components/admin/ProductStudio/ProductStudio.js`).
* **DO NOT alter existing SKU, database schema, or image compression pipelines.**
* **DO NOT remove existing Catalogue Taxonomy workflows** (Categories, Collections, Materials, Subjects, Product Types, Attributes).
* **DO NOT delete or refactor working business rules** (Product Health Auditor, Autosave engine, Sharp WebP variant generation).

### Integration Philosophy
Instead of replacing existing code, the modernized Admin Studio will **wrap around the existing foundation**:

```
                              EXISTING PROTECTED CORE
                     ┌───────────────────────────────────────┐
                     │ • Product Studio Editor               │
                     │ • Product Health Discovery Queue      │
                     │ • Catalogue & Taxonomy Manager        │
                     │ • Sharp WebP 4-Variant Upload Engine  │
                     └───────────────────┬───────────────────┘
                                         │
                                   EXTEND & CONNECT
                                         │
               ┌─────────────────────────┼─────────────────────────┐
               ▼                         ▼                         ▼
      NEW Page CMS Manager      NEW Projects Portfolio      NEW Customer Inquiries
      (/admin/pages)            (/admin/projects)           (/admin/inquiries)
      • Homepage Editor         • Case Studies CRUD         • Quote Request Viewer
      • Our Story Editor        • Photo Gallery             • Lead Status Tracker
      • Craftsmanship Editor    • Linked DB Products        • Custom Project Inbox
```

---

## 2. INVENTORY OF PROTECTED EXISTING FUNCTIONALITY

The following existing Admin modules represent significant development effort and must survive the modernization intact:

| Protected Module | Route / File Path | Key Components Involved | API Endpoints | Database Tables | Preserved Functionality |
|---|---|---|---|---|---|
| **Product Studio** | `/admin/products/[slug]`, `/admin/products/new` | `ProductStudio.js`, `ImageStudio.js`, `SeoReadinessPanel.js`, `AiAssistantModal.js`, `FieldAiActions.js` | `/api/admin/products`, `/api/admin/products/[id]` | `products`, `product_images` | 5-Tab studio editor, 2.5s debounced autosave, SKU generator, auto-slug sync, Knowledge Layer JSON normalizer, Dynamic FAQs, Sizing dimensions array, SEO readiness score (0–100%). |
| **Product Health Queue** | `/admin/health`, `/admin/products` | `AdminProductsListPage.js`, `HealthCounts` bar | `/api/admin/products` (query params `health`, `issue`) | `products` (dynamic evaluation) | Automated 10-rule quality auditor flagging missing primary images, missing alt texts, empty descriptions, or category placement issues. |
| **Catalogue Taxonomy** | `/admin/catalogue` | `AdminCataloguePage.js`, `QuickAddModal.js` | `/api/admin/catalogue`, `/api/admin/categories` | `categories`, `collections`, `subcategories`, `materials`, `subjects`, `product_types`, `attribute_definitions` | 6-Tab management interface for Categories, Collections, Materials, Sacred Subjects, Product Types, and Custom Attributes. Soft archiving (`is_active`), photo uploads, usage counters. |
| **Media Upload Engine** | `/api/admin/upload` | `upload/route.js`, Sharp node module | `/api/admin/upload` | File system: `/public/uploads/` | Byte-level image verification, EXIF auto-rotation, metadata stripping, 4 WebP variants (Raw, Display 1920px, Card 1080px, Thumb 400px). |
| **Quick Product Creation** | `/admin/products` | `QuickCreateProductModal.js` | `/api/admin/products` | `products` | Fast draft modal allowing instant creation of a product SKU with basic title, category, material, and initial image upload in <10 seconds. |
| **Bulk Actions Engine** | `/admin/products` | `AdminProductsListPage.js` | `/api/admin/products/bulk` | `products` | Batch operations enabling multi-select Publish, Feature (`is_featured`), or Archive on catalogue items. |

---

## 3. DETAILED PRODUCT STUDIO PRESERVATION MAP

The `ProductStudio.js` component (1,286 lines of code) is the central product engine. The table below details every tab, field, and business rule that is **PERMANENTLY PROTECTED**:

```
PRODUCT STUDIO PRESERVATION SCHEMATIC
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TOP ACTION BAR: Back Link | Status Badge | Autosave Pill | Live Preview | Delete  │
│                 Clone Draft | AI Analyze & Generate | Save Draft | Publish       │
├──────────────────────────────────────────────────────────────────────────────────┤
│ TAB 1: PRODUCT DETAILS                                                           │
│ • Product Name (auto-slug trigger)                                               │
│ • URL Slug (/products/{slug}) with Auto-sync toggle                              │
│ • SKU Identifier (e.g. JSC-DRAFT-849201)                                         │
│ • Lifecycle Status (Draft / Published / Archived)                                │
│ • Checkboxes: Featured Product (Homepage), New Arrival, Custom Only             │
│ • Short Summary Description & Field AI Action button                             │
│ • Detailed Atelier Description & Field AI Action button                         │
│ • Product Knowledge Layer (Dynamic information blocks with preset suggestions)   │
│ • Product FAQs & Dynamic Q&A (Question/Answer array rendered as Schema.org FAQ)  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ TAB 2: IMAGES (ImageStudio.js)                                                   │
│ • Cover Photo (Primary Image) & Multi-Image Gallery Uploader                    │
│ • Drag-and-drop / upload via Sharp WebP pipeline                                 │
│ • Role Selector per photo (Front View, Side Profile, Carving Detail, Base)       │
│ • Image Alt Text Editor for accessibility and SEO                                │
├──────────────────────────────────────────────────────────────────────────────────┤
│ TAB 3: CLASSIFICATION & TAXONOMY                                                 │
│ • Collection Selector dropdown + Quick-Add Modal trigger                         │
│ • Subcategory Selector dropdown                                                  │
│ • Category Selector dropdown                                                     │
│ • Primary Material Picker (Makrana White, Pink Sandstone, etc.)                  │
│ • Sacred Subject Picker (Ganesh, Krishna, Shiva, etc.)                           │
│ • Product Type Selector (Statue, Relief, Mandir, Fountain, Jali, etc.)           │
├──────────────────────────────────────────────────────────────────────────────────┤
│ TAB 4: SPECIFICATIONS & DIMENSIONS                                               │
│ • Sizing Dimensions Array (Height inches, Height feet label, Customizable flag)  │
│ • Stone Finish Type (Hand Honed Matte, High Gloss Polish, Natural Antique)       │
│ • Installation Environment (Indoor Sanctuary, Outdoor Courtyard, Both)          │
│ • Toggles: Customizable Size Allowed, Inquiry-Only (No fixed price)             │
│ • Custom Attributes JSON Object Editor                                           │
├──────────────────────────────────────────────────────────────────────────────────┤
│ TAB 5: SEO & SEARCH PHRASES                                                      │
│ • Meta Title Tag (Auto-falls back to "{Name} | Jaipur Stonecraft")               │
│ • Meta Description Tag                                                           │
│ • Primary Search Phrases / Focus Keywords Array                                  │
│ • Tag Chips (e.g. Single-Block-Marble, Hand-Carved-Jaipur)                       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Business Rules & Safeguards to Protect
1. **Autosave Engine**: 2.5-second debounce timer that automatically saves edits to draft products without disrupting user input.
2. **Auto-Slug Synchronization**: Converts product title into URL-safe slug in real-time unless manually overridden.
3. **SEO Quality Score (SeoReadinessPanel)**: Real-time 0–100% progress score checking name, slug, short description, primary material, category, cover image, and SEO title.
4. **Soft Deletion / Permanent Deletion Distinction**: Standard delete archives the record (`status = 'archived'`), preserving database relationships unless `?permanent=true` is explicitly requested.

---

## 4. CATALOGUE & TAXONOMY PRESERVATION MAP

The 6-tab Catalogue Manager (`/admin/catalogue`) must be preserved without modifying its database structure:

| Taxonomy Entity | Database Table | Fields & Attributes | Preserved Business Rules |
|---|---|---|---|
| **Collections** | `collections` | `id`, `slug`, `name`, `description`, `image_src`, `is_active`, `created_at` | Soft archiving (`is_active = 0`), cover image upload via Sharp, usage counters (`usedByProductsCount`). |
| **Categories** | `categories` | `id`, `slug`, `parent_collection_slug`, `parent_subcategory_slug`, `name`, `description`, `image_src`, `image_alt`, `featured`, `is_active` | Parent collection/subcategory validation, soft archiving, photo uploader. |
| **Subcategories** | `subcategories` | `id`, `slug`, `parent_collection_slug`, `name`, `description`, `image_src`, `is_active` | Connects collections to fine categories. |
| **Stone Materials** | `materials` | `id`, `name`, `category`, `origin`, `color_family`, `durability`, `is_sacred_grade`, `description`, `is_active` | **STRICT RULE**: Granite is strictly excluded. Material category pickers (Marble, Sandstone, Limestone, Onyx), Sacred Grade flag. |
| **Sacred Subjects** | `subjects` | `id`, `primary_name`, `synonyms`, `tradition`, `iconography_elements`, `is_active` | Deity synonyms array used by search engine for typo and alias resolution. |
| **Product Types** | `product_types` | `id`, `name`, `description`, `is_active` | Classifies stonecraft architecture vs devotional sculptures. |
| **Custom Attributes** | `attribute_definitions` | `id`, `name`, `data_type`, `options`, `applies_to_product_types`, `is_active` | Defines specifications applicable to specific product types. |

---

## 5. EXISTING ADMIN → WEBSITE CONNECTION MAP & BROKEN CONNECTIONS

The analysis below traces data flow from Admin control down to the public website, highlighting where connections are working and where they are broken:

```
DATA FLOW DIAGRAM
[Admin Control] ──> [Database Table] ──> [API / Query Layer] ──> [Frontend Component] ──> [Public Page]
```

### Connection Detailed Status

| Feature | Data Flow Trace | Status | Analysis & Required Action |
|---|---|---|---|
| **Product Detail Pages** | `/admin/products/[slug]` &rarr; DB `products` & `product_images` &rarr; `getProductBySlug()` &rarr; `<ProductHero>` &rarr; `/designs/[cat]/[slug]` | 🟢 **WORKING** | Full dynamic connection. Admin edits update live PDPs immediately. **PROTECT.** |
| **Search Engine** | Product & Taxonomy DB &rarr; `buildSearchIndex()` &rarr; `performSmartSearch()` &rarr; Header Popover & `/products` &rarr; Website Header & Catalogue | 🟢 **WORKING** | Search reads live DB data. Typo matching and synonyms are active. **PROTECT.** |
| **Homepage Featured Products** | `/admin/products` (Feature toggle) &rarr; DB `products` (`is_featured=1`) &rarr; `getFeaturedProducts()` &rarr; `<FeaturedCreations>` &rarr; Homepage | 🟢 **WORKING** | Correctly pulls 8 featured items from DB. **PROTECT.** |
| **Category Grids on Collection Pages** | `/admin/catalogue` &rarr; DB `categories` &rarr; `getCategoriesBySubcategory()` &rarr; Category Cards &rarr; `/collections/[col]/[sub]` | 🟡 **PARTIALLY WORKING** | Categories list reads DB, but fallback images read static `content/categories.js`. **RECONNECT.** |
| **Collections Index Page** | `/admin/catalogue` &rarr; DB `collections` table &rarr; ❌ Broken Link &rarr; `<HomeCollections>` & `/collections` | 🔴 **BROKEN** | Frontend reads static `content/collections.js` file instead of DB `collections` table. **RECONNECT.** |
| **Homepage Hero Section** | `/admin/content` (`homepage_hero_image`) &rarr; DB `site_content` &rarr; `getSiteContent()` &rarr; ❌ Overridden by hardcoded props &rarr; Homepage Hero | 🔴 **BROKEN** | DB value is fetched in `app/page.js` line 36 but hardcoded string `/images/hero/hero-krishna-artisan.jpg` is passed to `<Hero>`. Copy is uneditable. **RECONNECT & EXTEND.** |
| **Homepage Heritage Story** | `/admin/content` (`homepage_story_image`) &rarr; DB `site_content` &rarr; ❌ Ignored by component &rarr; `<HeritageStory>` &rarr; Homepage | 🔴 **BROKEN** | DB image slot is fetched but `<HeritageStory>` uses hardcoded file. Story text is uneditable. **RECONNECT & EXTEND.** |
| **Our Story Page Banners** | `/admin/content` (`about_heritage_banner`) &rarr; DB `site_content` &rarr; ❌ Never queried &rarr; `app/our-story/page.js` | 🔴 **BROKEN** | DB slots exist, but page component never queries them. Text is hardcoded. **RECONNECT & EXTEND.** |
| **Craftsmanship Page Banners** | `/admin/content` (`craftsmanship_hero_banner`) &rarr; DB `site_content` &rarr; ❌ Never queried &rarr; `app/craftsmanship/page.js` | 🔴 **BROKEN** | DB slots exist, but page component never queries them. 7 process stages are hardcoded. **RECONNECT & EXTEND.** |
| **Projects Portfolio** | ❌ No Admin Route &rarr; ❌ No DB Table &rarr; Static File `content/projects.js` &rarr; `<ProjectsList>` &rarr; `/projects` | 🔴 **MISSING** | Complete absence of Admin controls. Case studies are hardcoded. **ADD NEW MODULE.** |
| **Contact Info & Inquiries** | ❌ Form submission &rarr; ❌ No DB Storage &rarr; Email attempt &rarr; Lost lead data | 🔴 **MISSING** | Inquiries are not stored in any database table. Contact details are hardcoded in `content/site.js`. **ADD NEW MODULE.** |

---

## 6. NEW ADMIN FUNCTIONALITY REQUIRED

To bring the new website pages under full Admin management, the following new capabilities must be added **around** the protected core:

### 1. Page CMS Manager Module (`/admin/pages`) [NEW]
* **Purpose**: Manage text copy, headings, eyebrows, CTAs, and banners for editorial website pages.
* **Sub-Sections**:
  * *Homepage Tab*: Hero title/subtitle/CTAs/background upload, Trust Strip 4 numerical stats & labels, Heritage Story text & photo, CTA section copy.
  * *Our Story Tab*: Lineage title/body/photo, 4 Core Values cards, Dark transition statistics bar, Future vision title/body/photo.
  * *Craftsmanship Tab*: Manifesto title/subtitle, 7 Process Stage cards (Stage number, title, description, workshop photo upload), Quality checklist items.

### 2. Projects & Case Studies Module (`/admin/projects`) [NEW]
* **Purpose**: Portfolio management for bespoke architectural installations.
* **Capabilities**: Project Title, Slug, Type (Temple, Residential, Hospitality, Custom), Location, Year, Overview description, Materials description, Cover Image upload, Multi-image gallery upload, Linked DB products selector.

### 3. Customer Inquiries & Leads Module (`/admin/inquiries`) [NEW]
* **Purpose**: Capture and manage quote requests and custom project consultations submitted from `/contact`.
* **Capabilities**: Lead viewer table, contact info, inquiry type (Custom / Quote / General), project notes, lead status picker (`New`, `Contacted`, `In Progress`, `Closed`), internal notes.

### 4. Site Settings Module (`/admin/settings`) [NEW]
* **Purpose**: Manage business contact details and global website bars.
* **Capabilities**: Header announcement bar toggle & text, studio telephone, WhatsApp number, email address, workshop physical address, social links.

---

## 7. PROPOSED FINAL ADMIN ARCHITECTURE

The final navigation structure keeps the existing protected routes intact while placing new modules alongside them:

```
PROPOSED INTEGRATED ADMIN STUDIO NAVIGATION
├── 📊 Dashboard Overview (/admin) ────────────────────────── [PROTECTED CORE]
├── 🗿 Products Catalogue (/admin/products) ───────────────── [PROTECTED CORE - Product Studio]
│   ├── All Products List & Bulk Actions
│   ├── Product Health Queue (/admin/health)
│   └── Studio Editor (/admin/products/[slug])
├── 🏷️ Catalogue & Taxonomy (/admin/catalogue) ────────────── [PROTECTED CORE]
│   ├── Categories (Tab 1)
│   ├── Collections (Tab 2)
│   ├── Materials (Tab 3)
│   ├── Sacred Subjects (Tab 4)
│   ├── Product Types (Tab 5)
│   └── Attributes (Tab 6)
├── 📄 Page CMS Manager (/admin/pages) ────────────────────── [NEW MODULE]
│   ├── Homepage Editor
│   ├── Our Story Editor
│   └── Craftsmanship Editor
├── 🏛️ Projects Portfolio (/admin/projects) ───────────────── [NEW MODULE]
│   ├── Case Studies List
│   └── Project Editor & Gallery Uploader
├── 📁 Shared Media Library (/admin/media) ────────────────── [PROTECTED CORE]
├── 📬 Customer Inquiries (/admin/inquiries) ──────────────── [NEW MODULE]
└── ⚙️ Site Settings (/admin/settings) ───────────────────── [NEW MODULE]
```

---

## 8. SINGLE SOURCE OF TRUTH PLAN

To resolve the dual-source architecture (Database vs Static JS Files), the system will establish clear authoritative data sources:

```
SINGLE SOURCE OF TRUTH MATRIX
┌─────────────────────────┬───────────────────────────────┬──────────────────────────────┐
│ Content Type            │ Current Split Source          │ Authoritative Single Source  │
├─────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ Products & PDPs         │ DB `products` table           │ 🟢 DB `products` table       │
│ Taxonomy & Categories   │ DB `categories` + `content/`  │ 🟢 DB `categories` table     │
│ Collections             │ DB `collections` + `content/` │ 🟢 DB `collections` table    │
│ Page Editorial Copy     │ Hardcoded strings in `.js`    │ 🟢 DB `page_sections` table  │
│ Projects & Portfolio    │ Static `content/projects.js`  │ 🟢 DB `projects` table       │
│ Lead Submissions        │ Unstored form posts           │ 🟢 DB `inquiries` table      │
│ Global Contact Info     │ Hardcoded `content/site.js`   │ 🟢 DB `site_settings` table  │
└─────────────────────────┴───────────────────────────────┴──────────────────────────────┘
```

---

## 9. MEDIA & IMAGE INTEGRATION PLAN

The existing Sharp image pipeline (`/api/admin/upload/route.js`) is highly optimized and will be **100% PROTECTED**:

```
PROTECTED IMAGE PIPELINE USAGE
[Upload Request] ──> Sharp Processing ──> Generates 4 Variants ──> Used By:
                                          • rawUrl (Original file)
                                          • displayUrl (1920px) ──> PDP Hero & Covers
                                          • cardUrl (1080px) ───> Product & Project Grids
                                          • thumbUrl (400px) ────> Admin Thumbs & Search
```

### Media Integration Rules
1. **Reuse Upload API**: All new modules (Page CMS hero uploads, Project cover uploads, Craftsmanship process photos) will send file uploads to `/api/admin/upload`, utilizing the existing Sharp WebP optimization engine.
2. **Grid Optimization**: Frontend card grid components (`CollectionCard`, `ProjectCard`) will be updated to request `cardUrl` (1080px WebP) or `thumbUrl` (400px WebP) instead of downloading heavy 1920px display images.

---

## 10. SAFE MIGRATION REQUIREMENTS

To transition from static fallback files to dynamic database storage safely:

1. **Idempotent Schema Updates**:
   Add new tables (`page_sections`, `projects`, `inquiries`, `site_settings`) to `lib/db/schema.js` using `CREATE TABLE IF NOT EXISTS`.
2. **Database Seeding**:
   Create a migration seeder (`lib/db/seeders.js`) that imports existing static data from `content/projects.js`, `content/collections.js`, and default page copy into the database on first run.
3. **Graceful Fallbacks**:
   Frontend query functions will first query the database. If the database returns empty results during initial deployment, queries will fall back to static JS definitions to guarantee zero downtime or missing content.
4. **Cache Invalidation**:
   API write handlers (`PUT`/`POST`) will trigger Next.js `revalidatePath()` for `/`, `/collections`, `/our-story`, `/craftsmanship`, `/projects`, and `/products`.

---

## 11. DANGER AREAS — DO NOT BREAK LIST

The following items are critical system components. **NO CODE OR ARCHITECTURAL CHANGES SHOULD BE MADE TO THEM WITHOUT EXPLICIT APPROVAL**:

1. **`components/admin/ProductStudio/ProductStudio.js`**: Do NOT refactor, simplify, or rewrite. All 5 tabs, autosave timers, knowledge normalizer, and SEO readiness logic must remain intact.
2. **`lib/db/products.js`**: Do NOT alter product query logic, SKU formatting, or JSON attribute formatting.
3. **`app/api/admin/upload/route.js`**: Do NOT change Sharp WebP resize dimensions, quality levels, or folder structure (`raw/`, `display/`, `card/`, `thumb/`).
4. **`lib/db/schema.js` (Existing Tables)**: Do NOT drop or modify existing column types on `products`, `product_images`, `categories`, `collections`, `materials`, `subjects`, or `site_content`.
5. **`lib/search/smart-search-engine.js` & `lib/search/phonetic.js`**: Do NOT modify the search index builder, Levenshtein distance rules, or Indian domain phonetic keys.
6. **Granite Exclusion Rule**: Do NOT allow Granite to be added to stone materials or product attributes (strict brand mandate).

---

## 12. RECOMMENDED IMPLEMENTATION ORDER

```
PHASE 1: DATABASE & BACKEND ENDPOINTS (Non-Breaking)
  1. Add `page_sections`, `projects`, `inquiries`, and `site_settings` tables to `lib/db/schema.js`.
  2. Write data seeders to populate initial database rows from static files.
  3. Create API routes: `/api/admin/pages`, `/api/admin/projects`, `/api/admin/inquiries`, `/api/admin/settings`.

PHASE 2: FRONTEND REWIRING (Connect Live Website to DB)
  1. Rewire `app/page.js` to pass DB page section data to Hero, TrustStrip, HeritageStory, and CTASection.
  2. Rewire `app/collections/page.js` to query DB `collections` table.
  3. Rewire `app/our-story/page.js` and `app/craftsmanship/page.js` to query DB page sections.
  4. Rewire `app/projects/page.js` to query DB `projects` table.

PHASE 3: ADMIN STUDIO EXTENSIONS (Build New Admin Modules)
  1. Build `/admin/pages` (Page CMS Editor with Homepage, Our Story, and Craftsmanship tabs).
  2. Build `/admin/projects` (Projects Portfolio CRUD & gallery uploader).
  3. Build `/admin/inquiries` (Lead submission log & quote request manager).
  4. Build `/admin/settings` (Global contact & header announcement settings).

PHASE 4: MEDIA VARIANT OPTIMIZATION & FINAL QA
  1. Update card components to request Sharp `cardUrl` (1080px) and `thumbUrl` (400px) WebP variants.
  2. Perform full regression testing ensuring Product Studio and Search remain 100% functional.
```

---

## IMPLEMENTATION STATUS

**AUDIT COMPLETE — NO CHANGES IMPLEMENTED**  
*(This document serves as the technical preservation and integration blueprint. Execution will begin in the next phase.)*
