import { db } from "../utils/database.js";

export const likePost = async (userId, postId) => {
  const result = await db.query(
    `INSERT INTO likes (user_id, post_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [userId, postId]
  );
  return result.rows[0]; // if undefined → already liked
};

export const unlikePost = async (userId, postId) => {
  const result = await db.query(
    `DELETE FROM likes
     WHERE user_id = $1 AND post_id = $2
     RETURNING id`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

export const getPostLikes = async (postId) => {
  const result = await db.query(
    `SELECT users.id, users.username, users.full_name
     FROM likes
     JOIN users ON users.id = likes.user_id
     WHERE likes.post_id = $1`,
    [postId]
  );
  return result.rows;
};

export const getUserLikes = async (userId) => {
  const result = await db.query(
    `SELECT posts.*
     FROM likes
     JOIN posts ON posts.id = likes.post_id
     WHERE likes.user_id = $1
       AND posts.is_deleted = FALSE
     ORDER BY posts.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const hasUserLikedPost = async (userId, postId) => {
  const result = await db.query(
    `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

