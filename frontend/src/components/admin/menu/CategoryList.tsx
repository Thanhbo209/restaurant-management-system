import type { Category } from "@/types/category";

interface CategoryProps {
  CATEGORIES: Category[];
  selectedCategory: string;
  setSelectedCategory: (next: string) => void;
}

const CategoryList = ({
  CATEGORIES,
  selectedCategory,
  setSelectedCategory,
}: CategoryProps) => {
  return (
    <div>
      <p className="text-[15px]  tracking-widest uppercase font-semibold mb-3">
        Danh Mục
      </p>
      <div className="flex gap-3 overflow-x-auto pb-5 pt-5 pl-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat._id;
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(active ? "all" : cat._id)}
              className={` relative shrink-0 w-40 h-30 rounded-2xl overflow-hidden transition-all duration-200 ring-2 ${
                active
                  ? "ring-ring scale-105 shadow-lg shadow-orange-950/40"
                  : "ring-transparent hover:ring-border hover:scale-[1.02]"
              }`}
            >
              {/* Background image */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay — darker when inactive */}
              <div
                className={`absolute inset-0 transition-all duration-200 ${active ? "bg-black/10" : "bg-black/70 hover:bg-background/55"}`}
              />
              {/* Active orange tint */}
              {active && <div className="absolute inset-0 bg-primary-500/20" />}
              {/* Text */}
              <div className="relative z-10 h-full flex flex-col items-center justify-end pb-2.5 px-1">
                <span className="text-[11px] text-white font-bold  text-center leading-tight drop-shadow-md">
                  {cat.name}
                </span>
              </div>
              {/* Active indicator dot */}
              {active && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow shadow-orange-400/60" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
export { CategoryList };
