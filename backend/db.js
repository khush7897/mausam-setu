/**
 * MAUSAM SETU — Database Connection Pool
 * Uses mysql2/promise for async/await support
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'kanha',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'mausam_setu',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

export default pool;
