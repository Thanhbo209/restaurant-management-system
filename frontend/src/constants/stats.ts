import {
  Box,
  CheckCircle,
  Star,
  BarChart2,
  UserRoundX,
  BookOpenCheck,
} from "lucide-react";
import type { LocalStat } from "@/types/stats";
import { ShieldCheck, UserCheck, Users, UserX } from "lucide-react";
import type { User } from "@/types/user";
import type { Table } from "@/types/table";

export function getMenuStats({
  totalItems,
  availableItems,
  featuredItems,
  avgRating,
}: {
  totalItems: number;
  availableItems: number;
  featuredItems: number;
  avgRating: string;
}): LocalStat[] {
  return [
    {
      title: "Tổng món ăn",
      value: String(totalItems),
      change: "",
      trend: "up",
      description: "",
      icon: Box,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Đang bán",
      value: String(availableItems),
      change: "",
      trend: "up",
      description: "",
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Món nổi bật",
      value: String(featuredItems),
      change: "",
      trend: "up",
      description: "",
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Đánh giá TB",
      value: `${avgRating}/5`,
      change: "",
      trend: "up",
      description: "",
      icon: BarChart2,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];
}

export function TABLE_STATS(tables: Table[]): LocalStat[] {
  const total = tables.length;
  const available = tables.filter((t) => t.status === "available").length;
  const occupied = tables.filter((t) => t.status === "occupied").length;
  const reserved = tables.filter((t) => t.status === "reserved").length;

  return [
    {
      title: "Tổng bàn",
      value: String(total),
      change: "",
      trend: "up",
      description: "",
      icon: Box,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Trống",
      value: String(available),
      change: "",
      trend: "up",
      description: "",
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Đang phục vụ",
      value: String(occupied),
      change: "",
      trend: "up",
      description: "",
      icon: UserRoundX,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      title: "Đã đặt",
      value: String(reserved),
      change: "",
      trend: "up",
      description: "",
      icon: BookOpenCheck,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];
}

export function USER_STATS(users: User[]): LocalStat[] {
  return [
    {
      title: "Tổng người dùng",
      value: `${users.length}`,
      change: "",
      trend: "up",
      description: "Tổng hiện tại",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Đang hoạt động",
      value: `${users.filter((u) => u.isActive).length}`,
      change: "",
      trend: "up",
      description: "Hiện tại",
      icon: UserCheck,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      title: "Ngưng hoạt động",
      value: `${users.filter((u) => !u.isActive).length}`,
      change: "",
      trend: "down",
      description: "Hiện tại",
      icon: UserX,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Quản trị viên",
      value: `${users.filter((u) => u.role === "admin").length}`,
      change: "",
      trend: "up",
      description: "Admin",
      icon: ShieldCheck,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
  ];
}
