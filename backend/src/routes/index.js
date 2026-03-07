import authRoute from "../routes/AuthRoutes.js";
import usersRoute from "../routes/UsersRoutes.js";
import foodsRoute from "../routes/FoodsRoutes.js";
import categoriesRoute from "../routes/CategoriesRoutes.js";
import tablesRoute from "../routes/TableRoutes.js";
import ordersRoute from "../routes/OrderRoutes.js";

export function route(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/users", usersRoute);
  app.use("/api/foods", foodsRoute);
  app.use("/api/categories", categoriesRoute);
  app.use("/api/tables", tablesRoute);
  app.use("/api/orders", ordersRoute);
}
