import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const setupDatabase = async () => {
  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL file into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    // Connect to MySQL without selecting a database first
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'kanha',
      password: 'kanha123',
      multipleStatements: true,
    });

    console.log('✓ Connected to MySQL');

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          console.log(`✓ Executed: ${statement.substring(0, 50)}...`);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.error(`✗ Error executing statement: ${err.message}`);
          }
        }
      }
    }

    await connection.end();
    console.log('\n✅ Database setup completed successfully!');
    console.log('Database: mausam_setu');
    console.log('Table: users');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. MySQL is running');
    console.error('2. Root user password is empty (or update the script)');
    process.exit(1);
  }
};

setupDatabase();
