import { User } from "../../../generated/prisma/client";

// =========================
// USER ID TYPE
// =========================
export type TUserId = User["id"];

// =========================
// SAFE USER RESPONSE
// (ONLY FOR API OUTPUT)
// =========================
export type TUserRead = Pick<
  User,
  "id" | "name" | "email" | "role" | "isActive" | "createdAt"
>;