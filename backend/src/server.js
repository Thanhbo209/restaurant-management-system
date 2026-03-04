import express from "express";
import dotenv from "dotenv";
import { route } from "./routes/index.js";
import connectDb from "./lib/connectDb.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const connectionString = process.env.MONGODB_URI;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant Management System API!");
});

route(app);

const startServer = async () => {
  await connectDb(connectionString);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
