import type { OrderItem } from "@/types/order";
import type { Food } from "@/types/food";
import FoodCard from "./FoodCard";

type Props = {
  foods: Food[];
  orderItems: OrderItem[];
  addToCart: (food: Food) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
};

export default function FoodGrid({
  foods,
  orderItems,
  addToCart,
  updateQty,
}: Props) {
  if (foods.length === 0) {
    return (
      <p className="text-center py-20 text-muted-foreground">Không có món</p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 pt-4 grid sm:grid-cols-2 gap-4">
      {foods.map((food) => {
        const item = orderItems.find((i) => i.food._id === food._id);

        const qty = item?.quantity ?? 0;
        const itemId = item?._id;

        return (
          <FoodCard
            key={food._id}
            food={food}
            qty={qty}
            itemId={itemId}
            addToCart={addToCart}
            updateQty={updateQty}
          />
        );
      })}
    </main>
  );
}
