import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.util';
import { logger } from '../utils/logger.util';
import { Prisma } from '@prisma/client';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log error
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Zod validation error
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
    return;
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Resource already exists',
        field: error.meta?.target,
      });
      return;
    }

    // Record not found
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }
  }

  // Custom AppError
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
  });
}
