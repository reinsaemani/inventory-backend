import express from "express";
import { getDashboardController } from "./dashboard.controller";
import { protectAuth } from "../../middleware/auth-middleware";

const router = express.Router();

// ================================
// DASHBOARD ROUTES
// ================================
router.get(
  "/",
  protectAuth,
  getDashboardController
);

export default router;