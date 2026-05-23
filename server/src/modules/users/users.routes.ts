import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserStats,
} from './users.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authorize } from '../../common/middleware/roles.middleware';

const usersRouter = Router();

usersRouter.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getUsers);
usersRouter.get('/stats', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getUserStats);
usersRouter.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getUserById);

usersRouter.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createUser);
usersRouter.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), updateUser);
usersRouter.patch('/:id/role', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateUserRole);
usersRouter.patch('/:id/status', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateUserStatus);
usersRouter.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteUser);

export { usersRouter };
