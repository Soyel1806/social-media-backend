import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST (only in development)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: join(__dirname, '..', '.env') });
}

// Verify env variables are loaded BEFORE importing database
console.log('Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes ✓' : 'No ✗');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DATABASE_PUBLIC_URL:', process.env.DATABASE_PUBLIC_URL ? 'SET' : 'NOT SET');
console.log('PGHOST:', process.env.PGHOST || 'NOT SET');
console.log('PGDATABASE:', process.env.PGDATABASE || 'NOT SET');
console.log('POSTGRES_DB:', process.env.POSTGRES_DB || 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '********' : 'NOT SET');

// NOW import database and other modules
import "./utils/database.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js"; 
import followRoutes from "./routes/follow.js";
import userRoutes from "./routes/users.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import { runScheduler } from "./scheduler/ScheduledPosts.js";

// Start scheduler
runScheduler();

//middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:3000", 
  credentials: true 
}));

//route mounting
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/follow", followRoutes);
app.use("/users", userRoutes);   
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);

// temporary test route
app.get("/", (req, res) => {
  res.send("Backend working! 🚀");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;