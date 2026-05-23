import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customersApi, CustomersFilters } from './customers.api';

export const CUSTOMERS_KEYS = {
  all: ['customers'] as const,
  list: (filters: CustomersFilters) => ['customers', 'list', filters] as const,
  detail: (id: string) => ['customers', 'detail', id] as const,
  stats: ['customers', 'stats'] as const,
};

export function useCustomers(filters: CustomersFilters = {}) {
  return useQuery({
    queryKey: CUSTOMERS_KEYS.list(filters),
    queryFn: () => customersApi.getAll(filters),
    staleTime: 1000 * 30,
    retry: false,
    throwOnError: false,
  });
}

export function useUpdateCustomerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' }) =>
      customersApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_KEYS.all });
      toast.success('Customer status updated');
    },
    onError: () => toast.error('Failed to update customer status'),
  });
}

export function useUpdateCustomerRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      customersApi.updateRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_KEYS.all });
      toast.success('Customer role updated');
    },
    onError: () => toast.error('Failed to update customer role'),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_KEYS.all });
      toast.success('Customer deleted successfully');
    },
    onError: () => toast.error('Failed to delete customer'),
  });
}
