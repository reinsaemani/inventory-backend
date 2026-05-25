import { prisma } from "../../utils/prisma";
import { auditInclude } from "../../utils/auditInclude";

// GET ALL
export const getAllSuppliersService = async (
  skip: number,
  take: number,
  search?: string
) => {
  return prisma.supplier.findMany({
    where: {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    },
    skip,
    take,
    include: {
      _count: {
        select: {
          products: { where: { deletedAt: null } },
        },
      },
      ...auditInclude,
    },
    orderBy: { createdAt: "desc" },
  });
};

// COUNT
export const countSuppliersService = async (search?: string) => {
  return prisma.supplier.count({
    where: {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    },
  });
};

// GET BY ID
export const getSupplierByIdService = async (id: string) => {
  return prisma.supplier.findFirst({
    where: { id, deletedAt: null },
    include: {
      _count: {
        select: {
          products: { where: { deletedAt: null } },
        },
      },
      ...auditInclude,
    },
  });
};

// CREATE
export const createSupplierService = async (data: any, userId: string) => {
  return prisma.supplier.create({
    data: { ...data, createdById: userId },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
    },
  });
};

// UPDATE
export const updateSupplierService = async (
  id: string,
  data: any,
  userId: string
) => {
  return prisma.supplier.update({
    where: { id },
    data: { ...data, updatedById: userId },
    include: {
      updatedBy: { select: { id: true, name: true, role: true } },
    },
  });
};

// SOFT DELETE
export const deleteSupplierService = async (id: string) => {
  return prisma.supplier.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};