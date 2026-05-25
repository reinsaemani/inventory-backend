import { z } from "zod";
import { StockMovementType } from "../../../generated/prisma/enums";

export const createStockMovementSchema = z.object({
  type: z.nativeEnum(StockMovementType),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
  productId: z.string(),
  warehouseId: z.string(),
});

export type TCreateStockMovementSchema = z.infer<typeof createStockMovementSchema>;