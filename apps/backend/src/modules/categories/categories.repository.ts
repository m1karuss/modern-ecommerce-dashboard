import { PrismaClient, Category } from '@prisma/client';
import { CategoryTree } from './categories.types';

export class CategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getCategoryTree(): Promise<CategoryTree[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                _count: {
                  select: {
                    products: true,
                  },
                },
              },
            },
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories as CategoryTree[];
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { slug },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
  }): Promise<Category> {
    return this.prisma.category.create({
      data,
      include: {
        parent: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      parentId?: string;
      isActive?: boolean;
    }
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
      },
    });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async hasChildren(id: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: { parentId: id },
    });
    return count > 0;
  }

  async hasProducts(id: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { categoryId: id },
    });
    return count > 0;
  }

  async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    const descendant = await this.prisma.category.findUnique({
      where: { id: descendantId },
      include: { parent: true },
    });

    if (!descendant) return false;
    if (!descendant.parentId) return false;
    if (descendant.parentId === ancestorId) return true;

    return this.isDescendant(ancestorId, descendant.parentId);
  }
}
