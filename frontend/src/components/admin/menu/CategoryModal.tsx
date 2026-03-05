import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";

type Props = {
  modalOpen: boolean;
  onClose: () => void;
  onCreated?: (cat: Category) => void;
};

export default function CategoryModal({
  modalOpen,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold">Thêm danh mục</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-destructive flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
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

        <div className="px-6 py-5 space-y-4">
          <label className="block text-xs text-muted-foreground font-medium mb-1.5">
            Tên danh mục
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm"
            placeholder="VD: Món Khai Vị"
          />
          <label className="block text-xs text-muted-foreground font-medium mb-1.5">
            URL ảnh (tùy chọn)
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm"
            placeholder="https://..."
          />
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <Button onClick={onClose} variant={"outline"}>
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (!name.trim()) return;
              setSaving(true);
              try {
                const token = localStorage.getItem("token");
                const headers: Record<string, string> = {
                  "Content-Type": "application/json",
                };
                if (token) headers["Authorization"] = `Bearer ${token}`;
                const url = base ? `${base}/api/categories` : "/api/categories";
                const res = await fetch(url, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    name: name.trim(),
                    imageUrl: imageUrl.trim(),
                  }),
                });
                if (!res.ok) {
                  const text = await res.text().catch(() => "<no body>");
                  throw new Error(
                    `Failed to create category: ${res.status} ${url} ${text}`,
                  );
                }
                const json = await res.json();
                const created = json?.data ?? json;
                if (typeof onCreated === "function")
                  onCreated(created as Category);
                setName("");
                setImageUrl("");
                onClose();
              } catch (err) {
                console.error("Failed to create category (CategoryModal)", err);
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            Tạo
          </Button>
        </div>
      </div>
    </div>
  );
}
