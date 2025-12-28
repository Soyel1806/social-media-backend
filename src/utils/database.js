import pkg from "pg";
const { Pool } = pkg;

let poolInstance = null;

// Lazy initialization - only create pool when first accessed
function getPool() {
  if (!poolInstance) {
    let dbConfig;

    // Priority 1: Use DATABASE_URL (Railway's preferred method)
    if (process.env.DATABASE_URL) {
      console.log("✅ Using DATABASE_URL from Railway Postgres reference");
      dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      };
    }
    // Priority 2: Use DATABASE_PUBLIC_URL (Railway alternative)
    else if (process.env.DATABASE_PUBLIC_URL) {
      console.log("✅ Using DATABASE_PUBLIC_URL from Railway");
      dbConfig = {
        connectionString: process.env.DATABASE_PUBLIC_URL,
        ssl: { rejectUnauthorized: false }
      };
    }
    // Priority 3: Use PG* variables (Railway also provides these)
    else if (process.env.PGHOST && process.env.PGPASSWORD) {
      console.log("✅ Using PG* variables from Railway");
      dbConfig = {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        ssl: { rejectUnauthorized: false }
      };
    } 
    // Priority 4: Use POSTGRES_* variables (Railway reference format)
    else if (process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD) {
      console.log("✅ Using POSTGRES_* variables from Railway");
      dbConfig = {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        ssl: { rejectUnauthorized: false }
      };
    }
    // Priority 5: Fallback to custom DB_* variables (for local development)
    else if (process.env.DB_PASSWORD) {
      console.log("✅ Using DB_* variables (local development)");
      
      dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      };
    } 
    else {
      console.error("❌ CRITICAL: No database configuration found!");
      console.error("Available env vars:", Object.keys(process.env).filter(k => 
        k.includes('DB') || k.includes('PG') || k.includes('POSTGRES') || k.includes('DATABASE')
      ));
      throw new Error("No database configuration available. Check Railway variable reference.");
    }

    console.log("📊 Database configuration loaded successfully");
    
    poolInstance = new Pool(dbConfig);

    // Connection event handlers
    poolInstance.on('connect', () => {
      console.log('✅ Database connected successfully');
    });

    poolInstance.on('error', (err) => {
      console.error('❌ Unexpected database error:', err);
    });

    // Test connection
    poolInstance.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error('❌ Database connection test failed:', err.message);
      } else {
        console.log('✅ Database connection test passed');
      }
    });
  }
  
  return poolInstance;
}

// Export a Proxy that creates the pool on first access
export const db = new Proxy({}, {
  get(target, prop) {
    const pool = getPool();
    const value = pool[prop];
    // Bind methods to the pool instance
    return typeof value === 'function' ? value.bind(pool) : value;
  }
});