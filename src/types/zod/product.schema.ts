import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string(),
  supplierId: z.string().optional(),
});

export const updateProductSchema = z.object({
  sku: z.string().min(3).optional(),
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
});

export type TCreateProductSchema = z.infer<typeof createProductSchema>;
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>;