import { prisma } from "../../utils/prisma";
import { auditInclude } from "../../utils/auditInclude";

// GET ALL
export const getAllWarehousesService = async (
  skip: number,
  take: number,
  search?: string
) => {
  return prisma.warehouse.findMany({
    where: {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    },
    skip,
    take,
    include: {
      inventories: true,
      ...auditInclude,
    },
    orderBy: { createdAt: "desc" },
  });
};

// COUNT
export const countWarehousesService = async (search?: string) => {
  return prisma.warehouse.count({
    where: {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    },
  });
};

// GET BY ID
export const getWarehouseByIdService = async (id: string) => {
  return prisma.warehouse.findFirst({
    where: { id, deletedAt: null },
    include: {
      inventories: {
        include: {
          product: true,
          ...auditInclude,
        },
      },
    },
  });
};

// CREATE
export const createWarehouseService = async (
  data: { name: string; location?: string },
  userId: string
) => {
  return prisma.warehouse.create({
    data: {
      ...data,
      createdById: userId,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, role: true },
      },
    },
  });
};

// UPDATE
export const updateWarehouseService = async (
  id: string,
  data: { name?: string; location?: string },
  userId: string
) => {
  return prisma.warehouse.update({
    where: { id },
    data: {
      ...data,
      updatedById: userId,
    },
    include: {
      updatedBy: {
        select: { id: true, name: true, role: true },
      },
    },
  });
};

// SOFT DELETE
export const deleteWarehouseService = async (id: string) => {
  return prisma.warehouse.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};