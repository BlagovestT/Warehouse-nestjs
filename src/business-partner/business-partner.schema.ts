import { z } from 'zod';
import { BusinessPartnerType } from './business-partner.entity';

export const createBusinessPartnersSchema = z.object({
  companyId: z.uuid(),
  name: z.string().min(2).max(255).trim(),
  email: z.email(),
  type: z.enum(BusinessPartnerType),
  modifiedBy: z.uuid(),
});

export const updateBusinessPartnersSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  email: z.email().optional(),
  type: z.enum(BusinessPartnerType).optional(),
});
