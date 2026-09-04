import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { query } from '../lib/db/client.js';

const APP_DIR = "/home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com/hbuilds/current/nodejs";

async function syncAllCms() {
  console.log("================================================================================");
  console.log("SYNCING ALL LOCAL CMS CONTENT & PAGES TO HOSTINGER PRODUCTION");
  console.log("================================================================================");

  // 1. Extract all CMS tables
  console.log("1. Reading local tables (page_sections, site_content, site_settings, projects, subcategories, categories)...");
  const pageSections = await query("SELECT key_name, page, section_id, label, content_json FROM page_sections");
  const siteContent = await query("SELECT key_name, value FROM site_content");
  const siteSettings = await query("SELECT key_name, category, label, value FROM site_settings");
  const projects = await query("SELECT id, slug, name, type, location, year, description, materials, craftsmanship, final_result, image_src, gallery, products_used, sort_order FROM projects");
  const subcategories = await query("SELECT id, slug, parent_collection_slug, name, description, image_src, sort_order, is_active FROM subcategories");
  const categories = await query("SELECT id, slug, parent_collection_slug, parent_subcategory_slug, name, description, image_src, image_alt, featured, sort_order, is_active FROM categories");

  console.log(`- page_sections: ${pageSections.length} rows`);
  console.log(`- site_content:  ${siteContent.length} rows`);
  console.log(`- site_settings: ${siteSettings.length} rows`);
  console.log(`- projects:      ${projects.length} rows`);
  console.log(`- subcategories: ${subcategories.length} rows`);
  console.log(`- categories:    ${categories.length} rows`);

  const payload = {
    pageSections,
    siteContent,
    siteSettings,
    projects,
    subcategories,
    categories
  };

  fs.writeFileSync('scratch/full_cms_payload.json', JSON.stringify(payload, null, 2));

  // 2. Upload payload to Hostinger
  console.log("2. Uploading payload to Hostinger server...");
  execSync(
    `scp -i scratch/deploy_key -P 65002 -o BatchMode=yes -o StrictHostKeyChecking=accept-new scratch/full_cms_payload.json u209772524@217.21.91.171:${APP_DIR}/full_cms_payload.json`,
    { stdio: 'inherit' }
  );

  // 3. Prepare remote updater script
  console.log("3. Preparing remote database updater script...");
  const remoteScript = `
const fs = require("fs");
const mysql = require("mysql2/promise");
const path = require("path");

async function applySync() {
  const envPath = path.join(__dirname, ".env");
  const env = fs.readFileSync(envPath, "utf8");
  const dbMatch = env.match(/DATABASE_URL=(.+)/);
  if (!dbMatch) {
    console.error("DATABASE_URL not found in .env");
    process.exit(1);
  }

  const dbUrl = dbMatch[1].trim().replace(/^['"]|['"]$/g, "");
  const payloadPath = path.join(__dirname, "full_cms_payload.json");
  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));

  const conn = await mysql.createConnection(dbUrl);
  console.log("Connected to Hostinger MySQL database.");

  // Schema verification: ensure sort_order exists on subcategories and categories
  try {
    const [subCols] = await conn.query("SHOW COLUMNS FROM subcategories LIKE 'sort_order'");
    if (!subCols || subCols.length === 0) {
      await conn.query("ALTER TABLE subcategories ADD COLUMN sort_order INT DEFAULT 0");
      console.log("  [Schema Migration] Added sort_order column to subcategories.");
    }
  } catch (e) {
    console.warn("  [Schema Warning] subcategories sort_order:", e.message);
  }

  try {
    const [catCols] = await conn.query("SHOW COLUMNS FROM categories LIKE 'sort_order'");
    if (!catCols || catCols.length === 0) {
      await conn.query("ALTER TABLE categories ADD COLUMN sort_order INT DEFAULT 0");
      console.log("  [Schema Migration] Added sort_order column to categories.");
    }
  } catch (e) {
    console.warn("  [Schema Warning] categories sort_order:", e.message);
  }

  // A. Update page_sections
  for (const row of payload.pageSections) {
    await conn.execute(
      \`INSERT INTO page_sections (key_name, page, section_id, label, content_json, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         page = VALUES(page),
         section_id = VALUES(section_id),
         label = VALUES(label),
         content_json = VALUES(content_json),
         updated_at = CURRENT_TIMESTAMP\`,
      [row.key_name, row.page, row.section_id, row.label, row.content_json]
    );
    console.log("  [page_sections] Synced:", row.key_name);
  }

  // B. Update site_content
  for (const row of payload.siteContent) {
    await conn.execute(
      \`INSERT INTO site_content (key_name, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         value = VALUES(value),
         updated_at = CURRENT_TIMESTAMP\`,
      [row.key_name, row.value]
    );
    console.log("  [site_content] Synced:", row.key_name);
  }

  // C. Update site_settings
  for (const row of payload.siteSettings) {
    await conn.execute(
      \`INSERT INTO site_settings (key_name, category, label, value, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         category = VALUES(category),
         label = VALUES(label),
         value = VALUES(value),
         updated_at = CURRENT_TIMESTAMP\`,
      [row.key_name, row.category, row.label, row.value]
    );
    console.log("  [site_settings] Synced:", row.key_name);
  }

  // D. Update projects
  for (const row of payload.projects) {
    await conn.execute(
      \`INSERT INTO projects (id, slug, name, type, location, year, description, materials, craftsmanship, final_result, image_src, gallery, products_used, sort_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         slug = VALUES(slug),
         name = VALUES(name),
         type = VALUES(type),
         location = VALUES(location),
         year = VALUES(year),
         description = VALUES(description),
         materials = VALUES(materials),
         craftsmanship = VALUES(craftsmanship),
         final_result = VALUES(final_result),
         image_src = VALUES(image_src),
         gallery = VALUES(gallery),
         products_used = VALUES(products_used),
         sort_order = VALUES(sort_order),
         updated_at = CURRENT_TIMESTAMP\`,
      [
        row.id, row.slug, row.name, row.type, row.location, row.year,
        row.description, row.materials, row.craftsmanship, row.final_result,
        row.image_src, JSON.stringify(row.gallery || []), JSON.stringify(row.products_used || []),
        row.sort_order
      ]
    );
    console.log("  [projects] Synced:", row.slug || row.id);
  }

  // E. Update subcategories (covers & sort orders)
  if (payload.subcategories && payload.subcategories.length > 0) {
    for (const row of payload.subcategories) {
      await conn.execute(
        \`INSERT INTO subcategories (id, slug, parent_collection_slug, name, description, image_src, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           parent_collection_slug = VALUES(parent_collection_slug),
           name = VALUES(name),
           description = VALUES(description),
           image_src = VALUES(image_src),
           sort_order = VALUES(sort_order),
           is_active = VALUES(is_active)\`,
        [row.id, row.slug, row.parent_collection_slug, row.name, row.description, row.image_src, row.sort_order ?? 0, row.is_active ?? 1]
      );
      console.log("  [subcategories] Synced:", row.slug);
    }
  }

  // F. Update categories (covers & sort orders)
  if (payload.categories && payload.categories.length > 0) {
    for (const row of payload.categories) {
      await conn.execute(
        \`INSERT INTO categories (id, slug, parent_collection_slug, parent_subcategory_slug, name, description, image_src, image_alt, featured, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           parent_collection_slug = VALUES(parent_collection_slug),
           parent_subcategory_slug = VALUES(parent_subcategory_slug),
           name = VALUES(name),
           description = VALUES(description),
           image_src = VALUES(image_src),
           image_alt = VALUES(image_alt),
           featured = VALUES(featured),
           sort_order = VALUES(sort_order),
           is_active = VALUES(is_active)\`,
        [row.id, row.slug, row.parent_collection_slug, row.parent_subcategory_slug, row.name, row.description, row.image_src, row.image_alt, row.featured ?? 0, row.sort_order ?? 0, row.is_active ?? 1]
      );
      console.log("  [categories] Synced:", row.slug);
    }
  }

  await conn.end();
  try { fs.unlinkSync(payloadPath); } catch(e) {}
  console.log("ALL CMS & TAXONOMY DATABASE ROWS SUCCESSFULLY COMMITTED ON HOSTINGER!");
}

applySync().catch(err => {
  console.error("FATAL ERROR applying sync on Hostinger:", err);
  process.exit(1);
});
`;

  fs.writeFileSync('scratch/remote_full_sync.cjs', remoteScript);

  execSync(
    `scp -i scratch/deploy_key -P 65002 -o BatchMode=yes -o StrictHostKeyChecking=accept-new scratch/remote_full_sync.cjs u209772524@217.21.91.171:${APP_DIR}/remote_full_sync.cjs`,
    { stdio: 'inherit' }
  );

  // 4. Execute remote script
  console.log("4. Executing remote database sync on Hostinger...");
  const remoteCmd = `export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH && cd ${APP_DIR} && node remote_full_sync.cjs && rm -f remote_full_sync.cjs`;

  await new Promise((resolve, reject) => {
    const ssh = spawn("ssh", [
      "-i", "scratch/deploy_key",
      "-p", "65002",
      "-o", "BatchMode=yes",
      "-o", "StrictHostKeyChecking=accept-new",
      "u209772524@217.21.91.171",
      "bash"
    ]);

    ssh.stdout.pipe(process.stdout);
    ssh.stderr.pipe(process.stderr);

    ssh.stdin.write(remoteCmd + "\n");
    ssh.stdin.end();

    ssh.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Remote sync failed with exit code ${code}`));
    });
  });

  // 5. Sync media bundle
  console.log("5. Ensuring all local media files are synced to Hostinger shared storage...");
  execSync("node scripts/sync_media_to_hostinger.mjs", { stdio: 'inherit' });

  // 6. Reload Passenger worker so Next.js cache reloads
  console.log("6. Triggering graceful reload of Passenger / Next.js on Hostinger...");
  const restartCmd = `export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH && mkdir -p /home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com/public_html/tmp && touch /home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com/public_html/tmp/restart.txt`;
  execSync(
    `ssh -i scratch/deploy_key -p 65002 -o BatchMode=yes -o StrictHostKeyChecking=accept-new u209772524@217.21.91.171 "${restartCmd}"`,
    { stdio: 'inherit' }
  );

  console.log("================================================================================");
  console.log("SUCCESS: ALL CMS CONTENT, MEDIA & PAGES ARE NOW IDENTICAL ON HOSTINGER!");
  console.log("================================================================================");
}

syncAllCms().catch(console.error);
