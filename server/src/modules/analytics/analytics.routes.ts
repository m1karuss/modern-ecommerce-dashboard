import { Router } from 'express';
import {
  getDashboardStats,
  getRevenueByCategory,
  getTopProducts,
  getSalesOverTime,
  getOrderStatusDistribution,
  getCustomerGrowth,
} from './analytics.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authorize } from '../../common/middleware/roles.middleware';

const analyticsRouter = Router();

analyticsRouter.get('/dashboard', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getDashboardStats);
analyticsRouter.get('/revenue-by-category', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getRevenueByCategory);
analyticsRouter.get('/top-products', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getTopProducts);
analyticsRouter.get('/sales-over-time', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getSalesOverTime);
analyticsRouter.get('/order-status', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getOrderStatusDistribution);
analyticsRouter.get('/customer-growth', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getCustomerGrowth);

export { analyticsRouter };
