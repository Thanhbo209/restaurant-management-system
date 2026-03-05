import dotenv from "dotenv";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.slice(7).trim();
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // verify token and extract payload
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth protect error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
