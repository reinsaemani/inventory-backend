import express from "express";
import * as stockMovementController from "./stock-movement.controller";
import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { createStockMovementSchema } from "../../types/zod";



const router = express.Router();

// LOGIN REQUIRED
router.use(protectAuth);

// GET ALL
router.get("/", stockMovementController.getAllStockMovementsController);

// GET BY ID
router.get("/:id", stockMovementController.getStockMovementByIdController);

// CREATE
router.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(createStockMovementSchema),
  stockMovementController.createStockMovementController
);

// DELETE
router.delete(
  "/:id",
  requireRole([UserRole.ADMIN]),
  stockMovementController.deleteStockMovementController
);

export default router;