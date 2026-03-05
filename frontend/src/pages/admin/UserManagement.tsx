import { useEffect, useState, useCallback } from "react";

import CreateUserForm from "@/components/admin/users/CreateUserForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatCard } from "@/components/admin/StatCard";
import type { User } from "@/types/user";

import UsersTable from "@/components/admin/users/UsersTable";
import UsersFilters from "@/components/admin/users/UsersFilters";
import EditUserForm from "@/components/admin/users/EditUserForm";
import { USER_STATS } from "@/constants/stats";

// ─── Live data: fetch users from API ───────────────────────────────────────────
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
      const url = base ? `${base}/api/users` : "/api/users";

      const res = await fetch(url, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data ?? []);
      } else if (res.status === 401) {
        // unauthorized — clear local auth and redirect to login by reloading
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUsers([]);
      } else {
        const text = await res.text();
        setError(`Failed to load users: ${res.status} ${text}`);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Network error fetching users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers, setUsers };
};

// Stats will be computed from live users in the component render

// RoleBadge moved to shared component

// ─── Main Page ────────────────────────────────────────────────────────────────
const UsersPage = () => {
  const { users, loading, error, refetch, setUsers } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá người dùng này?")) return;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
      const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
      const url = base ? `${base}/api/users/${id}` : `/api/users/${id}`;
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        const text = await res.text();
        console.error("Delete failed:", res.status, text);
        void refetch();
      }
    } catch (err) {
      console.error(err);
      void refetch();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
      const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
      const url = base ? `${base}/api/users/${id}` : `/api/users/${id}`;
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method: "PUT",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map((u) => (u._id === id ? updated : u)));
      } else {
        const text = await res.text();
        console.error("Toggle active failed:", res.status, text);
        void refetch();
      }
    } catch (err) {
      console.error(err);
      void refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý nhân viên
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý tài khoản, phân quyền và trạng thái nhân viên.
          </p>
        </div>
        <CreateUserForm
          onCreated={(u) => {
            // prepend created user and refresh
            setUsers((s) => [u, ...s]);
            void refetch();
          }}
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {USER_STATS(users).map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Danh sách nhân viên</CardTitle>
              <CardDescription>
                {loading
                  ? "Đang tải..."
                  : `Tổng cộng ${users.length} nhân viên`}
                {error && (
                  <span className="text-destructive ml-2">{error}</span>
                )}
              </CardDescription>
            </div>
            <UsersFilters
              search={search}
              role={role}
              onSearchChange={setSearch}
              onRoleChange={setRole}
            />
          </div>
        </CardHeader>

        <UsersTable
          users={users}
          refetch={refetch}
          onDelete={handleDelete}
          onToggleActive={toggleActive}
          onEdit={(u) => setEditingUser(u)}
          search={search}
          role={role}
        />
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onUpdated={(updated) => {
              setUsers((s) =>
                s.map((u) => (u._id === updated._id ? updated : u)),
              );
              setEditingUser(null);
            }}
            onClose={() => setEditingUser(null)}
          />
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
