import { api } from '@/shared/lib/api';

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

export const customersApi = {
  getAll: (filters: CustomersFilters = {}) =>
    api
      .get<BackendPaginatedResponse<Customer>>('/users', { params: filters })
      .then((r) => ({
        customers: r.data.data,
        ...r.data.pagination,
      })),

  getById: (id: string) =>
    api.get<ApiResponse<Customer>>(`/users/${id}`).then((r) => r.data.data),

  updateStatus: (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') =>
    api.patch<ApiResponse<Customer>>(`/users/${id}/status`, { status }).then((r) => r.data.data),

  updateRole: (id: string, role: string) =>
    api.patch<ApiResponse<Customer>>(`/users/${id}/role`, { role }).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/users/${id}`).then((r) => r.data),

  getStats: () =>
    api.get<ApiResponse<any>>('/users/stats').then((r) => r.data.data),
};
