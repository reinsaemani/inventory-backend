import { StockMovementType } from "../../../generated/prisma/client";

// ================================
// SUMMARY
// ================================
export type TDashboardSummary = {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalWarehouses: number;
  totalStock: number;

  stockIn: number;
  stockOut: number;
};

// ================================
// STOCK CHART
// ================================
export type TStockMovementChartItem = {
  date: string;
  in: number;
  out: number;
};

// ================================
// WAREHOUSE STOCK
// ================================
export type TWarehouseStockItem = {
  warehouseId: string;
  warehouseName: string;
  totalStock: number;
};

// ================================
// LOW STOCK
// ================================
export type TLowStockItem = {
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
};

// ================================
// RECENT ACTIVITY
// ================================
export type TRecentActivityItem = {
  id: string;
  type: StockMovementType;
  quantity: number;

  productName: string;
  warehouseName: string | null;
  userName: string;

  createdAt: string;
};

// ================================
// DASHBOARD RESPONSE
// ================================
export type TDashboardRead = {
  summary: TDashboardSummary;
  stockMovementChart: TStockMovementChartItem[];
  warehouseStock: TWarehouseStockItem[];
  lowStock: TLowStockItem[];
  recentActivity: TRecentActivityItem[];
};