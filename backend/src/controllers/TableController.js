import Table from "../models/Table.js";
import QRCode from "qrcode";

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    const menuUrl = `http://localhost:5173/menu/${tableNumber}`;

    const qrCodeUrl = await QRCode.toDataURL(menuUrl);

    const table = await Table.create({
      tableNumber,
      capacity,
      qrCodeUrl,
    });

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Create table failed" });
  }
};
