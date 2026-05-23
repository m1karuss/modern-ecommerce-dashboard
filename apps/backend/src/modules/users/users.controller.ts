import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserService } from './users.service';
import {
  createUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userQuerySchema,
} from './users.dto';
import { asyncHandler } from '../../common/utils/async-handler.util';

const prisma = new PrismaClient();
const userService = new UserService(prisma);

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = userQuerySchema.parse(req.query);
  const result = await userService.getUsers(query);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  res.json({
    success: true,
    data: user,
  });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = createUserSchema.parse(req.body);
  const user = await userService.createUser(data);

  res.status(201).json({
    success: true,
    data: user,
    message: 'User created successfully',
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateUserSchema.parse(req.body);
  const user = await userService.updateUser(id, data);

  res.json({
    success: true,
    data: user,
    message: 'User updated successfully',
  });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateUserRoleSchema.parse(req.body);
  const user = await userService.updateUserRole(id, data);

  res.json({
    success: true,
    data: user,
    message: 'User role updated successfully',
  });
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateUserStatusSchema.parse(req.body);
  const user = await userService.updateUserStatus(id, data);

  res.json({
    success: true,
    data: user,
    message: 'User status updated successfully',
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const getUserStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await userService.getUserStats();

  res.json({
    success: true,
    data: stats,
  });
});
