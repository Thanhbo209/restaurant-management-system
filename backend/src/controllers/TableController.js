import Table from "../models/Table.js";
import QRCode from "qrcode";

export default class TableController {
  // CREATE TABLE
  static async createTable(req, res) {
    try {
      const { tableNumber, capacity } = req.body;

      if (!Number.isInteger(tableNumber) || tableNumber <= 0) {
        return res
          .status(400)
          .json({ message: "tableNumber must be a positive integer" });
      }

      const frontendBase = (
        process.env.FRONTEND_URL || "http://localhost:5173"
      ).replace(/\/$/, "");

      const menuUrl = `${frontendBase}/menu/${tableNumber}`;

      const qrCodeUrl = await QRCode.toDataURL(menuUrl);

      const table = await Table.create({
        tableNumber,
        capacity,
        qrCodeUrl,
      });

      res.status(201).json(table);
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({ message: "Table number already exists" });
      }

      res.status(500).json({ message: "Create table failed" });
    }
  }

  // GET ALL TABLES
  static async getTables(req, res) {
    try {
      const tables = await Table.find().sort({ tableNumber: 1 });

      res.json(tables);
    } catch (error) {
      res.status(500).json({ message: "Get tables failed" });
    }
  }

  // GET SINGLE TABLE
  static async getTable(req, res) {
    try {
      const table = await Table.findById(req.params.id);

      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      res.json(table);
    } catch (error) {
      res.status(500).json({ message: "Get table failed" });
    }
  }

  // UPDATE TABLE
  static async updateTable(req, res) {
    try {
      const { tableNumber, capacity, status } = req.body ?? {};

      const table = await Table.findById(req.params.id);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      const updates = {};

      // update tableNumber if provided
      if (typeof tableNumber !== "undefined") {
        if (!Number.isInteger(tableNumber) || tableNumber <= 0) {
          return res
            .status(400)
            .json({ message: "tableNumber must be a positive integer" });
        }

        // if tableNumber changes, ensure uniqueness
        if (table.tableNumber !== tableNumber) {
          const exists = await Table.findOne({ tableNumber });
          if (exists && String(exists._id) !== String(table._id)) {
            return res
              .status(409)
              .json({ message: "Table number already exists" });
          }

          updates.tableNumber = tableNumber;

          // regenerate QR code for new table number
          const frontendBase = (
            process.env.FRONTEND_URL || "http://localhost:5173"
          ).replace(/\/$/, "");
          const menuUrl = `${frontendBase}/menu/${tableNumber}`;
          try {
            const qrCodeUrl = await QRCode.toDataURL(menuUrl);
            updates.qrCodeUrl = qrCodeUrl;
          } catch (err) {
            console.error("Failed to generate QR code:", err);
            return res
              .status(500)
              .json({ message: "Failed to regenerate QR code" });
          }
        }
      }

      if (typeof capacity !== "undefined") {
        if (!Number.isInteger(capacity) || capacity <= 0) {
          return res
            .status(400)
            .json({ message: "capacity must be a positive integer" });
        }
        updates.capacity = capacity;
      }

      if (typeof status !== "undefined") {
        const allowed = ["available", "occupied", "reserved"];
        if (!allowed.includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }
        updates.status = status;
      }

      const updated = await Table.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });

      res.json(updated);
    } catch (error) {
      console.error("Update table error:", error);
      if (error?.code === 11000) {
        return res.status(409).json({ message: "Table number already exists" });
      }
      res.status(500).json({ message: "Update table failed" });
    }
  }

  // DELETE TABLE
  static async deleteTable(req, res) {
    try {
      const table = await Table.findByIdAndDelete(req.params.id);

      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      res.json({ message: "Table deleted" });
    } catch (error) {
      res.status(500).json({ message: "Delete table failed" });
    }
  }
}
