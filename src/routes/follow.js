import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { follow, unfollow, getFollowStats } from "../controllers/follow.js";

const router = express.Router();

router.post("/:userId", verifyToken, follow);         // follow
router.delete("/:userId", verifyToken, unfollow);     // unfollow
router.get("/:userId", verifyToken, getFollowStats);  // get stats

export default router;
