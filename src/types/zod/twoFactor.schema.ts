import { z } from "zod";

// =========================
// TWO FACTOR AUTH (2FA)
// =========================

// GET STATUS (opsional, biasanya tidak perlu validation body)
export const getTwoFactorSchema = z.object({});

// TOGGLE 2FA
export const toggleTwoFactorSchema = z.object({
  enabled: z.boolean(),
});

// =========================
// TYPES
// =========================
export type TToggleTwoFactorSchema = z.infer<
  typeof toggleTwoFactorSchema
>;