import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addComment,
  editComment,
  removeComment,
  listComments,
} from "../controllers/comments.js";

const router = express.Router();

router.post("/", verifyToken, addComment);
router.patch("/:commentId", verifyToken, editComment);
router.delete("/:commentId", verifyToken, removeComment);
router.get("/post/:postId", verifyToken, listComments);

export default router;

