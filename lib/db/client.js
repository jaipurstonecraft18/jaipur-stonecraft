import mysql from "mysql2";
import { CREATE_TABLES_SQL_STATEMENTS } from "./schema.js";

let mysqlPool = null;
let isInitialized = false;

/**
 * Get the MySQL connection pool
 */
export function getPool() {
  if (!mysqlPool) {
    const connectionString = process.env.DATABASE_URL || "";
    if (!connectionString) {
      throw new Error("[DB Client Error]: DATABASE_URL environment variable is missing.");
    }

    const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(connectionString);
    const sanitizedUri = connectionString.replace(/[?&]ssl-mode=[^&]+/i, "");
    
    mysqlPool = mysql.createPool({
      uri: sanitizedUri,
      ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 4,
      queueLimit: 0,
      connectTimeout: 8000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return mysqlPool;
}

/**
 * Initialize MySQL tables if they do not already exist
 */
export async function initDB() {
  if (isInitialized) return;
  isInitialized = true;

  try {
    const pool = getPool().promise();
    for (const statement of CREATE_TABLES_SQL_STATEMENTS) {
      await pool.query(statement);
    }
  } catch (err) {
    isInitialized = false;
    console.error("[MySQL Init Error]: Failed to initialize MySQL schema:", err.message);
    throw err;
  }
}

/**
 * Execute a parameterized SELECT / read query against MySQL
 */
export async function query(sql, params = []) {
  try {
    const pool = getPool().promise();
    const [rows] = await pool.query(sql, params);
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    console.error("[MySQL Query Error]:", err.message, "SQL:", sql);
    throw err;
  }
}

/**
 * Fetch a single row from MySQL
 */
export async function getOne(sql, params = []) {
  try {
    const rows = await query(sql, params);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("[MySQL getOne Error]:", error.message);
    throw error;
  }
}

/**
 * Execute an INSERT / UPDATE / DELETE write query against MySQL
 */
export async function execute(sql, params = []) {
  if (!isInitialized) {
    await initDB();
  }

  try {
    const pool = getPool().promise();
    const [result] = await pool.execute(sql, params);
    return {
      affectedRows: result ? result.affectedRows : 0,
      insertId: result ? result.insertId : 0
    };
  } catch (err) {
    console.error("[MySQL Execute Error]:", err.message, "SQL:", sql);
    throw err;
  }
}

export default getPool;

