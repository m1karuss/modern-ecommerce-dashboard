import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface DashboardStats {
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

export interface RevenueByCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  sales: number;
  revenue: number;
}

export interface SalesOverTime {
  date: string;
  revenue: number;
  orders: number;
}

export const analyticsApi = {
  getDashboardStats: async (period: string = '30d'): Promise<DashboardStats> => {
    const { data } = await axios.get(`${API_URL}/analytics/dashboard`, {
      params: { period },
    });
    return data.data;
  },

  getRevenueByCategory: async (period: string = '30d'): Promise<RevenueByCategory[]> => {
    const { data } = await axios.get(`${API_URL}/analytics/revenue-by-category`, {
      params: { period },
    });
    return data.data;
  },

  getTopProducts: async (period: string = '30d', limit: number = 10): Promise<TopProduct[]> => {
    const { data } = await axios.get(`${API_URL}/analytics/top-products`, {
      params: { period, limit },
    });
    return data.data;
  },

  getSalesOverTime: async (period: string = '30d'): Promise<SalesOverTime[]> => {
    const { data } = await axios.get(`${API_URL}/analytics/sales-over-time`, {
      params: { period },
    });
    return data.data;
  },

  getCustomerGrowth: async (period: string = '30d') => {
    const { data } = await axios.get(`${API_URL}/analytics/customer-growth`, {
      params: { period },
    });
    return data.data;
  },
};
