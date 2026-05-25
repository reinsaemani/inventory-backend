import { auditInclude } from "../../utils/auditInclude";
import { prisma } from "../../utils/prisma";
import { TProductWrite, TProductUpdate } from "./product.type";

// GET ALL
export const getAllProductsService = async (
  skip: number,
  take: number,
  search?: string
) => {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    skip,
    take,
    include: {
      category: true,
      supplier: true,
      ...auditInclude,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// COUNT
export const countProductsService = async (search?: string) => {
  return prisma.product.count({
    where: {
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
  });
};

// GET BY ID
export const getProductByIdService = async (id: string) => {
  return prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: true,
      supplier: true,
      ...auditInclude,
    },
  });
};

// CREATE
export const createProductService = async (
  data: TProductWrite,
  userId: string
) => {
  return prisma.product.create({
    data: {
      ...data,
      description: data.description ?? null,
      supplierId: data.supplierId ?? null,
      createdById: userId,
    },
    include: {
      category: true,
      supplier: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

// UPDATE
export const updateProductService = async (
  id: string,
  data: TProductUpdate,
  userId: string
) => {
  return prisma.product.update({
    where: { id },
    data: {
      ...(data.sku !== undefined ? { sku: data.sku } : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.supplierId !== undefined
        ? { supplierId: data.supplierId ?? null }
        : {}),
      ...(data.description !== undefined
        ? { description: data.description ?? null }
        : {}),
      updatedById: userId,
    },
    include: {
      category: true,
      supplier: true,
      updatedBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

// SOFT DELETE
export const deleteProductService = async (id: string) => {
  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};