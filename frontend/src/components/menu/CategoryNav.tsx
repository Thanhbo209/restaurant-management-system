import type { Category } from "@/types/category";

type Props = {
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (id: string) => void;
};

const CATEGORY_EMOJI: Record<string, string> = {
  "Khai vị": "🥗",
  "Món chính": "🍲",
  "Tráng miệng": "🍮",
  "Đồ uống": "🧃",
  "Đặc biệt": "⭐",
};

const catEmoji = (name: string) => CATEGORY_EMOJI[name] ?? "🍽️";

export default function CategoryNav({
  categories,
  activeCategory,
  setActiveCategory,
}: Props) {
  return (
    <nav className="mt-10 sticky top-14 z-40">
      <div className="max-w-3xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition
              ${
                activeCategory === cat._id
                  ? "bg-primary text-white"
                  : "border border-border text-muted-foreground hover:text-primary"
              }`}
          >
            {cat.imageUrl ? (
              <img
                src={cat.imageUrl}
                alt=""
                className="w-4 h-4 rounded-full object-cover"
              />
            ) : (
              <span>{catEmoji(cat.name)}</span>
            )}

            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
