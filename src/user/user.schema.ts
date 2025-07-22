import { z } from 'zod';
import { Role } from '../common/enums/role.enum';

export const createUserSchema = z.object({
  companyId: z.uuid(),
  username: z.string().min(3).max(50).trim(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(Role),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).trim().optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(Role).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
