# Jaipur Stonecraft — Hostinger Production Deployment & Operations Manual

This document provides step-by-step instructions for deploying, configuring, and operating the Jaipur Stonecraft platform on Hostinger Node.js Application Hosting.

---

## 1. Prerequisites & Hostinger Environment Checklist

Before deploying, ensure you have access to:
1. **Hostinger hPanel**: Domain manager & Node.js Application Manager.
2. **Hostinger MySQL Database**: Database name, username, password, and host (usually `localhost` or `127.0.0.1`).
3. **Domain Name**: Active SSL certificate enabled (HTTPS).
4. **Google Service Account Credentials** (Optional, for off-site backup sync to Google Drive).

---

## 2. Environment Configuration Checklist

In Hostinger hPanel -> **Node.js Web App** -> **Environment Variables**, configure the following variables:

```ini
# Core Node.js Environment
NODE_ENV=production
PORT=3000

# Hostinger Production Database (MySQL)
DATABASE_URL=mysql://jsc_db_user:YourStrongPassword123!@localhost:3306/jsc_production_db

# Admin Security & Session Keys (MUST BE STRONG & UNIQUE)
ADMIN_PASSWORD=SetYourStrongAdminPassword2026!
ADMIN_SECRET_KEY=GenerateA64CharRandomHexStringHere!

# Automated Backup & Off-Site Sync Configuration
BACKUP_SECRET_KEY=GenerateAnother64CharRandomKeyForCronJobs!
BACKUP_RETENTION_COUNT=14

# Off-Site Google Drive Backup Sync (Service Account JWT)
GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL=backup-service@your-project-id.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=1A2B3C4D5E6F7G8H9I0J
```

> [!CAUTION]
> Never commit real production secrets to GitHub. Always set them via Hostinger environment variables or `.env.production`.

---

## 3. Database Migration Procedure

### Step A: Export Local Database Dump
Run the automated database exporter locally to generate the latest ANSI SQL dump:
```bash
npm run backup
```
This outputs a timestamped SQL dump file under `backups/db/` (e.g. `backups/db/db_backup_YYYY-MM-DD_HHmmss.sql`).

### Step B: Import Database into Hostinger MySQL
1. Log in to Hostinger hPanel -> **Databases** -> **MySQL Databases**.
2. Create a new MySQL Database (e.g., `jsc_production_db`) and User (e.g., `jsc_db_user`).
3. Open **phpMyAdmin** for your database.
4. Click **Import** -> Choose the generated `db_backup_*.sql` file -> Click **Go**.
5. All 10 schema tables (`collections`, `subcategories`, `categories`, `materials`, `subjects`, `product_types`, `attribute_definitions`, `products`, `product_images`, `product_variant_links`) and data will be created cleanly.

---

## 4. Production Image Storage Setup

Per Phase 2's confirmed architecture (**Hostinger Native Storage with multi-variant WebP processing**):
1. Ensure the directory `public/uploads/` is created on the server with write permissions:
   ```bash
   public/uploads/products/raw/
   public/uploads/products/display/
   public/uploads/products/card/
   public/uploads/products/thumb/
   public/uploads/categories/raw/
   public/uploads/categories/display/
   public/uploads/categories/card/
   public/uploads/categories/thumb/
   ```
2. Uploaded image variants are served natively via standard web server paths (`/uploads/products/display/*.webp`) with maximum cache performance and zero cloud latency.

---

## 5. Deploying the Application to Hostinger

1. **Git Repository Push**: Push the repository code to your remote GitHub repository.
2. **Hostinger Node.js App Setup**:
   - Go to Hostinger hPanel -> **Setup Node.js App**.
   - Select **Node.js Version**: 20.x or 22.x LTS.
   - **Application Root**: `/public_html` (or your subfolder).
   - **Application Startup File**: `node_modules/next/dist/bin/next` (or `npm start`).
3. **Run Install & Build Commands**:
   - In Hostinger SSH / Terminal:
     ```bash
     npm install --production=false
     npm run build
     ```
4. **Start Application**: Click **Restart Application** in hPanel.

---

## 6. Automated Backup Setup (Hostinger Cron Job)

To enable automated daily backups of database and images:
1. In Hostinger hPanel -> **Advanced** -> **Cron Jobs**.
2. Add a Custom Cron Job running daily at 2:00 AM:
   ```bash
   curl -s -X POST "https://jaipurstonecraft.com/api/admin/backup?key=YOUR_BACKUP_SECRET_KEY" > /dev/null 2>&1
   ```
3. Alternatively, run the CLI backup runner via Node cron:
   ```bash
   cd /home/user/public_html && /usr/local/bin/node scripts/backup-runner.js >> backups/cron.log 2>&1
   ```

---

## 7. Restoration Quick Guide

- **Database Restoration**:
  ```bash
  node scripts/restore-runner.js --db --file backups/db/db_backup_2026-08-17.sql --target-db jsc_production_db
  ```
- **Image Restoration**:
  ```bash
  node scripts/restore-runner.js --images --file backups/images/images_backup_2026-08-17.json --target-dir public/uploads
  ```
