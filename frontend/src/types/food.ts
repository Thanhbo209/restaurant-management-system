export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  ratingAverage: number;
  ratingCount: number;
}

export type FoodForm = {
  name: string;
  description: string;
  price: string; // kept as string because form uses string
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isFeatured: boolean;
};
