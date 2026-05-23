import { PrismaClient, Order, Prisma } from '@prisma/client';
import { OrderFilters, OrderPagination, PaginatedResponse, OrderWithDetails } from './orders.types';

export class OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(
    filters: OrderFilters,
    pagination: OrderPagination
  ): Promise<PaginatedResponse<OrderWithDetails>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
        { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters.minTotal !== undefined || filters.maxTotal !== undefined) {
      where.total = {};
      if (filters.minTotal !== undefined) {
        where.total.gte = filters.minTotal;
      }
      if (filters.maxTotal !== undefined) {
        where.total.lte = filters.maxTotal;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  images: true,
                },
              },
            },
          },
          payment: {
            select: {
              id: true,
              method: true,
              status: true,
              transactionId: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: data.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          price: typeof item.price === 'object' ? item.price.toNumber() : item.price,
          total: typeof item.total === 'object' ? item.total.toNumber() : item.total,
        })),
      })) as OrderWithDetails[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<OrderWithDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true,
                price: true,
              },
            },
          },
        },
        payment: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });

    return order as OrderWithDetails | null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { orderNumber },
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async delete(id: string): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async getOrderStats(userId?: string): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    const where: Prisma.OrderWhereInput = userId ? { userId } : {};

    const [total, pending, processing, shipped, delivered, cancelled] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.order.count({ where: { ...where, status: 'PROCESSING' } }),
      this.prisma.order.count({ where: { ...where, status: 'SHIPPED' } }),
      this.prisma.order.count({ where: { ...where, status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { ...where, status: 'CANCELLED' } }),
    ]);

    return { total, pending, processing, shipped, delivered, cancelled };
  }

  async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `ORD-${year}${month}${day}-${sequence}`;
  }
}
