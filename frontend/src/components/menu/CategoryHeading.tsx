import type { Category } from "@/types/category";

type Props = {
  category?: Category;
};

const CATEGORY_EMOJI: Record<string, string> = {
  "Khai vị": "🥗",
  "Món chính": "🍲",
  "Tráng miệng": "🍮",
  "Đồ uống": "🧃",
  "Đặc biệt": "⭐",
};

const catEmoji = (name: string) => CATEGORY_EMOJI[name] ?? "🍽️";

export default function CategoryHeading({ category }: Props) {
  if (!category) return null;

  return (
    <div className="max-w-3xl mx-auto px-5 pt-5 pb-1 flex items-center gap-3">
      {category.imageUrl && (
        <img
          src={category.imageUrl}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      <h2 className="text-2xl font-extrabold">
        {!category.imageUrl && catEmoji(category.name)}

        {category.name}
      </h2>
    </div>
  );
}
