import { z } from 'zod';

export const createInvoiceSchema = z.object({
  companyId: z.uuid(),
  orderId: z.uuid(),
  invoiceNumber: z.string().min(1).max(255).trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const updateInvoiceSchema = z.object({
  orderId: z.uuid().optional(),
  invoiceNumber: z.string().min(1).max(255).trim().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
});
