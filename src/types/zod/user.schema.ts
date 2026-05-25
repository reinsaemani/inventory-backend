import { z } from "zod";
import { UserRole } from "../../../generated/prisma/enums";

// =========================
// CREATE USER (ADMIN)
// =========================
export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.nativeEnum(UserRole).optional(),
});

// =========================
// UPDATE ME (SELF)
// =========================
export const updateMeSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

// =========================
// UPDATE USER (ADMIN)
// =========================
export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

// =========================
// USER ID PARAM
// =========================
export const userIdSchema = z.object({
  id: z.string().uuid(),
});

// =========================
// TYPES (INFER FROM SCHEMA)
// =========================
export type TCreateUserSchema = z.infer<typeof createUserSchema>;
export type TUpdateMeSchema = z.infer<typeof updateMeSchema>;
export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;
export type TUserIdSchema = z.infer<typeof userIdSchema>;