import mongoose from "mongoose";

const connectDb = async (connectionString) => {
  try {
    const connect = await mongoose.connect(connectionString);

    if (!connect) {
      console.log("Please check the connection string");
    }

    console.log("MongoDB connected");
  } catch (error) {
    console.log("Failed to connect to DB", error);
    process.exit(1);
  }
};

export default connectDb;
