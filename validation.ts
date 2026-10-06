import { OrderStatus } from "@prisma/client";
import { z } from "zod";

const orderStatuses = Object.values(OrderStatus) as [OrderStatus, ...OrderStatus[]];
export const emailSchema = z.string().trim().email().max(254).transform((v) => v.toLowerCase());
export const passwordSchema = z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/).regex(/[^A-Za-z0-9]/);
export const registerSchema = z.object({ email: emailSchema, password: passwordSchema, name: z.string().trim().min(1).max(120).optional() });
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1) });
export const createOrderSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(50) })).min(1).max(50),
});
export const transitionSchema = z.object({ to: z.enum(orderStatuses), expectedVersion: z.number().int().positive() });
export const refundSchema = z.object({ amountMinor: z.number().int().positive(), expectedVersion: z.number().int().positive(), idempotencyKey: z.string().min(8).max(128) });
