import express from "express";
import TableController from "../controllers/TableController.js";
import { protect, restrictToAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", TableController.getTables);
router.get("/:id", TableController.getTable);

router.use(protect, restrictToAdmin);
router.post("/", TableController.createTable);
router.put("/:id", TableController.updateTable);
router.delete("/:id", TableController.deleteTable);

export default router;
