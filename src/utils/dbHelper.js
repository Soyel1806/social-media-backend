import { db } from "./database.js";

export const query = async (text, params = []) => {
  try {
    const result = await db.query(text, params);
    return result.rows;
  } catch (err) {
    console.error("DB QUERY ERROR:", err);
    throw err;
  }
};
