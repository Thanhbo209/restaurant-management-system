import express from "express";
import FoodController from "../controllers/FoodController.js";
import { protect, restrictToAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// public list and get
router.get("/", FoodController.list);
router.get("/:id", FoodController.get);

// protect mutating routes
router.use(protect, restrictToAdmin);

router.post("/", FoodController.create);
router.put("/:id", FoodController.update);
router.delete("/:id", FoodController.remove);

export default router;
