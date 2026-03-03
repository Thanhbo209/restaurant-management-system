import AuthController from "../controllers/AuthController.js";
import { protect } from "../middlewares/AuthMiddleware.js";
import express from "express";
const router = express.Router();

router.post("/login", AuthController.login);
router.get("/me", protect, AuthController.getMe);

export default router;
