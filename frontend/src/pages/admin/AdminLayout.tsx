import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { LogOut, ChevronRight, Zap } from "lucide-react";
import { SidebarItem } from "@/components/admin/SidebarItem";
import Navbar from "@/components/admin/Navbar";
import { ADMIN_NAV_ITEMS } from "@/constants/sidebar";
import type { User } from "@/types/user";

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // user will be an object like { name, email, role, avatarUrl }
  // Initialize from localStorage synchronously to avoid initial UI flicker.
  const [user, setUser] = useState<User | null>(() => {
    const seedUserStr = localStorage.getItem("user");
    if (!seedUserStr) return null;
    try {
      return JSON.parse(seedUserStr) as User;
    } catch (e) {
      // invalid JSON — clear it and start with null
      console.error(
        "Invalid user in localStorage during init, clearing it.",
        e,
      );
      localStorage.removeItem("user");
      return null;
    }
  });

  // Fetch authoritative user from the server (/api/auth/me) and update state/localStorage.
  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

    // If there's no token, there's no need to call /me.
    const token = localStorage.getItem("token");
    if (!token) {
      // no token — nothing to fetch; keep the seeded state (or null)
      return;
    }

    const controller = new AbortController();

    const fetchMe = async () => {
      try {
        const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
        const url = base ? `${base}/api/auth/me` : "/api/auth/me";

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          try {
            localStorage.setItem("user", JSON.stringify(data));
          } catch (e) {
            console.warn("Could not save user to localStorage", e);
          }
        } else if (res.status === 401) {
          // Not authorized — clear local auth and UI state.
          console.warn(
            "Unauthorized when fetching /api/auth/me, clearing local auth data.",
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        } else {
          const text = await res.text();
          console.error("Failed to fetch /api/auth/me:", res.status, text);
          setUser(null);
        }
      } catch (err) {
        const e = err as Error & { name?: string };
        if (e.name === "AbortError") return;
        console.error("Error fetching current user:", err);
        setUser(null);
      }
    };

    fetchMe();

    return () => controller.abort();
  }, []);

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
          {ADMIN_NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              collapsed={collapsed}
              user={user}
            />
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
              <img
                src={user?.avatarUrl || "https://i.pravatar.cc/32?img=11"}
                alt={user?.name || "avatar"}
                className="w-8 h-8 rounded-full ring-2 ring-ring shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "--"}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-destructive transition-all duration-200 text-sm font-medium"
          >
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
        <Navbar
          setMobileOpen={setMobileOpen}
          mobileOpen={mobileOpen}
          user={user}
        />
        {/* ── Outlet — child routes render here ── */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
