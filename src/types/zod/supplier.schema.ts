import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateSupplierSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type TCreateSupplierSchema = z.infer<typeof createSupplierSchema>;
export type TUpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;