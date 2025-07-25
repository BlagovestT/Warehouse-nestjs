import { z } from 'zod';
import { SupportType } from 'src/common/enums/warehouse-type.enum';

export const createWarehouseSchema = z.object({
  companyId: z.uuid(),
  supportType: z.enum(SupportType),
  name: z.string().min(2).max(255).trim(),
});

export const updateWarehouseSchema = z.object({
  supportType: z.enum(SupportType).optional(),
  name: z.string().min(2).max(255).trim().optional(),
});
