import { db } from "../utils/database.js";

// follow user
export const followUser = async (followerId, followedId) => {
  const result = await db.query(
    `INSERT INTO follows (follower_id, followed_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [followerId, followedId]
  );
  return result.rows[0]; // returns row only if newly inserted
};

// unfollow user
export const unfollowUser = async (followerId, followedId) => {
  const result = await db.query(
    `DELETE FROM follows 
     WHERE follower_id = $1 AND followed_id = $2
     RETURNING id`,
    [followerId, followedId]
  );
  return result.rowCount > 0;
};

// count followers for a user
export const getFollowersCount = async (userId) => {
  const result = await db.query(
    `SELECT COUNT(*) as followers FROM follows WHERE followed_id = $1`,
    [userId]
  );
  return parseInt(result.rows[0].followers);
};

// count following for a user
export const getFollowingCount = async (userId) => {
  const result = await db.query(
    `SELECT COUNT(*) as following FROM follows WHERE follower_id = $1`,
    [userId]
  );
  return parseInt(result.rows[0].following);
};
