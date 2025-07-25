import { z } from 'zod';
import { OrderType } from '../common/enums/order-type.enum';

export const createOrderSchema = z.object({
  companyId: z.uuid(),
  warehouseId: z.uuid(),
  businessPartnerId: z.uuid(),
  orderNumber: z.string().min(1).max(255).trim(),
  type: z.enum(OrderType),
});

export const updateOrderSchema = z.object({
  warehouseId: z.uuid().optional(),
  businessPartnerId: z.uuid().optional(),
  orderNumber: z.string().min(1).max(255).trim().optional(),
  type: z.enum(OrderType).optional(),
});
