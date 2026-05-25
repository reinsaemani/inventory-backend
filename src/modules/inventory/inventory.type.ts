import { Inventory } from "../../../generated/prisma/client";

// ID
export type TInventoryID = Inventory["id"];

// READ
export type TInventoryRead = Pick<
  Inventory,
  "id" | "warehouseId" | "productId" | "quantity" | "createdAt"
>;

export type TInventoryWrite = Pick<
  Inventory,
  "warehouseId" | "productId" | "quantity"
>;

// UPDATE
export type TInventoryUpdate = Pick<
  Inventory,
  "quantity"
>;