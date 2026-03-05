import TableCard from "./TableCard";
import type { StatusConfig, Table, TableStatus } from "@/types/table";

interface Props {
  tables: Table[];
  STATUS: Record<TableStatus, StatusConfig>;
  onEdit: (t: Table) => void;
  onDelete: (t: Table) => void;
  onCycle: (id: string) => void;
}

export default function TableGrid({
  tables,
  STATUS,
  onEdit,
  onDelete,
  onCycle,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard
          key={table._id}
          table={table}
          STATUS={STATUS}
          onEdit={onEdit}
          onDelete={onDelete}
          onCycle={onCycle}
        />
      ))}
    </div>
  );
}
