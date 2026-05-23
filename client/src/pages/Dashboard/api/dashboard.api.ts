import { api } from '@/shared/lib/api';

// ─── Backend response types (exact match to analytics.service.ts) ───────────

export interface BackendDashboardStats {
  revenue: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    data: Array<{ date: string; value: number }>;
  };
  orders: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    data: Array<{ date: string; value: number }>;
  };
  customers: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    newCustomers: number;
  };
  conversion: {
    rate: number;
    change: number;
    trend: 'up' | 'down';
  };
}

export interface BackendRevenueByCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface BackendSalesOverTime {
  date: string;
  revenue: number;
  orders: number;
}

export interface BackendTopProduct {
  productId: string;
  productName: string;
  sales: number;
  revenue: number;
}

// ─── Frontend-friendly types (used in DashboardPage) ────────────────────────

export interface DashboardStats {
  revenue: { total: number; change: number; trend: 'up' | 'down' };
  orders: { total: number; change: number; trend: 'up' | 'down' };
  customers: { total: number; change: number; trend: 'up' | 'down' };
  conversion: { rate: number; change: number; trend: 'up' | 'down' };
}

export interface RevenueDataPoint {
  name: string;
  revenue: number;
  orders: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const CATEGORY_COLORS = [
  '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
  '#2563eb', '#0891b2', '#059669', '#d97706',
];

export const dashboardApi = {
  getStats: () =>
    api
      .get<ApiResponse<BackendDashboardStats>>('/analytics/dashboard')
      .then((r) => r.data.data),

  getRevenueByCategory: () =>
    api
      .get<ApiResponse<BackendRevenueByCategory[]>>('/analytics/revenue-by-category')
      .then((r) =>
        r.data.data.map((item, i) => ({
          name: item.categoryName,
          value: item.revenue,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        }))
      ),

  getSalesOverTime: (period = '30d') =>
    api
      .get<ApiResponse<BackendSalesOverTime[]>>(`/analytics/sales-over-time?period=${period}`)
      .then((r) =>
        r.data.data.map((item) => ({
          name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: item.revenue,
          orders: item.orders,
        }))
      ),

  getTopProducts: (limit = 5) =>
    api
      .get<ApiResponse<BackendTopProduct[]>>(`/analytics/top-products?limit=${limit}`)
      .then((r) =>
        r.data.data.map((p) => ({
          id: p.productId,
          name: p.productName,
          totalSold: p.sales,
          totalRevenue: p.revenue,
        }))
      ),
};
