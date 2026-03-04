import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check role admin
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
