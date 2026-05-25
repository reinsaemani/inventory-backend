import { z } from "zod";

// ================================
// SUMMARY
// ================================
export const dashboardSummarySchema = z.object({
  totalProducts: z.number().int().min(0),
  totalCategories: z.number().int().min(0),
  totalSuppliers: z.number().int().min(0),
  totalWarehouses: z.number().int().min(0),
  totalStock: z.number().int().min(0),

  stockIn: z.number().int().min(0),
  stockOut: z.number().int().min(0),
});

// ================================
// STOCK CHART
// ================================
export const stockMovementChartItemSchema = z.object({
  date: z.string(),
  in: z.number().int().min(0),
  out: z.number().int().min(0),
});

// ================================
// WAREHOUSE STOCK
// ================================
export const warehouseStockItemSchema = z.object({
  warehouseId: z.string().uuid(),
  warehouseName: z.string(),
  totalStock: z.number().int().min(0),
});

// ================================
// LOW STOCK
// ================================
export const lowStockItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(),
  warehouseId: z.string().uuid(),
  warehouseName: z.string(),
  quantity: z.number().int().min(0),
});

// ================================
// RECENT ACTIVITY
// ================================
export const recentStockMovementItemSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: z.number().int().min(0),

  productName: z.string(),
  warehouseName: z.string().nullable(),

  userName: z.string(),
  createdAt: z.string(),
});

// ================================
// MAIN RESPONSE
// ================================
export const dashboardResponseSchema = z.object({
  summary: dashboardSummarySchema,
  stockMovementChart: z.array(stockMovementChartItemSchema),
  warehouseStock: z.array(warehouseStockItemSchema),
  lowStock: z.array(lowStockItemSchema),
  recentActivity: z.array(recentStockMovementItemSchema),
});

// ================================
// TYPES (AUTO FROM ZOD)
// ================================
export type TDashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type TStockMovementChartItem = z.infer<typeof stockMovementChartItemSchema>;
export type TWarehouseStockItem = z.infer<typeof warehouseStockItemSchema>;
export type TLowStockItem = z.infer<typeof lowStockItemSchema>;
export type TRecentStockMovementItem = z.infer<typeof recentStockMovementItemSchema>;
export type TDashboardRead = z.infer<typeof dashboardResponseSchema>;