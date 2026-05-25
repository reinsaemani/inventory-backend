import { Warehouse } from "../../../generated/prisma/client";

// ID
export type TWarehouseID = Warehouse["id"];

// READ
export type TWarehouseRead = Pick<
  Warehouse,
  "id" | "name" | "location" | "createdAt"
>;

// WRITE
export type TWarehouseWrite = Pick<
  Warehouse,
  "name" | "location"
>;