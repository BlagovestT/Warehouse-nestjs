import { z } from 'zod';

export const createOrderItemSchema = z.object({
  orderId: z.uuid(),
  productId: z.uuid(),
  quantity: z.number().int().positive(),
});

export const updateOrderItemSchema = z.object({
  productId: z.uuid().optional(),
  quantity: z.number().int().positive().optional(),
});
