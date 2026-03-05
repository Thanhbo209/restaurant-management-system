import { Button } from "@/components/ui/button";

function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + "đ";
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3 h-3 ${s <= Math.round(value) ? "text-amber-400" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

import type { Food } from "@/types/food";

type FoodListProps = {
  filtered: Food[];
  getCatName: (id: string) => string;
  openEdit: (item: Food) => void;
  setDeleteId: (id: string) => void;
};

const FoodList = ({
  filtered,
  getCatName,
  openEdit,
  setDeleteId,
}: FoodListProps) => {
  return (
    <div>
      <div className="flex flex-col gap-3">
        {filtered.map((food) => (
          <div
            key={food._id}
            className="group flex items-center gap-4 bg-card border border-border hover:border-ring rounded-2xl p-3 transition-all duration-200 hover:-translate-y-0.5"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {!food.isAvailable && (
                <div className="absolute inset-0  flex items-center justify-center">
                  <span className="text-[9px] font-bold text-destructive uppercase tracking-wide">
                    Hết
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="font-bold text-sm leading-tight truncate">
                  {food.name}
                </h3>
                <span className="text-[12px]  bg-card px-2 py-0.5 rounded-full shrink-0 border border-border">
                  {getCatName(food.category)}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mb-2 line-clamp-1">
                {food.description}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-primary font-black text-sm">
                  {formatPrice(food.price)}
                </span>
                <div className="flex items-center gap-1">
                  <StarRating value={food.ratingAverage} />
                  <span className="text-xs text-muted-foreground">
                    {food.ratingAverage} ({food.ratingCount})
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded-full font-semibold ${food.isAvailable ? "bg-chart-3/15 text-chart-3 border border-chart-3/25" : "bg-destructive/15 text-destructive border border-destructive/25"}`}
                  >
                    {food.isAvailable ? "Đang bán" : "Hết hàng"}
                  </span>
                  {food.isFeatured && (
                    <span className="text-[12px] px-2 py-0.5 rounded-full font-semibold bg-chart-4/15 text-chart-4 border border-chart-4/25">
                      Nổi bật
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <Button onClick={() => openEdit(food)} variant={"outline"}>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Sửa
              </Button>
              <Button
                onClick={() => setDeleteId(food._id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/40 text-destructive rounded-lg text-xs font-medium transition-all"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;
