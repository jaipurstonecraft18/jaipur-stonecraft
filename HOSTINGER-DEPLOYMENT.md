# Jaipur Stonecraft — Hostinger Production Deployment & Operations Manual

This document provides step-by-step instructions for deploying, configuring, operating, and recovering the Jaipur Stonecraft platform on Hostinger Node.js Application Hosting (Business Plan).

---

## 1. Architecture Overview

* **Runtime Host**: Hostinger Business Hosting (Node.js Application Manager with Node.js 20.x or 22.x LTS).
* **Application Startup**: `server.js` (Custom HTTP server listening on `0.0.0.0:${PORT || 3000}`).
* **Production Database**: Hostinger Managed MySQL / MariaDB (Accessed via `DATABASE_URL`).
* **Persistent Uploads**: Hostinger local filesystem at `public/uploads/` (Serving 4 WebP image variants at `/uploads/...`).
* **Source of Truth**: GitHub `main` branch (Code only; zero dynamic production data).
* **Disaster Recovery & Sync**: Automated nightly backup endpoint + non-destructive local pull runner (`npm run sync:prod`).

---

## 2. Prerequisites & Hostinger Environment Checklist

Before deploying, ensure you have access to:
1. **Hostinger hPanel**: Domain manager & Node.js Application Manager.
2. **Hostinger MySQL Database**: Database name, username, password, and host (`localhost` or `127.0.0.1`).
3. **Domain Name**: Active SSL certificate enabled (HTTPS).
4. **Node.js Runtime**: Version 20.x or 22.x LTS selected in hPanel Node.js selector.

---

## 3. Environment Configuration Checklist

In Hostinger hPanel -> **Node.js Web App** -> **Environment Variables**, configure the following production variables:

```ini
# Core Node.js Environment
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Hostinger Production Database (MySQL)
DATABASE_URL=mysql://jsc_db_user:YourStrongPassword123!@localhost:3306/jsc_production_db

# Admin Security & Session Keys (MUST BE STRONG & UNIQUE)
ADMIN_PASSWORD=SetYourStrongAdminPassword2026!
ADMIN_SECRET_KEY=GenerateA64CharRandomHexStringHere!

# Automated Backup Secret Key
BACKUP_SECRET_KEY=GenerateAnother64CharRandomKeyForCronJobs!
BACKUP_RETENTION_COUNT=14

# AI Content Intelligence & Vision (Optional / Server-Side)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

> [!CAUTION]
> Never commit real production secrets to GitHub. Always set them via Hostinger hPanel environment variables.

---

## 4. Database Migration Procedure (Phase 7E+)

### Step A: Export Local Database Dump
Run the automated database exporter locally:
```bash
npm run backup
```
This outputs a timestamped compressed SQL dump file under `backups/db/full/` (e.g. `db_full_YYYY-MM-DD.sql.gz`).

### Step B: Import Database into Hostinger MySQL
1. Log in to Hostinger hPanel -> **Databases** -> **MySQL Databases**.
2. Create a new MySQL Database (e.g., `jsc_production_db`) and User (e.g., `jsc_db_user`).
3. Open **phpMyAdmin** for your database.
4. Click **Import** -> Choose the extracted `.sql` dump file -> Click **Go**.
5. All 14 schema tables (`collections`, `subcategories`, `categories`, `materials`, `subjects`, `product_types`, `attribute_definitions`, `products`, `product_images`, `site_content`, `page_sections`, `projects`, `inquiries`, `site_settings`) and all catalog records will be created cleanly.

---

## 5. Production Image Storage & Persistence Strategy

Hostinger Native Storage with multi-variant WebP processing:
1. Ensure the directory `public/uploads/` exists on the server with write permissions (`755`):
   ```text
   public/uploads/
     ├── products/   (raw/, display/, card/, thumb/)
     └── categories/ (raw/, display/, card/, thumb/)
   ```
2. Uploaded image variants are served natively via standard web server paths (`/uploads/products/display/*.webp`) with HTTP caching and zero external latency.
3. **Deployment Safety Rule**: When pulling updates via Git on Hostinger, always execute non-destructive commands (`git pull origin main`). Never run `git clean -fd` or destructive resets that could remove untracked dynamic uploads.

---

## 6. Deploying the Application to Hostinger

1. **Pre-flight Check**: Run the pre-flight verification locally:
   ```bash
   npm run preflight:hostinger
   ```
2. **Git Repository Push**: Push the latest code to your remote GitHub repository (`main` branch).
3. **Hostinger Node.js App Setup**:
   - Go to Hostinger hPanel -> **Setup Node.js App**.
   - Select **Node.js Version**: 20.x or 22.x LTS.
   - **Application Root**: `/public_html` (or your application folder).
   - **Application Startup File**: `server.js`.
4. **Run Install & Build Commands**:
   - In Hostinger SSH / Terminal:
     ```bash
     npm install --production=false
     npm run build
     ```
5. **Start Application**: Click **Restart Application** in hPanel.

---

## 7. Security Hardening (.htaccess)

The root `.htaccess` file enforces server-level protection:
- Blocks direct HTTP downloads of `.env*`, `.git`, `.sql`, `.gz`, `.db`, and `.log` files.
- Denies direct directory browsing of `/backups/`, `/data/`, `/lib/`, and `/scripts/`.

---

## 8. Automated Backup Setup (Hostinger Cron Job)

To enable automated daily backups of database and images:
1. In Hostinger hPanel -> **Advanced** -> **Cron Jobs**.
2. Add a Custom Cron Job running daily at 2:00 AM:
   ```bash
   curl -s -X POST "https://jaipurstonecraft.com/api/admin/backup?key=YOUR_BACKUP_SECRET_KEY" > /dev/null 2>&1
   ```

---

## 9. Production -> Local Synchronization (Backup & Development)

To pull the production database back to your local development environment:
1. Configure `PRODUCTION_DATABASE_URL` in your local `.env` (using Hostinger Remote MySQL or SSH tunnel).
2. Run the safe one-way sync command:
   ```bash
   npm run sync:prod
   ```
3. This creates a timestamped compressed backup in `backups/db/cloud_sync/` and refreshes your local MySQL mirror without altering production data.

---

## 10. Disaster Recovery & Rollback Procedure

### Application Rollback
If a code deployment causes issues:
```bash
git checkout <previous-commit-hash>
npm run build
# Restart application in hPanel
```

### Database Restoration
To restore a database dump:
```bash
node --env-file=.env scripts/restore-runner.js --db --file backups/db/full/db_full_YYYY-MM-DD.sql.gz
```

### Media Restoration
To restore images from a timestamped manifest:
```bash
node --env-file=.env scripts/restore-runner.js --images --manifest backups/images/manifests/images_manifest_YYYY-MM-DD.json
```

---

## 11. Important File & Directory Rules

| Resource | Scope | Persistence Rule |
| :--- | :--- | :--- |
| `public/uploads/` | Production & Local | **NEVER DELETE**. Stores customer & catalog media assets. |
| `backups/` | Production & Local | Stores historical SQL and image archives. Retained per policy. |
| `.env` | Local Only | **NEVER COMMIT TO GIT**. Contains sensitive local credentials. |
| `data/` | Local Legacy | Local SQLite reference copy; not used in production. |
| `server.js` | Universal | Core production server startup entry point. |


