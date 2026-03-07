import express from "express";
import OrderController from "../controllers/OrderController.js";
import { protect, restrictTo } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/*
============================
PUBLIC (QR ORDERING)
============================
*/

// tạo hoặc lấy active order của bàn
router.post("/", OrderController.create);

// khách thêm món
router.post("/:id/items", OrderController.addItem);
// staff sửa quantity
router.patch("/:id/items/:itemId", OrderController.updateItem);

// staff xoá item
router.delete("/:id/items/:itemId", OrderController.removeItem);
/*
============================
AUTH REQUIRED
============================
*/

router.use(protect);

/*
ADMIN / STAFF / CHEF
*/

// xem danh sách order
router.get("/", restrictTo("admin", "staff", "chef"), OrderController.list);

// xem chi tiết order
router.get("/:id", restrictTo("admin", "staff", "chef"), OrderController.get);

/*
STAFF
*/

// thanh toán
router.patch("/:id/pay", restrictTo("admin", "staff"), OrderController.pay);

/*
CHEF
*/

// chef update cooking status
router.patch(
  "/:id/items/:itemId/status",
  restrictTo("admin", "chef"),
  OrderController.updateItemStatus,
);

export default router;
