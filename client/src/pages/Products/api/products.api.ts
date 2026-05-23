import { api } from '@/shared/lib/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  isFeatured: boolean;
  categoryId?: string;
  category?: { id: string; name: string };
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BackendPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  status: string;
  categoryId?: string;
  description?: string;
  images?: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const productsApi = {
  getAll: (filters: ProductsFilters = {}) =>
    api
      .get<BackendPaginatedResponse<Product>>('/products', { params: filters })
      .then((r) => ({
        products: r.data.data,
        ...r.data.pagination,
      })),

  getById: (id: string) =>
    api.get<ApiResponse<Product>>(`/products/${id}`).then((r) => r.data.data),

  create: (payload: CreateProductPayload) =>
    api.post<ApiResponse<Product>>('/products', payload).then((r) => r.data.data),

  // Backend has PUT (full update), not PATCH
  update: (id: string, payload: UpdateProductPayload) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, payload).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/products/${id}`).then((r) => r.data),

  // Backend: POST /products/bulk-delete with body {ids}
  bulkDelete: (ids: string[]) =>
    api.post<ApiResponse<void>>('/products/bulk-delete', { ids }).then((r) => r.data),

  bulkUpdateStatus: (ids: string[], status: string) =>
    api.post<ApiResponse<void>>('/products/bulk-update-status', { ids, status }).then((r) => r.data),

  getLowStock: () =>
    api.get<ApiResponse<Product[]>>('/products/low-stock').then((r) => r.data.data),
};
