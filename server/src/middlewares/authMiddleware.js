import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  // console.log('authHeader', authHeader)
  if (!authHeader) {
    return res.status(401).json({ message: "Missing token." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { _id, email, full_name, iat, exp }
    req.account = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid." });
  }
};
