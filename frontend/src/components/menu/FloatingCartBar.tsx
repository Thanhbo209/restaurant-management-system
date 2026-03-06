type Props = {
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
};

export default function FloatingCartBar({
  cartCount,
  cartTotal,
  openCart,
}: Props) {
  if (cartCount === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-card px-5 py-3 rounded-xl flex justify-between items-center shadow-xl cursor-pointer text-left"
    >
      <div className="flex gap-3 items-center">
        <span className="border-3 rounded-xl p-2">{cartCount} món</span>
        <span className="text-muted-foreground">Xem giỏ hàng</span>
      </div>

      <span>{cartTotal.toLocaleString("vi-VN")}₫</span>
    </button>
  );
}
