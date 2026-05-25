import { z } from "zod";

export const createInventorySchema = z.object({
  warehouseId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(0),
});

export const updateInventorySchema = z.object({
  quantity: z.number().int().min(0),
});

export type TCreateInventorySchema = z.infer<typeof createInventorySchema>;
export type TUpdateInventorySchema = z.infer<typeof updateInventorySchema>;