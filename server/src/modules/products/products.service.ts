import { PrismaClient, Product } from '@prisma/client';
import { ProductRepository } from './products.repository';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './products.dto';
import { PaginatedResponse } from './products.types';
import { AppError } from '../../common/utils/app-error.util';

export class ProductService {
  private repository: ProductRepository;

  constructor(private prisma: PrismaClient) {
    this.repository = new ProductRepository(prisma);
  }

  async getProducts(query: ProductQueryDto): Promise<PaginatedResponse<Product>> {
    const { page, limit, sortBy, sortOrder, ...filters } = query;

    return this.repository.findAll(filters, {
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.repository.findBySlug(slug);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    const existingSlug = await this.repository.findBySlug(data.slug);
    if (existingSlug) {
      throw new AppError('Product with this slug already exists', 400);
    }

    const existingSku = await this.repository.findBySku(data.sku);
    if (existingSku) {
      throw new AppError('Product with this SKU already exists', 400);
    }

    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    return this.repository.create({
      ...data,
      category: data.categoryId
        ? { connect: { id: data.categoryId } }
        : undefined,
    });
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (data.slug && data.slug !== product.slug) {
      const existingSlug = await this.repository.findBySlug(data.slug);
      if (existingSlug) {
        throw new AppError('Product with this slug already exists', 400);
      }
    }

    if (data.sku && data.sku !== product.sku) {
      const existingSku = await this.repository.findBySku(data.sku);
      if (existingSku) {
        throw new AppError('Product with this SKU already exists', 400);
      }
    }

    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    return this.repository.update(id, {
      ...data,
      category: data.categoryId
        ? { connect: { id: data.categoryId } }
        : undefined,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await this.repository.delete(id);
  }

  async bulkDeleteProducts(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new AppError('No product IDs provided', 400);
    }

    return this.repository.bulkDelete(ids);
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new AppError('No product IDs provided', 400);
    }

    return this.repository.bulkUpdateStatus(ids, status);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return this.repository.updateStock(id, quantity);
  }

  async getLowStockProducts(threshold?: number): Promise<Product[]> {
    return this.repository.getLowStockProducts(threshold);
  }
}
