import express from "express";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import * as otpController from "./otp.controller";
import { resendOtpSchema, verifyOtpSchema } from "../../types/zod/otp.schema";

const router = express.Router();


// =========================
// VERIFY OTP
// =========================
router.post(
  "/verify",
  validateRequest(verifyOtpSchema),
  otpController.verifyOtp
);

// =========================
// RESEND OTP
// =========================
router.post(
  "/resend",
  validateRequest(resendOtpSchema),
  otpController.resendOtp
);

export default router;