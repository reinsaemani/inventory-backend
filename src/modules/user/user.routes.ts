import express from "express";
import * as userController from "./user.controller";
import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

// =========================
// SELF USER
// =========================
router
  .route("/me")
  .get(protectAuth, userController.getMeController)
  .patch(protectAuth, userController.updateMeController);

// =========================
// ADMIN USER MANAGEMENT
// =========================
router.get(
  "/",
  protectAuth,
  requireRole([UserRole.ADMIN]),
  userController.getAllUsersController
);

router.get(
  "/:id",
  protectAuth,
  requireRole([UserRole.ADMIN]),
  userController.getUserByIdController
);

router.patch(
  "/:id",
  protectAuth,
  requireRole([UserRole.ADMIN]),
  userController.updateUserController
);

router.delete(
  "/:id",
  protectAuth,
  requireRole([UserRole.ADMIN]),
  userController.deleteUserController
);

export default router;