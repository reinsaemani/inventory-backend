import express from "express";
import * as supplierController from "./supplier.controller";

import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { createSupplierSchema, updateSupplierSchema } from "../../types/zod";

const router = express.Router();

// ALL LOGIN REQUIRED
router.use(protectAuth);

// GET ALL
router.get("/", supplierController.getAllSuppliersController);

// GET BY ID
router.get("/:id", supplierController.getSupplierByIdController);

// CREATE
router.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(createSupplierSchema),
  supplierController.createSupplierController
);

// UPDATE
router.patch(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(updateSupplierSchema),
  supplierController.updateSupplierController
);

// DELETE (ADMIN ONLY)
router.delete(
  "/:id",
  requireRole([UserRole.ADMIN]),
  supplierController.deleteSupplierController
);

export default router;