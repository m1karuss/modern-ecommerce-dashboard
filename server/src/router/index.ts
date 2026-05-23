import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { usersRouter } from '../modules/users/users.routes';
import { productsRouter } from '../modules/products/products.routes';
import { ordersRouter } from '../modules/orders/orders.routes';
import { analyticsRouter } from '../modules/analytics/analytics.routes';
import { categoriesRouter } from '../modules/categories/categories.routes';
import { uploadRouter } from '../modules/upload/upload.routes';

const apiRouter = Router();

// Mount routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/upload', uploadRouter);

export { apiRouter };
