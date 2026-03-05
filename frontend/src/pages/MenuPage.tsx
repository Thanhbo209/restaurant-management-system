import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

type Category = {
  _id: string;
  name: string;
  description?: string;
};

type Food = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: Category | string | null;
  description?: string;
  rating?: number;
  isAvailable?: boolean;
};

export default function MenuPage() {
  const { tableNumber } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const base = import.meta.env.VITE_API_URL ?? "";
    const catReq = axios.get(`${base}/api/categories`);
    const foodReq = axios.get(`${base}/api/foods`);

    Promise.all([catReq, foodReq])
      .then(([cats, foodsRes]) => {
        if (!mounted) return;
        setCategories(cats.data || []);
        setFoods(foodsRes.data || []);
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        setError("Unable to load menu. Please try again later.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const foodsByCategory = useMemo(() => {
    const map: Record<string, Food[]> = {};
    // ensure categories order preserved
    categories.forEach((c) => (map[c._id] = []));
    for (const f of foods) {
      const catId =
        typeof f.category === "string" ? f.category : f.category?._id;
      if (catId && map[catId]) map[catId].push(f);
      else {
        // uncategorized bucket
        if (!map.__uncat) map.__uncat = [];
        map.__uncat.push(f);
      }
    }
    return map;
  }, [categories, foods]);

  if (loading) return <div className="p-6">Loading menu…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Menu</h1>
      <p className="text-sm text-muted-foreground mb-6">Table: {tableNumber}</p>

      {categories.map((cat) => (
        <section key={cat._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {cat.description}
          </p>
          <ul className="space-y-2">
            {(foodsByCategory[cat._id] || []).map((f) => (
              <li
                key={f._id}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
              >
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.description ?? ""}
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {Number(f.price).toLocaleString()}₫
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* uncategorized */}
      {foodsByCategory.__uncat && foodsByCategory.__uncat.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Other</h2>
          <ul className="space-y-2">
            {foodsByCategory.__uncat.map((f) => (
              <li
                key={f._id}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
              >
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.description ?? ""}
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {Number(f.price).toLocaleString()}₫
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
