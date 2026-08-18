import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';

// Simple env loader
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

let sqliteInstance = null;
let mysqlPool = null;
let activeEngine = null; // 'mysql' | 'sqlite'

function getSqliteDB() {
  if (!sqliteInstance) {
    const dbDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    const dbPath = path.join(dbDir, "jaipur_stonecraft.db");
    sqliteInstance = new Database(dbPath);
    sqliteInstance.pragma("journal_mode = WAL");
    sqliteInstance.pragma("synchronous = NORMAL");
  }
  return sqliteInstance;
}

async function determineEngine() {
  if (activeEngine) return activeEngine;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    activeEngine = "sqlite";
    return activeEngine;
  }

  try {
    const conn = await mysql.createConnection({
      uri: dbUrl,
      connectTimeout: 1000
    });
    await conn.ping();
    await conn.end();
    activeEngine = "mysql";
    console.log("[DB Client]: Successfully connected to MySQL server.");
  } catch (err) {
    console.warn(`[DB Client]: Could not connect to MySQL server (${err.code}). Falling back to local SQLite database.`);
    activeEngine = "sqlite";
  }

  return activeEngine;
}

export async function testQuery(sql, params = []) {
  const engine = await determineEngine();
  if (engine === "sqlite") {
    const db = getSqliteDB();
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } else {
    // MySQL query
    const pool = mysql.createPool(process.env.DATABASE_URL);
    const [rows] = await pool.query(sql, params);
    return rows;
  }
}

async function run() {
  console.log("Testing dual DB determination...");
  const engine = await determineEngine();
  console.log("Engine selected:", engine);

  const products = await testQuery("SELECT id, name, slug FROM products LIMIT 5");
  console.log("Returned products count:", products.length);
  console.log("Sample:", products[0]);
}

run();
