import { Product } from "../../../generated/prisma/client";

export type TProductID = Product["id"];

export type TProductRead = Pick<
  Product,
  | "id"
  | "sku"
  | "name"
  | "description"
  | "price"
  | "categoryId"
  | "supplierId"
  | "createdAt"
>;


// PRODUCT WRITE
export type TProductWrite = {
  sku: string;
  name: string;
  description?: string | null;
  price: number;
  categoryId: string;
  supplierId?: string | null;
};

// PRODUCT UPDATE
export type TProductUpdate = Partial<TProductWrite>;