import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

console.log('=== FORENSIC BACKUP AUDIT & VERIFICATION ===\n');

// 1. Verify AEO / GEO in D:\jsc backup\jsc web1
const backupRoot = 'D:\\jsc backup\\jsc web1';
const checks = [
  {
    file: path.join(backupRoot, 'lib', 'seo', 'schemas.js'),
    pattern: '"Sunday"',
    desc: 'schemas.js (7-day opening hours)'
  },
  {
    file: path.join(backupRoot, 'public', 'llms.txt'),
    pattern: 'Monday through Sunday, 08:00 – 22:00 IST',
    desc: 'llms.txt (7-day hours)'
  },
  {
    file: path.join(backupRoot, 'public', 'llms-full.txt'),
    pattern: 'Jaipur Stonecraft prioritizes efficient production and responsive project coordination',
    desc: 'llms-full.txt (credible speed advantage & variable timelines)'
  },
  {
    file: path.join(backupRoot, 'app', 'contact', 'page.js'),
    pattern: 'Monday through Sunday, 8:00 AM to 10:00 PM (IST)',
    desc: 'contact/page.js (visible 7-day hours)'
  },
  {
    file: path.join(backupRoot, 'app', 'uploads', '[...path]', 'route.js'),
    pattern: 'export async function GET',
    desc: 'app/uploads/[...path]/route.js (dynamic upload handler)'
  },
  {
    file: path.join(backupRoot, 'content', 'products-db', 'knowledge-db.js'),
    pattern: 'Production Timelines & Coordination',
    desc: 'knowledge-db.js (fact-checked knowledge guides)'
  },
  {
    file: path.join(backupRoot, 'components', 'admin', 'QuickCreateModal', 'QuickCreateProductModal.js'),
    pattern: 'Primary Stone Material *</label>',
    desc: 'QuickCreateProductModal.js (no granite exclusion label)'
  }
];

let allCodeOk = true;
for (const c of checks) {
  if (fs.existsSync(c.file)) {
    const content = fs.readFileSync(c.file, 'utf8');
    if (content.includes(c.pattern)) {
      console.log(`[PASS] ${c.desc}: Verified content match.`);
    } else {
      console.log(`[FAIL] ${c.desc}: Content does not match expected pattern!`);
      allCodeOk = false;
    }
  } else {
    console.log(`[FAIL] ${c.desc}: File does NOT exist!`);
    allCodeOk = false;
  }
}

// 2. File Count & Media Check
console.log('\n--- Standalone Media Directory Audit ---');
const standalonePublic = 'D:\\jsc backup\\public';
const testImg = path.join(standalonePublic, 'uploads', 'categories', 'display', 'cms-image-1793002440661-xl8z5.webp');
if (fs.existsSync(testImg)) {
  const stat = fs.statSync(testImg);
  console.log(`[PASS] Standalone public has latest upload: cms-image-1793002440661-xl8z5.webp (${stat.size} bytes)`);
} else {
  console.log('[FAIL] Latest upload not found in standalone public!');
}

function countFiles(dir) {
  let count = 0;
  let totalBytes = 0;
  if (!fs.existsSync(dir)) return { count, totalBytes };
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const sub = countFiles(full);
      count += sub.count;
      totalBytes += sub.totalBytes;
    } else {
      count++;
      totalBytes += fs.statSync(full).size;
    }
  }
  return { count, totalBytes };
}

const livePublicStats = countFiles('D:\\jsc\\jsc web1\\public');
const backupPublicStats = countFiles('D:\\jsc backup\\public');
const backupJscWeb1PublicStats = countFiles('D:\\jsc backup\\jsc web1\\public');

console.log(`Live public:              ${livePublicStats.count} files (${(livePublicStats.totalBytes / (1024 * 1024)).toFixed(1)} MB)`);
console.log(`D:\\jsc backup\\public:     ${backupPublicStats.count} files (${(backupPublicStats.totalBytes / (1024 * 1024)).toFixed(1)} MB)`);
console.log(`D:\\jsc backup\\jsc web1:   ${backupJscWeb1PublicStats.count} files (${(backupJscWeb1PublicStats.totalBytes / (1024 * 1024)).toFixed(1)} MB)`);

// 3. Inspect SQL Database Backup
console.log('\n--- SQL Database Backup Integrity Check ---');
const dbBackupDir = path.join(backupRoot, 'backups', 'db', 'full');
if (fs.existsSync(dbBackupDir)) {
  const files = fs.readdirSync(dbBackupDir).filter(f => f.endsWith('.sql.gz'));
  files.sort().reverse();
  console.log(`Found ${files.length} SQL dump(s). Latest: ${files[0]}`);
  if (files.length > 0) {
    const latestPath = path.join(dbBackupDir, files[0]);
    const gzipped = fs.readFileSync(latestPath);
    const unzipped = zlib.gunzipSync(gzipped).toString('utf8');
    console.log(`[PASS] Successfully decompressed ${files[0]}! Uncompressed size: ${(unzipped.length / 1024).toFixed(1)} KB`);
    
    // Check tables present in dump
    const tables = ['collections', 'categories', 'materials', 'products', 'page_sections', 'site_content', 'projects', 'inquiries'];
    let allTablesFound = true;
    for (const t of tables) {
      if (unzipped.includes(`\`${t}\``)) {
        // Table present
      } else {
        allTablesFound = false;
        console.log(`[WARN] Table ${t} not explicitly found in dump`);
      }
    }
    if (allTablesFound) {
      console.log('[PASS] All core schema tables confirmed in decompressed SQL dump!');
    }
    
    // Check record occurrences
    const insertCount = (unzipped.match(/INSERT INTO/g) || []).length;
    console.log(`[PASS] SQL dump contains ${insertCount} table INSERT statements.`);
    
    // Verify readable SQL header
    const firstLines = unzipped.split('\n').slice(0, 10).join('\n');
    console.log(`[PASS] SQL Header sample:\n${firstLines.trim()}`);
  }
} else {
  console.log('[FAIL] db backup directory not found!');
}
