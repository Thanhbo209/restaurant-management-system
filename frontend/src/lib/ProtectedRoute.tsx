import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  let user: { role?: string };
  try {
    user = JSON.parse(userStr);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
