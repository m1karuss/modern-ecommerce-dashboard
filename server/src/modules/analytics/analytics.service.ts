import { PrismaClient } from '@prisma/client';
import { AnalyticsRepository } from './analytics.repository';
import { DashboardStats, RevenueByCategory, TopProduct, SalesOverTime } from './analytics.types';

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new AnalyticsRepository(prisma);
  }

  private getPeriodDates(period: string): { startDate: Date; endDate: Date; previousStartDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    const previousStartDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        previousStartDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        previousStartDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        previousStartDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        previousStartDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
        previousStartDate.setDate(startDate.getDate() - 30);
    }

    return { startDate, endDate, previousStartDate };
  }

  async getDashboardStats(period: string): Promise<DashboardStats> {
    const { startDate, endDate, previousStartDate } = this.getPeriodDates(period);

    const [
      currentRevenue,
      previousRevenue,
      currentOrders,
      previousOrders,
      currentCustomers,
      previousCustomers,
      newCustomers,
      revenueOverTime,
      ordersOverTime,
    ] = await Promise.all([
      this.repository.getTotalRevenue(startDate, endDate),
      this.repository.getTotalRevenue(previousStartDate, startDate),
      this.repository.getTotalOrders(startDate, endDate),
      this.repository.getTotalOrders(previousStartDate, startDate),
      this.repository.getTotalCustomers(startDate, endDate),
      this.repository.getTotalCustomers(previousStartDate, startDate),
      this.repository.getNewCustomers(startDate, endDate),
      this.repository.getRevenueOverTime(startDate, endDate),
      this.repository.getOrdersOverTime(startDate, endDate),
    ]);

    const revenueChange = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const ordersChange = previousOrders > 0
      ? ((currentOrders - previousOrders) / previousOrders) * 100
      : 0;

    const customersChange = previousCustomers > 0
      ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
      : 0;

    const conversionRate = currentOrders > 0 && currentCustomers > 0
      ? (currentOrders / currentCustomers) * 100
      : 0;

    const previousConversionRate = previousOrders > 0 && previousCustomers > 0
      ? (previousOrders / previousCustomers) * 100
      : 0;

    const conversionChange = previousConversionRate > 0
      ? ((conversionRate - previousConversionRate) / previousConversionRate) * 100
      : 0;

    return {
      revenue: {
        total: currentRevenue,
        change: Number(revenueChange.toFixed(2)),
        trend: revenueChange >= 0 ? 'up' : 'down',
        data: revenueOverTime,
      },
      orders: {
        total: currentOrders,
        change: Number(ordersChange.toFixed(2)),
        trend: ordersChange >= 0 ? 'up' : 'down',
        data: ordersOverTime,
      },
      customers: {
        total: currentCustomers,
        change: Number(customersChange.toFixed(2)),
        trend: customersChange >= 0 ? 'up' : 'down',
        newCustomers,
      },
      conversion: {
        rate: Number(conversionRate.toFixed(2)),
        change: Number(conversionChange.toFixed(2)),
        trend: conversionChange >= 0 ? 'up' : 'down',
      },
    };
  }

  async getRevenueByCategory(period: string): Promise<RevenueByCategory[]> {
    const { startDate, endDate } = this.getPeriodDates(period);
    return this.repository.getRevenueByCategory(startDate, endDate);
  }

  async getTopProducts(period: string, limit: number): Promise<TopProduct[]> {
    const { startDate, endDate } = this.getPeriodDates(period);
    return this.repository.getTopProducts(startDate, endDate, limit);
  }

  async getSalesOverTime(period: string): Promise<SalesOverTime[]> {
    const { startDate, endDate } = this.getPeriodDates(period);
    return this.repository.getSalesOverTime(startDate, endDate);
  }

  async getOrderStatusDistribution() {
    return this.repository.getOrderStatusDistribution();
  }

  async getCustomerGrowth(period: string) {
    const { startDate, endDate } = this.getPeriodDates(period);
    return this.repository.getCustomerGrowth(startDate, endDate);
  }
}
