import { PrismaClient, Category } from '@prisma/client';
import { CategoryRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';
import { CategoryTree } from './categories.types';
import { AppError } from '../../common/utils/app-error.util';

export class CategoryService {
  private repository: CategoryRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new CategoryRepository(prisma);
  }

  async getCategories(): Promise<Category[]> {
    return this.repository.findAll();
  }

  async getCategoryTree(): Promise<CategoryTree[]> {
    return this.repository.getCategoryTree();
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.repository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.repository.findBySlug(slug);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const existingSlug = await this.repository.findBySlug(data.slug);
    if (existingSlug) {
      throw new AppError('Category with this slug already exists', 400);
    }

    if (data.parentId) {
      const parent = await this.repository.findById(data.parentId);
      if (!parent) {
        throw new AppError('Parent category not found', 404);
      }
    }

    return this.repository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (data.slug && data.slug !== category.slug) {
      const existingSlug = await this.repository.findBySlug(data.slug);
      if (existingSlug) {
        throw new AppError('Category with this slug already exists', 400);
      }
    }

    if (data.parentId) {
      if (data.parentId === id) {
        throw new AppError('Category cannot be its own parent', 400);
      }

      const parent = await this.repository.findById(data.parentId);
      if (!parent) {
        throw new AppError('Parent category not found', 404);
      }

      const isDescendant = await this.repository.isDescendant(id, data.parentId);
      if (isDescendant) {
        throw new AppError('Cannot set a descendant as parent', 400);
      }
    }

    return this.repository.update(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const hasChildren = await this.repository.hasChildren(id);
    if (hasChildren) {
      throw new AppError('Cannot delete category with subcategories', 400);
    }

    const hasProducts = await this.repository.hasProducts(id);
    if (hasProducts) {
      throw new AppError('Cannot delete category with products', 400);
    }

    await this.repository.delete(id);
  }
}
