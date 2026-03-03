import authRoute from "../routes/AuthRoutes.js";

export function route(app) {
  app.use("/api/auth", authRoute);
}
