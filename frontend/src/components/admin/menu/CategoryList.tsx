import { useState } from "react";
import type { Category } from "@/types/category";

interface CategoryProps {
  CATEGORIES: Category[];
  selectedCategory: string;
  setSelectedCategory: (next: string) => void;
  onCategoryUpdated?: (cat: Category) => void;
  onCategoryRemoved?: (id: string) => void;
  onEditRequested?: (cat: Category) => void;
}

const CategoryList = ({
  CATEGORIES,
  selectedCategory,
  setSelectedCategory,
  onCategoryRemoved,
  onEditRequested,
}: CategoryProps) => {
  const [busyId, setBusyId] = useState<string | null>(null);
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
              {/* Edit / Delete controls */}
              <div className="absolute top-2 left-2 z-20 flex gap-2">
                <button
                  title="Chỉnh sửa danh mục"
                  className="w-8 h-8 rounded-md bg-card/70 hover:bg-card/90 flex items-center justify-center text-white text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (busyId) return;
                    if (typeof onEditRequested === "function")
                      onEditRequested(cat);
                  }}
                >
                  ✎
                </button>
                <button
                  title="Xóa danh mục"
                  className="w-8 h-8 rounded-md bg-destructive/80 hover:bg-destructive/95 flex items-center justify-center text-white text-xs"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (busyId) return;
                    const ok = window.confirm(
                      `Xóa danh mục "${cat.name}"? Hành động này sẽ xóa tất cả món ăn thuộc danh mục này.`,
                    );
                    if (!ok) return;
                    try {
                      setBusyId(cat._id);
                      const API_BASE_URL = import.meta.env.VITE_API_URL as
                        | string
                        | undefined;
                      const base = API_BASE_URL
                        ? API_BASE_URL.replace(/\/$/, "")
                        : "";
                      const token = localStorage.getItem("token");
                      const headers: Record<string, string> = {};
                      if (token) headers["Authorization"] = `Bearer ${token}`;
                      const url = base
                        ? `${base}/api/categories/${cat._id}`
                        : `/api/categories/${cat._id}`;
                      const res = await fetch(url, {
                        method: "DELETE",
                        headers,
                      });
                      if (!res.ok) {
                        const text = await res.text().catch(() => "<no body>");
                        throw new Error(
                          `Failed to delete category: ${res.status} ${url} ${text}`,
                        );
                      }
                      if (typeof onCategoryRemoved === "function")
                        onCategoryRemoved(cat._id);
                    } catch (err) {
                      console.error("Failed to delete category:", err);
                      window.alert("Xóa danh mục thất bại. Vui lòng thử lại.");
                    } finally {
                      setBusyId(null);
                    }
                  }}
                >
                  🗑
                </button>
              </div>
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
