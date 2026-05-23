import { api } from '@/shared/lib/api';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      name: string;
      sku: string;
      images: string[];
    };
  }[];
  payment?: {
    id: string;
    method: string;
    status: string;
    amount: number;
  };
}

export interface OrdersFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface BackendPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export const ordersApi = {
  // Backend returns { data: Order[], pagination: {...} } at top level
  getAll: (filters: OrdersFilters = {}) =>
    api
      .get<BackendPaginatedResponse<Order>>('/orders', { params: filters })
      .then((r) => ({
        orders: r.data.data,
        ...r.data.pagination,
      })),

  getById: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data.data),

  updateStatus: (id: string, status: OrderStatus) =>
    api
      .patch<ApiResponse<Order>>(`/orders/${id}/status`, { status })
      .then((r) => r.data.data),

  cancelOrder: (id: string) =>
    api.post<ApiResponse<Order>>(`/orders/${id}/cancel`).then((r) => r.data.data),

  deleteOrder: (id: string) =>
    api.delete<ApiResponse<void>>(`/orders/${id}`).then((r) => r.data),

  getStats: () =>
    api.get<ApiResponse<OrderStats>>('/orders/stats').then((r) => r.data.data),
};
