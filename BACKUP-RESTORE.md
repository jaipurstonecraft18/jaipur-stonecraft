# Jaipur Stonecraft — Backup and Recovery Architecture & Restore Manual

This document provides complete operational procedures for creating, storing, verifying, and restoring database and production image backups for the Jaipur Stonecraft platform.

---

## 1. System Architecture & Environment Capabilities

### Hostinger Production Environment Assessment
- **Confirmed Capabilities**:
  - **Node.js Runtime**: Supported via API routes, npm scripts, and scheduled node processes.
  - **Pure Node.js Database Dumper**: The backup engine exports MySQL data using `mysql2` metadata and DDL/DML serialization. It does **not** rely on external binary `mysqldump` (which is often restricted or unavailable in shared hosting environments).
  - **Google Drive v3 REST Integration**: Uses Service Account JWT assertions (RSA-SHA256) via native Node `crypto` & `fetch` API.
  - **Scheduled Execution**: Can be triggered automatically via Hostinger hPanel Cron, GitHub Actions, or external cron services (`cron-job.org`) calling `POST /api/admin/backup?key=BACKUP_SECRET_KEY`.
  - **Off-Site & Local Fallback**: Backups are archived locally under `backups/` and pushed to off-site Google Drive cloud storage.

- **Constraints & Prohibitions**:
  - **Zero Hardcoded Secrets**: All Google Drive keys and API tokens are loaded exclusively via environment variables (`.env`).
  - **Live Image Serving**: Google Drive is strictly an off-site backup archive, never used as live website image storage.

---

## 2. Environment Configuration (.env)

```ini
# Backup Security & Retention
BACKUP_SECRET_KEY=your_backup_secret_key
BACKUP_RETENTION_COUNT=14

# Google Drive Service Account Sync (Off-Site Backup Destination)
GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL=backup-service@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

---

## 3. Creating Backups

### Option A: Command Line Interface (CLI)
```bash
npm run backup
# Or directly:
node scripts/backup-runner.js
```

### Option B: HTTP API Endpoint / Automated Cron Trigger
```bash
curl -X POST "http://localhost:3000/api/admin/backup?key=YOUR_BACKUP_SECRET_KEY"
```

---

## 4. Database Restoration Procedure

> [!WARNING]
> Always perform database restoration tests on a separate test database to avoid overwriting production data.

### Step-by-Step Restoration:
1. Locate the desired `.sql` dump file under `backups/db/` (e.g. `backups/db/db_backup_2026-08-17_185200.sql`).
2. Run the automated restoration script targeting your destination database (e.g., `jaipur_stonecraft_test`):
   ```bash
   node scripts/restore-runner.js --db --file backups/db/db_backup_2026-08-17_185200.sql --target-db jaipur_stonecraft_test
   ```
3. The restore script will:
   - Connect to the target MySQL instance.
   - Create the target database if it does not exist.
   - Re-initialize table DDL schemas (`collections`, `subcategories`, `categories`, `materials`, `subjects`, `product_types`, `attribute_definitions`, `products`, `product_images`, `product_variant_links`).
   - Execute the SQL `INSERT` statements to restore all rows.
   - Verify and log final table row counts.

---

## 5. Image Restoration Procedure

### Step-by-Step Restoration:
1. Locate the desired `.json` image archive under `backups/images/` (e.g., `backups/images/images_backup_2026-08-17_185200.json`).
2. Run the image restore script targeting your desired output directory (e.g., `scratch/test_restore_images` or `public/uploads`):
   ```bash
   node scripts/restore-runner.js --images --file backups/images/images_backup_2026-08-17_185200.json --target-dir scratch/test_restore_images
   ```
3. The restore script will:
   - Read the archive payload manifest.
   - Re-create the full directory structure (`raw/`, `display/`, `card/`, `thumb/`).
   - Restore all WebP and raw master image files.
   - Report total restored file count and size.

---

## 6. Verification Audit & Retention Policy

- **Database Retention**: Retains the last 14 timestamped `.sql` backups (`BACKUP_RETENTION_COUNT`).
- **Image Retention**: Retains the last 14 `.json` image manifest archives.
- **Automated Retention Cleanup**: Older backups beyond the retention limit are automatically pruned from both local disk and Google Drive cloud storage on every backup run.
