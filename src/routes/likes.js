import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { like, unlike, postLikes, userLikes } from "../controllers/likes.js";

const router = express.Router();

// Like / Unlike
router.post("/:postId", verifyToken, like);
router.delete("/:postId", verifyToken, unlike);

// Get likes
router.get("/post/:postId", verifyToken, postLikes);
router.get("/user/:userId", verifyToken, userLikes);

export default router;
