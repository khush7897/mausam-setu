import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const setupDatabase = async () => {
  console.log('── Setting up Mausam Setu Database ──');

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  // Attempt MySQL setup if credentials/connection available
  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true,
      connectTimeout: 3000,
    });

    console.log(`✓ Connected to MySQL server at ${host}:${port}`);

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        try {
          await connection.query(statement);
          console.log(`✓ Executed: ${statement.substring(0, 45).replace(/\n/g, ' ')}...`);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.error(`✗ Statement warning: ${err.message}`);
          }
        }
      }
    }

    await connection.end();
    console.log('\n✅ MySQL database initialized successfully!');
  } catch (mysqlErr) {
    console.log(`\nℹ Notice: MySQL server is not running or unreachable (${mysqlErr.code || mysqlErr.message}).`);
    console.log('✓ Initializing embedded zero-config SQLite database instead...');
  }

  // Ensure tables and demo seeds are initialized via the adapter
  try {
    await initDatabase();
    console.log('\n🎉 Setup completed! You can now start the application:');
    console.log('   npm start');
  } catch (err) {
    console.error('❌ Setup encountered an error:', err.message);
    process.exit(1);
  }
};

setupDatabase();
