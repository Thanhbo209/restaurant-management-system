import FoodCard from "./FoodCard";
import type { Food } from "@/types/food";

type Props = {
  foods: Food[];
  cart: Record<string, any>;
  addToCart: (food: Food) => void;
  removeFromCart: (id: string) => void;
};

export default function FoodGrid({
  foods,
  cart,
  addToCart,
  removeFromCart,
}: Props) {
  if (!foods.length) {
    return (
      <p className="text-center py-20 text-muted-foreground">Không có món</p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 pt-4 grid sm:grid-cols-2 gap-4">
      {foods.map((food) => (
        <FoodCard
          key={food._id}
          food={food}
          qty={cart[food._id]?.qty ?? 0}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
    </main>
  );
}
