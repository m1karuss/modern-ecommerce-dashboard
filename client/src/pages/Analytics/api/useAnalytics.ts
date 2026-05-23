import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from './analytics.api';

export function useDashboardStats(period: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'dashboard', period],
    queryFn: () => analyticsApi.getDashboardStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRevenueByCategory(period: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'revenue-by-category', period],
    queryFn: () => analyticsApi.getRevenueByCategory(period),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopProducts(period: string = '30d', limit: number = 10) {
  return useQuery({
    queryKey: ['analytics', 'top-products', period, limit],
    queryFn: () => analyticsApi.getTopProducts(period, limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSalesOverTime(period: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'sales-over-time', period],
    queryFn: () => analyticsApi.getSalesOverTime(period),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomerGrowth(period: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'customer-growth', period],
    queryFn: () => analyticsApi.getCustomerGrowth(period),
    staleTime: 5 * 60 * 1000,
  });
}
