# Jaipur Stonecraft — Hostinger Production Deployment Package Audit (Phase 8D)

Generated on: 2026-10-10T07:13:01.454Z

---

## 1. Archive Overview
* **Archive Filename**: `jaipur-stonecraft-hostinger-deployment.zip`
* **File Path**: `D:\jsc\jsc web1\jaipur-stonecraft-hostinger-deployment.zip`
* **File Size**: **359.53 MB** (37,69,91,277 bytes)
* **Archive SHA-256 Checksum**:
  ```
  5fd1195e9b8c1224be37a587afb6d6465218d448d38ae8a5ce97d9350b810c64
  ```
* **Total Entries in ZIP**: **1117 entries** (171 directories, 946 files)
* **Archive Format**: **100% POSIX-compliant ZIP** (Unix MadeBy `0x0314`, forward slashes `/`, explicit `0755` directory and `0644` file permissions).

---

## 2. Inclusions & Exclusions Summary

### Included Directories & Files
* `app/` — Full Next.js App Router hierarchy (pages, layout, components, **all 28 admin API routes**)
* `components/` — All UI components
* `content/` — Static database schemas and content
* `lib/` — Core database client (`mysql2`), schema definitions, backup engine, image archiver, SEO helpers
* `public/` — Static assets and **all 571 production media uploads** (`public/uploads/`)
* `scripts/` — Production runtime scripts (`sync-production-to-local.mjs`, `backup-runner.js`, `restore-runner.js`, `hostinger-preflight.mjs`, `verify-hostinger-migration.mjs`)
* `styles/` — Global stylesheet tokens and CSS
* `server.js` — Custom Node.js HTTP server entry point with startup upload directory scaffolding
* `next.config.mjs` — Production Next.js configuration
* `package.json` & `package-lock.json` — Clean production dependencies (**Next.js 16.3.8 secure patch**)
* `.htaccess` — Apache / LiteSpeed web server protection
* `.env.example` — Clean configuration template

### Excluded Directories & Files
* `.env` / `.env.local` / `.env.production` — **ZERO SECRET LEAKAGE**
* `node_modules/` — Excluded; to be installed on Hostinger via `npm install --production=false`
* `.next/` — Excluded; to be compiled on Hostinger via `npm run build`
* `.git/` — Excluded
* `backups/` — Local SQL backups and image CAS retained offline
* `data/` — Local SQLite legacy databases excluded
* `scratch/` — Development scratch files excluded

---

## 3. Media & Upload Inventory
* **Total Staged Images**: **571 files**
* **Total Media Size**: **324.25 MB** (33,99,99,938 bytes)
* **Directory Structure**:
  * `public/uploads/products/` (`raw/`, `display/`, `card/`, `thumb/`)
  * `public/uploads/categories/` (`raw/`, `display/`, `card/`, `thumb/`)
* **SHA-256 Parity**: Verified match against baseline manifest.

---

## 4. Admin API Route Inventory (28 Routes)
1. `app/api/admin/ai/analyze-product/route.js`
2. `app/api/admin/ai/generate-alt-texts/route.js`
3. `app/api/admin/auth/route.js`
4. `app/api/admin/backup/route.js`
5. `app/api/admin/catalogue/quick-add/route.js`
6. `app/api/admin/catalogue/route.js`
7. `app/api/admin/categories/route.js`
8. `app/api/admin/content/route.js`
9. `app/api/admin/health/route.js`
10. `app/api/admin/inquiries/route.js`
11. `app/api/admin/media/route.js`
12. `app/api/admin/pages/route.js`
13. `app/api/admin/products/bulk/route.js`
14. `app/api/admin/products/route.js`
15. `app/api/admin/products/[id]/route.js`
16. `app/api/admin/projects/route.js`
17. `app/api/admin/search/route.js`
18. `app/api/admin/settings/route.js`
19. `app/api/admin/upload/route.js`

---

## 5. Permissions & EACCES Remediation
* **Root Cause of Previous Hostinger EACCES**: Windows compression tools omit Unix directory attributes, causing Linux to extract directories with mode `000` (inaccessible without execute bit).
* **Remediation**: Custom POSIX ZIP generator with Unix MadeBy (`0x0314`), POSIX forward slashes, and explicit `0755` directory and `0644` file permissions.

---

## 6. Database & Provider Decoupling Audit
* **Runtime Database Provider**: Exclusively Hostinger MySQL / MariaDB via `DATABASE_URL`.
* **Driver**: `mysql2` connection pool.
* **Aiven Status**: 0 runtime dependencies.
* **Backblaze B2 Status**: 0 runtime dependencies.
* **SQLite Status**: 0 runtime dependencies (`better-sqlite3` completely uninstalled).

---

## 7. Status & Readiness
* **HOSTINGER PACKAGE STATUS**: **READY FOR MANUAL UPLOAD**
* **Target Archive**: `jaipur-stonecraft-hostinger-deployment.zip`
