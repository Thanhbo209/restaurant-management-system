import type { NavItem } from "@/types/sidebar";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  Utensils,
  Martini,
} from "lucide-react";

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Nhân Viên", path: "/admin/users", icon: Users, badge: 3 },
  { label: "Menu", path: "/admin/menus", icon: Utensils },
  { label: "Bàn", path: "/admin/tables", icon: Martini },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart, badge: 12 },
  { label: "Cài đặt", path: "/admin/settings", icon: Settings },
];
