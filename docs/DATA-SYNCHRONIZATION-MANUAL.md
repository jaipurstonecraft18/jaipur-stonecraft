# Jaipur Stonecraft — Master Data Synchronization & Parity Manual

This manual documents the bidirectional synchronization, backup, restore, and verification system for the Jaipur Stonecraft platform.

---

## 1. Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│                   OFFLINE / LOCAL                     │
│  - Local MySQL Database (DATABASE_URL)                 │
│  - Local Media Tree (public/uploads/ - 106 Assets)     │
│  - CAS Image Backup & Manifests (backups/images/)      │
│  - SQL Snapshots & DB Manifests (backups/db/)          │
└──────────────────────────▲─────────────────────────────┘
                           │
                 BIDIRECTIONAL SYNC ENGINE
               (lib/backup/sync-coordinator.js)
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 HOSTINGER PRODUCTION                   │
│  - Hostinger MySQL / MariaDB (DATABASE_URL)            │
│  - Hostinger Persistent Media (public/uploads/)        │
│  - Admin API & Cron Backup Endpoints                   │
└────────────────────────────────────────────────────────┘
```

* **Production Database**: Hostinger Managed MySQL / MariaDB via `DATABASE_URL` (`mysql2`).
* **Source of Truth (Offline Baseline)**: Local MySQL mirror (`14 tables`, `1,741 verified records`).
* **Media Assets**: 106 production images in `public/uploads/` tracked by cryptographic SHA-256 manifests.
* **Safety Principle**: All synchronization commands operate in **DRY-RUN mode by default**. Destructive or replacement operations strictly require the `--confirm` flag.

---

## 2. Command Reference

| Command | Purpose | Default Mode | Confirmed Execution |
| :--- | :--- | :--- | :--- |
| `npm run sync:status` | Check real-time parity between Local & Production | Read-Only Audit | N/A |
| `npm run sync:verify` | Deep table-by-table & media SHA-256 parity verification | Read-Only Audit | N/A |
| `npm run sync:push` | Synchronize Local changes -> Production | Dry-Run (Preview) | `npm run sync:push -- --confirm` |
| `npm run sync:pull` | Synchronize Production changes -> Local | Dry-Run (Preview) | `npm run sync:pull -- --confirm` |
| `npm run backup` | Capture timestamped DB dump & CAS image snapshot | Live Snapshot | `npm run backup` |
| `npm run restore` | Restore verified backup to database | Dry-Run (Validation) | `npm run restore -- --confirm` |

### Command Flags & Modifiers
* `--confirm`: Authorizes live execution (bypasses dry-run preview).
* `--dry-run`: Explicitly forces dry-run preview mode.
* `--db-only`: Restricts synchronization to database tables only.
* `--media-only`: Restricts synchronization to `public/uploads/` media assets only.
* `--file=<path>`: Specifies custom `.sql` or `.sql.gz` dump file for restore.
* `--target=local|production`: Sets restore target database (defaults to `local`).

---

## 3. Standard Operating Workflows

### Workflow A: Adding / Editing Products Locally -> Pushing to Production
1. Add or update products, categories, or content locally via local Admin Studio or scripts.
2. Verify the proposed changes in dry-run mode:
   ```bash
   npm run sync:push
   ```
   * *Preview*: Displays both Database row changes and the exact Media Transfer Plan (new, modified, and unchanged images).
3. When the diff summary is verified, push changes to Hostinger Production:
   ```bash
   npm run sync:push -- --confirm
   ```
   * *Safety Guarantee*: The system automatically creates a pre-push backup of production before writing any changes.
   * *Media Transport*: Streams delta media over authenticated HTTPS (`/api/admin/sync/media/upload`) with temporary `.tmp` atomic write and SHA-256 checksum verification.

---

### Workflow B: Pulling Production Changes Back to Local Development
1. After content, products, or images are edited directly on the production site, preview the changes:
   ```bash
   npm run sync:pull
   ```
2. Pull the live production snapshot and new media into your local environment:
   ```bash
   npm run sync:pull -- --confirm
   ```
   * *Safety Guarantee*: Automatically creates a timestamped local safety backup in `backups/pre_pull/` before refreshing the local MySQL database and media tree.

---

## 4. Automated HTTPS Media Transport Architecture

```text
LOCAL MACHINE                               HOSTINGER SERVER
  npm run sync:push --confirm
       │
       ├─► 1. GET /api/admin/sync/media/manifest ──► Scans public/uploads/ & returns SHA-256 manifest
       │   (Compares local hashes vs remote)
       │
       ├─► 2. POST /api/admin/sync/media/upload ───► Validates auth & path safety
       │      [FormData: file + relativePath + hash]  Writes target.tmp.xxxx
       │                                              Verifies SHA-256 byte integrity
       │                                              Atomic rename -> target.webp
       │
       └─► 3. Updates local CAS & manifest
```

### Media Security & Corruption Protection
1. **Authentication**: Every media sync endpoint requires `ADMIN_SECRET_KEY` or `MEDIA_SYNC_SECRET` passed via `x-sync-secret` or `Authorization: Bearer <secret>` headers.
2. **Directory Traversal Protection**: Any path containing `..`, null bytes, absolute paths, or leading slashes is immediately rejected.
3. **Atomic Writes**: Incoming files are written to `.tmp` files first. If the computed SHA-256 does not match the expected hash, the temporary file is unlinked immediately without touching existing valid assets.
4. **Disaster Recovery Baseline**: The standalone media archive [`jaipur-stonecraft-media-uploads.zip`](../jaipur-stonecraft-media-uploads.zip) and SQL dump [`backups/db/full/jaipur_stonecraft_production_restore.sql`](../backups/db/full/jaipur_stonecraft_production_restore.sql) remain preserved as permanent offline disaster recovery baselines.

