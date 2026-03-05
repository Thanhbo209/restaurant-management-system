import express from "express";
import UserController from "../controllers/UserController.js";
import { protect, restrictToAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// All routes here are admin-only
router.use(protect, restrictToAdmin);

router.get("/", UserController.list);
router.post("/", UserController.create);
router.get("/:id", UserController.get);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);

export default router;
