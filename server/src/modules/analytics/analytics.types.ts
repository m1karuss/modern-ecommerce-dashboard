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
