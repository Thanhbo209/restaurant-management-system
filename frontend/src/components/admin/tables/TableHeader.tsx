import { Button } from "@/components/ui/button";
import { Utensils, Plus } from "lucide-react";

interface Props {
  onAdd: () => void;
}

export default function TableHeader({ onAdd }: Props) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Utensils className="w-5 h-5 text-white" />
        </div>

        <div>
          <p className="text-2xl font-bold tracking-tight leading-none">
            Quản lý bàn ăn
          </p>
          <p className="text-xs text-muted-foreground mt-2">Thêm sửa xóa bàn</p>
        </div>
      </div>

      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1" />
        Add Table
      </Button>
    </div>
  );
}
