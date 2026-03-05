import { useState, useEffect } from "react";
import axios from "axios";

import { STATUS, type Table } from "@/types/table";

import TableHeader from "@/components/admin/tables/TableHeader";
import TableGrid from "@/components/admin/tables/TableGrid";
import TableModal from "@/components/admin/tables/TableModal";
import { DeleteModal } from "@/components/admin/tables/DeleteModal";

import { StatCard } from "@/components/admin/StatCard";
import { TABLE_STATS } from "@/constants/stats";

const STATUSES = ["all", "available", "occupied", "reserved"];

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [filter, setFilter] = useState("all");

  const [modal, setModal] = useState<Table | "add" | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Table | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL ?? "";

  const stats = TABLE_STATS(tables);

  const filtered =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);

  /*
  ======================
  LOAD TABLES
  ======================
  */

  useEffect(() => {
    let mounted = true;

    axios
      .get(`${API_BASE}/api/tables`)
      .then((res) => {
        if (!mounted) return;

        const data = Array.isArray(res.data) ? res.data : [];

        setTables(data);
      })
      .catch((err) => {
        console.error("Failed to load tables", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /*
  ======================
  SAVE TABLE
  ======================
  */

  const handleSave = (savedTable: Table) => {
    if (!savedTable) return;

    if (modal === "add") {
      setTables((prev) => [...prev, savedTable]);
    } else {
      setTables((prev) =>
        prev.map((t) => (t._id === savedTable._id ? savedTable : t)),
      );
    }

    setModal(null);
  };

  /*
  ======================
  CHANGE STATUS
  ======================
  */

  const cycleStatus = async (id: string) => {
    const order = ["available", "occupied", "reserved"];

    try {
      const table = tables.find((t) => t._id === id);
      if (!table) return;

      const next = order[(order.indexOf(table.status) + 1) % order.length];

      const token = localStorage.getItem("token");

      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await axios.put(
        `${API_BASE}/api/tables/${id}`,
        { status: next },
        { headers },
      );

      const updated = res.data;

      setTables((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      alert("Failed to change status");
    }
  };

  /*
  ======================
  DELETE TABLE
  ======================
  */

  const deleteTable = async () => {
    if (!deleteConfirm) return;

    try {
      const token = localStorage.getItem("token");

      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      await axios.delete(`${API_BASE}/api/tables/${deleteConfirm._id}`, {
        headers,
      });

      setTables((prev) => prev.filter((t) => t._id !== deleteConfirm._id));

      setDeleteConfirm(null);
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      alert("Failed to delete table");
    }
  };

  /*
  ======================
  RENDER
  ======================
  */

  return (
    <div className="min-h-screen font-sans">
      <TableHeader onAdd={() => setModal("add")} />

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Stats */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <StatCard
              key={s.title}
              stat={{
                title: s.title,
                value: String(s.value),
                change: "",
                trend: "up",
                icon: s.icon,
                color: s.color,
                bg: s.bg,
              }}
            />
          ))}
        </div>

        {/* Filters */}

        <div className="flex gap-2 mb-6">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                filter === s
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s === "all"
                ? `Tất cả (${stats.total})`
                : `${STATUS[s].label} (${stats[s]})`}
            </button>
          ))}
        </div>

        {/* GRID */}

        <TableGrid
          tables={filtered}
          STATUS={STATUS}
          onEdit={(t) => setModal(t)}
          onDelete={(t) => setDeleteConfirm(t)}
          onCycle={cycleStatus}
        />
      </main>

      {/* TABLE MODAL */}

      {modal && (
        <TableModal
          modalOpen={Boolean(modal)}
          table={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* DELETE MODAL */}

      {deleteConfirm && (
        <DeleteModal
          table={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={deleteTable}
        />
      )}
    </div>
  );
}
