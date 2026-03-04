import { ThemeProvider } from "@/components/theme-provider";
import ProtectedAdminRoute from "@/lib/ProtectedRoute";
import Dashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/auth/Login";
import { Route, Routes } from "react-router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
