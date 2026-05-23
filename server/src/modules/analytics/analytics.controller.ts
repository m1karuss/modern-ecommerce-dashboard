import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { asyncHandler } from '../../common/utils/async-handler.util';

const prisma = new PrismaClient();
const analyticsService = new AnalyticsService(prisma);

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const period = (req.query.period as string) || '30d';
  const stats = await analyticsService.getDashboardStats(period);

  res.json({
    success: true,
    data: stats,
  });
});

export const getRevenueByCategory = asyncHandler(async (req: Request, res: Response) => {
  const period = (req.query.period as string) || '30d';
  const data = await analyticsService.getRevenueByCategory(period);

  res.json({
    success: true,
    data,
  });
});

export const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const period = (req.query.period as string) || '30d';
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await analyticsService.getTopProducts(period, limit);

  res.json({
    success: true,
    data,
  });
});

export const getSalesOverTime = asyncHandler(async (req: Request, res: Response) => {
  const period = (req.query.period as string) || '30d';
  const data = await analyticsService.getSalesOverTime(period);

  res.json({
    success: true,
    data,
  });
});

export const getOrderStatusDistribution = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getOrderStatusDistribution();

  res.json({
    success: true,
    data,
  });
});

export const getCustomerGrowth = asyncHandler(async (req: Request, res: Response) => {
  const period = (req.query.period as string) || '30d';
  const data = await analyticsService.getCustomerGrowth(period);

  res.json({
    success: true,
    data,
  });
});
