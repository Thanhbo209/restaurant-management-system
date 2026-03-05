import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FC } from "react";

type Props = {
  search: string;
  role: string;
  onSearchChange: (next: string) => void;
  onRoleChange: (next: string) => void;
};

const UsersFilters: FC<Props> = ({
  search,
  role,
  onSearchChange,
  onRoleChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm..."
          className="pl-9 w-52 h-9"
        />
      </div>

      <Select value={role} onValueChange={(v) => onRoleChange(v)}>
        <SelectTrigger className="w-36 h-9">
          <Filter size={14} className="mr-1 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="chef">Chef</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UsersFilters;
