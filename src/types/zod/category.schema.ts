import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3),
  description: z.string().nullable().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().nullable().optional(),
});

export type TCreateCategorySchema = z.infer<typeof createCategorySchema>;
export type TUpdateCategorySchema = z.infer<typeof updateCategorySchema>;