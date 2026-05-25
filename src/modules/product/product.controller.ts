import { Request, Response } from "express";
import * as productService from "./product.service";
import { getPagination } from "../../utils/pagination";

import {
  sendSuccessResponse,
  sendNotFoundResponse,
} from "../../utils/responseHandler";
import { createProductSchema, updateProductSchema } from "../../types/zod";

// GET ALL
export const getAllProductsController = async (
  req: Request,
  res: Response
) => {
  const { page, limit, skip } = getPagination(req.query);

  const search = req.query.search as string | undefined;

  const products = await productService.getAllProductsService(
    skip,
    limit,
    search
  );

  const total = await productService.countProductsService(search);

    return sendSuccessResponse(
    res,
    {
      items: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Products fetched successfully",
  );
};

// GET BY ID
export const getProductByIdController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  const product = await productService.getProductByIdService(id);

  if (!product) {
    return sendNotFoundResponse(res, "Product not found");
  }

  return sendSuccessResponse(
    res,
    product,
    "Product fetched successfully"
  );
};

// CREATE
export const createProductController = async (
  req: Request,
  res: Response
) => {
  const data = createProductSchema.parse(req.body);
  const userId = req.user!.id;

  const product = await productService.createProductService(
    data,
    userId
  );

  return sendSuccessResponse(
    res,
    product,
    "Product created successfully"
  );
};

// UPDATE
export const updateProductController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  const data = updateProductSchema.parse(req.body);
  const userId = req.user!.id;

  const product = await productService.updateProductService(
    id,
    data,
    userId
  );

  return sendSuccessResponse(
    res,
    product,
    "Product updated successfully"
  );
};

// DELETE (SOFT DELETE)
export const deleteProductController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  await productService.deleteProductService(id);

  return sendSuccessResponse(
    res,
    null,
    "Product deleted successfully"
  );
};