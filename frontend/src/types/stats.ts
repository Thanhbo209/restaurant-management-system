import type { ElementType } from "react";

export type LocalStat = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description?: string;
  icon: ElementType;
  color?: string;
  bg?: string;
};
