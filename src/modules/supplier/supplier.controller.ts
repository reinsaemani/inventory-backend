import { Request, Response } from "express";
import * as supplierService from "./supplier.service";

import { getPagination } from "../../utils/pagination";
import {
  sendSuccessResponse,
  sendNotFoundResponse,
} from "../../utils/responseHandler";
import { createSupplierSchema, updateSupplierSchema } from "../../types/zod";

// GET ALL
export const getAllSuppliersController = async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const search = req.query.search as string;

  const suppliers = await supplierService.getAllSuppliersService(
    skip,
    limit,
    search
  );

  const total = await supplierService.countSuppliersService(search);

  return sendSuccessResponse(
    res,
    {
      items: suppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Suppliers fetched successfully",
  );
};

// GET BY ID
export const getSupplierByIdController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const supplier = await supplierService.getSupplierByIdService(id);

  if (!supplier) return sendNotFoundResponse(res, "Supplier not found");

  return sendSuccessResponse(res, supplier, "Supplier fetched successfully");
};

// CREATE
export const createSupplierController = async (req: Request, res: Response) => {
  const data = createSupplierSchema.parse(req.body);
  const userId = req.user!.id;

  const supplier = await supplierService.createSupplierService(data, userId);

  return sendSuccessResponse(res, supplier, "Supplier created successfully");
};

// UPDATE
export const updateSupplierController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const data = updateSupplierSchema.parse(req.body);
  const userId = req.user!.id;

  const supplier = await supplierService.updateSupplierService(
    id,
    data,
    userId
  );

  return sendSuccessResponse(res, supplier, "Supplier updated successfully");
};

// DELETE
export const deleteSupplierController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  await supplierService.deleteSupplierService(id);

  return sendSuccessResponse(res, null, "Supplier deleted successfully");
};