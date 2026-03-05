import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "tableNumber must be an integer",
      },
    },

    capacity: {
      type: Number,
      default: 4,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "capacity must be an integer",
      },
    },

    qrCodeUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Table", tableSchema);
