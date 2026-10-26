import fs from 'fs';
import mysql from 'mysql2/promise';
import { popularStatuesData } from '../content/discovery-sliders.js';

const envText = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
}

async function run() {
  const pool = mysql.createPool(env.DATABASE_URL);
  
  // Update homepage_discovery_statues in page_sections
  const contentJson = JSON.stringify(popularStatuesData);
  await pool.query(
    "UPDATE page_sections SET content_json = ?, updated_at = NOW() WHERE key_name = 'homepage_discovery_statues'",
    [contentJson]
  );
  
  console.log('Successfully synced homepage_discovery_statues into database page_sections table!');
  await pool.end();
}

run().catch(console.error);
