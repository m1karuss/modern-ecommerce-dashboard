import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CategoryService } from './categories.service';
import { createCategorySchema, updateCategorySchema } from './categories.dto';
import { asyncHandler } from '../../common/utils/async-handler.util';

const prisma = new PrismaClient();
const categoryService = new CategoryService(prisma);

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories();

  res.json({
    success: true,
    data: categories,
  });
});

export const getCategoryTree = asyncHandler(async (_req: Request, res: Response) => {
  const tree = await categoryService.getCategoryTree();

  res.json({
    success: true,
    data: tree,
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryById(id);

  res.json({
    success: true,
    data: category,
  });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const category = await categoryService.getCategoryBySlug(slug);

  res.json({
    success: true,
    data: category,
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(data);

  res.status(201).json({
    success: true,
    data: category,
    message: 'Category created successfully',
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateCategorySchema.parse(req.body);
  const category = await categoryService.updateCategory(id, data);

  res.json({
    success: true,
    data: category,
    message: 'Category updated successfully',
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id);

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});
