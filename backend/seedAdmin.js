import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

export const seedAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";

    // 1. check existing
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash("123123", 10);

    // 3. create admin
    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      avatarUrl: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    });

    console.log("🔥 Admin seeded successfully");
    console.log("📧 email: admin@restaurant.com");
    console.log("🔑 password: Admin@123");
  } catch (error) {
    console.error("Seed admin failed:", error);
  }
};
