import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../common/middleware/auth.middleware';

const authRouter = Router();
const authController = new AuthController();

// Public routes
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refreshToken);

// Protected routes
authRouter.post('/logout', authenticate, authController.logout);
authRouter.post('/logout-all', authenticate, authController.logoutAll);
authRouter.get('/me', authenticate, authController.me);
authRouter.patch('/me/profile', authenticate, authController.updateProfile);
authRouter.patch('/me/password', authenticate, authController.changePassword);

export { authRouter };
