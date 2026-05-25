import { z } from "zod";
import { OtpType } from "../../../generated/prisma/enums";

// =========================
// OTP
// =========================
export const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6).regex(/^\d+$/),
  type: z.nativeEnum(OtpType),
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
  type: z.nativeEnum(OtpType),
});

// =========================
// TYPES
// =========================
export type TVerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
export type TResendOtpSchema = z.infer<typeof resendOtpSchema>;