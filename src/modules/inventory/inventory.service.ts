import { prisma } from "../../utils/prisma";
import { TInventoryWrite, TInventoryUpdate } from "./inventory.type";

// GET ALL
export const getAllInventoriesService = async (
  skip: number,
  take: number
) => {
  return prisma.inventory.findMany({
    skip,
    take,
    include: {
      warehouse: true,
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// COUNT
export const countInventoriesService = async () => {
  return prisma.inventory.count();
};

// GET BY ID
export const getInventoryByIdService = async (id: string) => {
  return prisma.inventory.findUnique({
    where: { id },
    include: {
      warehouse: true,
      product: true,
    },
  });
};

// CREATE
export const createInventoryService = async (data: TInventoryWrite) => {
  return prisma.inventory.create({
    data,
    include: {
      warehouse: true,
      product: true,
    },
  });
};

// UPDATE
export const updateInventoryService = async (
  id: string,
  data: TInventoryUpdate
) => {
  return prisma.inventory.update({
    where: { id },
    data,
    include: {
      warehouse: true,
      product: true,
    },
  });
};

// DELETE
export const deleteInventoryService = async (id: string) => {
  return prisma.inventory.delete({
    where: { id },
  });
};