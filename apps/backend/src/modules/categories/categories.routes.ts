import { Router } from 'express';
import { UserRole } from '@prisma/client';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
} from './categories.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authorize } from '../../common/middleware/roles.middleware';

const categoriesRouter = Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.get('/tree', getCategoryTree);
categoriesRouter.get('/slug/:slug', getCategoryBySlug);
categoriesRouter.get('/:id', getCategoryById);

categoriesRouter.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), createCategory);
categoriesRouter.put('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), updateCategory);
categoriesRouter.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteCategory);

export { categoriesRouter };
