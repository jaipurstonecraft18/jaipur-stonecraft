# JAIPUR STONECRAFT — ADMIN PANEL AUDIT & REBUILD BLUEPRINT
**Document Version**: 1.0.0  
**Audit Date**: August 26, 2026  
**Target Scope**: Website Architecture, Existing Admin Studio, Database Schema, Media Pipelines, and Rebuild Blueprint

---

## EXECUTIVE SUMMARY

### Current Website State
The public Jaipur Stonecraft website has recently undergone major architectural, visual, and editorial redesigns across all core touchpoints:
* **Homepage**: Re-architected with warm luxury aesthetics, floating statistics bar (`TrustStrip`), heritage editorial block (`HeritageStory`), interactive collection showcases (`HomeCollections`), dark craft mosaics (`FeaturedCreations`), client reviews (`ClientReviews`), and multi-step atelier process tracks (`CraftProcess`).
* **Product Detail Pages (PDP)**: Redesigned matching reference standards with custom size inquiry modules, subtle craftsmanship dark cards, horizontal perspective view galleries, and collection recommendation tracks.
* **Our Story Page**: Redesigned as an editorial brand journey with split lineage hero, artisan dignity value grids, dark stats transition bars, and future vision chapters.
* **Craftsmanship Page**: Redesigned into a 7-stage solid-block atelier transformation journey.
* **Search Engine**: Upgraded into a local-first, typo-tolerant, phonetic-aware (Levenshtein + Soundex) search system integrated across header popovers, `/products` catalogue, and `/projects` portfolio.
* **Projects Portfolio**: Re-architected showcase with real case studies (`projectsData`), category filters, and shared smart search integration.

### Current Admin Panel State
The Admin Panel (`/admin`) was originally constructed as a product-cataloguing tool. While it includes robust database management for products, SKUs, categories, stone materials, and image variant uploads (via Sharp), **it is almost completely disconnected from the newly redesigned website pages and editorial content**.
* **Content Disconnect**: The Admin Panel's "Website Content" section (`/admin/content`) manages 7 predefined `site_content` database slots (`homepage_hero_image`, `about_heritage_banner`, etc.). However, **zero of these slots are actually wired to the live website pages**. The live website pages render hardcoded strings and static assets instead of reading from `site_content`.
* **Zero Editorial Control**: Crucial website sections—such as Homepage Hero copy/CTAs, Trust Bar stats, Our Story text/images, Craftsmanship process stages, Featured Products ordering, Projects portfolio, and Client Reviews—have **no Admin controls at all**.
* **Taxonomy Mismatch**: Admin edits categories and collections in the database (`categories` and `collections` tables), but public collection pages (`/collections`, `/collections/[collection]`) pull data from static JSON/JS definitions (`content/collections.js`, `content/categories.js`). Updates made in Admin do not update collection pages.

### Overall Assessment
| Area | Status | Summary |
|---|---|---|
| **Product Catalogue (CRUD & Database)** | 🟡 PARTIALLY WORKING | Product creation, SKU management, SQLite database persistence, and bulk actions work. However, homepage featured products do not respect Admin flags. |
| **Site Content & Page CMS** | 🔴 BROKEN / DISCONNECTED | 7 database content slots exist in Admin, but live website components ignore them completely. |
| **Collections & Category CMS** | 🔴 DISCONNECTED | Admin updates database tables; live collection routes read static hardcoded files. |
| **Projects Portfolio CMS** | 🔴 MISSING | Projects page is powered by static `content/projects.js` with no Admin control. |
| **Media Pipeline & Uploads** | 🟢 WORKING WELL | Sharp-based image optimization generates Raw, Display (1920px), Card (1080px), and Thumb (400px) WebP variants cleanly. |
| **Lead / Inquiry Management** | 🔴 MISSING | Contact forms and quote requests send no data to Admin (no submission storage in DB). |

### Biggest Gaps
1. **Broken Editorial Control**: Admin edits to `site_content` have zero visual effect on Homepage, Our Story, or Craftsmanship pages.
2. **Dual Source of Truth**: The codebase maintains two parallel content sources—the SQLite database (`lib/db/`) edited by Admin, and hardcoded static JS files (`content/`) read by frontend components.
3. **No Projects/Case Studies Management**: No Admin interface exists for managing completed installations or uploading project photos.
4. **No Lead Capture Storage**: Quote requests and custom project inquiries are not stored in any database table or visible in Admin.

### Biggest Risks
1. **Data Desynchronization**: Editing a category or collection image in Admin updates `categories` in SQLite, but the public `/collections` page continues displaying stale images from `content/categories.js`.
2. **Image Pipeline Path Traversal / Duplication**: Uploaded assets stored under `public/uploads/` are decoupled from static `/images/` assets, leading to duplicate image files and broken references when static fallback paths are used.
3. **Uncached DB Queries on Build**: Hardcoded page components bypass DB caching while static pages fetch directly from local SQLite.

---

## 1. AUDIT OF CURRENT WEBSITE SECTIONS

Below is the itemized inventory of every public website page, section, component, content source, and its current Admin Panel control status:

| Page / Section | Component / Element | Content Displayed | Content Type | Storage / Source File | Admin Control Status |
|---|---|---|---|---|---|
| **Homepage** | Hero Section (`<Hero>`) | Eyebrow, Main Heading, Subheading, CTAs, Hero Background Image | Hardcoded | `app/page.js` (lines 42–50) | 🔴 **BROKEN**: DB slot `homepage_hero_image` is fetched in `page.js` line 36 but hardcoded path `/images/hero/hero-krishna-artisan.jpg` is passed to prop. Copy has no control. |
| **Homepage** | Statistics Bar (`<TrustStrip>`) | 4 Statistics (Years, Artisans, Countries, Projects) | Hardcoded | `components/TrustStrip/TrustStrip.js` | 🔴 **MISSING**: No Admin control. |
| **Homepage** | Heritage Story (`<HeritageStory>`) | Chapter Heading, Atelier History text, Quote, Image | Hardcoded | `components/HeritageStory/HeritageStory.js` | 🔴 **BROKEN**: DB slot `homepage_story_image` is fetched in `page.js` line 37 but ignored inside `<HeritageStory>`. Text is uneditable. |
| **Homepage** | Collections Grid (`<HomeCollections>`) | 6 Collection Cards (Name, Description, Image, Link) | Static JS | `content/collections.js` & `components/HomeCollections/HomeCollections.js` | 🔴 **DISCONNECTED**: Admin updates `collections` DB table, but component reads `content/collections.js`. |
| **Homepage** | Featured Creations (`<FeaturedCreations>`) | 8 Featured Artwork Cards (Images, Titles, Material badges) | Dynamic DB | `lib/db/products.js` (`getFeaturedProducts`) | 🟢 **CONNECTED**: Displays products flagged as `is_featured = 1` in Admin database. |
| **Homepage** | Client Reviews (`<ClientReviews>`) | Client Testimonial Cards (Quote, Author, Location, Project Type) | Hardcoded | `components/ClientReviews/ClientReviews.js` | 🔴 **MISSING**: No Admin control. |
| **Homepage** | Craftsmanship Process (`<CraftProcess>`) | 4 Process Stages (Stone Selection, Grid, Chiseling, Polishing) | Hardcoded | `components/CraftProcess/CraftProcess.js` | 🔴 **BROKEN**: DB slot `homepage_craftsmanship_image` exists in DB but is ignored. Stage text is hardcoded. |
| **Homepage** | Conversion CTA (`<CTASection>`) | Closing Banner Heading, Description, CTA Buttons | Hardcoded | `app/page.js` (lines 71–79) | 🔴 **MISSING**: No Admin control. |
| **Collections** | Collections Index (`/collections`) | Collection Cards & Grid | Static JS | `content/collections.js` & `app/collections/page.js` | 🔴 **DISCONNECTED**: Does not read DB `collections` table. |
| **Collections** | Collection Detail (`/collections/[collection]`) | Hero Banner, Subcategories, Category Grid | Static JS + DB | `content/collections.js`, `content/categories.js`, `lib/db/taxonomy.js` | 🟡 **PARTIALLY CONNECTED**: Categories read DB fallback, but Subcategories and Collection descriptions read static JS. |
| **PDP** | Product Hero (`<ProductHero>`) | Title, Images, Rating, Sizing info, Badges, CTAs | Dynamic DB | `lib/db/products.js` (`getProductBySlug`) | 🟢 **CONNECTED**: Full control over title, SKU, material, descriptions, images, tags via Admin Product Studio (`/admin/products/[slug]`). |
| **PDP** | Subtle Craftsmanship Grid | Atelier Banner & 6 Product Specifications | Dynamic DB | `components/ProductDetail/ProductSubtleCraftsmanship.js` | 🟢 **CONNECTED**: Populated from DB `attributes` JSON column and product fields. |
| **PDP** | Perspective Gallery | Perspective Views & Full-screen Lightbox | Dynamic DB | DB `product_images` table | 🟢 **CONNECTED**: Controlled via Product Studio gallery images. |
| **PDP** | Recommendations Track | Related Product Recommendation Cards | Dynamic DB | `lib/db/products.js` (`getRelatedProductsFromDB`) | 🟢 **CONNECTED**: Derived dynamically from category and collection relationships. |
| **Our Story** | Story Header (`<StoryHeader>`) | Editorial Split Hero (Heading, Text, Deity Image) | Hardcoded | `components/OurStory/StoryHeader.js` | 🔴 **BROKEN**: DB slot `about_heritage_banner` exists in DB but `page.js` does not fetch it. |
| **Our Story** | Lineage Chapter (`<StoryLineageSection>`) | Heritage Story, Artisan Chiseling Photo, Italic Quote Box | Hardcoded | `components/OurStory/StoryLineageSection.js` | 🔴 **BROKEN**: DB slot `about_quarry_image` exists in DB but is not fetched. |
| **Our Story** | Values Grid (`<StoryValuesSection>`) | 4 Core Values (Artisan Dignity, In-House, Materials, Precision) | Hardcoded | `components/OurStory/StoryValuesSection.js` | 🔴 **MISSING**: No Admin control. |
| **Our Story** | Stats Transition (`<StoryTransitionDark>`) | Dark Brand Statistics (3+ Gens, 500+ Artisans, 25+ Countries) | Hardcoded | `components/StoryTransitionDark.js` | 🔴 **MISSING**: No Admin control. |
| **Our Story** | Future Vision (`<StoryFutureSection>`) | Global Vision Chapter & Architecture Image | Hardcoded | `components/StoryFutureSection.js` | 🔴 **MISSING**: No Admin control. |
| **Craftsmanship** | Atelier Journey (`/craftsmanship`) | 7 Transformation Stages, Hero Manifesto, Quality Checklist | Hardcoded | `app/craftsmanship/page.js` & component suite | 🔴 **BROKEN**: DB slots `craftsmanship_hero_banner` & `craftsmanship_chisel_image` exist in DB but `page.js` does not fetch them. |
| **Projects** | Projects Portfolio (`/projects`) | Project Cards, Case Studies, Image Galleries, Metadata | Static JS | `content/projects.js` & `components/ProjectsList/ProjectsList.js` | 🔴 **MISSING**: No Admin control. Projects cannot be added, edited, or reordered via Admin. |
| **Contact** | Contact Info & Form (`/contact`) | Studio Address, Email, Phone, Inquiry Type Form | Hardcoded + API | `content/site.js` & `app/contact/page.js` | 🔴 **MISSING**: Studio phone/email/address are hardcoded. Form submissions are not saved to database. |
| **Global** | Header & Utility Bar | Announcement text, Phone number, Nav items | Hardcoded | `components/Header/Header.js` & `content/site.js` | 🔴 **MISSING**: No Admin control for header utility bar text or contact numbers. |
| **Global** | Footer | Address, Copyright, Social links, Category links | Hardcoded | `components/Footer/Footer.js` | 🔴 **MISSING**: No Admin control. |

---

## 2. AUDIT OF CURRENT ADMIN PANEL CONTROLS

Below is the complete inventory of pages, tabs, forms, and controls currently present in the Admin Studio (`/admin`):

```
ADMIN PANEL WORKSPACE STRUCTURE
├── 📊 Dashboard Overview (/admin)
│   ├── Snapshot Metrics (Total Products, Published, Drafts, Archived, Needs Attention)
│   ├── Quick Action Buttons (+ Add Product, View Drafts, View Archived)
│   └── Recently Updated Products Table (Thumb, Title, SKU, Category, Material, Status, Edit Link)
├── 🗿 Products Catalogue (/admin/products)
│   ├── Fast Draft Modal (Quick title, category, material, image upload)
│   ├── Studio Editor (/admin/products/[slug] or /admin/products/new)
│   │   ├── Basic Info (Name, SKU, Slug, Status, Category, Material, Subject, Type)
│   │   ├── Attributes & Specifications JSON Editor
│   │   ├── Detailed Descriptions & Knowledge Layer
│   │   ├── Image Upload & Gallery Order Manager (Sharp WebP Pipeline)
│   │   └── SEO & Search Phrase Settings
│   ├── Bulk Actions Bar (Publish, Feature, Archive selected items)
│   ├── Health Discovery Filter Bar (Healthy, Needs Attention, Incomplete)
│   └── Issue Category Select Dropdown (Filter by missing images, alt text, meta description)
├── 🩺 Product Health Queue (/admin/health)
│   └── Automated Audit Table flagging incomplete product listings across 10 SEO/Data rules
├── 🏷️ Catalogue & Taxonomy (/admin/catalogue)
│   ├── Tab 1: Categories (Add/Edit Category modal, Slug, Parent Collection/Subcategory, Photo upload, Usage count, Delete)
│   ├── Tab 2: Collections (Add/Edit Collection modal, Name, Slug, Photo upload, Usage count, Delete)
│   ├── Tab 3: Materials (Add/Edit Stone Material, Name, Category, Color Family, Origin, Sacred Grade, Archive/Restore)
│   ├── Tab 4: Subjects (Add/Edit Sacred Deity/Subject, Primary Name, Synonyms, Archive/Restore)
│   ├── Tab 5: Product Types (List & Archive/Restore product types)
│   └── Tab 6: Custom Attributes (Add/Edit Custom Attribute definition, Data Type, Applies-to)
├── 🖼️ Website Content Manager (/admin/content)
│   ├── Tab 1: Homepage (3 slot cards: hero image, craftsmanship image, story image)
│   ├── Tab 2: Our Story (2 slot cards: heritage banner, quarry selection)
│   └── Tab 3: Craftsmanship (2 slot cards: hero banner, chisel technique)
└── 📁 Shared Media Inspector (/admin/media)
    └── Grid view of all uploaded image files in `/public/uploads/` with WebP compression savings & file size stats
```

### Detailed Evaluation of Admin Controls

| Control / Page | What It Controls | Data Storage Location | Where Used on Website | Status & Audit Finding | Classification & Recommendation |
|---|---|---|---|---|---|
| **Product Studio** (`/admin/products/[slug]`) | Product title, SKU, slug, status, categories, material, descriptions, attributes, gallery images, SEO fields | `products` & `product_images` tables in SQLite | Product Detail Pages (`/designs/[cat]/[slug]`), Search Engine, Catalogue grids | 🟢 **WORKING**: Full CRUD works correctly. | **RETAIN & REFINE**: Keep as core product management interface. |
| **Product Health Queue** (`/admin/health`) | Audit rules checking products for missing images, short descriptions, SEO titles | Evaluated dynamically from `products` DB rows | Internal Admin quality control | 🟢 **WORKING**: Identifies incomplete catalogue items accurately. | **RETAIN**: Valuable QA tool. |
| **Catalogue Taxonomy** (`/admin/catalogue`) | Categories, Collections, Materials, Subjects, Product Types, Custom Attributes | `categories`, `collections`, `materials`, `subjects`, `product_types`, `attribute_definitions` DB tables | Used in PDPs and Search Engine | 🟡 **PARTIALLY WORKING**: Updates DB tables, but public `/collections` pages read static JS files (`content/collections.js`). | **MODIFY**: Rewire frontend `/collections` pages to read directly from database tables. |
| **Website Content Manager** (`/admin/content`) | Predefined slot images (`homepage_hero_image`, `about_heritage_banner`, etc.) | `site_content` table in SQLite | Supposed to power Homepage, Our Story, and Craftsmanship banners | 🔴 **BROKEN / DISCONNECTED**: Admin allows uploading and saving slot images to DB, but public page components ignore DB queries and display hardcoded static assets. | **REPLACE & REWIRE**: Re-architect into a complete Page CMS that controls text copy, headings, and images. |
| **Media Inspector** (`/admin/media`) | Inspection view of uploaded images in `/public/uploads/` | `/public/uploads/` directory on disk | Displays uploaded WebP variants | 🟢 **WORKING**: Lists media files cleanly. | **RETAIN & EXPAND**: Enhance into a full Media Library with asset search and replace-all capabilities. |

---

## 3. WEBSITE → ADMIN CONTROL MAP

| Website Feature / Section | Status Classification | Detailed Reason / Discrepancy |
|---|---|---|
| **Product Detail Pages** | 🟢 **CONNECTED** | Controlled via DB (`products` & `product_images` tables). Admin updates reflect immediately on PDP routes. |
| **Search Engine & Autocomplete** | 🟢 **CONNECTED** | Powered by `search-index.js` which builds index directly from DB products and taxonomy. |
| **Homepage Featured Products** | 🟢 **CONNECTED** | Reads products with `is_featured = 1` from database. |
| **Category Grids on Collection Pages** | 🟡 **PARTIALLY CONNECTED** | Category list falls back to DB `categories` table, but description and cover images prefer static files. |
| **Collections Index Page (`/collections`)** | 🔴 **DISCONNECTED** | Reads static `content/collections.js` file instead of DB `collections` table. |
| **Homepage Hero Section** | 🔴 **BROKEN** | `getSiteContent("homepage_hero_image")` is fetched in `app/page.js`, but hardcoded image `/images/hero/hero-krishna-artisan.jpg` and hardcoded copy are rendered. |
| **Homepage Heritage Story** | 🔴 **BROKEN** | `getSiteContent("homepage_story_image")` is fetched in `app/page.js`, but ignored by `<HeritageStory>`. Copy is hardcoded. |
| **Our Story Page Images** | 🔴 **BROKEN** | DB slots `about_heritage_banner` and `about_quarry_image` exist in DB, but `app/our-story/page.js` never queries them. |
| **Craftsmanship Page Images** | 🔴 **BROKEN** | DB slots `craftsmanship_hero_banner` and `craftsmanship_chisel_image` exist in DB, but `app/craftsmanship/page.js` never queries them. |
| **Trust Strip Statistics Bar** | 🔴 **MISSING** | Statistics numbers (Years, Artisans, Countries, Projects) are hardcoded inside `TrustStrip.js`. |
| **Client Reviews Section** | 🔴 **MISSING** | Client testimonials are hardcoded inside `ClientReviews.js` with no DB table or Admin UI. |
| **Craftsmanship Process 7 Stages** | 🔴 **MISSING** | Detailed process stages on `/craftsmanship` page are hardcoded in page component. |
| **Projects Portfolio (`/projects`)** | 🔴 **MISSING** | Case studies and project photos are hardcoded in `content/projects.js`. No Admin management exists. |
| **Contact Info & Inquiries** | 🔴 **MISSING** | Address, phone, and email are hardcoded in `content/site.js`. Form submissions are lost (no DB storage). |
| **Header Announcement Bar** | 🔴 **MISSING** | Announcement text is hardcoded in `components/Header/Header.js`. |
| **Footer Links & Copyright** | 🔴 **STATIC** | Standard static navigation; intentionally hardcoded and appropriate to remain so. |

---

## 4. OUTDATED & OBSOLETE ADMIN CONTROLS

The audit identified several Admin controls that were designed for an earlier iteration of the website and no longer align with current frontend architecture:

1. **Standalone Key/Value Slot Manager (`site_content` table)**:
   * *Current Behavior*: `/admin/content` presents 7 isolated image key slots (`homepage_hero_image`, `homepage_craftsmanship_image`, etc.).
   * *Why Obsolete*: Modern website sections contain complex structured copy (eyebrows, headings, body text, primary/secondary CTAs, stats) rather than single isolated image URLs. A key/value table storing only `value` and `alt_text` cannot support structured editorial sections like `HeritageStory` or `CTASection`.
   * *Recommendation*: Replace `site_content` key/value storage with a structured `page_sections` JSON model or page-specific CMS tables.

2. **Isolated Categories Form (`/admin/categories`)**:
   * *Current Behavior*: Older standalone `/admin/categories` route duplicates functionality now present in `/admin/catalogue` (Tab 1).
   * *Why Obsolete*: Having two separate routes (`/admin/categories` and `/admin/catalogue`) editing the same database tables creates confusion.
   * *Recommendation*: Remove `/admin/categories` route and consolidate all taxonomy editing inside `/admin/catalogue`.

3. **Unused Product Attributes in DB Schema**:
   * *Current Behavior*: DB schema defines `product_types` and `attribute_definitions` tables.
   * *Why Obsolete*: PDPs render product specifications dynamically from a single flexible JSON column (`attributes`) on the `products` table, making rigid relational attribute schema tables redundant.
   * *Recommendation*: Retain JSON attributes column on `products`; simplify or remove unused relational attribute definition tables.

---

## 5. IDENTIFY MISSING ADMIN FUNCTIONALITY

The following key website elements currently cannot be managed via the Admin Panel and require new Admin controls:

### 1. Projects & Case Studies Manager
* **Website Element**: `/projects` page and `/projects/[slug]` case study detail pages.
* **Editable Needs**: Project name, client/location, project type (Temple, Residential, Hospitality), cover image, gallery photos, description, materials used, products used.
* **Why Required**: Case studies are crucial sales drivers for custom architectural commissions. The client currently cannot publish new completed installations without developer code changes.
* **Suggested Admin Location**: `/admin/projects` (New Top-Level Navigation item).

### 2. Homepage Editorial CMS
* **Website Element**: `Hero`, `TrustStrip`, `HeritageStory`, `FeaturedCreations` ordering, and `CTASection` on `app/page.js`.
* **Editable Needs**:
  * *Hero*: Eyebrow text, main heading, subheading, primary CTA label/link, secondary CTA label/link, background image upload.
  * *Trust Strip*: 4 numerical stats (Years, Artisans, Countries, Projects) and labels.
  * *Heritage Story*: Chapter title, body paragraphs, pull-quote text, featured image upload.
  * *CTA Section*: Heading, body copy, CTA button text and links.
* **Why Required**: Allows marketing updates, seasonal promotional messaging, and banner refreshes without developer intervention.
* **Suggested Admin Location**: `/admin/pages/homepage`.

### 3. Collection Cover & Display Settings
* **Website Element**: `/collections` index and `/collections/[collection]` pages.
* **Editable Needs**: Collection display name, editorial tagline, description, cover image upload, sorting order, homepage visibility toggle (`is_featured`).
* **Why Required**: Collections are the primary navigation entry points. Current Admin panel allows editing name/slug, but changes do not propagate to public pages because frontend reads static JS.
* **Suggested Admin Location**: `/admin/catalogue` (Tab 2: Collections).

### 4. Client Testimonials & Reviews Manager
* **Website Element**: `<ClientReviews>` section on Homepage.
* **Editable Needs**: Add/Edit/Delete client reviews (Quote text, Client Name, Location, Project Type, Star Rating, Date, Visibility toggle).
* **Why Required**: Social proof needs continuous updating as new international projects are delivered.
* **Suggested Admin Location**: `/admin/pages/homepage` or `/admin/reviews`.

### 5. Craftsmanship Page Process Editor
* **Website Element**: `/craftsmanship` page.
* **Editable Needs**: Stage title, stage subtitle, process description, stage photo upload for each of the 7 atelier transformation stages.
* **Why Required**: Communicating artisan craftsmanship is a core brand pillar. Adding real workshop photography to process stages builds client trust.
* **Suggested Admin Location**: `/admin/pages/craftsmanship`.

### 6. Customer Inquiries & Quote Request Log
* **Website Element**: `/contact` page forms (Custom Project inquiry, Quote request, General contact).
* **Editable Needs**: View incoming inquiries, filter by type (Custom / Quote / General), lead status (New, Contacted, In-Progress, Closed), notes field.
* **Why Required**: Currently, form submissions are not stored in any database table. Storing inquiries ensures no customer lead is lost if email delivery fails.
* **Suggested Admin Location**: `/admin/inquiries`.

### 7. Global Site Settings
* **Website Element**: Header utility announcement bar, Studio address, phone numbers, email address, social media links.
* **Editable Needs**: Announcement banner text/link, phone number, WhatsApp contact number, studio address, Instagram/Pinterest URLs.
* **Why Required**: Business contact info changes require hardcoded code updates across multiple components (`Header.js`, `Footer.js`, `site.js`).
* **Suggested Admin Location**: `/admin/settings`.

---

## 6. IMAGE AND MEDIA MANAGEMENT AUDIT

### Current Upload Pipeline Architecture
The current upload pipeline (`/api/admin/upload/route.js`) uses **Sharp** for image verification and WebP variant generation:

```
[User Image Upload (JPEG/PNG/WebP/AVIF up to 15MB)]
                       │
                       ▼
          /api/admin/upload/route.js
                       │
     ┌─────────────────┴─────────────────┐
     ▼                                   ▼
Save Raw Original                Process Sharp WebP
/public/uploads/{folder}/raw/    Variants with Metadata Stripping
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
          Display Variant          Card Variant            Thumb Variant
          (1920x2400 max,          (1080x1350 max,         (400x400 square,
          WebP 90% Quality)        WebP 88% Quality)       WebP 85% Quality)
                 │                       │                       │
                 ▼                       ▼                       ▼
          /public/uploads/        /public/uploads/        /public/uploads/
          {folder}/display/       {folder}/card/          {folder}/thumb/
```

### Audit Findings & Evaluation

1. **Original Storage**:
   * Original uncompressed files are preserved in `/public/uploads/{folder}/raw/`.
   * *Assessment*: Good practice. Originals are never lost, enabling future re-processing.

2. **Generated Image Variants**:
   * For every upload, 4 paths are returned: `rawUrl`, `displayUrl`, `cardUrl`, and `thumbUrl`.
   * *Assessment*: Highly efficient. Compression savings average **60%–85%** compared to camera RAW/PNG uploads.

3. **Frontend Variant Request Discrepancy**:
   * *Issue*: When a product is created or edited in Admin, `product.imageSrc` is saved using `displayUrl` (1920px max). When product cards are rendered in small grids (e.g. 280px wide on homepage or search popovers), the browser downloads the large 1920px `displayUrl` image rather than the 1080px `cardUrl` or 400px `thumbUrl`.
   * *Impact*: Unnecessary bandwidth consumption on mobile devices.

4. **Image Asset Duplication & Path Splits**:
   * Static seed images are located in `/public/images/` (e.g., `/images/hero/`, `/images/collections/`).
   * Admin uploads are stored in `/public/uploads/` (e.g., `/uploads/products/display/`).
   * *Issue*: Replacing a static collection image in Admin saves a new WebP file to `/public/uploads/categories/display/`, but existing static components pointing to `/images/collections/...` are not updated.

5. **Image Quality & Recompression Risks**:
   * Sharp processes uploaded images once with high-quality WebP settings (90% for display, 88% for card).
   * Next.js `<Image>` component further applies dynamic WebP optimization on request.
   * *Risk*: Double WebP compression (Sharp 90% WebP &rarr; Next.js Image loader WebP) can introduce minor artifacts.
   * *Recommendation*: Use `unoptimized` flag on `<Image>` when serving pre-optimized Sharp WebP variants from `/uploads/`, OR configure Next.js image device sizes to match Sharp output dimensions.

---

## 7. DATA RELATIONSHIPS & DUPLICATION AUDIT

### Data Models & Relationships

```
                     ┌────────────────────────┐
                     │       collections      │
                     └───────────┬────────────┘
                                 │ 1:N
                     ┌───────────▼────────────┐
                     │      subcategories     │
                     └───────────┬────────────┘
                                 │ 1:N
                     ┌───────────▼────────────┐
                     │       categories       │
                     └───────────┬────────────┘
                                 │ 1:N
┌─────────────────┐  │  ┌────────▼─────────┐  │  ┌──────────────────┐
│    materials    ├──┼──►     products     ◄──┼──┤     subjects     │
└─────────────────┘     └────────┬────────┘     └──────────────────┘
                                 │ 1:N
                        ┌────────▼─────────┐
                        │  product_images  │
                        └──────────────────┘
```

### Architectural Vulnerabilities & Duplication Issues

1. **Dual Content Store (Database vs Static Files)**:
   * *Problem*: `lib/db/` stores SQLite database rows for `collections`, `categories`, and `products`. Simultaneously, `content/` contains static JS definitions (`collections.js`, `categories.js`, `projects.js`).
   * *Consequence*: Updating a collection name or image in Admin updates SQLite, but public collection routes read static files, rendering Admin edits invisible on the frontend.

2. **Orphaned `site_content` Key Slots**:
   * *Problem*: `site_content` table contains rows for `homepage_hero_image`, `homepage_story_image`, etc.
   * *Consequence*: `app/page.js` calls `getSiteContent()` to read these keys, but hardcoded props override the DB values. Admin edits to `site_content` have zero effect on the live website.

3. **Product Category & Collection Denormalization**:
   * *Problem*: The `products` table stores `parent_collection`, `parent_subcategory`, and `parent_category` as raw text string slugs rather than foreign keys referencing the `categories` or `collections` tables.
   * *Consequence*: If a category slug is renamed in Admin (e.g. `ganesh-ji` &rarr; `ganesha-statues`), existing product rows retain the old slug (`ganesh-ji`), breaking product category filtering until manually re-saved.

4. **Projects Portfolio Unlinked from Products**:
   * *Problem*: `content/projects.js` defines `productsUsed` as an array of static names and slugs (e.g. `{ name: "Classical Carved Column", slug: "carved-pillars-columns" }`).
   * *Consequence*: Project references do not link to real DB product IDs. Renaming a product breaks project link integrity.

---

## 8. PROPOSED FUTURE ADMIN ARCHITECTURE

To establish a unified CMS where every public website section is fully manageable, the Admin Studio should be reorganized into **8 cohesive modules**:

```
PROPOSED ADMIN STUDIO MODULES
├── 1. 📊 Dashboard Overview (/admin)
├── 2. 📄 Page CMS Manager (/admin/pages)
│   ├── Homepage Editor (Hero, Stats, Heritage Story, CTA Banners)
│   ├── Our Story Editor (Lineage, Core Values, Stats Transition, Vision)
│   └── Craftsmanship Editor (7 Atelier Process Stages, Manifesto, Quality Checklist)
├── 3. 🏷️ Catalogue & Taxonomy (/admin/catalogue)
│   ├── Collections Manager (Cover images, taglines, ordering, visibility)
│   ├── Categories Manager (Slug, parent assignments, cover photos)
│   ├── Stone Materials Manager (Marble, Sandstone, Limestone, Origin, Sacred Grade)
│   └── Sacred Subjects Manager (Deities, Synonyms, Traditions)
├── 4. 🗿 Products Studio (/admin/products)
│   ├── Product Catalogue List & Health Discovery Queue
│   └── Product Studio Editor (Basic info, JSON attributes, multi-photo gallery, SEO)
├── 5. 🏛️ Projects & Case Studies (/admin/projects)
│   ├── Project List & Category Filters (Temple, Residential, Hospitality, Custom)
│   └── Project Editor (Title, location, client, description, multi-photo gallery, linked products)
├── 6. 🖼️ Shared Media Library (/admin/media)
│   ├── Media asset inspector with WebP size metrics
│   └── Asset replacement utility (updates all DB references atomically)
├── 7. 📬 Customer Inquiries & Leads (/admin/inquiries)
│   └── Submission log for Custom Projects & Quote Requests with status tracking
└── ⚙️ Site Settings & Contact (/admin/settings)
    └── Studio address, telephone, WhatsApp number, email, announcement bar text
```

### Module Specifications & Field Requirements

#### Module 1: Page CMS Manager (`/admin/pages`)
* **Purpose**: Single control center for editorial page copy, hero banners, and brand storytelling.
* **Controlled Pages**: Homepage (`/`), Our Story (`/our-story`), Craftsmanship (`/craftsmanship`).
* **Fields & Controls**:
  * *Homepage Hero Tab*: Eyebrow, Main Heading, Subheading, Primary CTA Label/URL, Secondary CTA Label/URL, Desktop Hero Image Upload, Mobile Hero Image Upload.
  * *Homepage Stats Tab*: 4 Stat Cards (Number value, Label text).
  * *Homepage Story Tab*: Section Eyebrow, Heading, Paragraph 1, Paragraph 2, Pull-Quote, Image Upload.
  * *Our Story Tab*: Lineage Heading, Story Body, Artisan Image Upload, 4 Core Value Cards (Icon, Title, Description), Dark Stats (3+ Gens, 500+ Artisans, etc.), Future Vision Heading/Body/Image.
  * *Craftsmanship Tab*: Hero Manifesto Title/Subtitle, 7 Process Stage Cards (Stage #, Title, Description, Workshop Image Upload), Quality Checklist items.

#### Module 2: Catalogue & Taxonomy (`/admin/catalogue`)
* **Purpose**: Manage store taxonomy and collection presentation.
* **Controlled Pages**: `/collections`, `/collections/[collection]`, `/collections/[collection]/[subcategory]/[category]`.
* **Fields & Controls**:
  * *Collections Tab*: Name, Slug, Short Tagline, Full Description, Cover Image Upload, Featured on Homepage Toggle (`is_featured`), Sort Order Index.
  * *Categories Tab*: Name, Slug, Parent Collection Dropdown, Parent Subcategory Dropdown, Description, Cover Image Upload, Sort Order Index.
  * *Materials Tab*: Material Name, Category (Marble, Sandstone, Limestone, Onyx), Color Family, Origin Region, Sacred Grade Toggle, Description.
  * *Subjects Tab*: Deity Primary Name, Synonyms (Comma-separated), Tradition (Vedic, Buddhist, Jain).

#### Module 3: Products Studio (`/admin/products`)
* **Purpose**: Complete lifecycle management for stonecraft items.
* **Controlled Pages**: PDP routes (`/designs/[cat]/[slug]`), Search popovers, Product Grids.
* **Fields & Controls**:
  * SKU, Slug, Name, Status (Published / Draft / Archived), Featured Toggle, Custom-Only Toggle.
  * Taxonomy Pickers: Parent Collection, Subcategory, Category, Primary Material, Sacred Subject.
  * Descriptions: Short Teaser, Detailed Atelier Description, Knowledge Layer.
  * Specifications (JSON): Sizing notes, weight disclaimer, carving technique, finish type.
  * Multi-Image Gallery Manager: Drag-and-drop ordering, primary image picker, role assignment (Front, Detail, Profile), automated Sharp WebP compression.
  * SEO Settings: Meta Title, Meta Description, Focus Search Keywords, Image Alt Texts.

#### Module 4: Projects & Case Studies (`/admin/projects`) [NEW]
* **Purpose**: Portfolio management for bespoke architectural installations.
* **Controlled Pages**: `/projects`, `/projects/[slug]`.
* **Fields & Controls**:
  * Project Title, Slug, Project Type (Temple, Residential, Hospitality, Landscape, Memorial, Custom), Location / Site City, Year Completed.
  * Project Overview Description, Stone Materials Used, Carving & Installation Details, Final Result Summary.
  * Main Cover Image Upload + Multi-Image Gallery Upload.
  * Linked Catalogue Products (Multi-select picker connecting to DB products).

#### Module 5: Customer Inquiries & Leads (`/admin/inquiries`) [NEW]
* **Purpose**: Capture and track customer consultation requests.
* **Controlled Pages**: Receives input from `/contact` page forms.
* **Fields & Controls**:
  * Customer Name, Email, Phone Number, Inquiry Type (Custom Project / Quote / General).
  * Project Details / Message Text, Reference Image Attachment URL, Submission Date.
  * Admin Lead Status Picker (`New` / `Contacted` / `In Progress` / `Quoted` / `Archived`), Internal Admin Notes.

#### Module 6: Site Settings (`/admin/settings`) [NEW]
* **Purpose**: Centralized management of global business info and header/footer elements.
* **Controlled Pages**: Header Announcement Bar, Footer, Contact Page.
* **Fields & Controls**:
  * Announcement Bar: Active Toggle, Message Text, Button Link.
  * Studio Contact: Official Telephone, WhatsApp Contact Number, Email Address.
  * Physical Location: Workshop / Showroom Address, City, State, Postal Code, Google Maps Link.
  * Social Links: Instagram URL, Pinterest URL, YouTube URL.

---

## 9. PRIORITIZATION MATRIX

Implementation work is categorized below by functional urgency:

```
┌────────────────────────────────────────────────────────────────────────┐
│ CRITICAL (Immediate Fixes Required)                                     │
│ • Rewire Homepage Hero & Heritage Story to read DB Page CMS settings  │
│ • Rewire /collections & /collections/[slug] to read DB collections    │
│ • Fix baseProducts safe array fallbacks across all search pages        │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ HIGH (Core Missing Admin Functionality)                                │
│ • Build Page CMS Module (/admin/pages) for Homepage & Story copy       │
│ • Build Projects Portfolio CMS (/admin/projects) with DB table & CRUD  │
│ • Build Customer Inquiries DB Table & Admin Viewer (/admin/inquiries)  │
│ • Consolidate Catalogue Taxonomy (/admin/catalogue)                    │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ MEDIUM (Operational & Asset Efficiency)                                │
│ • Update frontend image components to request card/thumb WebP variants │
│ • Build Site Settings Module (/admin/settings) for header/footer info │
│ • Implement atomic image replacement utility in Media Inspector       │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LOW (Polish & Visual Enhancements)                                     │
│ • Drag-and-drop image gallery reordering in Product Studio            │
│ • Export Inquiries to CSV utility                                      │
│ • Dark mode preview toggle in Admin Studio                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10. TECHNICAL RISK ANALYSIS

1. **Static Data Desynchronization Risk**:
   * *Risk*: Removing static `content/*.js` files before database tables are fully populated could cause `404` errors or missing content on collection pages.
   * *Mitigation*: Implement fallback logic where database queries take priority, falling back to static files only if database rows are absent during migration.

2. **Database Migration & Schema Compatibility**:
   * *Risk*: Altering database schema (e.g. adding `page_sections` or `inquiries` tables) on local SQLite / production MySQL could fail if migration scripts are not idempotent.
   * *Mitigation*: Use `CREATE TABLE IF NOT EXISTS` and defensive column checks in `lib/db/schema.js`.

3. **Image Path Breakage Risk**:
   * *Risk*: Migrating static cover images from `/images/collections/...` to `/uploads/categories/...` could break links if hardcoded image paths exist in database records.
   * *Mitigation*: Maintain backwards-compatible image path resolution helper in `lib/utils/image-utils.js` that checks for both upload and static paths.

4. **Cache Invalidation & Server Revalidation**:
   * *Risk*: Next.js App Router aggressively caches static pages (`/`, `/our-story`, `/craftsmanship`). Updates in Admin may not reflect on public pages immediately.
   * *Mitigation*: Ensure all Admin API `PUT`/`POST` handlers execute `revalidatePath()` for affected public routes.

---

## 11. RECOMMENDED IMPLEMENTATION STRATEGY

### Step-by-Step Execution Plan

```
PHASE 1: DATA & CMS FOUNDATION
  1. Add `page_sections`, `projects`, and `inquiries` tables to DB Schema (`lib/db/schema.js`).
  2. Seed default DB rows for Homepage, Our Story, and Craftsmanship sections.
  3. Create backend API routes: `/api/admin/pages`, `/api/admin/projects`, `/api/admin/inquiries`, `/api/admin/settings`.

PHASE 2: FRONTEND REWIRING (ELIMINATE HARDCODED DISCONNECTS)
  1. Update `app/page.js` to pass DB `page_sections` data to `<Hero>`, `<TrustStrip>`, `<HeritageStory>`, and `<CTASection>`.
  2. Update `app/collections/page.js` to query DB `collections` table instead of static JS.
  3. Update `app/our-story/page.js` and `app/craftsmanship/page.js` to query DB page sections.
  4. Update `app/projects/page.js` to query DB `projects` table.

PHASE 3: ADMIN STUDIO UI BUILD
  1. Build `/admin/pages` (Page CMS Editor with Homepage, Our Story, Craftsmanship tabs).
  2. Build `/admin/projects` (Projects Portfolio CRUD & gallery uploader).
  3. Build `/admin/inquiries` (Lead log & quote request manager).
  4. Build `/admin/settings` (Global contact & header announcement settings).
  5. Refine `/admin/catalogue` to ensure collection & category cover image uploads immediately update DB.

PHASE 4: MEDIA PIPELINE OPTIMIZATION & QA
  1. Update product grid components to request Sharp `cardUrl` (1080px) and `thumbUrl` (400px) variants.
  2. Perform full end-to-end QA across Admin edits and public page updates.
```

---

## RECOMMENDED NEXT PHASE

### Proposed Next Phase: **PHASE 1 — DATA & CMS FOUNDATION**
When ready to begin implementation, launch Phase 1 to:
1. Create the `page_sections`, `projects`, and `inquiries` database tables in `lib/db/schema.js`.
2. Seed initial default values for all homepage and story editorial sections into the database.
3. Build the core API endpoints (`/api/admin/pages`, `/api/admin/projects`, `/api/admin/inquiries`) to support the new Admin modules.

*DO NOT IMPLEMENT NOW. THIS CONCLUDES THE AUDIT PHASE.*
