import { db } from "../utils/database.js";

export const createPost = async ({ user_id, content, media_url, comments_enabled = true, scheduled_at = null }) => {
  const is_scheduled = scheduled_at ? true : false;

  const result = await db.query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, scheduled_at, is_scheduled)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, content, media_url, comments_enabled, scheduled_at, is_scheduled, created_at`,
    [user_id, content, media_url, comments_enabled, scheduled_at, is_scheduled]
  );

  return result.rows[0];
};


export const getPostsByUserId = async (userId) => {
  const result = await db.query(
    `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;    
};

export const deletePostById = async (postId, userId) => {
  // First, check if the post exists and belongs to the user
  const checkResult = await db.query(
    `SELECT id, user_id, is_deleted FROM posts WHERE id = $1`,
    [postId]
  );

  console.log('Post lookup:', checkResult.rows);

  if (checkResult.rows.length === 0) {
    console.log(`Post ${postId} not found`);
    return false;
  }

  const post = checkResult.rows[0];
  
  if (post.user_id !== userId) {
    console.log(`Post ${postId} belongs to user ${post.user_id}, not ${userId}`);
    return false;
  }

  if (post.is_deleted) {
    console.log(`Post ${postId} is already deleted`);
    return false;
  }

  // Now perform the soft delete
  const result = await db.query(
    `UPDATE posts 
     SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
     RETURNING id`,
    [postId, userId]
  );

  console.log('Delete result:', result.rows);

  return result.rows.length > 0;
};

// Get single post with like & comment counts
export const getPostDetailsById = async (postId) => {
  const result = await db.query(
    `
    SELECT 
      p.id,
      p.user_id,
      p.content,
      p.media_url,
      p.comments_enabled,
      p.created_at,

      -- like count
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,

      -- comment count
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comments_count

    FROM posts p
    WHERE p.id = $1 AND p.is_deleted = FALSE
    `,
    [postId]
  );

  return result.rows[0];
};

export const getFeedPosts = async (userId, limit = 10, offset = 0) => {
  const result = await db.query(
    `
      SELECT 
        p.*, 
        u.username, 
        u.full_name,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.is_deleted = FALSE) AS comments_count

      FROM posts p
      JOIN users u ON p.user_id = u.id

      WHERE p.is_deleted = FALSE
      AND (
          p.is_scheduled = FALSE
          OR p.scheduled_at <= NOW()   -- 👈 PREVENTS EARLY VISIBILITY
      )
      AND (
          p.user_id IN (SELECT followed_id FROM follows WHERE follower_id = $1)
          OR p.user_id = $1
      )
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `,
    [userId, limit, offset]
  );

  return result.rows;
};


