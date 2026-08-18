import mysql from "mysql2";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { CREATE_TABLES_SQL_STATEMENTS } from "./schema.js";

let mysqlPool = null;
let sqliteInstance = null;
let activeEngine = null; // 'mysql' | 'sqlite' | null
let lastConnectAttempt = 0;
const RETRY_INTERVAL_MS = 30000;

function getSqliteDB() {
  if (!sqliteInstance) {
    const dbDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, "jaipur_stonecraft.db");
    sqliteInstance = new Database(dbPath);
    sqliteInstance.pragma("journal_mode = WAL");
    sqliteInstance.pragma("synchronous = NORMAL");
    sqliteInstance.pragma("cache_size = -64000");
  }
  return sqliteInstance;
}

export function getPool() {
  if (!mysqlPool) {
    const connectionString = process.env.DATABASE_URL || "";
    mysqlPool = mysql.createPool({
      uri: connectionString || "mysql://localhost:3306/jaipur_stonecraft",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return mysqlPool;
}

export function getDB() {
  return getSqliteDB();
}

async function probeEngine() {
  // If engine determined as mysql and it's working, stick with mysql.
  if (activeEngine === "mysql") {
    return "mysql";
  }

  // If engine failed recently, stay on sqlite until retry interval passes
  if (activeEngine === "sqlite" && Date.now() - lastConnectAttempt < RETRY_INTERVAL_MS) {
    return "sqlite";
  }

  const connectionString = process.env.DATABASE_URL || "";
  if (!connectionString) {
    activeEngine = "sqlite";
    return "sqlite";
  }

  lastConnectAttempt = Date.now();

  return new Promise((resolve) => {
    try {
      const pool = getPool();
      pool.query("SELECT 1", (err) => {
        if (err) {
          if (activeEngine !== "sqlite") {
            console.warn(`[DB Client Warning]: MySQL server unreachable at ${connectionString}. Using local SQLite database.`);
          }
          activeEngine = "sqlite";
          resolve("sqlite");
        } else {
          if (activeEngine !== "mysql") {
            console.log(`[DB Client]: Connected to MySQL database server successfully.`);
          }
          activeEngine = "mysql";
          resolve("mysql");
        }
      });
    } catch (e) {
      activeEngine = "sqlite";
      resolve("sqlite");
    }
  });
}

export async function query(sql, params = []) {
  const engine = await probeEngine();

  if (engine === "sqlite") {
    try {
      const db = getSqliteDB();
      const stmt = db.prepare(sql);
      const isSelect = /^\s*(SELECT|SHOW|PRAGMA|EXPLAIN)\b/i.test(sql);
      if (isSelect) {
        const rows = stmt.all(...params);
        return Array.isArray(rows) ? rows : [];
      } else {
        const info = stmt.run(...params);
        return [{ affectedRows: info.changes, insertId: info.lastInsertRowid }];
      }
    } catch (err) {
      console.error("[SQLite Query Error]:", err.message, "SQL:", sql);
      throw err;
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const pool = getPool();
      pool.query(sql, params, (err, rows) => {
        if (err) {
          activeEngine = "sqlite";
          console.warn("[MySQL Query Error, failing over to SQLite]:", err.message);
          // Try fallback execution once on SQLite
          try {
            const db = getSqliteDB();
            const stmt = db.prepare(sql);
            const fallbackRows = stmt.all(...params);
            return resolve(Array.isArray(fallbackRows) ? fallbackRows : []);
          } catch (sqliteErr) {
            return reject(err);
          }
        }
        return resolve(Array.isArray(rows) ? rows : []);
      });
    } catch (e) {
      activeEngine = "sqlite";
      reject(e);
    }
  });
}

export async function getOne(sql, params = []) {
  try {
    const rows = await query(sql, params);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    return null;
  }
}

export async function execute(sql, params = []) {
  const engine = await probeEngine();

  if (engine === "sqlite") {
    try {
      const db = getSqliteDB();
      const stmt = db.prepare(sql);
      const info = stmt.run(...params);
      return {
        affectedRows: info.changes,
        insertId: info.lastInsertRowid
      };
    } catch (err) {
      console.error("[SQLite Execute Error]:", err.message, "SQL:", sql);
      throw err;
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const pool = getPool();
      pool.execute(sql, params, (err, result) => {
        if (err) {
          activeEngine = "sqlite";
          console.warn("[MySQL Execute Error, failing over to SQLite]:", err.message);
          try {
            const db = getSqliteDB();
            const stmt = db.prepare(sql);
            const info = stmt.run(...params);
            return resolve({
              affectedRows: info.changes,
              insertId: info.lastInsertRowid
            });
          } catch (sqliteErr) {
            return reject(err);
          }
        }
        return resolve({
          affectedRows: result ? result.affectedRows : 0,
          insertId: result ? result.insertId : 0
        });
      });
    } catch (e) {
      activeEngine = "sqlite";
      reject(e);
    }
  });
}

let isInitialized = false;

export async function initDB() {
  if (isInitialized) return;

  try {
    const engine = await probeEngine();

    if (engine === "sqlite") {
      const db = getSqliteDB();
      // Ensure SQLite tables exist
      db.exec(`
        CREATE TABLE IF NOT EXISTS collections (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          image_src TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS subcategories (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL,
          parent_collection_slug TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          image_src TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          parent_collection_slug TEXT NOT NULL,
          parent_subcategory_slug TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          image_src TEXT,
          image_alt TEXT,
          featured INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS materials (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          origin TEXT,
          color_family TEXT,
          durability TEXT,
          is_sacred_grade INTEGER DEFAULT 0,
          description TEXT,
          is_active INTEGER DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS subjects (
          id TEXT PRIMARY KEY,
          primary_name TEXT NOT NULL,
          synonyms TEXT,
          tradition TEXT,
          iconography_elements TEXT,
          default_category_slug TEXT,
          is_active INTEGER DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS product_types (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          is_active INTEGER DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS attribute_definitions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          data_type TEXT NOT NULL,
          options TEXT,
          applies_to_product_types TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          sku TEXT UNIQUE NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          status TEXT DEFAULT 'published',
          is_featured INTEGER DEFAULT 0,
          is_new_arrival INTEGER DEFAULT 0,
          is_custom_only INTEGER DEFAULT 0,
          product_type TEXT NOT NULL,
          parent_collection TEXT NOT NULL,
          parent_subcategory TEXT NOT NULL,
          parent_category TEXT NOT NULL,
          subject_id TEXT,
          primary_material_id TEXT NOT NULL,
          short_description TEXT,
          detailed_description TEXT,
          knowledge_layer TEXT,
          attributes TEXT,
          tags TEXT,
          variants TEXT,
          seo TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS product_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_slug TEXT NOT NULL,
          url TEXT NOT NULL,
          alt_text TEXT,
          role TEXT DEFAULT 'gallery',
          sort_order INTEGER DEFAULT 0,
          is_primary INTEGER DEFAULT 0,
          FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS site_content (
          key_name TEXT PRIMARY KEY,
          page TEXT NOT NULL,
          label TEXT NOT NULL,
          type TEXT DEFAULT 'image',
          value TEXT NOT NULL,
          alt_text TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      for (const statement of CREATE_TABLES_SQL_STATEMENTS) {
        await query(statement);
      }
    }

    isInitialized = true;
  } catch (e) {
    console.error("[DB Client Init Error]:", e);
  }
}

export default getPool;
