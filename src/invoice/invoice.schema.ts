import { z } from 'zod';

export const createInvoiceSchema = z.object({
  companyId: z.uuid(),
  orderId: z.uuid(),
  invoiceNumber: z.string().min(1).max(255).trim(),
  date: z.date(),
  modifiedBy: z.uuid(),
});

export const updateInvoiceSchema = z.object({
  orderId: z.uuid().optional(),
  invoiceNumber: z.string().min(1).max(255).trim().optional(),
  date: z.date().optional(),
});
