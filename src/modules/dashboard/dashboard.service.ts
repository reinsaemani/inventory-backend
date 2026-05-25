import { StockMovementType } from "../../../generated/prisma/enums";
import { prisma } from "../../utils/prisma";
import {
  TDashboardRead,
  TRecentActivityItem,
} from "./dashboard.type";

// ================================
// SUMMARY
// ================================
export const getDashboardSummaryService = async () => {
  const [
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalWarehouses,
    inventoryAgg,
    stockInAgg,
    stockOutAgg,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.supplier.count(),
    prisma.warehouse.count(),

    prisma.inventory.aggregate({
      _sum: { quantity: true },
    }),

    prisma.stockMovement.aggregate({
      where: { type: "IN" },
      _sum: { quantity: true },
    }),

    prisma.stockMovement.aggregate({
      where: { type: "OUT" },
      _sum: { quantity: true },
    }),
  ]);

  return {
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalWarehouses,
    totalStock: inventoryAgg._sum.quantity ?? 0,
    stockIn: stockInAgg._sum.quantity ?? 0,
    stockOut: stockOutAgg._sum.quantity ?? 0,
  };
};

// ================================
// STOCK CHART
// ================================
export const getStockMovementChartService = async () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const movements = await prisma.stockMovement.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      type: true,
      quantity: true,
      createdAt: true,
    },
  });

  const map: Record<string, { date: string; in: number; out: number }> = {};

  for (const m of movements) {
    const date = m.createdAt.toISOString().split("T")[0];

    if (!map[date]) {
      map[date] = { date, in: 0, out: 0 };
    }

    if (m.type === "IN") map[date].in += m.quantity;
    if (m.type === "OUT") map[date].out += m.quantity;
  }

  return Object.values(map).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// ================================
// WAREHOUSE STOCK
// ================================
export const getWarehouseStockService = async () => {
  const inventories = await prisma.inventory.findMany({
    select: {
      warehouseId: true,
      quantity: true,
      warehouse: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
  });

  const map: Record<string, {
    warehouseId: string;
    warehouseName: string;
    totalStock: number;
    Date: Date;
  }> = {};

  for (const inv of inventories) {
    const id = inv.warehouseId;

    if (!map[id]) {
      map[id] = {
        warehouseId: id,
        warehouseName: inv.warehouse.name,
        totalStock: 0,
        Date: inv.warehouse.createdAt,
      };
    }

    map[id].totalStock += inv.quantity;
  }

  return Object.values(map);
};

// ================================
// LOW STOCK
// ================================
export const getLowStockService = async () => {
  const threshold = 10;

  const inventories = await prisma.inventory.findMany({
    where: {
      quantity: { lte: threshold },
    },
    select: {
      productId: true,
      quantity: true,
      warehouseId: true,

      product: {
        select: { name: true },
      },

      warehouse: {
        select: { name: true },
      },
    },
  });

  return inventories.map((inv) => ({
    productId: inv.productId,
    productName: inv.product.name,
    warehouseId: inv.warehouseId,
    warehouseName: inv.warehouse.name,
    quantity: inv.quantity,
  }));
};

// ================================
// RECENT ACTIVITY (CLEAN DTO FIX)
// ================================
export const getRecentActivityService = async (): Promise<TRecentActivityItem[]> => {
  const activities = await prisma.stockMovement.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },

    select: {
      id: true,
      type: true,
      quantity: true,
      createdAt: true,

      product: {
        select: {
          name: true,
        },
      },

      warehouse: {
        select: {
          name: true,
        },
      },

      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return activities.map((a): TRecentActivityItem => ({
    id: a.id,
    type: a.type as StockMovementType,
    quantity: a.quantity,

    productName: a.product.name,
    warehouseName: a.warehouse?.name ?? null,
    userName: a.user.name,

    createdAt: a.createdAt.toISOString(),
  }));
};

// ================================
// DASHBOARD
// ================================
export const getDashboardService = async (): Promise<TDashboardRead> => {
  const [
    summary,
    stockMovementChart,
    warehouseStock,
    lowStock,
    recentActivity,
  ] = await Promise.all([
    getDashboardSummaryService(),
    getStockMovementChartService(),
    getWarehouseStockService(),
    getLowStockService(),
    getRecentActivityService(),
  ]);

  return {
    summary,
    stockMovementChart,
    warehouseStock,
    lowStock,
    recentActivity,
  };
};