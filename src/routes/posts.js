import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { validateRequest, createPostSchema } from "../utils/validation.js";
import { create, getMyPosts, remove, getPostDetails, getFeed} from "../controllers/posts.js";
const router = express.Router();

router.post("/", verifyToken, validateRequest(createPostSchema), create);
router.get("/my", verifyToken, getMyPosts);
router.get("/feed", verifyToken, getFeed);
router.get("/:id", verifyToken, getPostDetails);
router.delete("/:id", verifyToken, remove);  

export default router;
