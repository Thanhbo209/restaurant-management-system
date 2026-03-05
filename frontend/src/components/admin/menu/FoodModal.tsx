import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Food, FoodForm } from "@/types/food";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-primary" : "bg-accent"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}

type CategoryShape = { _id: string; name: string };

type Props = {
  modalOpen: boolean;
  onClose: () => void;
  form: FoodForm;
  setForm: React.Dispatch<React.SetStateAction<FoodForm>>;
  editItem: Food | null;
  onSaved?: (food: Food) => void;
  CATEGORIES?: CategoryShape[];
};

export default function FoodModal({
  modalOpen,
  onClose,
  form,
  setForm,
  editItem,
  onSaved,
  CATEGORIES,
}: Props) {
  const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";

  const [localCats, setLocalCats] = useState<CategoryShape[]>(CATEGORIES ?? []);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let mounted = true;
    async function fetchCats() {
      try {
        const headers: Record<string, string> = {};
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(
          base ? `${base}/api/categories` : "/api/categories",
          { headers },
        );
        if (!res.ok) return;
        const json = await res.json();
        const cats = json?.data ?? json?.categories ?? json;
        if (mounted && Array.isArray(cats)) {
          const catsArr = cats as CategoryShape[];
          setLocalCats(catsArr);
          // if form has no category selected, default to first
          if (!form.category && catsArr.length) {
            setForm((prev) => ({
              ...prev,
              category: String(catsArr[0]._id ?? ""),
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories inside FoodModal:", err);
      }
    }
    fetchCats();
    return () => {
      mounted = false;
    };
  }, [CATEGORIES, base, form.category, setForm]);

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold">
            {editItem ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl  hover:bg-destructive flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground font-medium mb-1.5">
                Tên món ăn <span className="text-destructive">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Phở Bò Đặc Biệt"
                className="w-full bg-input border border-border focus:border-ring rounded-xl px-4 py-2.5 text-sm  placeholder-secondary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-medium mb-1.5">
                Giá (VNĐ) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="95000"
                className="w-full bg-input border border-border focus:border-ring rounded-xl px-4 py-2.5 text-sm  placeholder-secondary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-medium mb-1.5">
                Danh mục
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-input border border-border focus:border-ring rounded-xl px-4 py-2.5 text-sm  outline-none transition-colors"
              >
                {localCats.length === 0 ? (
                  <option value="">-- Chưa có danh mục --</option>
                ) : (
                  localCats.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground font-medium mb-1.5">
                Mô tả
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Mô tả ngắn về món ăn..."
                rows={2}
                className="w-full bg-input border border-border focus:border-ring rounded-xl px-4 py-2.5 text-sm  placeholder-secondary outline-none transition-colors resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground font-medium mb-1.5">
                URL ảnh
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-input border border-border focus:border-ring rounded-xl px-4 py-2.5 text-sm  placeholder-secondary outline-none transition-colors"
              />
            </div>
            <div className="col-span-2 flex gap-6 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Toggle
                  checked={!!form.isAvailable}
                  onChange={() =>
                    setForm({ ...form, isAvailable: !form.isAvailable })
                  }
                />
                <span className="text-sm text-muted-foreground">Đang bán</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Toggle
                  checked={!!form.isFeatured}
                  onChange={() =>
                    setForm({ ...form, isFeatured: !form.isFeatured })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  Món nổi bật
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <Button onClick={onClose} variant={"outline"}>
            Hủy
          </Button>
          <Button
            onClick={async () => {
              const parsedPrice = Number(form.price);
              if (!form.name.trim()) return;
              if (!form.category) return;
              if (!Number.isFinite(parsedPrice) || parsedPrice < 0) return;
              setSaving(true);
              try {
                const token = localStorage.getItem("token");
                const headers: Record<string, string> = {
                  "Content-Type": "application/json",
                };
                if (token) headers["Authorization"] = `Bearer ${token}`;
                const payload = {
                  name: form.name,
                  description: form.description,
                  price: parsedPrice,
                  imageUrl: form.imageUrl,
                  category: form.category,
                  isAvailable: form.isAvailable,
                  isFeatured: form.isFeatured,
                };
                if (editItem) {
                  const url = base
                    ? `${base}/api/foods/${editItem._id}`
                    : `/api/foods/${editItem._id}`;
                  const res = await fetch(url, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) {
                    const text = await res.text().catch(() => "<no body>");
                    throw new Error(
                      `Failed to update food: ${res.status} ${url} ${text}`,
                    );
                  }
                  const json = await res.json();
                  const updated = json?.data ?? json;
                  if (typeof onSaved === "function") onSaved(updated);
                } else {
                  const url = base ? `${base}/api/foods` : "/api/foods";
                  const res = await fetch(url, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) {
                    const text = await res.text().catch(() => "<no body>");
                    throw new Error(
                      `Failed to create food: ${res.status} ${url} ${text}`,
                    );
                  }
                  const json = await res.json();
                  const created = json?.data ?? json;
                  if (typeof onSaved === "function") onSaved(created);
                }
                onClose();
              } catch (err) {
                console.error("Error saving food inside FoodModal", err);
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {editItem ? "Lưu thay đổi" : "Thêm món"}
          </Button>
        </div>
      </div>
    </div>
  );
}
