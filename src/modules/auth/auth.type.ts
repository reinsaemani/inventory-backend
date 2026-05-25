import { User } from "../../../generated/prisma/client";

// =========================
// AUTH USER ID
// =========================
export type TAuthID = User["id"];

// =========================
// AUTH USER CONTEXT (SAFE)
// =========================
export type TAuthUser = Pick<
  User,
  "id" | "name" | "email" | "role" | "isActive" | "isEmailVerified"
>;