import type { Food } from "@/types/food";

export type OrderItem = {
  _id: string;
  food: Food | string;
  quantity: number;
};
