import { PrismaClient } from '@prisma/client';
import { RevenueByCategory, TopProduct, SalesOverTime } from './analytics.types';

export class AnalyticsRepository {
  constructor(private prisma: PrismaClient) {}

  async getTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          notIn: ['CANCELLED', 'REFUNDED'],
        },
      },
      _sum: {
        total: true,
      },
    });

    return Number(result._sum.total || 0);
  }

  async getTotalOrders(startDate: Date, endDate: Date): Promise<number> {
    return this.prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          notIn: ['CANCELLED'],
        },
      },
    });
  }

  async getTotalCustomers(_startDate: Date, endDate: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        createdAt: {
          lte: endDate,
        },
        role: 'USER',
        status: 'ACTIVE',
      },
    });
  }

  async getNewCustomers(startDate: Date, endDate: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        role: 'USER',
      },
    });
  }

  async getRevenueOverTime(startDate: Date, endDate: Date): Promise<Array<{ date: string; value: number }>> {
    const orders = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          notIn: ['CANCELLED', 'REFUNDED'],
        },
      },
      _sum: {
        total: true,
      },
    });

    const dataMap = new Map<string, number>();
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const current = dataMap.get(date) || 0;
      dataMap.set(date, current + Number(order._sum.total || 0));
    });

    return Array.from(dataMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getOrdersOverTime(startDate: Date, endDate: Date): Promise<Array<{ date: string; value: number }>> {
    const orders = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          notIn: ['CANCELLED'],
        },
      },
      _count: true,
    });

    const dataMap = new Map<string, number>();
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const current = dataMap.get(date) || 0;
      dataMap.set(date, current + order._count);
    });

    return Array.from(dataMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getRevenueByCategory(startDate: Date, endDate: Date): Promise<RevenueByCategory[]> {
    const result = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            notIn: ['CANCELLED', 'REFUNDED'],
          },
        },
      },
      _sum: {
        total: true,
      },
    });

    const productIds = result.map((r) => r.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        category: true,
      },
    });

    const categoryMap = new Map<string, { name: string; revenue: number }>();

    result.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product?.category) {
        const current = categoryMap.get(product.category.id) || { name: product.category.name, revenue: 0 };
        current.revenue += Number(item._sum.total || 0);
        categoryMap.set(product.category.id, current);
      }
    });

    const totalRevenue = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.revenue, 0);

    return Array.from(categoryMap.entries())
      .map(([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        revenue: data.revenue,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getTopProducts(startDate: Date, endDate: Date, limit: number): Promise<TopProduct[]> {
    const result = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            notIn: ['CANCELLED', 'REFUNDED'],
          },
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: limit,
    });

    const productIds = result.map((r) => r.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    return result.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Unknown',
        sales: item._sum.quantity || 0,
        revenue: Number(item._sum.total || 0),
      };
    });
  }

  async getSalesOverTime(startDate: Date, endDate: Date): Promise<SalesOverTime[]> {
    const orders = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          notIn: ['CANCELLED', 'REFUNDED'],
        },
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    const dataMap = new Map<string, { revenue: number; orders: number }>();
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const current = dataMap.get(date) || { revenue: 0, orders: 0 };
      current.revenue += Number(order._sum.total || 0);
      current.orders += order._count;
      dataMap.set(date, current);
    });

    return Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getOrderStatusDistribution() {
    const statuses = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    return statuses.map((item) => ({
      status: item.status,
      count: item._count,
    }));
  }

  async getCustomerGrowth(startDate: Date, endDate: Date) {
    const users = await this.prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        role: 'USER',
      },
      _count: true,
    });

    const dataMap = new Map<string, number>();
    users.forEach((user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      const current = dataMap.get(date) || 0;
      dataMap.set(date, current + user._count);
    });

    return Array.from(dataMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
