import express from "express";
import UserController from "../controllers/UserController.js";
import { protect, restrictTo } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get("/", UserController.list);
router.post("/", UserController.create);
router.get("/:id", UserController.get);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);

export default router;
