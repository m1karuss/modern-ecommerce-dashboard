import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboard.api';

export const DASHBOARD_KEYS = {
  stats: ['dashboard', 'stats'] as const,
  revenueByCategory: ['dashboard', 'revenueByCategory'] as const,
  salesOverTime: (period: string) => ['dashboard', 'salesOverTime', period] as const,
  topProducts: ['dashboard', 'topProducts'] as const,
};

const QUERY_OPTIONS = {
  staleTime: 1000 * 60 * 2,
  retry: false,
  throwOnError: false,
} as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats,
    queryFn: dashboardApi.getStats,
    ...QUERY_OPTIONS,
  });
}

export function useRevenueByCategory() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.revenueByCategory,
    queryFn: dashboardApi.getRevenueByCategory,
    ...QUERY_OPTIONS,
  });
}

export function useSalesOverTime(period = '30d') {
  return useQuery({
    queryKey: DASHBOARD_KEYS.salesOverTime(period),
    queryFn: () => dashboardApi.getSalesOverTime(period),
    ...QUERY_OPTIONS,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.topProducts,
    queryFn: () => dashboardApi.getTopProducts(5),
    ...QUERY_OPTIONS,
  });
}
