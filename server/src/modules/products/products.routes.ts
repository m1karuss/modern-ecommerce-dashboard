import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateStatus,
  updateStock,
  getLowStockProducts,
} from './products.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authorize } from '../../common/middleware/roles.middleware';

const productsRouter = Router();

productsRouter.get('/', getProducts);
productsRouter.get('/low-stock', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getLowStockProducts);
productsRouter.get('/slug/:slug', getProductBySlug);
productsRouter.get('/:id', getProductById);

productsRouter.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), createProduct);
productsRouter.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), updateProduct);
productsRouter.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteProduct);

productsRouter.post('/bulk-delete', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), bulkDeleteProducts);
productsRouter.post('/bulk-update-status', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), bulkUpdateStatus);
productsRouter.patch('/:id/stock', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), updateStock);

export { productsRouter };
