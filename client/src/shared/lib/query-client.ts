import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        const errorResponse = error as ErrorResponse;
        const message = errorResponse?.response?.data?.message || 'Something went wrong';
        toast.error(message);
      },
    },
  },
});
