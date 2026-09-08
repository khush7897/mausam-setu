/**
 * MAUSAM SETU — Database Connection Pool & Adapter
 * Supports both MySQL (when available) and zero-config SQLite fallback.
 * Uses mysql2/promise or Node.js native sqlite.
 */

import mysql from 'mysql2/promise';
import { DatabaseSync } from 'node:sqlite';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to cwd .env if any

let activeEngine = null; // 'mysql' | 'sqlite'
let mysqlPool = null;
let sqliteDb = null;

// Initial demo users to seed so that the demo accounts work immediately
const DEMO_SEEDS = [
  { name: 'Arjun Singh', mobile: '9876543210', email: 'user@demo.com', pass: 'demo123', role: 'citizen', state: 'Delhi' },
  { name: 'Priya Patel', mobile: '9123456789', email: 'farmer@demo.com', pass: 'demo123', role: 'farmer', state: 'Gujarat' },
  { name: 'Rajan Kumar', mobile: '9012345678', email: 'fish@demo.com', pass: 'demo123', role: 'fisherman', state: 'Tamil Nadu' },
  { name: 'Admin User', mobile: '9000000000', email: 'admin@mausam.gov', pass: 'admin123', role: 'admin', state: 'Delhi' },
];

/**
 * Initialize SQLite database engine and schema
 */
const initSqlite = async () => {
  const dbPath = process.env.SQLITE_PATH || path.join(__dirname, 'mausam_setu.sqlite');
  sqliteDb = new DatabaseSync(dbPath);

  // Enable WAL mode for better concurrency
  sqliteDb.exec('PRAGMA journal_mode = WAL;');

  // Create users table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE,
      full_name TEXT NOT NULL,
      mobile_number TEXT NOT NULL UNIQUE,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'citizen',
      state TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile_number);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_resets_identifier ON password_resets(identifier);

    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      session_id TEXT,
      sender TEXT NOT NULL,
      message TEXT NOT NULL,
      raw_response TEXT,
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
  `);

  // Ensure default demo accounts exist so that demo logins work immediately out-of-the-box
  for (const u of DEMO_SEEDS) {
    const existing = sqliteDb.prepare('SELECT id FROM users WHERE mobile_number = ?').get(u.mobile);
    if (!existing) {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(u.pass, salt);
      const uuid = 'demo-' + u.mobile;
      sqliteDb.prepare(`
        INSERT INTO users (uuid, full_name, mobile_number, email, role, state, password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(uuid, u.name, u.mobile, u.email, u.role, u.state, hash);
    }
  }

  activeEngine = 'sqlite';
  console.log(`✓ Using SQLite database engine at: ${dbPath}`);
};

/**
 * Initialize MySQL connection pool and schema
 */
const initMysql = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'mausam_setu';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  // Test connection to MySQL server
  const testConn = await mysql.createConnection({
    host,
    user,
    password,
    port,
    connectTimeout: 2000,
  });

  await testConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await testConn.end();

  mysqlPool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
  });

  // Ensure table exists
  const conn = await mysqlPool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(10) NOT NULL UNIQUE,
        email VARCHAR(255),
        role ENUM('citizen', 'farmer', 'fisherman', 'student', 'official', 'admin') NOT NULL DEFAULT 'citizen',
        state VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_mobile (mobile_number),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_resets_id (identifier)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS chat_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100),
        session_id VARCHAR(100),
        sender VARCHAR(10) NOT NULL,
        message TEXT NOT NULL,
        raw_response TEXT,
        city VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_chat_user (user_id),
        INDEX idx_chat_session (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure default demo accounts exist so that demo logins work immediately out-of-the-box
    for (const u of DEMO_SEEDS) {
      const [existing] = await conn.query('SELECT id FROM users WHERE mobile_number = ?', [u.mobile]);
      if (existing.length === 0) {
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(u.pass, salt);
        const uuid = 'demo-' + u.mobile;
        await conn.query(
          'INSERT INTO users (uuid, full_name, mobile_number, email, role, state, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [uuid, u.name, u.mobile, u.email, u.role, u.state, hash]
        );
      }
    }
  } finally {
    conn.release();
  }

  activeEngine = 'mysql';
  console.log(`✓ Connected to MySQL database (${database}@${host}:${port})`);
};

/**
 * Auto-detect and establish database connection
 */
export const initDatabase = async () => {
  const preferredEngine = (process.env.DB_TYPE || 'auto').toLowerCase();

  if (preferredEngine === 'mysql') {
    try {
      await initMysql();
      return;
    } catch (err) {
      console.error('MySQL connection failed:', err.message);
      throw err;
    }
  }

  if (preferredEngine === 'sqlite') {
    await initSqlite();
    return;
  }

  // AUTO mode: Try MySQL first, fall back to SQLite gracefully
  try {
    await initMysql();
  } catch (err) {
    console.log(`ℹ MySQL not reachable (${err.code || err.message}). Auto-switching to embedded SQLite...`);
    await initSqlite();
  }
};

/**
 * Execute query against active database
 */
export const query = async (sql, params = []) => {
  if (!activeEngine) {
    await initDatabase();
  }

  if (activeEngine === 'mysql') {
    return await mysqlPool.query(sql, params);
  }

  // SQLite execution
  const trimmed = sql.trim();
  const isSelect = /^SELECT/i.test(trimmed);
  const isInsert = /^INSERT/i.test(trimmed);

  const stmt = sqliteDb.prepare(sql);

  if (isSelect) {
    const rows = stmt.all(...params);
    return [rows, []];
  } else if (isInsert) {
    const result = stmt.run(...params);
    return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }, []];
  } else {
    const result = stmt.run(...params);
    return [{ affectedRows: result.changes }, []];
  }
};

/**
 * Unified pool interface compatible with mysql2 Connection / Pool
 */
const pool = {
  query,
  getConnection: async () => {
    if (!activeEngine) {
      await initDatabase();
    }
    if (activeEngine === 'mysql') {
      return await mysqlPool.getConnection();
    }
    // Return SQLite connection wrapper
    return {
      query: (sql, params) => query(sql, params),
      release: () => {},
    };
  },
  getEngine: () => activeEngine,
  init: initDatabase,
};

export default pool;
