import Category from "../models/Category.js";
import Food from "../models/Food.js";
import mongoose from "mongoose";

export default class CategoryController {
  // GET /api/categories
  static async list(req, res) {
    try {
      const { q, isActive, limit = 100, skip = 0 } = req.query ?? {};
      const filter = {};
      if (q) {
        filter.name = new RegExp(String(q), "i");
      }
      if (typeof isActive !== "undefined") {
        filter.isActive = String(isActive) === "true";
      }

      const categories = await Category.find(filter)
        .limit(Number(limit))
        .skip(Number(skip));
      res.json(categories);
    } catch (error) {
      console.error("List categories error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /api/categories/:id
  static async get(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
      const category = await Category.findById(id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (error) {
      console.error("Get category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /api/categories
  static async create(req, res) {
    try {
      const { name, imageUrl, isActive = true, sortOrder = 0 } = req.body ?? {};
      if (!name) return res.status(400).json({ message: "name is required" });
      const category = await Category.create({
        name,
        imageUrl,
        isActive,
        sortOrder,
      });
      res.status(201).json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /api/categories/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
      const updates = { ...req.body };
      const category = await Category.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        context: "query",
      });
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /api/categories/:id
  static async remove(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
      const category = await Category.findByIdAndDelete(id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      // cascade delete foods in this category
      try {
        const { deletedCount } = await Food.deleteMany({ category: id });
        return res.json({
          message: "Category deleted",
          deletedFoods: deletedCount,
        });
      } catch (err) {
        console.error("Failed to delete foods for category:", err);
        // still return success for category deletion but inform about the cascade failure
        return res
          .status(200)
          .json({
            message: "Category deleted, but failed to remove associated foods",
          });
      }
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
