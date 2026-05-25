import express from "express";
import * as authController from "./auth.controller";

import { validateRequest } from "../../middleware/validateRequest-middleware";
import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";

import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  setPasswordSchema,
} from "../../types/zod";

import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

// =========================
// ADMIN CREATE USER
// =========================
router.post(
  "/register",
  protectAuth,
  requireRole([UserRole.ADMIN]),
  validateRequest(registerSchema),
  authController.register
);

// =========================
// LOGIN
// =========================
router.post(
  "/login",
  validateRequest(loginSchema),
  authController.login
);

// =========================
// LOGOUT
// =========================
router.post(
  "/logout",
  protectAuth,
  authController.logout
);

// =========================
// REFRESH TOKEN
// =========================
router.post(
  "/refresh",
  authController.refreshToken
);

// =========================
// RESET PASSWORD
// =========================
router.post(
  "/reset-password",
  protectAuth,
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);

// =========================
// ME
// =========================
router.get(
  "/me",
  protectAuth,
  authController.me
);

// =========================
// SET INITIAL PASSWORD (OTP FLOW)
// =========================
router.post(
  "/set-password",
  validateRequest(setPasswordSchema),
  authController.setInitialPassword
);

router.post(
  "/login/verify-otp",
  authController.loginVerifyOtp
);

export default router;