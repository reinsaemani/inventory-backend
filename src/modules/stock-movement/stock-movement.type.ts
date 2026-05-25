import { StockMovement } from "../../../generated/prisma/client";

// ID
export type TStockMovementID = StockMovement["id"];

// READ
export type TStockMovementRead = Pick<
  StockMovement,
  | "id"
  | "type"
  | "quantity"
  | "note"
  | "productId"
  | "userId"
  | "createdAt"
>;

export type TStockMovementWrite = {
  type: StockMovement["type"];
  quantity: number;
  note?: string | null;
  productId: string;
  userId: string;
  warehouseId: string;
};