import {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
  hasUserLikedPost
} from "../models/like.js";

export const like = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);

  const already = await hasUserLikedPost(userId, postId);
  if (already) return res.json({ message: "Already liked" });

  const result = await likePost(userId, postId);
  return res.json({ message: result ? "Liked successfully" : "Already liked" });
};

export const unlike = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);

  const removed = await unlikePost(userId, postId);
  return res.json({ message: removed ? "Unliked successfully" : "You haven't liked this post" });
};

export const postLikes = async (req, res) => {
  const postId = parseInt(req.params.postId);
  const likes = await getPostLikes(postId);
  return res.json({ postId, likes, count: likes.length });
};

export const userLikes = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const posts = await getUserLikes(userId);
  return res.json({ userId, liked_posts: posts });
};

