# Jaipur Stonecraft — Current Project Status & Technical Handover Report

**Date of Audit:** August 17, 2026  
**Target Repository:** Jaipur Stonecraft Web Platform (`d:\jsc\jsc web1`)  
**Audit Type:** Complete Read-Only Technical Inspection  
**Audit Purpose:** Comprehensive Technical Handover Document for AI Technical Reviewer & Strategic Production Planning

---

## 1. Executive Summary

### Project Overview
Jaipur Stonecraft is a modern, high-performance web platform built for a heritage Jaipur atelier specializing in bespoke, hand-carved stone sculptures, sacred murti idols, architectural home mandirs, sandstone jali lattices, and lotus water fountains. 

The website serves a dual purpose:
1. **Public E-Commerce & Catalogue Showcase:** Highlighting Shilpa Shastra proportions, natural stone materials (Makrana White Marble, Blush Pink Sandstone, Jaisalmer Yellow, Dholpur Beige, Natural Onyx), and atelier craftsmanship.
2. **Interactive Admin Studio:** A full product lifecycle management dashboard for creating, drafting, uploading images, configuring custom specifications, and publishing items directly into an embedded database.

### Current Stage of Development
The project is currently in the **Late Staging / Pre-Production Preparation Phase**. Core public pages, dynamic taxonomies, catalogue management APIs, search functionality, admin dashboard, and database infrastructure are fully implemented and functional locally.

### Systems Summary & Maturity Breakdown:
- **Complete & Working:** Public Homepage, Collections pages, Category landings, Product detail pages, Smart Search with fallback matching, Interactive Product Studio, Image Studio with multi-upload, SQLite database schema with WAL mode & memory caching, Dynamic XML Sitemap & Robots.txt, and HMAC-signed Admin Authentication.
- **Partially Implemented:** Custom Projects showcase (uses static data structure), Marble Material Knowledge Hub (uses static JS mappings alongside dynamic DB queries), Category cover manager.
- **Experimental / Unfinished:** `app/designs/[category]/[design]/page.js` (alias router wrapping product pages), legacy static seed scripts (`scripts/seed-db.js` vs `scripts/seed-db.mjs`).
- **Biggest Technical Risks:** Ephemeral serverless storage incompatibility (local SQLite & `/public/uploads/`), missing automated database & media backup infrastructure, raw `<img>` HTML tags bypassing Next.js Image Optimization in key components, and absence of upload-time image compression.

---

## 2. Complete Technology Stack

### Core Runtime & Environment
- **Framework:** Next.js `16.3.0` (App Router, ES Modules enabled via `"type": "module"` in `package.json`).
- **UI Library:** React `19.2.8` & React DOM `19.2.8`.
- **Language:** JavaScript (ES2022+ / ES Modules).
- **Styling Architecture:** Vanilla CSS Modules (`*.module.css`) with global design system tokens (`styles/globals.css`).
- **Database Engine:** `better-sqlite3` (`^12.11.1`), synchronous SQLite driver with WAL (Write-Ahead Logging) mode.
- **Authentication:** Custom HMAC SHA-256 signed session tokens stored in HTTP-only cookies (`jsc_admin_session`).

### Complete Dependency Matrix:

| Dependency | Version | Purpose | Where Used | Status |
| :--- | :--- | :--- | :--- | :--- |
| `next` | `16.3.0` | React framework, SSR, App Router, Route Handlers | Entire project | **Important for production** |
| `react` | `19.2.8` | UI Component library | Entire project | **Important for production** |
| `react-dom` | `19.2.8` | DOM rendering engine | Entire project | **Important for production** |
| `better-sqlite3` | `^12.11.1` | Native SQLite driver for Node.js | `lib/db/client.js`, API routes, sitemap | **Important for production** |
| `eslint` | `^9` | Code linting and formatting rules | Root `eslint.config.mjs` | **Actively used** |
| `eslint-config-next` | `16.3.0` | Next.js specific ESLint rules | Root `eslint.config.mjs` | **Actively used** |

---

## 3. Complete Project Structure

```
d:\jsc\jsc web1
├── app/                            # Next.js App Router Pages & API Routes
├── components/                     # Reusable React UI Components
├── content/                        # Static Content, Schemas & Fallback Data
├── data/                           # SQLite Database Storage Location
├── docs/                           # Technical Documentation & Specifications
├── lib/                            # Core System Logic, DB Drivers, Auth
├── public/                         # Public Static Assets & Media Upload Target
└── scripts/                        # Utility & Seeding Scripts
```

---

## 4. Complete Route and Page Inventory

The application contains **33 total routes** (22 public routes and 11 admin/API routes).

---

## 5. Current Information and Content Architecture

### Hierarchy Representation
```
Level 1: COLLECTION (e.g. Sculptures & Statues)
   └── Level 2: SUBCATEGORY (e.g. Hindu Sculptures & Sacred Murtis)
          └── Level 3: CATEGORY (e.g. Ganesha Murtis)
                 └── Level 4: PRODUCT / DESIGN (e.g. Seated Chaturbhuj Ganesha)
```

---

## 6. Complete Database Audit

### Engine & Connection Specifications
- **Engine:** SQLite 3 via `better-sqlite3` (`^12.11.1`).
- **File Location:** `d:\jsc\jsc web1\data\jaipur_stonecraft.db`.
- **Mode:** WAL mode with synchronous = NORMAL.

---

## 7. Mandatory Business Constraint Check (Granite Exclusion)
- **Status:** **100% Compliant**. Granite does NOT exist as an active material anywhere in the product catalog or database. All occurrences are explicit code guards prohibiting granite.

---

## 8. Summary Matrix of Findings

```
┌────────────────────────────────────────────────────────────────────────┐
│                        JAIPUR STONECRAFT AUDIT                         │
├──────────────────────────┬─────────────────────────────────────────────┤
│ WHAT WORKS WELL          │ • High-performance Next.js 16 App Router    │
│                          │ • SQLite WAL mode with fast in-memory maps  │
│                          │ • Complete admin dashboard for products/cat │
│                          │ • Touch-optimized mobile Image Studio UI    │
├──────────────────────────┼─────────────────────────────────────────────┤
│ WHAT IS MISSING          │ • MySQL Database Integration               │
│                          │ • Google Drive Automated Backup Pipeline    │
│                          │ • Upload Image Variant Generation (Sharp)   │
│                          │ • Next.js <Image /> component integration   │
└──────────────────────────┴─────────────────────────────────────────────┘
```
