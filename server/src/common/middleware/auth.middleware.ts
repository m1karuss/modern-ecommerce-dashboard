import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.util';
import { AppError } from '../utils/app-error.util';
import { JwtPayload } from '../../modules/auth/auth.types';

// Extend Express Request type
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyAccessToken(token);

    if (!payload) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Attach user to request
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}
