import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool
export const db = new Pool({
  user: "postgres",       // your postgres username
  host: "localhost",
  database: "social_media",  // the DB you created earlier
  password: "Soyelig@1806", // replace with your actual password
  port: 5432,
});

// Just to verify connection works (run once)
db.connect()
  .then(() => console.log("PostgreSQL connected successfully 🟢"))
  .catch(err => console.log("PostgreSQL connection error 🔴", err));

