import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/cartItems";
import { Check } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  cartItems: CartItem[];
  cartTotal: number;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  tableNumber?: string;
};

export default function CartDrawer({
  open,
  setOpen,
  cartItems,
  cartTotal,
  updateQty,
  removeItem,
  tableNumber,
}: Props) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [note, setNote] = useState("");

  function handleClose() {
    setOpen(false);
  }

  function handlePlaceOrder() {
    setOrderPlaced(true);

    setTimeout(() => {
      setOrderPlaced(false);
      setOpen(false);
      setNote("");
    }, 3000);
  }

  function handleDecrease(item: CartItem) {
    const nextQty = item.qty - 1;
    if (nextQty <= 0) {
      removeItem(item._id);
      return;
    }
    updateQty(item._id, nextQty);
  }

  function handleIncrease(item: CartItem) {
    updateQty(item._id, item.qty + 1);
  }

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-card w-full max-w-xl rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Header tableNumber={tableNumber} onClose={handleClose} />

        {orderPlaced ? (
          <OrderSuccess />
        ) : (
          <>
            <CartList
              items={cartItems}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />

            <NoteInput note={note} setNote={setNote} />

            <CartTotal total={cartTotal} />

            <Button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="w-full mt-4"
            >
              Gọi món
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Header({
  tableNumber,
  onClose,
}: {
  tableNumber?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-4 border-b pb-4">
      <h2 className="text-lg font-bold">Giỏ hàng — Bàn {tableNumber}</h2>
      <button onClick={onClose}>✕</button>
    </div>
  );
}

function OrderSuccess() {
  return (
    <div className="text-center py-12">
      <Check size={40} className="mx-auto text-green-500 mb-4" />
      <p className="font-bold text-lg">Đặt món thành công</p>
      <p className="text-sm text-muted-foreground">Nhà bếp đang chuẩn bị</p>
    </div>
  );
}

function CartList({
  items,
  onIncrease,
  onDecrease,
}: {
  items: CartItem[];
  onIncrease: (item: CartItem) => void;
  onDecrease: (item: CartItem) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground">Giỏ hàng trống</p>
    );
  }

  return (
    <div className="divide-y">
      {items.map((item) => (
        <CartRow
          key={item._id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      ))}
    </div>
  );
}

function CartRow({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onIncrease: (item: CartItem) => void;
  onDecrease: (item: CartItem) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      )}

      <div className="flex-1">
        <p className="font-semibold text-sm">{item.name}</p>

        <p className="text-xs text-muted-foreground">
          {item.price.toLocaleString("vi-VN")}₫
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => onDecrease(item)}>-</Button>

        <span className="mx-2">{item.qty}</span>

        <Button onClick={() => onIncrease(item)}>+</Button>
      </div>

      <span className="font-semibold text-sm">
        {(item.qty * item.price).toLocaleString("vi-VN")}₫
      </span>
    </div>
  );
}

function NoteInput({
  note,
  setNote,
}: {
  note: string;
  setNote: (v: string) => void;
}) {
  return (
    <div className="mt-4">
      <label className="text-xs font-semibold">Ghi chú</label>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
      />
    </div>
  );
}

function CartTotal({ total }: { total: number }) {
  return (
    <div className="flex justify-between font-bold mt-4 border-t pt-3">
      <span>Tổng</span>
      <span>{total.toLocaleString("vi-VN")}₫</span>
    </div>
  );
}
