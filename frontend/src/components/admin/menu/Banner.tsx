interface BannerProps {
  availableItems: number;
  featuredItems: number;
}

const Banner = ({ availableItems, featuredItems }: BannerProps) => {
  return (
    <div className="relative rounded-2xl overflow-hidden h-44 shadow-2xl shadow-black/40">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
        alt="menu-banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-muted/60 via-muted/20 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-muted/20 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-center px-7">
        <h2 className="text-3xl font-black  leading-tight drop-shadow-lg">
          Menu
          <br />
          Nhà Hàng
        </h2>
      </div>
      <div className="absolute right-5 bottom-4 flex gap-2">
        <div className="bg-card backdrop-blur border border-border rounded-xl px-4 py-2 text-center">
          <p className="text-primary text-xl font-black">{availableItems}</p>
          <p className="text-primary text-xs">Đang bán</p>
        </div>
        <div className="bg-card backdrop-blur border border-border rounded-xl px-4 py-2 text-center">
          <p className="text-primary text-xl font-black">{featuredItems}</p>
          <p className="text-primary text-xs">Nổi bật</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
