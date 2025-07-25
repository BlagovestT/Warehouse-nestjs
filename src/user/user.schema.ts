import { z } from 'zod';
import { Role } from '../common/enums/role.enum';

export const registerOwnerSchema = z.object({
  companyName: z.string().min(1).max(255).trim(),
  username: z.string().min(3).max(50).trim(),
  email: z.email(),
  password: z.string().min(6),
});

export const registerUserSchema = z.object({
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
