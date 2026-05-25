import { prisma } from "../../utils/prisma";
import { TStockMovementWrite } from "./stock-movement.type";

// GET ALL
export const getAllStockMovementsService = async (
  skip: number,
  take: number
) => {
  return prisma.stockMovement.findMany({
    skip,
    take,
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          description: true,
          price: true,
          categoryId: true,
          supplierId: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      warehouse:{
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// COUNT
export const countStockMovementsService = async () => {
  return prisma.stockMovement.count();
};

// GET BY ID
export const getStockMovementByIdService = async (id: string) => {
  return prisma.stockMovement.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          description: true,
          price: true,
          categoryId: true,
          supplierId: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      warehouse:{
        select: {
          id: true,
          name: true,
        }
      }
    },
  });
};

// CREATE
export const createStockMovementService = async (
  data: TStockMovementWrite & { userId: string }
) => {
  return prisma.$transaction(async (tx) => {
    // 1. GET INVENTORY
    const inventory = await tx.inventory.findUnique({
      where: {
        warehouseId_productId: {
          warehouseId: data.warehouseId,
          productId: data.productId,
        },
      },
    });

    // 2. INIT CURRENT QTY
    const currentQty = inventory?.quantity ?? 0;

    // ⚠️ SAFETY RULE: OUT tidak boleh kalau inventory belum ada
    if (data.type === "OUT" && !inventory) {
      throw new Error("Inventory not found in this warehouse");
    }

    // 3. CALCULATE NEW STOCK
    let newQty = currentQty;

    if (data.type === "IN") {
      newQty += data.quantity;
    }

    if (data.type === "OUT") {
      if (currentQty < data.quantity) {
        throw new Error("Insufficient stock");
      }
      newQty -= data.quantity;
    }

    if (data.type === "ADJUSTMENT") {
      newQty = data.quantity;
    }

    // 4. UPSERT INVENTORY (safe for create/update)
    await tx.inventory.upsert({
      where: {
        warehouseId_productId: {
          warehouseId: data.warehouseId,
          productId: data.productId,
        },
      },
      create: {
        warehouseId: data.warehouseId,
        productId: data.productId,
        quantity: newQty,
      },
      update: {
        quantity: newQty,
      },
    });

    // 5. CREATE MOVEMENT LOG
    const movement = await tx.stockMovement.create({
      data: {
        type: data.type,
        quantity: data.quantity,
        note: data.note,
        productId: data.productId,
        userId: data.userId,
        warehouseId: data.warehouseId,
      },
      include: {
        product: true,
        user: true,
        warehouse: true,
      },
    });

    return movement;
  });
};

// DELETE
export const deleteStockMovementService = async (id: string) => {
  return prisma.stockMovement.delete({
    where: { id },
  });
};