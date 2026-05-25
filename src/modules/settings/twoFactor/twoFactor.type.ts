import { User } from "../../../../generated/prisma/client";

// =========================
// TWO FACTOR TYPES
// =========================

export type TTwoFactorStatus = {
  enabled: boolean;
};

// =========================
// INPUT TYPE
// =========================
export type TToggleTwoFactorInput = {
  userId: User["id"];
  enabled: boolean;
};