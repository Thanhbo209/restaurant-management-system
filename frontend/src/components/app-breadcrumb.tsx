import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router";
import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BreadcrumbSegment {
  label: string;
  href: string;
}

// ─── Label map — thêm route mới vào đây ──────────────────────────────────────
const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  users: "Users",
  products: "Products",
  orders: "Orders",
  analytics: "Analytics",
  settings: "Settings",
};

const toLabel = (seg: string) =>
  SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);

// ─── Hook: lấy segments từ URL hiện tại ──────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const useBreadcrumbs = (): BreadcrumbSegment[] => {
  const location = useLocation();
  return location.pathname
    .split("/")
    .filter(Boolean)
    .map((seg, index, arr) => ({
      label: toLabel(seg),
      href: "/" + arr.slice(0, index + 1).join("/"),
    }));
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const BreadcrumbNavLink = ({ href, label }: BreadcrumbSegment) => (
  <BreadcrumbItem>
    <BreadcrumbLink asChild>
      <Link to={href}>{label}</Link>
    </BreadcrumbLink>
  </BreadcrumbItem>
);

const BreadcrumbCurrent = ({ label }: { label: string }) => (
  <BreadcrumbItem>
    <BreadcrumbPage>{label}</BreadcrumbPage>
  </BreadcrumbItem>
);

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * Tự động tạo breadcrumb từ URL hiện tại.
 *
 * @example
 * // Dùng mặc định (đọc URL tự động)
 * <AppBreadcrumb />
 *
 * @example
 * // Truyền segments thủ công
 * <AppBreadcrumb segments={[
 *   { label: "Admin", href: "/admin" },
 *   { label: "Users", href: "/admin/users" },
 * ]} />
 */
const AppBreadcrumb = ({
  segments: customSegments,
}: {
  segments?: BreadcrumbSegment[];
}) => {
  const autoSegments = useBreadcrumbs();
  const segments = customSegments ?? autoSegments;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, index) => {
          const isLast = index === segments.length - 1;
          return (
            <React.Fragment key={seg.href}>
              {isLast ? (
                <BreadcrumbCurrent label={seg.label} />
              ) : (
                <BreadcrumbNavLink {...seg} />
              )}
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
