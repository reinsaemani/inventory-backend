import { z } from "zod";
import { UserRole } from "../../../generated/prisma/enums";

// =========================
// AUTH - REGISTER / LOGIN
// =========================
export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// =========================
// PASSWORD FLOW
// =========================

// OTP PASSWORD_SETUP flow
export const setPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6).max(50),
});

// reset password manual
export const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6).max(50),
});

// =========================
// TYPES
// =========================
export type TRegisterSchema = z.infer<typeof registerSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;
export type TSetPasswordSchema = z.infer<typeof setPasswordSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;