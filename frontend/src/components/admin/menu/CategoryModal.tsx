import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";
import CategoryForm from "./CategoryForm";

type Props = {
  modalOpen: boolean;
  onClose: () => void;
  onCreated?: (cat: Category) => void;
  editItem?: Category | null;
  onSaved?: (cat: Category) => void;
};

export default function CategoryModal({
  modalOpen,
  onClose,
  onCreated,
  editItem = null,
  onSaved,
}: Props) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";

  useEffect(() => {
    if (editItem) {
      setName(editItem.name ?? "");
      setImageUrl(editItem.imageUrl ?? "");
    } else {
      setName("");
      setImageUrl("");
    }
  }, [editItem]);

  if (!modalOpen) return null;

  const isEdit = Boolean(editItem);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="category-modal-title" className="text-base font-bold">
            {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
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

        <CategoryForm
          name={name}
          setName={setName}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />

        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <Button onClick={onClose} variant={"outline"}>
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (!name.trim()) return;
              setSaving(true);
              setErrorMsg(null);
              try {
                const token = localStorage.getItem("token");
                const headers: Record<string, string> = {
                  "Content-Type": "application/json",
                };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                if (isEdit && editItem) {
                  const url = base
                    ? `${base}/api/categories/${editItem._id}`
                    : `/api/categories/${editItem._id}`;
                  const res = await fetch(url, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                      name: name.trim(),
                      imageUrl: imageUrl.trim(),
                    }),
                  });
                  if (!res.ok) {
                    const text = await res.text().catch(() => "<no body>");
                    throw new Error(
                      `Failed to update category: ${res.status} ${url} ${text}`,
                    );
                  }
                  const json = await res.json();
                  const updated = json?.data ?? json;
                  if (typeof onSaved === "function")
                    onSaved(updated as Category);
                } else {
                  const url = base
                    ? `${base}/api/categories`
                    : "/api/categories";
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
                }
                setName("");
                setImageUrl("");
                onClose();
              } catch (err) {
                console.error("Failed to save category (CategoryModal)", err);
                setErrorMsg("Lưu danh mục thất bại. Vui lòng thử lại.");
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {isEdit ? "Lưu" : "Tạo"}
          </Button>
        </div>
        {errorMsg && (
          <p className="px-6 pb-4 text-xs text-destructive">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
