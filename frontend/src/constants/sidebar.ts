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
  { label: "Users", path: "/admin/users", icon: Users, badge: 3 },
  { label: "Menu", path: "/admin/products", icon: Utensils },
  { label: "Table", path: "/admin/tables", icon: Martini },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart, badge: 12 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];
