import User from "../models/User.js";
import bcrypt from "bcryptjs";

export default class UserController {
  // GET /api/users
  static async list(req, res) {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      console.error("List users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /api/users/:id
  static async get(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /api/users
  static async create(req, res) {
    try {
      const {
        name,
        email,
        password,
        role = "customer",
        isActive = true,
        avatarUrl,
      } = req.body ?? {};
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "name, email and password are required" });
      }

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(409).json({ message: "Email already in use" });

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashed,
        role,
        isActive,
        avatarUrl,
      });
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).json(userObj);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /api/users/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = { ...req.body };
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
      }).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /api/users/:id
  static async remove(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
