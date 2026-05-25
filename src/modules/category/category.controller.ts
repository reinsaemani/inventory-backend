import { Request, Response } from "express";
import * as categoryService from "./category.service";


import { getPagination } from "../../utils/pagination";

import {
  sendSuccessResponse,
  sendNotFoundResponse,
} from "../../utils/responseHandler";
import { createCategorySchema, updateCategorySchema } from "../../types/zod";

// GET ALL
export const getAllCategoriesController = async (
  req: Request,
  res: Response
) => {
  const { page, limit, skip } = getPagination(req.query);
  const search = req.query.search as string | undefined;

  const categories = await categoryService.getAllCategoriesService(
    skip,
    limit,
    search
  );

  const total = await categoryService.countCategoriesService(search);

  return sendSuccessResponse(
    res,
    {
      items: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Categories fetched successfully"
  );
};

// GET BY ID
export const getCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  const category = await categoryService.getCategoryByIdService(id);

  if (!category) {
    return sendNotFoundResponse(res, "Category not found");
  }

  return sendSuccessResponse(
    res,
    category,
    "Category fetched successfully"
  );
};

// CREATE
export const createCategoryController = async (
  req: Request,
  res: Response
) => {
  const raw = createCategorySchema.parse(req.body);
  const userId = req.user!.id;

  const data = {
    name: raw.name,
    description: raw.description ?? null,
  };

  const category = await categoryService.createCategoryService(
    data,
    userId
  );

  return sendSuccessResponse(
    res,
    category,
    "Category created successfully"
  );
};

export const updateCategoryController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);
  const raw = updateCategorySchema.parse(req.body);
  const userId = req.user!.id;

  const data = {
    name: raw.name,
    description: raw.description ?? null,
  };

  const category = await categoryService.updateCategoryService(
    id,
    data,
    userId
  );

  return sendSuccessResponse(
    res,
    category,
    "Category updated successfully"
  );
};

// DELETE
export const deleteCategoryController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  await categoryService.deleteCategoryService(id);

  return sendSuccessResponse(
    res,
    null,
    "Category deleted successfully"
  );
};