import { api } from '@/shared/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

// Backend returns: { user, accessToken } — refreshToken is in httpOnly cookie
export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api
      .post<ApiResponse<AuthResponse>>('/auth/login', payload)
      .then((r) => r.data.data),

  register: (payload: RegisterPayload) =>
    api
      .post<ApiResponse<AuthResponse>>('/auth/register', payload)
      .then((r) => r.data.data),

  me: () =>
    api
      .get<ApiResponse<{ user: AuthUser }>>('/auth/me')
      .then((r) => r.data.data.user),

  logout: () => api.post('/auth/logout'),

  refreshToken: () =>
    api
      .post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
      .then((r) => r.data.data),

  updateProfile: (payload: UpdateProfilePayload) =>
    api
      .patch<ApiResponse<{ user: AuthUser }>>('/auth/me/profile', payload)
      .then((r) => r.data.data.user),

  changePassword: (payload: ChangePasswordPayload) =>
    api
      .patch<ApiResponse<void>>('/auth/me/password', payload)
      .then((r) => r.data),
};
