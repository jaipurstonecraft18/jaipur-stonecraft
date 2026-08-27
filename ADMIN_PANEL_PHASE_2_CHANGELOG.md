# JAIPUR STONECRAFT — ADMIN PANEL PHASE 2 CHANGELOG
**Phase**: Phase 2 — Admin Panel Expansion & Website Control  
**Date**: August 26, 2026  
**Status**: COMPLETED & VERIFIED  

---

## 1. NEW ADMIN WORKSPACE SECTIONS ADDED

The Admin Studio navigation and workspace have been expanded with 4 dedicated management tools:

1. **📄 Website Page CMS Manager (`/admin/pages`)**:
   * **Homepage Tab**: Hero Eyebrow, Main Heading, Subtitle, Primary CTA Text/Href, Secondary CTA Text/Href, Hero Background Image Uploader, Trust Strip 4 Statistics values & labels, Heritage Story copy & image, Closing CTA section copy.
   * **Our Story Tab**: Hero Eyebrow, Title, Subtitle paragraph, and Cover Image uploader.
   * **Craftsmanship Tab**: Atelier Manifesto Hero Eyebrow, Title, Subtitle, and Process Stage copy.
2. **🏛️ Projects & Case Studies Manager (`/admin/projects`)**:
   * **Portfolio CRUD Desk**: Case study list view, category filter bar (`All`, `Residential`, `Hospitality`, `Temple`, `Garden`, `Memorial`, `Custom`).
   * **Project Editor Modal**: Create/Edit modal supporting Project Name, Slug, Type, Location, Year, Stone Materials description, Overview description, Craftsmanship details, Cover Image URL, and Delete capability.
3. **📬 Customer Inquiries & Lead Operations (`/admin/inquiries`)**:
   * **Operational Lead Dashboard**: Tabbed status filters (`All`, `New Leads`, `Contacted`, `Quoted / Active`, `Closed / Archived`).
   * **Lead Inspector Drawer**: Detailed view of customer name, email, telephone, project details message, date received, lead status picker, and internal admin notes editor.
4. **⚙️ Global Site Settings Editor (`/admin/settings`)**:
   * **Header Announcement Bar**: Active toggle, announcement text, button link text, and destination URL.
   * **Studio Contact Details**: Official telephone number, WhatsApp business contact, email address, physical showroom address, city, state.
   * **Social Channels**: Instagram, Pinterest, and YouTube channel URLs.

---

## 2. WEBSITE DATA CONNECTIONS PROPAGATED

* **Homepage (`app/page.js`)**: Connected Hero and CTA sections to query DB `page_sections` via `getPageSection()` with safe fallbacks.
* **Our Story (`app/our-story/page.js` & `StoryHeader.js`)**: Connected editorial hero to query `getPageSection("story_header")` with safe fallbacks.
* **Projects Portfolio (`app/projects/page.js`)**: Resolves case studies from DB `projects` table with fallback to `projectsData`.
* **Contact Form (`components/ContactForm/ContactForm.js`)**: Submits quote requests and custom project inquiries directly to `/api/admin/inquiries`.

---

## 3. PRESERVED EXISTING WORKFLOWS (100% UNTOUCHED)

* 🟢 **Product Studio (`components/admin/ProductStudio/ProductStudio.js`)**: Intact (All 5 tabs, 2.5s debounced autosave, SKU generator, Knowledge Layer normalizer, Dynamic FAQs, SEO Readiness Score).
* 🟢 **Catalogue & Taxonomy (`/admin/catalogue`)**: Intact (Categories, Collections, Materials, Subjects, Product Types, Attributes).
* 🟢 **Media Pipeline (`/api/admin/upload/route.js`)**: Intact (Sharp WebP 4-variant generation).
* 🟢 **Product Health Auditor (`/admin/health`)**: Intact.
* 🟢 **Search Intelligence (`smart-search-engine.js`, `phonetic.js`)**: Intact.

---

## 4. SUMMARY OF REMOVALS & DELETIONS

* **REMOVED / DELETED**: **NONE**. No existing Admin routes, database columns, product records, image files, or static fallback files were deleted.
* **DEFERRED**: Advanced drag-and-drop gallery reordering in Product Studio (scheduled for future polish).

---

## VERIFICATION RESULTS

* **Build**: Production build completed successfully with zero compilation or type errors.
* **Navigation**: Updated `AdminMobileNav.js` provides seamless desktop header and mobile drawer access across all 8 Admin Studio modules.
* **Data Flow**: Admin edits to Page CMS, Projects, Inquiries, and Settings persist to database tables and revalidate public page routes.
