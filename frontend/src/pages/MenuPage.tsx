import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router";
import axios from "axios";

import type { Food } from "@/types/food";
import type { Category } from "@/types/category";

import MenuHeader from "@/components/menu/MenuHeader";
import CategoryNav from "@/components/menu/CategoryNav";
import CategoryHeading from "@/components/menu/CategoryHeading";
import FoodGrid from "@/components/menu/FoodGrid";
import FloatingCartBar from "@/components/menu/FloatingCartBar";
import CartDrawer from "@/components/menu/CartDrawer";

type CartItem = Food & { qty: number };

export default function MenuPage() {
  const { tableNumber } = useParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL ?? "";

    Promise.all([
      axios.get<Category[]>(`${base}/api/categories`),
      axios.get<Food[]>(`${base}/api/foods`),
    ]).then(([cats, foodsRes]) => {
      const activeCats = cats.data
        .filter((c) => c.isActive)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      setCategories(activeCats);
      setFoods(foodsRes.data);

      if (activeCats.length) setActiveCategory(activeCats[0]._id);
      setLoading(false);
    });
  }, []);

  // const foodsByCategory = useMemo(() => {
  //   const map: Record<string, Food[]> = {};
  //   categories.forEach((c) => (map[c._id] = []));

  //   foods.forEach((f) => {
  //     if (f.category && map[f.category]) map[f.category].push(f);
  //   });

  //   return map;
  // }, [categories, foods]);

  const foodsByCategory = useMemo(() => {
    const map: Record<string, Food[]> = {};

    categories.forEach((c) => (map[c._id] = []));

    foods.forEach((f) => {
      const categoryId =
        typeof f.category === "string" ? f.category : f.category?._id;

      if (categoryId && map[categoryId]) {
        map[categoryId].push(f);
      }
    });

    return map;
  }, [categories, foods]);

  const addToCart = useCallback((food: Food) => {
    setCart((prev) => ({
      ...prev,
      [food._id]: { ...food, qty: (prev[food._id]?.qty ?? 0) + 1 },
    }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      if (!prev[id] || prev[id].qty <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...prev[id], qty: prev[id].qty - 1 } };
    });
  }, []);

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  if (loading) return <div>Loading...</div>;

  const activeFoods = activeCategory
    ? (foodsByCategory[activeCategory] ?? [])
    : [];

  const activeCat = categories.find((c) => c._id === activeCategory);

  return (
    <div className="min-h-screen pb-28">
      <MenuHeader
        tableNumber={tableNumber}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
      />

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <CategoryHeading category={activeCat} />

      <FoodGrid
        foods={activeFoods}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />

      <FloatingCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        openCart={() => setCartOpen(true)}
      />

      <CartDrawer
        open={cartOpen}
        setOpen={setCartOpen}
        cartItems={cartItems}
        cartTotal={cartTotal}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        tableNumber={tableNumber}
      />
    </div>
  );
}
