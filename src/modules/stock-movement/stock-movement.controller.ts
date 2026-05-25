import { Request, Response } from "express";
import * as stockMovementService from "./stock-movement.service";
import { getPagination } from "../../utils/pagination";

import {
  sendSuccessResponse,
  sendNotFoundResponse,
} from "../../utils/responseHandler";
import { createStockMovementSchema } from "../../types/zod";

// GET ALL
export const getAllStockMovementsController = async (
  req: Request,
  res: Response
) => {
  const { page, limit, skip } = getPagination(req.query);

  const stockMovements =
    await stockMovementService.getAllStockMovementsService(skip, limit);

  const total =
    await stockMovementService.countStockMovementsService();

  return sendSuccessResponse(
    res,
    {
      items: stockMovements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Stock movements fetched successfully",
  );
};

// GET BY ID
export const getStockMovementByIdController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  const stockMovement =
    await stockMovementService.getStockMovementByIdService(id);

  if (!stockMovement) {
    return sendNotFoundResponse(res, "Stock movement not found");
  }

  return sendSuccessResponse(
    res,
    stockMovement,
    "Stock movement fetched successfully"
  );
};

// CREATE
export const createStockMovementController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createStockMovementSchema.parse(req.body);

    const stockMovement =
      await stockMovementService.createStockMovementService({
        ...data,
        userId: req.user!.id,
      });

    return sendSuccessResponse(
      res,
      stockMovement,
      "Stock movement created successfully"
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: {
        message: error.message ?? "Failed to create stock movement",
      },
    });
  }
};

// DELETE
export const deleteStockMovementController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  await stockMovementService.deleteStockMovementService(id);

  return sendSuccessResponse(
    res,
    null,
    "Stock movement deleted successfully"
  );
};