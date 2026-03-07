import { Button } from "@/components/ui/button";
import type { Food } from "@/types/food";
import { Plus } from "lucide-react";

type Props = {
  food: Food;
  qty: number;
  itemId?: string;
  addToCart: (food: Food) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
};

export default function FoodCard({
  food,
  qty,
  itemId,
  addToCart,
  updateQty,
}: Props) {
  const unavailable = !food.isAvailable;

  const increase = async () => {
    if (qty === 0) {
      await addToCart(food);
    } else if (itemId) {
      await updateQty(itemId, qty + 1);
    }
  };

  const decrease = async () => {
    if (!itemId) return;

    if (qty <= 1) {
      await updateQty(itemId, 0); // backend sẽ remove item
    } else {
      await updateQty(itemId, qty - 1);
    }
  };

  return (
    <div
      className={`bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col ${
        unavailable ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden shrink-0">
        {food.imageUrl ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}

        {unavailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/70 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
              Hết món
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2 right-2 flex items-start justify-between pointer-events-none">
          {food.isFeatured ? (
            <span className="border border-chart-4 bg-chart-4/50 text-white text-[12px] font-bold px-2 py-0.5 rounded-full shadow">
              Nổi bật
            </span>
          ) : (
            <span />
          )}

          {food.ratingAverage > 0 && (
            <span className="bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
              ⭐ {food.ratingAverage.toFixed(1)}
              {food.ratingCount > 0 && (
                <span className="text-stone-400 font-normal ml-0.5">
                  ({food.ratingCount})
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1">
        <p className="font-bold text-[15px] leading-snug">{food.name}</p>

        {food.description && (
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2 flex-1">
            {food.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-foreground font-extrabold text-base whitespace-nowrap">
            {food.price.toLocaleString("vi-VN")}₫
          </span>

          {!unavailable &&
            (qty === 0 ? (
              <Button onClick={increase}>
                <Plus />
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-md px-1 py-0.5">
                <Button onClick={decrease} variant="outline">
                  −
                </Button>

                <span className="min-w-5 text-center font-bold text-md">
                  {qty}
                </span>

                <Button onClick={increase}>+</Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
