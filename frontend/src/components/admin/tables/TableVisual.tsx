import { Armchair } from "lucide-react";
import type { StatusConfig, Table, TableStatus } from "@/types/table";

interface Props {
  capacity: number;
  status: Table["status"];
  STATUS: Record<TableStatus, StatusConfig>;
}

export default function TableVisual({ capacity, status, STATUS }: Props) {
  const cfg = STATUS[status];

  const chairCount = Math.min(Math.floor(capacity / 2), 3);

  const tableSize =
    capacity >= 6 ? "w-20 h-12" : capacity >= 4 ? "w-16 h-10" : "w-12 h-8";

  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      <div className={`flex gap-1.5 ${cfg.chairColor}`}>
        {Array.from({ length: chairCount }).map((_, i) => (
          <Armchair key={i} size={12} />
        ))}
      </div>

      <div
        className={`rounded-xl border-2 transition-all duration-200 ${cfg.tableColor} ${tableSize}`}
      />

      <div className={`flex gap-1.5 rotate-180 ${cfg.chairColor}`}>
        {Array.from({ length: chairCount }).map((_, i) => (
          <Armchair key={i} size={12} />
        ))}
      </div>
    </div>
  );
}
