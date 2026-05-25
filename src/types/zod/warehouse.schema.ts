import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z.string().min(3),
  location: z.string().optional(),
});

export const updateWarehouseSchema = z.object({
  name: z.string().min(3).optional(),
  location: z.string().optional(),
});

export type TCreateWarehouseSchema = z.infer<typeof createWarehouseSchema>;
export type TUpdateWarehouseSchema = z.infer<typeof updateWarehouseSchema>;