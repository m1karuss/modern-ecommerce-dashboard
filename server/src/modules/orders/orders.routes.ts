import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
} from './orders.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authorize } from '../../common/middleware/roles.middleware';

const ordersRouter = Router();

ordersRouter.get('/', authenticate, getOrders);
ordersRouter.get('/stats', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getOrderStats);
ordersRouter.get('/:id', authenticate, getOrderById);

ordersRouter.post('/', authenticate, createOrder);
ordersRouter.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), updateOrder);
ordersRouter.patch('/:id/status', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), updateOrderStatus);
ordersRouter.patch('/:id/payment', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), updatePaymentStatus);
ordersRouter.post('/:id/cancel', authenticate, cancelOrder);
ordersRouter.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteOrder);

export { ordersRouter };
