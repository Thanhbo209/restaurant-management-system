import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import { protect, restrictToAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", CategoryController.list);
router.get("/:id", CategoryController.get);

router.use(protect, restrictToAdmin);

router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;
