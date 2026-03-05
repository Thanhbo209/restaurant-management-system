import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCw, Users } from "lucide-react";
import TableVisual from "./TableVisual";
import StatusBadge from "./StatusBadge";
import type { TableStatus, Table, StatusConfig } from "@/types/table";

interface Props {
  table: Table;
  STATUS: Record<TableStatus, StatusConfig>;
  onEdit: (t: Table) => void;
  onDelete: (t: Table) => void;
  onCycle: (id: string) => void;
}

export default function TableCard({
  table,
  STATUS,
  onEdit,
  onDelete,
  onCycle,
}: Props) {
  const cfg = STATUS[table.status];

  return (
    <div className="group relative bg-card rounded-2xl p-4 flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${cfg.topBar}`}
      />

      <div className="absolute top-3 left-3 text-xs font-bold text-muted-foreground font-mono">
        T-{String(table.tableNumber).padStart(2, "0")}
      </div>

      <TableVisual
        capacity={table.capacity}
        status={table.status}
        STATUS={STATUS}
      />

      <div className="flex flex-col items-center gap-1.5 w-full">
        <StatusBadge status={table.status} STATUS={STATUS} />

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users size={14} />
          {table.capacity} chỗ
        </div>
      </div>

      <div className="flex gap-1.5 w-full justify-center pt-1 border-t">
        <Button variant="outline" onClick={() => onCycle(table._id)}>
          <RefreshCw size={14} />
        </Button>

        <Button onClick={() => onEdit(table)}>
          <Pencil size={14} />
        </Button>

        <Button variant="destructive" onClick={() => onDelete(table)}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
