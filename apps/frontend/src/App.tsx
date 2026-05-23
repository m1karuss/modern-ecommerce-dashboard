import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { router } from './router';
import { queryClient } from './shared/lib/query-client';
import { ThemeProvider } from './providers/ThemeProvider';
import { useAuthStore } from './store/authStore';
import { authApi } from './pages/Auth/api/auth.api';

// ─── Sync auth state with server on app start ─────────────────────────────────
// Prevents stale role data in localStorage (e.g. after admin promotes/demotes a user)

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, login, logout } = useAuthStore();

  useEffect(() => {
    // Skip for demo token (offline mode)
    if (!isAuthenticated || accessToken === 'demo-token') return;

    authApi
      .me()
      .then((user) => {
        // Re-sync user data (role, name, email) from server
        login(user, accessToken!);
      })
      .catch(() => {
        // Token invalid / expired → force logout
        logout();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once on mount

  return <>{children}</>;
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </AuthInitializer>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
