import Banner from "@/components/admin/menu/Banner";
import CategoryList from "@/components/admin/menu/CategoryList";
import FoodList from "@/components/admin/menu/FoodList";
import { StatCard } from "@/components/admin/StatCard";
import { getMenuStats } from "@/constants/stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryModal from "@/components/admin/menu/CategoryModal";
import { useState, useEffect } from "react";
import type { Food as FoodType } from "@/types/food";
import type { Category as CategoryType } from "@/types/category";
import TopSelling from "@/components/admin/menu/TopSelling";
import FoodModal from "@/components/admin/menu/FoodModal";
import DeleteModal from "@/components/admin/menu/DeleteModal";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
  isAvailable: true,
  isFeatured: false,
};

type Food = FoodType;
type FormState = typeof emptyForm;

const API_BASE_URL = import.meta.env.VITE_API_URL;
const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";

export default function MenuManagement() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Food | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = foods.filter((f) => {
    const matchCat =
      selectedCategory === "all" || f.category === selectedCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalItems = foods.length;
  const availableItems = foods.filter((f) => f.isAvailable).length;
  const featuredItems = foods.filter((f) => f.isFeatured).length;
  const avgRating = foods.length
    ? (foods.reduce((s, f) => s + f.ratingAverage, 0) / foods.length).toFixed(1)
    : "0.0";

  const STATS = getMenuStats({
    totalItems,
    availableItems,
    featuredItems,
    avgRating,
  });

  const openAdd = () => {
    setForm({ ...emptyForm, category: categories[0]?._id ?? "" });
    setEditItem(null);
    setModalOpen(true);
  };
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryType | null>(null);
  const openEdit = (item: Food) => {
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      imageUrl: item.imageUrl,
      category: item.category,
      isAvailable: item.isAvailable,
      isFeatured: !!item.isFeatured,
    });
    setEditItem(item);
    setModalOpen(true);
  };

  const getCatName = (id: string) =>
    categories.find((c) => c._id === id)?.name ?? "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    async function fetchData() {
      try {
        const [catsRes, foodsRes] = await Promise.all([
          fetch(base ? `${base}/api/categories` : "/api/categories", {
            headers,
          }),
          fetch(base ? `${base}/api/foods` : "/api/foods", { headers }),
        ]);

        const catsJson = await catsRes.json();
        const foodsJson = await foodsRes.json();

        const cats = catsJson?.data ?? catsJson?.categories ?? catsJson;
        const f = foodsJson?.data ?? foodsJson ?? foodsJson?.foods;

        if (Array.isArray(cats)) setCategories(cats as CategoryType[]);
        if (Array.isArray(f)) {
          const norm = f.map((it: unknown) => {
            const obj = it as Record<string, unknown>;
            const cat = obj.category as
              | Record<string, unknown>
              | string
              | undefined;
            return {
              _id: String(obj._id ?? ""),
              name: String(obj.name ?? ""),
              description: String(obj.description ?? ""),
              price: Number(obj.price ?? 0),
              imageUrl: String(obj.imageUrl ?? ""),
              category:
                typeof cat === "string"
                  ? String(cat)
                  : String(
                      (cat && (cat as Record<string, unknown>)?._id) ?? "",
                    ),
              isAvailable: Boolean(obj.isAvailable),
              isFeatured: Boolean(obj.isFeatured),
              ratingAverage: Number(obj.ratingAverage ?? 0),
              ratingCount: Number(obj.ratingCount ?? 0),
            } as Food;
          });
          setFoods(norm as Food[]);
        }
      } catch (err) {
        console.error("Failed to fetch categories/foods:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen  ">
      {/* ── Two-column layout ── */}
      <div className="flex overflow-hidden">
        {/* ════ LEFT COLUMN ════ */}
        <div className="flex-3 overflow-y-auto p-6 space-y-6 border-r border-border">
          {/* Banner */}
          <Banner
            availableItems={availableItems}
            featuredItems={featuredItems}
          />
          {/* Categories */}
          <div>
            {categories.length === 0 ? (
              <div className="p-4 bg-card border border-border rounded-xl text-sm text-muted-foreground">
                Không có danh mục nào. Hãy tạo danh mục trước khi thêm món.
              </div>
            ) : (
              <CategoryList
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                CATEGORIES={categories}
                onEditRequested={(c) => {
                  setEditCategory(c);
                  setCatModalOpen(true);
                }}
                onCategoryRemoved={(id) => {
                  // remove category from list
                  setCategories((prev) => prev.filter((p) => p._id !== id));
                  // remove foods belonging to that category
                  setFoods((prev) => prev.filter((f) => f.category !== id));
                  // if the deleted category was selected, reset to all
                  if (selectedCategory === id) setSelectedCategory("all");
                }}
              />
            )}
          </div>

          {/* Food CRUD */}
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <p className="text-[15px]  tracking-widest uppercase font-semibold whitespace-nowrap">
                  Món Ăn{" "}
                  {selectedCategory !== "all" &&
                    `· ${getCatName(selectedCategory)}`}
                </p>
                <div className="relative flex-1 max-w-xs">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm món ăn..."
                    className="w-full  border border-border rounded-xl pl-9 pr-3 py-2 text-sm  placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {selectedCategory !== "all" && (
                  <Button
                    onClick={() => setSelectedCategory("all")}
                    variant={"outline"}
                  >
                    Tất cả
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setEditCategory(null);
                    setCatModalOpen(true);
                  }}
                  variant={"outline"}
                >
                  Thêm danh mục
                </Button>
                <Button onClick={openAdd}>
                  <Plus />
                  Thêm món
                </Button>
              </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 ">
                <span className="text-5xl mb-3">🍽</span>
                <p className="text-sm">Không tìm thấy món ăn nào</p>
              </div>
            ) : (
              <FoodList
                filtered={filtered}
                getCatName={getCatName}
                openEdit={openEdit}
                setDeleteId={setDeleteId}
              />
            )}
          </div>
        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div className="flex-[1.4] overflow-y-auto p-6 space-y-6">
          {/* Stat Cards 2×2 */}
          <div>
            <p className="text-[15px] tracking-widest uppercase font-semibold mb-3">
              Tổng Quan
            </p>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <StatCard
                  key={s.title}
                  stat={{
                    title: s.title,
                    value: s.value,
                    change: s.change,
                    trend: s.trend as "up" | "down",
                    description: s.description,
                    icon: s.icon as unknown as import("react").ElementType,
                    color: s.color,
                    bg: s.bg,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Top Selling */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[15px] tracking-widest uppercase font-semibold">
                Bán Chạy Nhất
              </p>
              <span className="text-xs text-primary font-medium">
                Tháng này
              </span>
            </div>

            {foods.length === 0 ? (
              <div className="p-4 bg-card border border-border rounded-xl text-sm text-muted-foreground">
                Chưa có dữ liệu bán chạy.
              </div>
            ) : (
              (() => {
                const top = foods
                  .slice()
                  .sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0))
                  .slice(0, 3)
                  .map((it) => ({
                    id: it._id,
                    name: it.name,
                    sold: it.ratingCount ?? 0,
                    revenue: "—",
                    trend: "",
                    img: it.imageUrl || "/vite.svg",
                  }));
                return <TopSelling TopSellingFood={top} />;
              })()
            )}
          </div>

          {/* Category Breakdown */}
          <div>
            <p className="text-[15px] tracking-widest uppercase font-semibold mb-3">
              Phân Bổ Danh Mục
            </p>
            <div className="space-y-3">
              {categories.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Không có danh mục để hiển thị.
                </div>
              ) : (
                <>
                  {categories.map((cat) => {
                    const count = foods.filter(
                      (f) => f.category === cat._id,
                    ).length;
                    const pct = foods.length
                      ? Math.round((count / foods.length) * 100)
                      : 0;
                    return (
                      <div key={cat._id} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-20 truncate shrink-0">
                          {cat.name}
                        </span>
                        <div className="flex-1 bg-card rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-chart-1 to-chart-5 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <FoodModal
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        setForm={setForm}
        editItem={editItem}
        onSaved={(item) => {
          if (!item) return;
          if (editItem)
            setFoods((prev) =>
              prev.map((f) => (f._id === item._id ? item : f)),
            );
          else setFoods((prev) => [...prev, item]);
        }}
        CATEGORIES={categories}
      />

      <CategoryModal
        modalOpen={catModalOpen}
        onClose={() => {
          setCatModalOpen(false);
          setEditCategory(null);
        }}
        onCreated={(c) => setCategories((prev) => [...prev, c])}
        editItem={editCategory}
        onSaved={(c) => {
          setCategories((prev) => prev.map((p) => (p._id === c._id ? c : p)));
          setEditCategory(null);
        }}
      />

      {/* ══════ Delete Confirm Modal ══════ */}
      {deleteId && (
        <DeleteModal
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          onDeleted={(id) =>
            setFoods((prev) => prev.filter((f) => f._id !== id))
          }
        />
      )}
    </div>
  );
}
