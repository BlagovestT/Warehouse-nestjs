import { z } from 'zod';
import { SupportType } from './warehouse.entity';

export const createWarehouseSchema = z.object({
  companyId: z.uuid(),
  supportType: z.enum(SupportType),
  name: z.string().min(2).max(255).trim(),
  modifiedBy: z.uuid(),
});

export const updateWarehouseSchema = z.object({
  supportType: z.enum(SupportType).optional(),
  name: z.string().min(2).max(255).trim().optional(),
});
