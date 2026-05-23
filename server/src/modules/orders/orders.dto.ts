import { z } from 'zod';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ).min(1, 'Order must have at least one item'),
  shippingAddressId: z.string().uuid().optional(),
  billingAddressId: z.string().uuid().optional(),
  notes: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  notes: z.string().optional(),
  shippingAddressId: z.string().uuid().optional(),
  billingAddressId: z.string().uuid().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const updatePaymentStatusSchema = z.object({
  status: z.nativeEnum(PaymentStatus),
  transactionId: z.string().optional(),
});

export const orderQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  userId: z.string().uuid().optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  minTotal: z.string().optional().transform(val => val ? Number(val) : undefined),
  maxTotal: z.string().optional().transform(val => val ? Number(val) : undefined),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusDto = z.infer<typeof updatePaymentStatusSchema>;
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
