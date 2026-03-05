import type { LocalStat } from "@/types/stats";
import { ShieldCheck, UserCheck, Users, UserX } from "lucide-react";
import type { User } from "@/types/user";

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
