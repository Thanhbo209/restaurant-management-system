import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, Role } from "@/types/user";

type Props = {
  user: User;
  onUpdated: (user: User) => void;
  onClose: () => void;
};

export default function EditUserForm({ user, onUpdated, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: !!user.isActive,
      });
    }
  }, [user]);

  const handleChange = (k: string, v: string | boolean) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
      const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
      const url = base
        ? `${base}/api/users/${user._id}`
        : `/api/users/${user._id}`;
      const token = localStorage.getItem("token");

      const body: Partial<User> = {
        name: form.name,
        email: form.email,
        role: form.role as Role,
        isActive: form.isActive,
      };

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdated(updated);
        onClose();
      } else {
        const txt = await res.text();
        console.error("Update failed:", res.status, txt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h3>
        <div className="grid gap-5">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(v) => handleChange("role", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
            <Label htmlFor="active">Hoạt động</Label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={submit} disabled={loading}>
              {loading ? "Lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
