import express from "express";
import * as categoryController from "./category.controller";
import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { createCategorySchema, updateCategorySchema } from "../../types/zod";

const router = express.Router();

router.get("/", protectAuth, categoryController.getAllCategoriesController);
router.get("/:id", protectAuth, categoryController.getCategoryByIdController);

// ADMIN + STAFF
router.post(
  "/",
  protectAuth,
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(createCategorySchema),
  categoryController.createCategoryController
);

router.patch(
  "/:id",
  protectAuth,
  requireRole([UserRole.ADMIN, UserRole.STAFF]),
  validateRequest(updateCategorySchema),
  categoryController.updateCategoryController
);

router.delete(
  "/:id",
  protectAuth,
  requireRole([UserRole.ADMIN]),
  categoryController.deleteCategoryController
);

export default router;