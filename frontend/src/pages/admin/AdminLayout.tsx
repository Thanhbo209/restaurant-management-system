import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";
import { SidebarItem, type NavItem } from "@/components/admin/SidebarItem";
import Navbar from "@/components/admin/Navbar";

// ─── Config ───────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users, badge: 3 },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart, badge: 12 },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0  z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed lg:relative z-30 flex flex-col h-full bg-sidebar",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-17" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? "justify-center" : ""}`}
        >
          <div className="shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <Zap size={16} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-bold  text-sm tracking-wide">AdminKit</p>
              <p className="text-xs text-muted-foreground">Control Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-x-hidden px-3 py-6 space-y-3">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
              <img
                src="https://i.pravatar.cc/32?img=11"
                alt="avatar"
                className="w-8 h-8 rounded-full ring-2 ring-ring shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Nguyễn Admin</p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@example.com
                </p>
              </div>
            </div>
          )}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-destructive transition-all duration-200 text-sm font-medium">
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden  lg:flex absolute -right-3 top-18 w-6 h-6 bg-secondary border border-border rounded-full items-center justify-center hover:bg-primary hover:border-primary/50 transition-all duration-500 "
        >
          <ChevronRight
            size={13}
            className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
          />
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar setMobileOpen={setMobileOpen} mobileOpen={mobileOpen} />
        {/* ── Outlet — child routes render here ── */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
