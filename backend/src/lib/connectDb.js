import mongoose from "mongoose";

const connectDb = async (connectionString) => {
  try {
    if (!connectionString) {
      console.error("Missing MongoDB connection string");
      process.exit(1);
    }
    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Failed to connect to DB", error);
    process.exit(1);
  }
};

export default connectDb;
