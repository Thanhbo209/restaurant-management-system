import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types/user";

export const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  admin: { label: "Admin", variant: "default" },
  staff: { label: "Staff", variant: "secondary" },
  chef: { label: "Chef", variant: "outline" },
};

export default function RoleBadge({ role }: { role: Role }) {
  const { label, variant } = ROLE_CONFIG[role];
  return <Badge variant={variant}>{label}</Badge>;
}
