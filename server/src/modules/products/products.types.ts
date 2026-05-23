import { ProductStatus } from '@prisma/client';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductPagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
