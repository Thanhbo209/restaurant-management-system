import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ElementType } from "react";

type Stat = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description?: string;
  icon: ElementType;
  color?: string;
  bg?: string;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ stat }: { stat: Stat }) => (
  <Card>
    <CardContent>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{stat.title}</p>
          <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
          <div className="flex items-center gap-1 text-xs">
            {stat.trend === "up" ? (
              <ChevronUp size={14} className="text-chart-3" />
            ) : (
              <ChevronDown size={14} className="text-destructive" />
            )}
            <span
              className={
                stat.trend === "up" ? "text-chart-3" : "text-destructive"
              }
            >
              {stat.change}
            </span>
            <span className="text-muted-foreground">{stat.description}</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${stat.bg}`}>
          <stat.icon size={20} className={stat.color} />
        </div>
      </div>
    </CardContent>
  </Card>
);
