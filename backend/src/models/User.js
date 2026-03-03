import mongoose from "mongoose";

const defaultAvatarUrl =
  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "customer", "chef"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },
    avatarUrl: {
      type: String,
      default: defaultAvatarUrl,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
