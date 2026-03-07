import type { Food } from "@/types/food";

export type OrderItem = {
  _id: string;
  food: Food;
  foodId: string;
  quantity: number;
};
