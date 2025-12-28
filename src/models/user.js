import { db } from "../utils/database.js";

/* -------- create / get user -------- */
export const createUser = async ({ username, email, password_hash, full_name }) => {
  const result = await db.query(
    `INSERT INTO users (username, email, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, full_name, created_at`,
    [username, email, password_hash, full_name]
  );
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await db.query(
    `SELECT id, username, email, full_name, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

/* -------- search users -------- */
export const findUsersByName = async (name, limit = 10, offset = 0) => {
  const search = `%${name}%`;

  const result = await db.query(
    `SELECT id, username, full_name
     FROM users
     WHERE (username ILIKE $1 OR full_name ILIKE $1)
       AND is_deleted = FALSE
     ORDER BY username ASC
     LIMIT $2 OFFSET $3`,
    [search, limit, offset]
  );

  return result.rows;
};


/* -------- user profile with follow stats -------- */
export const getUserProfile = async (userId) => {
  const result = await db.query(
    `SELECT id, username, full_name, created_at FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0];
};

/* -------- update profile -------- */
export const updateUserProfile = async (userId, { full_name }) => {
  const result = await db.query(
    `UPDATE users
     SET full_name = COALESCE($2, full_name),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, username, full_name`,
    [userId, full_name]
  );
  return result.rows[0];
};
