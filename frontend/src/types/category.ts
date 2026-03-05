export interface Category {
  _id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CategorySummary = Pick<
  Category,
  "_id" | "name" | "imageUrl" | "isActive"
>;
