import { z } from 'zod';
import { ProductType } from './product.entity';

export const createProductSchema = z.object({
  companyId: z.uuid(),
  name: z.string().min(2).max(255).trim(),
  price: z.number().positive(),
  type: z.enum(ProductType),
  modifiedBy: z.uuid(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  price: z.number().positive().optional(),
  type: z.enum(ProductType).optional(),
});
