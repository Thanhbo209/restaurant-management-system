import type { User } from "@/types/user";
import { NavLink, useLocation } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
export const SidebarItem = (props: {
  item: NavItem;
  collapsed: boolean;
  user?: User | null;
}) => {
  const { item, collapsed } = props;
  const location = useLocation();
  const isActive =
    item.path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`);

  return (
    <NavLink
      to={item.path}
      end={item.path === "/admin"}
      className={[
        "group relative flex items-center gap-4 px-3 py-2.5 rounded-xl",
        "transition-all duration-200 font-medium text-sm",
        isActive
          ? "bg-primary text-background font-bold"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      ].join(" ")}
    >
      <item.icon size={18} className="shrink-0" />

      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

      {!collapsed && item.badge && (
        <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none">
          {item.badge}
        </span>
      )}

      {/* Tooltip khi collapsed */}
      {collapsed && (
        <div
          className="absolute left-full ml-3 px-2.5 py-1.5 bg-primary text-xs rounded-lg
          opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50
          transition-opacity duration-150 border border-border flex items-center gap-2"
        >
          {item.label}
          {item.badge && (
            <span className="bg-indigo-500  px-1.5 py-0.5 rounded-full text-xs">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
};
