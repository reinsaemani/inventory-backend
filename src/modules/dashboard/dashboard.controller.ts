import { Request, Response } from "express";
import * as dashboardService from "./dashboard.service";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/responseHandler";

// ================================
// GET DASHBOARD
// ================================
export const getDashboardController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await dashboardService.getDashboardService();

    return sendSuccessResponse(
      res,
      data,
      "Dashboard fetched successfully"
    );
  } catch (error) {
    console.error("Dashboard Error:", error);

    return sendErrorResponse(
      res,
      "Failed to fetch dashboard"
    );
  }
};