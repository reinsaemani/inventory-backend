import { Category } from "../../../generated/prisma/client";

export type TCategoryID = Category["id"];

export type TCategoryRead = Pick<
  Category,
  "id" | "name" | "description" | "createdAt"
>;

export type TCategoryWrite = Pick<
  Category,
  "name" | "description"
>;