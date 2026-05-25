import { Request, Response } from "express";
import * as warehouseService from "./warehouse.service";


import { getPagination } from "../../utils/pagination";
import {
  sendSuccessResponse,
  sendNotFoundResponse,
} from "../../utils/responseHandler";
import { createWarehouseSchema, updateWarehouseSchema } from "../../types/zod";

// GET ALL
export const getAllWarehousesController = async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const search = req.query.search as string;

  const warehouses = await warehouseService.getAllWarehousesService(
    skip,
    limit,
    search
  );

  const total = await warehouseService.countWarehousesService(search);

  return sendSuccessResponse(
    res,
    {
      items: warehouses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Warehouses fetched successfully",
  );
};

// GET BY ID
export const getWarehouseByIdController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const warehouse = await warehouseService.getWarehouseByIdService(id);

  if (!warehouse) return sendNotFoundResponse(res, "Warehouse not found");

  return sendSuccessResponse(res, warehouse, "Warehouse fetched successfully");
};

// CREATE
export const createWarehouseController = async (req: Request, res: Response) => {
  const data = createWarehouseSchema.parse(req.body);
  const userId = req.user!.id;

  const warehouse = await warehouseService.createWarehouseService(data, userId);

  return sendSuccessResponse(res, warehouse, "Warehouse created successfully");
};

// UPDATE
export const updateWarehouseController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const data = updateWarehouseSchema.parse(req.body);
  const userId = req.user!.id;

  const warehouse = await warehouseService.updateWarehouseService(
    id,
    data,
    userId
  );

  return sendSuccessResponse(res, warehouse, "Warehouse updated successfully");
};

// DELETE
export const deleteWarehouseController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  await warehouseService.deleteWarehouseService(id);

  return sendSuccessResponse(res, null, "Warehouse deleted successfully");
};