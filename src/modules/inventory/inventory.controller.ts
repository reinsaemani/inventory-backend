import { Request, Response } from "express";
import * as inventoryService from "./inventory.service";

import { getPagination } from "../../utils/pagination";

import {
  sendSuccessResponse,
  sendNotFoundResponse,
} from "../../utils/responseHandler";
import { createInventorySchema, updateInventorySchema } from "../../types/zod";

// GET ALL
export const getAllInventoriesController = async (
  req: Request,
  res: Response
) => {
  const { page, limit, skip } = getPagination(req.query);

  const inventories = await inventoryService.getAllInventoriesService(
    skip,
    limit
  );

  const total = await inventoryService.countInventoriesService();

  return sendSuccessResponse(
    res,
    {
      items: inventories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Inventories fetched successfully"
  );
};

// GET BY ID
export const getInventoryByIdController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  const inventory = await inventoryService.getInventoryByIdService(id);

  if (!inventory) {
    return sendNotFoundResponse(res, "Inventory not found");
  }

  return sendSuccessResponse(
    res,
    inventory,
    "Inventory fetched successfully"
  );
};

// CREATE
export const createInventoryController = async (
  req: Request,
  res: Response
) => {
  const data = createInventorySchema.parse(req.body);

  const inventory = await inventoryService.createInventoryService(data);

  return sendSuccessResponse(
    res,
    inventory,
    "Inventory created successfully"
  );
};

// UPDATE
export const updateInventoryController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  const data = updateInventorySchema.parse(req.body);

  const inventory = await inventoryService.updateInventoryService(
    id,
    data
  );

  return sendSuccessResponse(
    res,
    inventory,
    "Inventory updated successfully"
  );
};

// DELETE
export const deleteInventoryController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  await inventoryService.deleteInventoryService(id);

  return sendSuccessResponse(
    res,
    null,
    "Inventory deleted successfully"
  );
};