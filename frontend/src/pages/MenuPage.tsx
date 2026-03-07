import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

import type { Food } from "@/types/food";
import type { Category } from "@/types/category";
import type { CartItem } from "@/types/cartItems";
import type { OrderItem } from "@/types/order";

import MenuHeader from "@/components/menu/MenuHeader";
import CategoryNav from "@/components/menu/CategoryNav";
import CategoryHeading from "@/components/menu/CategoryHeading";
import FoodGrid from "@/components/menu/FoodGrid";
import FloatingCartBar from "@/components/menu/FloatingCartBar";
import CartDrawer from "@/components/menu/CartDrawer";

export default function MenuPage() {
  const { tableNumber } = useParams();

  const base = import.meta.env.VITE_API_URL ?? "";
  const api = axios.create({ baseURL: base });

  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /*
  ============================
  TABLE NUMBER
  ============================
  */

  const tableNum = Number(tableNumber?.replace("t-", ""));

  /*
  ============================
  CREATE / GET ORDER
  ============================
  */

  useEffect(() => {
    if (!tableNum) return;

    const initOrder = async () => {
      try {
        const res = await api.post("/api/orders", {
          tableNumber: tableNum,
        });

        setOrderId(res.data._id);
        setOrderItems(res.data.items ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    initOrder();
  }, [tableNum]);

  /*
  ============================
  LOAD MENU
  ============================
  */

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const [catsRes, foodsRes] = await Promise.all([
          api.get<Category[]>("/api/categories"),
          api.get<Food[]>("/api/foods"),
        ]);

        const activeCats = catsRes.data
          .filter((c) => c.isActive)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setCategories(activeCats);
        setFoods(foodsRes.data);

        if (activeCats.length) {
          setActiveCategory(activeCats[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  /*
  ============================
  GROUP FOODS
  ============================
  */

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

  /*
  ============================
  ORDER ACTIONS
  ============================
  */

  const addToCart = async (food: Food) => {
    if (!orderId) return;

    const res = await api.post(`/api/orders/${orderId}/items`, {
      foodId: food._id,
      quantity: 1,
    });

    setOrderItems(res.data.items);
  };

  const updateQty = async (itemId: string, quantity: number) => {
    if (!orderId) return;

    const res = await api.patch(`/api/orders/${orderId}/items/${itemId}`, {
      quantity,
    });

    setOrderItems(res.data.items);
  };

  const removeItem = async (itemId: string) => {
    if (!orderId) return;

    const res = await api.delete(`/api/orders/${orderId}/items/${itemId}`);

    setOrderItems(res.data.items);
  };

  /*
  ============================
  CART COMPUTATION
  ============================
  */

  const cartItems: CartItem[] = useMemo(() => {
    return orderItems.map((item) => {
      const foodId = typeof item.food === "string" ? item.food : item.food?._id;

      const food = foods.find((f) => f._id === foodId);

      return {
        _id: item._id,
        name: food?.name ?? "Unknown",
        price: food?.price ?? 0,
        imageUrl: food?.imageUrl,
        qty: item.quantity,
      };
    });
  }, [orderItems, foods]);

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
        orderItems={orderItems}
        addToCart={addToCart}
        updateQty={updateQty}
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
        updateQty={updateQty}
        removeItem={removeItem}
        tableNumber={tableNumber}
      />
    </div>
  );
}
