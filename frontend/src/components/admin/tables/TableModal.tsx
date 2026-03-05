import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { STATUS, type Table, type TableStatus } from "@/types/table";

export default function TableModal({
  modalOpen,
  table,
  onClose,
  onSave,
}: {
  modalOpen: boolean;
  table: Table | null;
  onClose: () => void;
  // onSave will be called with the saved table object returned from the backend
  onSave: (saved: Table) => void;
}) {
  const isEdit = Boolean(table && table._id);
  const [form, setForm] = useState<Table>(() => ({
    _id: table?._id ?? "",
    tableNumber: table?.tableNumber ?? 0,
    capacity: table?.capacity ?? 4,
    status: table?.status ?? "available",
    qrCodeUrl: table?.qrCodeUrl ?? "",
  }));
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent key={`${modalOpen}-${table?._id ?? "new"}`}>
        <div>
          <DialogTitle>
            {isEdit ? `Edit Table #${table?.tableNumber}` : "Add New Table"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the table details below."
              : "Configure your new table."}
          </DialogDescription>

          <div className="mt-4 space-y-4">
            <Field>
              <FieldLabel>Table Number</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min={1}
                  value={Number(form.tableNumber ?? 0)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tableNumber: e.target.value ? Number(e.target.value) : 0,
                    })
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Capacity</FieldLabel>
              <FieldContent>
                <div className="flex gap-2">
                  {[2, 4, 6, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => setForm({ ...form, capacity: n })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${form.capacity === n ? "bg-violet-600 text-white border-violet-600 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <div className="flex gap-2">
                  {Object.entries(STATUS).map(([key, cfg]) => {
                    const status = key as TableStatus;

                    return (
                      <button
                        key={status}
                        onClick={() => setForm({ ...form, status })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all duration-150 capitalize ${
                          form.status === status
                            ? cfg.badge
                            : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                QR Code URL{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  value={form.qrCodeUrl ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, qrCodeUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </FieldContent>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-2"
              onClick={async () => {
                try {
                  setLoading(true);
                  const API_BASE = import.meta.env.VITE_API_URL ?? "";
                  const token = localStorage.getItem("token");
                  const headers = token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined;

                  if (isEdit && table) {
                    const id = table._id ?? table._id;
                    const updates: Partial<Table> = {};
                    if (typeof form.tableNumber !== "undefined")
                      updates.tableNumber = Number(form.tableNumber);
                    if (typeof form.capacity !== "undefined")
                      updates.capacity = Number(form.capacity);
                    if (typeof form.status !== "undefined")
                      updates.status = form.status;
                    if (typeof form.qrCodeUrl !== "undefined")
                      updates.qrCodeUrl = form.qrCodeUrl;
                    const res = await axios.put(
                      `${API_BASE}/api/tables/${id}`,
                      updates,
                      { headers },
                    );
                    onSave(res.data);
                  } else {
                    const body = {
                      tableNumber: Number(form.tableNumber),
                      capacity: Number(form.capacity ?? 4),
                      qrCodeUrl: form.qrCodeUrl?.trim() || undefined,
                    };
                    const res = await axios.post(
                      `${API_BASE}/api/tables`,
                      body,
                      { headers },
                    );
                    onSave(res.data);
                  }
                  onClose();
                } catch (unknownErr) {
                  console.error(unknownErr);
                  const err = unknownErr as { response?: { status?: number } };
                  // handle unauthorized
                  if (err?.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                    return;
                  }
                  alert("Failed to save table. See console for details.");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {isEdit ? "Save Changes" : "Add Table"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
