import Food from "../models/Food.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

export default class FoodController {
  // GET /api/foods
  static async list(req, res) {
    try {
      const {
        q,
        category,
        isAvailable,
        featured,
        limit = 100,
        skip = 0,
      } = req.query ?? {};

      const filter = {};
      const parsedLimit = Number.parseInt(String(limit), 10);
      const parsedSkip = Number.parseInt(String(skip), 10);
      const safeLimit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), 100)
        : 100;
      const safeSkip = Number.isFinite(parsedSkip)
        ? Math.max(parsedSkip, 0)
        : 0;
      const escapeRegex = (value) =>
        value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (q) {
        const regex = new RegExp(escapeRegex(String(q)), "i");
        filter.$or = [{ name: regex }, { description: regex }];
      }
      if (category && mongoose.Types.ObjectId.isValid(String(category))) {
        filter.category = category;
      }
      if (typeof isAvailable !== "undefined") {
        filter.isAvailable = String(isAvailable) === "true";
      }
      if (typeof featured !== "undefined") {
        filter.isFeatured = String(featured) === "true";
      }

      const foods = await Food.find(filter)
        .limit(safeLimit)
        .skip(safeSkip)
        .populate("category");

      res.json(foods);
    } catch (error) {
      console.error("List foods error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /api/foods/:id
  static async get(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid food id" });
      }
      const food = await Food.findById(id).populate("category");
      if (!food) return res.status(404).json({ message: "Food not found" });
      res.json(food);
    } catch (error) {
      console.error("Get food error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /api/foods
  static async create(req, res) {
    try {
      const {
        name,
        description,
        price,
        imageUrl,
        category,
        isAvailable = true,
        isFeatured = false,
      } = req.body ?? {};
      if (!name || typeof price === "undefined" || !category) {
        return res
          .status(400)
          .json({ message: "name, price and category are required" });
      }

      // validate category id and existence
      if (!mongoose.Types.ObjectId.isValid(String(category))) {
        return res
          .status(400)
          .json({
            message:
              "category is required and must refer to an existing category",
          });
      }
      const catExists = await Category.exists({ _id: category });
      if (!catExists) {
        return res
          .status(400)
          .json({
            message:
              "category is required and must refer to an existing category",
          });
      }
      const food = await Food.create({
        name,
        description,
        price,
        imageUrl,
        category,
        isAvailable,
        isFeatured,
      });
      res.status(201).json(food);
    } catch (error) {
      console.error("Create food error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /api/foods/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid food id" });
      }
      const updates = { ...req.body };

      // If category is being updated, validate it refers to an existing category
      if (
        typeof updates.category !== "undefined" &&
        updates.category !== null
      ) {
        if (!mongoose.Types.ObjectId.isValid(String(updates.category))) {
          return res
            .status(400)
            .json({
              message:
                "category is required and must refer to an existing category",
            });
        }
        const catExists = await Category.exists({ _id: updates.category });
        if (!catExists) {
          return res
            .status(400)
            .json({
              message:
                "category is required and must refer to an existing category",
            });
        }
      }
      const food = await Food.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        context: "query",
      });
      if (!food) return res.status(404).json({ message: "Food not found" });
      res.json(food);
    } catch (error) {
      console.error("Update food error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /api/foods/:id
  static async remove(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid food id" });
      }
      const food = await Food.findByIdAndDelete(id);
      if (!food) return res.status(404).json({ message: "Food not found" });
      res.json({ message: "Food deleted" });
    } catch (error) {
      console.error("Delete food error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
