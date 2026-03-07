import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: [
        "pending", // mới tạo
        "confirmed", // đã xác nhận
        "preparing", // bếp đang làm
        "served", // đã phục vụ
        "paid", // đã thanh toán
        "cancelled",
      ],
      default: "pending",
    },

    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },

        name: String, // snapshot name

        price: Number, // snapshot price

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        note: String,

        status: {
          type: String,
          enum: ["pending", "preparing", "done"],
          default: "pending",
        },
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "momo", "zalopay"],
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
