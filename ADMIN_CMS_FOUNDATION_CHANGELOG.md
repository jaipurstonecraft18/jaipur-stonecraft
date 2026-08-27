# JAIPUR STONECRAFT — ADMIN CMS FOUNDATION CHANGELOG
**Phase**: Phase 1 — Data & CMS Foundation  
**Date**: August 26, 2026  
**Status**: COMPLETED & VERIFIED  

---

## 1. CREATED DATA STRUCTURES & SCHEMAS

The following database tables were safely added to `lib/db/schema.js` using `CREATE TABLE IF NOT EXISTS`:

1. `page_sections`:
   * **Columns**: `key_name` (PRIMARY KEY), `page`, `section_id`, `label`, `content_json` (LONGTEXT), `updated_at`.
   * **Purpose**: Holds structured JSON data for editorial page sections (Homepage Hero, Trust Strip stats, Heritage Story, Craftsmanship process stages, Our Story sections).
2. `projects`:
   * **Columns**: `id` (PRIMARY KEY), `slug` (UNIQUE), `name`, `type`, `location`, `year`, `description`, `materials`, `craftsmanship`, `final_result`, `image_src`, `gallery` (LONGTEXT), `products_used` (LONGTEXT), `status`, `sort_order`, `created_at`, `updated_at`.
   * **Purpose**: Database store for bespoke case studies and architectural installation portfolio items.
3. `inquiries`:
   * **Columns**: `id` (PRIMARY KEY), `name`, `email`, `phone`, `inquiry_type`, `message` (LONGTEXT), `reference_image_url`, `status`, `admin_notes` (LONGTEXT), `created_at`, `updated_at`.
   * **Purpose**: Captures quote requests and custom project consultation leads submitted from `/contact`.
4. `site_settings`:
   * **Columns**: `key_name` (PRIMARY KEY), `category`, `label`, `value` (LONGTEXT), `updated_at`.
   * **Purpose**: Centralized storage for global business info (telephone, WhatsApp, studio email, physical address, announcement bar toggle/text, social links).

---

## 2. NEW BACKEND API ENDPOINTS

1. `app/api/admin/pages/route.js`:
   * `GET`: Fetches all page section content or filters by page (`?page=Homepage`).
   * `PUT`: Updates section `content_json` by `keyName` and triggers `revalidatePath()` for public page routes.
2. `app/api/admin/projects/route.js`:
   * `GET`: Returns project list or single project by `?slug=...`.
   * `POST`: Creates a new case study.
   * `PUT`: Updates an existing case study.
   * `DELETE`: Deletes a case study by `?slug=...`.
3. `app/api/admin/inquiries/route.js`:
   * `GET`: Admin-authenticated endpoint for inspecting customer leads and filtering by `?status=new|contacted|in_progress|closed`.
   * `POST`: Public endpoint used by `<ContactForm>` to save quote requests and custom project inquiries to the database.
   * `PUT`: Admin endpoint for updating lead status and internal admin notes.
4. `app/api/admin/settings/route.js`:
   * `GET`: Returns all global site settings.
   * `PUT`: Updates global setting JSON value by `keyName`.

---

## 3. SEEDERS & MIGRATIONS IMPLEMENTED

* Created `lib/db/seeders.js` (`seedCMSFoundation()`):
  * **Page Sections**: Automatically seeds default copy and image paths for Homepage Hero, Trust Strip, Heritage Story, CTA Section, Our Story Header, and Craftsmanship Hero Manifesto.
  * **Projects Portfolio**: Seeds initial 10 case studies from `content/projects.js` into the `projects` table.
  * **Site Settings**: Seeds Announcement Bar, Studio Phone (`+91 70147 53278`), WhatsApp, Email (`Jaipurstonecraft18@gmail.com`), Address (`30, Industrial Area, Kartarpura, Jaipur`), and social media channels.

---

## 4. MODIFIED CODE & REWIRING

1. `lib/db/content.js`:
   * Added `getPageSection(keyName, defaultContent)`: Retrieves section JSON from `page_sections` DB table with safe fallback to hardcoded default if DB is empty or unreachable.
   * Added `getSiteSetting(keyName, defaultValue)`: Retrieves site setting from `site_settings` DB table with safe fallback.
2. `lib/db/projects.js` *(New File)*:
   * Added `getAllProjectsFromDB(typeFilter)`: Queries published projects from DB `projects` table with fallback to static `projectsData`.
   * Added `getProjectBySlugFromDB(slug)`: Queries single project from DB with fallback.
3. `app/page.js`:
   * Rewired Hero and CTA sections to fetch dynamic content via `getPageSection()` with safe fallbacks preserving 100% of current website appearance.
4. `components/ContactForm/ContactForm.js`:
   * Updated `handleSubmit` to post live lead data directly to `/api/admin/inquiries`, ensuring zero lead loss.

---

## 5. PRESERVED SYSTEMS (TOUCHED ZERO CODE)

* 🟢 **Product Studio (`components/admin/ProductStudio/ProductStudio.js`)**: Intact (All 5 tabs, 2.5s autosave, SKU generator, Knowledge Layer normalizer, Dynamic FAQs, SEO Readiness Score).
* 🟢 **Catalogue & Taxonomy (`/admin/catalogue`)**: Intact (Categories, Collections, Materials, Subjects, Product Types, Attributes).
* 🟢 **Media Pipeline (`/api/admin/upload/route.js`)**: Intact (Sharp WebP 4-variant generation).
* 🟢 **Product Health Auditor (`/admin/health`)**: Intact.
* 🟢 **Search Intelligence (`smart-search-engine.js`, `phonetic.js`)**: Intact.

---

## 6. CLASSIFICATION OF IMPLEMENTATION ITEMS

* **CREATED**: `lib/db/seeders.js`, `lib/db/projects.js`, `app/api/admin/pages/route.js`, `app/api/admin/projects/route.js`, `app/api/admin/inquiries/route.js`, `app/api/admin/settings/route.js`.
* **MODIFIED**: `lib/db/schema.js`, `lib/db/content.js`, `app/page.js`, `components/ContactForm/ContactForm.js`.
* **PRESERVED**: `ProductStudio.js`, `ImageStudio.js`, `/admin/catalogue`, `/api/admin/upload`, `content/*.js` static files (retained as safe fallbacks).
* **MIGRATED**: Inquiries submission, Homepage Hero/CTA dynamic DB resolution, Projects database persistence.
* **DEFERRED**: Admin UI views for Page CMS (`/admin/pages`), Projects (`/admin/projects`), Inquiries (`/admin/inquiries`), and Settings (`/admin/settings`) — scheduled for Phase 2.

---

## VERIFICATION RESULTS

* **Build**: Production build completed successfully with zero compilation or type errors.
* **Database**: `page_sections`, `projects`, `inquiries`, and `site_settings` tables initialized and seeded.
* **Admin Studio**: Existing Product Studio, SKU creation, health auditor, and taxonomy controls function cleanly.
