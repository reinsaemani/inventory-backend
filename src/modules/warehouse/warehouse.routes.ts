import express from "express";
import * as warehouseController from "./warehouse.controller";

import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { createWarehouseSchema, updateWarehouseSchema } from "../../types/zod";

const router = express.Router();

// ALL LOGIN REQUIRED
router.use(protectAuth);

// GET ALL
router.get("/", warehouseController.getAllWarehousesController);

// GET BY ID
router.get("/:id", warehouseController.getWarehouseByIdController);

// CREATE
router.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(createWarehouseSchema),
  warehouseController.createWarehouseController
);

// UPDATE
router.patch(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(updateWarehouseSchema),
  warehouseController.updateWarehouseController
);

// DELETE
router.delete(
  "/:id",
  requireRole([UserRole.ADMIN]),
  warehouseController.deleteWarehouseController
);

export default router;