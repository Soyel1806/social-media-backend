import {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
  getCommentById,
} from "../models/comment.js";
import {getPostDetailsById} from "../models/post.js"
import { verbose, critical } from "../utils/logger.js";

export const addComment = async (req, res) => {
  try {
    const { post_id, content } = req.body;
    const user_id = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // 🔥 NEW: check if commenting is allowed on this post
    const post = await getPostDetailsById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.comments_enabled) {
      return res.status(403).json({ message: "Comments are disabled for this post" });
    }

    const comment = await createComment({ user_id, post_id, content });
    verbose(`User ${user_id} commented on post ${post_id}`);

    return res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    critical("ADD COMMENT ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editComment = async (req, res) => {
  try {
    const comment_id = parseInt(req.params.commentId);
    const { content } = req.body;
    const user_id = req.user.id;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const success = await updateComment({ comment_id, user_id, content });

    if (!success) return res.status(404).json({ message: "Comment not found or unauthorized" });

    return res.json({ message: "Comment updated" });
  } catch (err) {
    critical("EDIT COMMENT ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeComment = async (req, res) => {
  try {
    const comment_id = parseInt(req.params.commentId);
    const user_id = req.user.id;

    const success = await deleteComment({ comment_id, user_id });

    if (!success) return res.status(404).json({ message: "Comment not found or unauthorized" });

    return res.json({ message: "Comment deleted" });
  } catch (err) {
    critical("DELETE COMMENT ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const listComments = async (req, res) => {
  try {
    const post_id = parseInt(req.params.postId);
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const comments = await getPostComments({ post_id, limit, offset });

    return res.json({ post_id, comments });
  } catch (err) {
    critical("LIST COMMENTS ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
