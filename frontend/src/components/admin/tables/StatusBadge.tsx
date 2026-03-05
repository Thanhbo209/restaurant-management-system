import type { StatusConfig, TableStatus } from "@/types/table";

interface Props {
  status: TableStatus;
  STATUS: Record<TableStatus, StatusConfig>;
}

export default function StatusBadge({ status, STATUS }: Props) {
  const cfg = STATUS[status];

  return (
    <span
      className={`inline-flex mb-2 items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
