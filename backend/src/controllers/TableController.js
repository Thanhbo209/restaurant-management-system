import Table from "../models/Table.js";
import QRCode from "qrcode";

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    if (!Number.isInteger(tableNumber) || tableNumber <= 0) {
      return res
        .status(400)
        .json({ message: "tableNumber must be a positive integer" });
    }
    if (
      capacity !== undefined &&
      (!Number.isInteger(capacity) || capacity <= 0)
    ) {
      return res
        .status(400)
        .json({ message: "capacity must be a positive integer" });
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

    return res.status(201).json(table);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Table number already exists" });
    }
    return res.status(500).json({ message: "Create table failed" });
  }
};
