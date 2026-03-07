import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import { protect, restrictTo } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", CategoryController.list);
router.get("/:id", CategoryController.get);

router.use(protect, restrictTo("admin"));

router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;
