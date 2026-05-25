import { OtpType } from "../../../generated/prisma/enums";

export type TOtpCode = string;

// =========================
// CREATE OTP
// =========================
export type TCreateOtp = {
  email: string;
  type: OtpType;
};

// =========================
// VERIFY OTP
// =========================
export type TVerifyOtp = {
  email: string;
  code: string;
  type: OtpType;
};

// =========================
// RESEND OTP
// =========================
export type TResendOtp = {
  email: string;
  type: OtpType;
};