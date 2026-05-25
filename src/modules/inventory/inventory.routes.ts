import express from "express";
import * as inventoryController from "./inventory.controller";
import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { createInventorySchema, updateInventorySchema } from "../../types/zod";

const router = express.Router();

// LOGIN REQUIRED
router.use(protectAuth);

// GET ALL
router.get("/", inventoryController.getAllInventoriesController);

// GET BY ID
router.get("/:id", inventoryController.getInventoryByIdController);

// CREATE
router.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(createInventorySchema),
  inventoryController.createInventoryController
);

// UPDATE
router.patch(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(updateInventorySchema),
  inventoryController.updateInventoryController
);

// DELETE
router.delete(
  "/:id",
  requireRole([UserRole.ADMIN]),
  inventoryController.deleteInventoryController
);

export default router;