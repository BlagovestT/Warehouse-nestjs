import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255).trim(),
  modifiedBy: z.string().uuid('Modified by must be a valid user ID'),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255).trim(),
});
