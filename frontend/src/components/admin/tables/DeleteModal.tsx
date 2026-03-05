import { Button } from "@/components/ui/button";
import type { Table } from "@/types/table";
import { Trash } from "lucide-react";

interface Props {
  table: Table;
  onClose: () => void;
  onConfirm: () => void;
}
export const DeleteModal = ({ table, onClose, onConfirm }: Props) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    onClick={onClose}
  >
    <div
      className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-sm p-7 text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
        <Trash color="red" />
      </div>
      <h3 className="text-lg font-bold  mb-1">
        Delete Table #{table.tableNumber}?
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        This action cannot be undone.
      </p>
      <div className="flex justify-center gap-5">
        <Button onClick={onClose} variant={"outline"}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant={"destructive"}>
          Delete
        </Button>
      </div>
    </div>
  </div>
);
