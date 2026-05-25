import { Supplier } from "../../../generated/prisma/client";

export type TSupplierID = Supplier["id"];

export type TSupplierRead = Pick<
  Supplier,
  "id" | "name" | "email" | "phone" | "address" | "createdAt"
>;

export type TSupplierWrite = Pick<
  Supplier,
  "name" | "email" | "phone" | "address"
>;