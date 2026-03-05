export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  qrCodeUrl: string;
  status: TableStatus;
}

export interface StatusConfig {
  label: string;
  badge: string;
  dot: string;
  card: string;
  topBar: string;
  tableColor: string;
  chairColor: string;
}
export type TableStatus = "available" | "occupied" | "reserved";

export const STATUS: Record<TableStatus, StatusConfig> = {
  available: {
    label: "Trống",
    badge: "bg-chart-3/20 text-chart-3 border border-chart-3",
    dot: "bg-emerald-500",
    card: "border-emerald-200 hover:border-emerald-400",
    topBar: "from-emerald-400/0 via-emerald-400/40 to-emerald-400/0",
    tableColor: "bg-emerald-50 border-emerald-300",
    chairColor: "text-emerald-400",
  },

  occupied: {
    label: "Đang phục vụ",
    badge: "bg-chart-2/20 text-chart-2 border border-chart-2",
    dot: "bg-rose-500",
    card: "border-rose-200 hover:border-rose-400",
    topBar: "from-rose-400/0 via-rose-400/40 to-rose-400/0",
    tableColor: "bg-rose-50 border-rose-300",
    chairColor: "text-rose-400",
  },

  reserved: {
    label: "Đã đặt",
    badge: "bg-chart-4/20 text-chart-4 border border-chart-4",
    dot: "bg-amber-500",
    card: "border-amber-200 hover:border-amber-400",
    topBar: "from-amber-400/0 via-amber-400/40 to-amber-400/0",
    tableColor: "bg-amber-50 border-amber-300",
    chairColor: "text-amber-400",
  },
};
