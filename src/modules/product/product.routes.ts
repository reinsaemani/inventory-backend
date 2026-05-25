import express from "express";

import * as productController from "./product.controller";

import { protectAuth } from "../../middleware/auth-middleware";

import { requireRole } from "../../middleware/role-middleware";


import { validateRequest } from "../../middleware/validateRequest-middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { createProductSchema, updateProductSchema } from "../../types/zod";


const router = express.Router();

// PUBLIC / AUTH USER
router.get(
  "/",
  protectAuth,
  productController.getAllProductsController
);

router.get(
  "/:id",
  protectAuth,
  productController.getProductByIdController
);

// ADMIN + STAFF
router.post(
  "/",
  protectAuth,
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(createProductSchema),
  productController.createProductController
);

router.patch(
  "/:id",
  protectAuth,
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(updateProductSchema),
  productController.updateProductController
);

// ADMIN ONLY
router.delete(
  "/:id",
  protectAuth,
  requireRole([UserRole.ADMIN]),
  productController.deleteProductController
);

export default router;