import { db } from "../utils/database.js";

// create a comment
export const createComment = async ({ user_id, post_id, content }) => {
  const result = await db.query(
    `INSERT INTO comments (user_id, post_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, post_id, content, created_at`,
    [user_id, post_id, content]
  );
  return result.rows[0];
};

// update comment (only if user owns the comment)
export const updateComment = async ({ comment_id, user_id, content }) => {
  const result = await db.query(
    `UPDATE comments
     SET content = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3 AND is_deleted = FALSE
     RETURNING id`,
    [content, comment_id, user_id]
  );
  return result.rowCount > 0;
};

// soft delete comment
export const deleteComment = async ({ comment_id, user_id }) => {
  const result = await db.query(
    `UPDATE comments
     SET is_deleted = TRUE
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
     RETURNING id`,
    [comment_id, user_id]
  );
  return result.rowCount > 0;
};

// get a single comment (for ownership checks)
export const getCommentById = async (comment_id) => {
  const result = await db.query(
    `SELECT * FROM comments WHERE id = $1`,
    [comment_id]
  );
  return result.rows[0];
};

// get comments for a post with pagination
export const getPostComments = async ({ post_id, limit, offset }) => {
  const result = await db.query(
    `SELECT c.id, c.user_id, u.username, c.content, c.created_at
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1 AND c.is_deleted = FALSE
     ORDER BY c.created_at DESC
     LIMIT $2 OFFSET $3`,
    [post_id, limit, offset]
  );
  return result.rows;
};
