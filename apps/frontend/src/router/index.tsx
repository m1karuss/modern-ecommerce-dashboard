import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { ProductsPage } from '../pages/Products/ProductsPage';
import { OrdersPage } from '../pages/Orders/OrdersPage';
import { CustomersPage } from '../pages/Customers/CustomersPage';
import { AnalyticsPage } from '../pages/Analytics/AnalyticsPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ErrorPage } from '../pages/NotFound/ErrorPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';

// ─── Role constants ───────────────────────────────────────────────────────────

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  // ── Public auth routes ─────────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },

  // ── Protected dashboard routes ─────────────────────────────────────────────
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Visible to all authenticated users
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },

      // Admin/Manager only
      {
        path: 'products',
        element: (
          <ProtectedRoute roles={ADMIN_ROLES}>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'customers',
        element: (
          <ProtectedRoute roles={ADMIN_ROLES}>
            <CustomersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <ProtectedRoute roles={ADMIN_ROLES}>
            <AnalyticsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ── 404 catch-all ──────────────────────────────────────────────────────────
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
