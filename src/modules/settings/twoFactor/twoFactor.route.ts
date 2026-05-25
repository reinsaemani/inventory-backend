import express from "express";


import { protectAuth } from "../../../middleware/auth-middleware";
import { validateRequest } from "../../../middleware/validateRequest-middleware";

import { toggleTwoFactorSchema } from "../../../types/zod/twoFactor.schema";
import { twoFactorgetStatusController, twoFactortoggleController } from "./ twoFactor.controller";

const router = express.Router();

// =========================
// GET STATUS
// =========================
router.get(
  "/",
  protectAuth,
  twoFactorgetStatusController
);

// =========================
// TOGGLE 2FA
// =========================
router.patch(
  "/",
  protectAuth,
  validateRequest(toggleTwoFactorSchema),
  twoFactortoggleController
);

export default router;