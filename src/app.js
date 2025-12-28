import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory (one level up from src/)
dotenv.config({ path: join(__dirname, '..', '.env') });

// Verify env variables are loaded
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes ✓' : 'No ✗');

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