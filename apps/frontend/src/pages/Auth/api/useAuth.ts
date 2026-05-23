import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, LoginPayload, RegisterPayload, UpdateProfilePayload, ChangePasswordPayload } from './auth.api';
import { useAuthStore } from '@/store/authStore';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};

// Demo credentials for offline/demo mode
const DEMO_USERS: Record<string, { password: string; user: any }> = {
  'admin@ecommerce.com': {
    password: 'Admin@123',
    user: {
      id: 'demo-1',
      email: 'admin@ecommerce.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
    },
  },
};

function isServerUnavailable(error: any): boolean {
  if (!error?.response) return true;
  const status = error?.response?.status;
  if (status === 502 || status === 503 || status === 504) return true;
  if (
    error?.code === 'ERR_NETWORK' ||
    error?.code === 'ECONNREFUSED' ||
    error?.message === 'Network Error'
  ) return true;
  return false;
}

function tryDemoLogin(email: string, password: string) {
  const demo = DEMO_USERS[email];
  if (demo && demo.password === password) {
    return {
      user: demo.user,
      accessToken: 'demo-token',
      _demo: true,
    } as any;
  }
  return null;
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.me,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        return await authApi.login(payload);
      } catch (error: any) {
        if (isServerUnavailable(error)) {
          const demoResult = tryDemoLogin(payload.email, payload.password);
          if (demoResult) return demoResult;
          throw Object.assign(new Error('Demo mode: invalid credentials'), {
            _demoError: true,
          });
        }
        throw error;
      }
    },
    onSuccess: (data: any) => {
      login(data.user, data.accessToken);
      if (data._demo) {
        toast.info('Running in demo mode — backend is offline', {
          description: 'Dashboard shows mock data. Start the backend to use real data.',
          duration: 6000,
        });
      } else {
        toast.success(`Welcome back, ${data.user.firstName}!`);
      }
      navigate('/');
    },
    onError: (error: any) => {
      if (error._demoError) {
        toast.error('Invalid demo credentials', {
          description: 'Use admin@ecommerce.com / Admin@123',
        });
        return;
      }
      const message =
        error?.response?.data?.message ||
        (isServerUnavailable(error) ? 'Cannot connect to server' : 'Invalid credentials');
      toast.error(message);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success(`Welcome, ${data.user.firstName}! Account created successfully.`);
      navigate('/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
}

export function useUpdateProfile() {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authApi.updateProfile(payload),
    onSuccess: (user) => {
      updateUser(user);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // Ignore logout errors (e.g., backend offline)
      }
    },
    onSettled: () => {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    },
  });
}
