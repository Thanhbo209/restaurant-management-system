export type Role = "admin" | "staff" | "chef";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatarUrl: string;
  createdAt: string;
}
