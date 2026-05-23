import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderService } from './orders.service';
import {
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  orderQuerySchema,
} from './orders.dto';
import { asyncHandler } from '../../common/utils/async-handler.util';

const prisma = new PrismaClient();
const orderService = new OrderService(prisma);

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const query = orderQuerySchema.parse(req.query);
  const result = await orderService.getOrders(query);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);

  res.json({
    success: true,
    data: order,
  });
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = createOrderSchema.parse(req.body);
  const order = await orderService.createOrder(data);

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order created successfully',
  });
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateOrderSchema.parse(req.body);
  const order = await orderService.updateOrder(id, data);

  res.json({
    success: true,
    data: order,
    message: 'Order updated successfully',
  });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateOrderStatusSchema.parse(req.body);
  const order = await orderService.updateOrderStatus(id, data);

  res.json({
    success: true,
    data: order,
    message: 'Order status updated successfully',
  });
});

export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updatePaymentStatusSchema.parse(req.body);
  await orderService.updatePaymentStatus(id, data);

  res.json({
    success: true,
    message: 'Payment status updated successfully',
  });
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderService.cancelOrder(id);

  res.json({
    success: true,
    data: order,
    message: 'Order cancelled successfully',
  });
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await orderService.deleteOrder(id);

  res.json({
    success: true,
    message: 'Order deleted successfully',
  });
});

export const getOrderStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;
  const stats = await orderService.getOrderStats(userId);

  res.json({
    success: true,
    data: stats,
  });
});
