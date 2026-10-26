import fs from 'fs';
import mysql from 'mysql2/promise';

const envText = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
}

async function run() {
  const pool = mysql.createPool(env.DATABASE_URL);
  const [rows] = await pool.query("SELECT key_name, content_json FROM page_sections WHERE key_name IN ('homepage_discovery_statues', 'homepage_discovery_arch')");
  for (const r of rows) {
    console.log(`\n=== DB key: ${r.key_name} ===`);
    const data = JSON.parse(r.content_json || '{}');
    console.log('Items in DB:', data.items?.length);
    for (const item of (data.items || [])) {
      console.log(`  ${item.title}: customImage=${item.customImage}, imageSrc=${item.imageSrc}`);
    }
  }
  await pool.end();
}

run().catch(console.error);
