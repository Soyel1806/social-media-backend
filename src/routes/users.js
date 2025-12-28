import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { searchUsers, follow, unfollow, profile, updateProfile } from "../controllers/users.js";

const router = express.Router();

router.get("/search", verifyToken, searchUsers);
router.get("/:userId", verifyToken, profile);
router.patch("/profile/update", verifyToken, updateProfile);

router.post("/:userId/follow", verifyToken, follow);
router.delete("/:userId/follow", verifyToken, unfollow);

export default router;

