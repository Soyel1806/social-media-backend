// scripts/setup-database.js
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Only load .env in development (Railway provides env vars directly in production)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupDatabase = async () => {
  console.log('Database Setup - Environment Check:');
  console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
  console.log('DB_PORT:', process.env.DB_PORT || 'NOT SET');
  console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
  console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }  // IMPORTANT FOR RAILWAY !!!
  });

  try {
    console.log("🔧 Setting up database...");

    const schemaPath = path.join(__dirname, "../sql/schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schemaSQL);

    console.log("✅ Database schema created successfully!");
  } catch (error) {
    console.error("❌ Database setup failed!", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Allow running via: node scripts/setup-database.js
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}