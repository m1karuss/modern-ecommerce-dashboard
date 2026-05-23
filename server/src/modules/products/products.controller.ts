import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductService } from './products.service';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from './products.dto';
import { asyncHandler } from '../../common/utils/async-handler.util';

const prisma = new PrismaClient();
const productService = new ProductService(prisma);

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);
  const result = await productService.getProducts(query);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);

  res.json({
    success: true,
    data: product,
  });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await productService.getProductBySlug(slug);

  res.json({
    success: true,
    data: product,
  });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);
  const product = await productService.createProduct(data);

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully',
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateProductSchema.parse(req.body);
  const product = await productService.updateProduct(id, data);

  res.json({
    success: true,
    data: product,
    message: 'Product updated successfully',
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await productService.deleteProduct(id);

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

export const bulkDeleteProducts = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const count = await productService.bulkDeleteProducts(ids);

  res.json({
    success: true,
    data: { count },
    message: `${count} products deleted successfully`,
  });
});

export const bulkUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { ids, status } = req.body;
  const count = await productService.bulkUpdateStatus(ids, status);

  res.json({
    success: true,
    data: { count },
    message: `${count} products updated successfully`,
  });
});

export const updateStock = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const product = await productService.updateStock(id, quantity);

  res.json({
    success: true,
    data: product,
    message: 'Stock updated successfully',
  });
});

export const getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const threshold = req.query.threshold ? Number(req.query.threshold) : undefined;
  const products = await productService.getLowStockProducts(threshold);

  res.json({
    success: true,
    data: products,
  });
});
