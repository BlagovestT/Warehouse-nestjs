import { z } from 'zod';
import { ProductType } from 'src/common/enums/product-type.enum';

export const createProductSchema = z.object({
  companyId: z.uuid(),
  name: z.string().min(2).max(255).trim(),
  price: z.number().positive(),
  type: z.enum(ProductType),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  price: z.number().positive().optional(),
  type: z.enum(ProductType).optional(),
});
