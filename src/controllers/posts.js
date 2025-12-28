import { 
  createPost, 
  getPostDetailsById, 
  getPostsByUserId,
  deletePostById,
  getFeedPosts 
} from "../models/post.js";
import { verbose, critical } from "../utils/logger.js";

// convert IST → UTC
const convertISTtoUTC = (dateString) => {
  const date = new Date(dateString); // input has timezone +05:30
  return date.toISOString();         // automatically converted to UTC
};

export const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled, scheduled_at } = req.body;
    const userId = req.user.id;

    if (!content)
      return res.status(400).json({ error: "Content is required" });

    let utcScheduledAt = null;

    if (scheduled_at) {
      try {
        utcScheduledAt = convertISTtoUTC(scheduled_at);
      } catch (e) {
        return res.status(400).json({ error: "Invalid scheduled_at format" });
      }
    }

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled,
      scheduled_at: utcScheduledAt
    });

    verbose(`User ${userId} created post ${post.id}${post.is_scheduled ? " (scheduled)" : ""}`);

    return res.status(201).json({
      message: post.is_scheduled ? "Post scheduled successfully" : "Post created successfully",
      post
    });
  } catch (error) {
    critical("Create post error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await getPostsByUserId(userId);
    return res.json({ posts });
  } catch (error) {
    critical("Get posts error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const deleted = await deletePostById(postId, userId);

    if (!deleted) {
      return res.status(404).json({
        message: "Post not found or you are not the owner",
      });
    }

    return res.json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostDetails = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await getPostDetailsById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);

  } catch (error) {
    console.error("GET POST DETAILS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await getFeedPosts(userId, limit, offset);

    return res.json({
      posts,
      pagination: {
        limit,
        offset,
        count: posts.length
      }
    });
  } catch (error) {
    console.error("FEED ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};