import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export default class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      // Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create token
      const payload = { id: user._id, role: user.role };
      const token = signToken(payload);

      // Remove password
      const userObj = user.toObject();
      delete userObj.password;
      res.json({ token, user: userObj });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMe(req, res) {
    const user = req.user;
    res.json(user);
  }
}
