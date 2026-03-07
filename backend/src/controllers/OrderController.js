import mongoose from "mongoose";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import Table from "../models/Table.js";

export default class OrderController {
  // GET /api/orders
  static async list(req, res) {
    try {
      const { status, table, limit = 50, skip = 0 } = req.query ?? {};

      const filter = {};

      if (status) filter.status = status;
      if (table && mongoose.Types.ObjectId.isValid(table)) {
        filter.table = table;
      }

      const orders = await Order.find(filter)
        .populate("table")
        .populate("staff", "name role")
        .populate("items.food")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(skip));

      res.json(orders);
    } catch (error) {
      console.error("List orders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /api/orders/:id
  static async get(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order id" });
      }

      const order = await Order.findById(id)
        .populate("table")
        .populate("staff", "name role")
        .populate("items.food");

      if (!order) return res.status(404).json({ message: "Order not found" });

      res.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /api/orders
  static async create(req, res) {
    try {
      const { tableNumber } = req.body ?? {};

      if (!tableNumber) {
        return res.status(400).json({ message: "tableNumber is required" });
      }

      const table = await Table.findOne({ tableNumber });
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      const existingOrder = await Order.findOne({
        table: table._id,
        status: { $nin: ["paid", "cancelled"] },
      });

      if (existingOrder) {
        return res.json(existingOrder);
      }

      const order = await Order.create({
        table: table._id,
        staff: req.user?._id ?? null,
        status: "pending",
      });

      table.status = "occupied";
      await table.save();

      res.status(201).json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /api/orders/:id/items
  static async addItem(req, res) {
    try {
      const { id } = req.params;
      const { foodId, quantity = 1, note } = req.body ?? {};

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res
          .status(400)
          .json({ message: "quantity must be a positive integer" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order id" });
      }

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const food = await Food.findById(foodId);
      if (!food) return res.status(404).json({ message: "Food not found" });
      if (!food.isAvailable) {
        return res.status(400).json({ message: "Food not available" });
      }

      order.items.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity,
        note,
      });

      order.totalAmount += food.price * quantity;

      await order.save();

      res.json(order);
    } catch (error) {
      console.error("Add item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PATCH /api/orders/:id/items/:itemId
  static async updateItem(req, res) {
    try {
      const { id, itemId } = req.params;
      const { quantity, status } = req.body ?? {};

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const item = order.items.id(itemId);
      if (!item) return res.status(404).json({ message: "Item not found" });

      if (typeof quantity === "number") {
        if (quantity <= 0) {
          order.totalAmount -= item.price * item.quantity;
          item.deleteOne();
        } else {
          const diff = quantity - item.quantity;
          item.quantity = quantity;
          order.totalAmount += diff * item.price;
        }
      }

      if (status) item.status = status;

      await order.save();

      res.json(order);
    } catch (error) {
      console.error("Update item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /api/orders/:id/items/:itemId
  static async removeItem(req, res) {
    try {
      const { id, itemId } = req.params;

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const item = order.items.id(itemId);
      if (!item) return res.status(404).json({ message: "Item not found" });

      order.totalAmount -= item.price * item.quantity;

      item.deleteOne();

      await order.save();

      res.json(order);
    } catch (error) {
      console.error("Remove item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PATCH /api/orders/:id/pay
  static async pay(req, res) {
    try {
      const { id } = req.params;
      const { paymentMethod } = req.body ?? {};

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (order.status === "paid") {
        return res.status(400).json({ message: "Order already paid" });
      }
      order.status = "paid";
      order.paymentMethod = paymentMethod;
      order.paidAt = new Date();

      await order.save();

      await Table.findByIdAndUpdate(order.table, { status: "available" });

      res.json(order);
    } catch (error) {
      console.error("Pay order error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getActiveOrder(req, res) {
    try {
      const { tableNumber } = req.params;

      const table = await Table.findOne({ tableNumber });
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      const order = await Order.findOne({
        table: table._id,
        status: { $nin: ["paid", "cancelled"] },
      }).populate("items.food");

      res.json(order);
    } catch (error) {
      console.error("Get active order error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateItemStatus(req, res) {
    try {
      const { id, itemId } = req.params;
      const { status } = req.body;

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const item = order.items.id(itemId);
      if (!item) return res.status(404).json({ message: "Item not found" });

      item.status = status;

      await order.save();

      res.json(order);
    } catch (error) {
      console.error("Update item status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
