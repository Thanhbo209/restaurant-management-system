import authRoute from "../routes/AuthRoutes.js";
import usersRoute from "../routes/UsersRoutes.js";

export function route(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/users", usersRoute);
}
