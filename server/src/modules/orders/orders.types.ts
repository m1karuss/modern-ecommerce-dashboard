import { Order, OrderStatus } from '@prisma/client';

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
}

export interface OrderPagination {
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

export interface OrderWithDetails extends Order {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number | { toNumber(): number };
    total: number | { toNumber(): number };
    product: {
      id: string;
      name: string;
      sku: string;
      images: string[];
    };
  }>;
  payment?: {
    id: string;
    method: string;
    status: string;
    transactionId: string | null;
  } | null;
}
