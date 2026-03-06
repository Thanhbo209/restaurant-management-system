import { Button } from "@/components/ui/button";
import type { Food } from "@/types/food";
import { Plus } from "lucide-react";

type Props = {
  food: Food;
  qty: number;
  addToCart: (food: Food) => void;
  removeFromCart: (id: string) => void;
};

export default function FoodCard({
  food,
  qty,
  addToCart,
  removeFromCart,
}: Props) {
  const unavailable = !food.isAvailable;

  return (
    <div
      className={`bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col ${unavailable ? "opacity-60" : ""}`}
    >
      {/* ── Image ── */}
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

        {/* Sold out overlay */}
        {unavailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/70 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
              Hết món
            </span>
          </div>
        )}

        {/* Badges */}
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

      {/* ── Body ── */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Name */}
        <p className="font-bold text-[15px] leading-snug">{food.name}</p>

        {/* Description */}
        {food.description && (
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2 flex-1">
            {food.description}
          </p>
        )}

        {/* Price + Action */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-foreground font-extrabold text-base whitespace-nowrap">
            {food.price.toLocaleString("vi-VN")}₫
          </span>

          {!unavailable &&
            (qty === 0 ? (
              <Button onClick={() => addToCart(food)}>
                <Plus />
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-md px-1 py-0.5">
                <Button
                  onClick={() => removeFromCart(food._id)}
                  variant={"outline"}
                >
                  −
                </Button>
                <span className="min-w-5 text-center font-bold text-md ">
                  {qty}
                </span>
                <Button onClick={() => addToCart(food)}>+</Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
