import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { loginSchema, registerSchema } from './auth.dto';
import { asyncHandler } from '../../common/utils/async-handler.util';
import { AppError } from '../../common/utils/app-error.util';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const dto = registerSchema.parse(req.body);
    const result = await this.authService.register(dto);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const dto = loginSchema.parse(req.body);
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401);
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
      },
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });

  logoutAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    await this.authService.logoutAll(userId);

    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices',
    });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const authRepository = new (await import('./auth.repository')).AuthRepository();
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('User not authenticated', 401);

    const { firstName, lastName, email } = req.body;
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Check email uniqueness if changed
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
      });
      if (existing) throw new AppError('Email already in use', 409);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    await prisma.$disconnect();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('User not authenticated', 401);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError('Current and new password are required', 400);
    }
    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400);
    }

    const { PrismaClient } = await import('@prisma/client');
    const { comparePassword, hashPassword } = await import('../../common/utils/hash.util');
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) throw new AppError('Current password is incorrect', 401);

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    await prisma.$disconnect();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  });
}
