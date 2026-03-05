import { ThemeProvider } from "@/components/theme-provider";
import ProtectedAdminRoute from "@/lib/ProtectedRoute";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import MenuManagement from "@/pages/admin/MenuManagement";
import TableManagement from "@/pages/admin/TableManagement";
import UsersPage from "@/pages/admin/UserManagement";
import Login from "@/pages/auth/Login";
import MenuPage from "@/pages/MenuPage";
import { Route, Routes } from "react-router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="menus" element={<MenuManagement />} />
            <Route path="tables" element={<TableManagement />} />
          </Route>
        </Route>

        {/* Public menu page (no auth) */}
        <Route path="/menu/:tableNumber" element={<MenuPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
