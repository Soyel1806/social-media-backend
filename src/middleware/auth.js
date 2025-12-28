import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Try to get token from cookies first
  let token = req.cookies?.accessToken;

  // If not in cookies, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  console.log("Token received:", token ? "Yes" : "No");
  console.log("JWT_SECRET exists:", process.env.JWT_SECRET ? "Yes" : "No");

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(403).json({ message: "Token is not valid" });
    }

    console.log("Token verified successfully for user:", decoded.id);
    req.user = decoded;  // contains { id: <userId>, iat, exp }
    next();
  });
};