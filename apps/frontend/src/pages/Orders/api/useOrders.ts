import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ordersApi, OrdersFilters, OrderStatus } from './orders.api';

export const ORDERS_KEYS = {
  all: ['orders'] as const,
  lists: () => [...ORDERS_KEYS.all, 'list'] as const,
  list: (filters: OrdersFilters) => [...ORDERS_KEYS.lists(), filters] as const,
  details: () => [...ORDERS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDERS_KEYS.details(), id] as const,
};

export function useOrders(filters: OrdersFilters = {}) {
  return useQuery({
    queryKey: ORDERS_KEYS.list(filters),
    queryFn: () => ordersApi.getAll(filters),
    staleTime: 1000 * 30,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ORDERS_KEYS.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.lists() });
      queryClient.setQueryData(ORDERS_KEYS.detail(data.id), data);
      toast.success(`Order status updated to ${data.status}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update order status');
    },
  });
}
