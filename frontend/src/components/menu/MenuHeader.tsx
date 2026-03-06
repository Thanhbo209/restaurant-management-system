import { ShoppingCart } from "lucide-react";

type Props = {
  tableNumber?: string;
  cartCount: number;
  openCart: () => void;
};

export default function MenuHeader({
  tableNumber,
  cartCount,
  openCart,
}: Props) {
  return (
    <header className="bg-sidebar sticky top-0 z-50 shadow">
      <div className="max-w-3xl mx-auto px-5 py-3 flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">Nhà Hàng</p>
          <p className="text-xs text-muted-foreground">Bàn {tableNumber}</p>
        </div>

        <button
          onClick={openCart}
          className="relative px-4 py-4 rounded-full border"
        >
          <ShoppingCart size={15} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
