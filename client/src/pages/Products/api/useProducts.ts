import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productsApi, ProductsFilters, CreateProductPayload, UpdateProductPayload } from './products.api';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const PRODUCTS_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCTS_KEYS.all, 'list'] as const,
  list: (filters: ProductsFilters) => [...PRODUCTS_KEYS.lists(), filters] as const,
  details: () => [...PRODUCTS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCTS_KEYS.details(), id] as const,
};

export function useProducts(filters: ProductsFilters = {}) {
  return useQuery({
    queryKey: PRODUCTS_KEYS.list(filters),
    queryFn: () => productsApi.getAll(filters),
    staleTime: 1000 * 30,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCTS_KEYS.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
      toast.success('Product created successfully!');
    },
    onError: (error: unknown) => {
      const errorResponse = error as ErrorResponse;
      toast.error(errorResponse?.response?.data?.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      productsApi.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
      queryClient.setQueryData(PRODUCTS_KEYS.detail(data.id), data);
      toast.success('Product updated successfully!');
    },
    onError: (error: unknown) => {
      const errorResponse = error as ErrorResponse;
      toast.error(errorResponse?.response?.data?.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
      toast.success('Product deleted successfully!');
    },
    onError: (error: unknown) => {
      const errorResponse = error as ErrorResponse;
      toast.error(errorResponse?.response?.data?.message || 'Failed to delete product');
    },
  });
}
