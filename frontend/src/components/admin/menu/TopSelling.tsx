interface TopSellingProps {
  TopSellingFood: {
    id: string;
    name: string;
    sold: number;
    revenue: string;
    trend: string;
    img: string;
  }[];
}

const TopSelling = ({ TopSellingFood }: TopSellingProps) => {
  return (
    <div className="space-y-2">
      {TopSellingFood.map((item, i) => (
        <div
          key={item.id}
          className="flex items-center gap-3 bg-card border border-border hover:border-ring rounded-xl p-3 transition-colors group"
        >
          <span
            className={`text-sm font-black w-5 text-center shrink-0 ${i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-700" : "text-gray-600"}`}
          >
            {i + 1}
          </span>
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-1 ring-ring group-hover:ring-ring/70 transition-all">
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-sm font-semibold  truncate leading-tight">
              {item.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.sold} đơn · {item.revenue}
            </p>
          </div>
          <span className="text-xs font-bold text-chart-3 bg-chart-3/10 border border-chart-3/20 px-2 py-0.5 rounded-full shrink-0">
            {item.trend}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TopSelling;
