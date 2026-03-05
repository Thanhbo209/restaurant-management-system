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
      const session = await mongoose.startSession();
      try {
        let deletedFoods = 0;
        await session.withTransaction(async () => {
          const category = await Category.findById(id).session(session);
          if (!category) {
            const notFound = new Error("CATEGORY_NOT_FOUND");
            throw notFound;
          }
          const result = await Food.deleteMany({ category: id }, { session });
          deletedFoods = result.deletedCount ?? 0;
          await Category.deleteOne({ _id: id }, { session });
        });
        return res.json({ message: "Category deleted", deletedFoods });
      } catch (err) {
        if (err instanceof Error && err.message === "CATEGORY_NOT_FOUND") {
          return res.status(404).json({ message: "Category not found" });
        }
        throw err;
      } finally {
        await session.endSession();
      }
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
