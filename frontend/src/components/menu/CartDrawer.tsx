import type { Food } from "@/types/food";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

type CartItem = Food & { qty: number };

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (food: Food) => void;
  removeFromCart: (id: string) => void;
  tableNumber?: string;
};

export default function CartDrawer({
  open,
  setOpen,
  cartItems,
  cartTotal,
  addToCart,
  removeFromCart,
  tableNumber,
}: Props) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [note, setNote] = useState("");

  function handlePlaceOrder() {
    setOrderPlaced(true);

    setTimeout(() => {
      setOrderPlaced(false);
      setOpen(false);
      setNote("");
    }, 3000);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-card w-full max-w-xl rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-lg font-bold">Giỏ hàng — Bàn {tableNumber}</h2>

          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {orderPlaced ? (
          <div className="text-center py-12">
            <Check size={40} className="mx-auto text-green-500 mb-4" />

            <p className="font-bold text-lg">Đặt món thành công</p>

            <p className="text-sm text-muted-foreground">
              Nhà bếp đang chuẩn bị
            </p>
          </div>
        ) : (
          <>
            {/* cart items */}

            <div className="divide-y">
              {cartItems.length === 0 && (
                <p className="text-center py-10 text-muted-foreground">
                  Giỏ hàng trống
                </p>
              )}

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
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
                    <Button
                      onClick={() => removeFromCart(item._id)}
                      variant={"outline"}
                    >
                      -
                    </Button>

                    <span className="mx-2">{item.qty}</span>

                    <Button onClick={() => addToCart(item)}>+</Button>
                  </div>

                  <span className="font-semibold text-sm">
                    {(item.qty * item.price).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
            </div>

            {/* note */}

            <div className="mt-4">
              <label className="text-xs font-semibold">Ghi chú</label>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            {/* total */}

            <div className="flex justify-between font-bold mt-4 border-t pt-3">
              <span>Tổng</span>

              <span>{cartTotal.toLocaleString("vi-VN")}₫</span>
            </div>

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
