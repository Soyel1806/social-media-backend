import jwt from "jsonwebtoken";

export const createToken = (payload) => {
  const SECRET = process.env.JWT_SECRET;
  if (!SECRET) {
    console.error("JWT_SECRET missing while creating token!");
  }
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};
