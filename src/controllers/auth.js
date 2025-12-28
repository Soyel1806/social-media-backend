import bcrypt from "bcryptjs";
import { query } from "../utils/dbHelper.js";
import { createToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  try {
    // check if user already exists
    const existing = await query(
      `SELECT id FROM users WHERE username = $1 OR email = $2`,
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // insert new user
    await query(
      `INSERT INTO users (username, email, password_hash, full_name)
       VALUES ($1, $2, $3, $4)`,
      [username, email, hashedPassword, full_name]
    );

    return res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // get user by username
    const users = await query(
      `SELECT id, username, password_hash, email, full_name
       FROM users WHERE username = $1`,
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // compare password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // create jwt token
    const token = createToken({ id: user.id });

    // remove password from response
    const { password_hash, ...userData } = user;

    // send cookie
    return res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: false,     // set true in production (HTTPS)
        sameSite: "strict",
      })
      .status(200)
      .json({ user: userData });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

