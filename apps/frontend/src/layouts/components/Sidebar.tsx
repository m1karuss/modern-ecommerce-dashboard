import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings,
  ShoppingBag, X, LockKeyhole,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/store/authStore';

// ─── Navigation config with role guards ──────────────────────────────────────

type AllowedRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: AllowedRole[]; // empty = all roles
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: [], // everyone
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
    roles: [], // everyone can see their own orders
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
    roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: [], // everyone
  },
];

function hasAccess(userRole: string, allowedRoles: AllowedRole[]) {
  if (allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole as AllowedRole);
}

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// ─── Nav items (role-filtered) ───────────────────────────────────────────────

function NavItems({ onItemClick }: { onItemClick?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? 'USER';

  const visible = navigation.filter((item) => hasAccess(role, item.roles));

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {visible.map((item) => (
        <li key={item.name}>
          <NavLink
            to={item.href}
            end={item.href === '/'}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'group flex gap-x-3 rounded-xl p-2.5 text-sm font-semibold leading-6 transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110', isActive && 'scale-110')} />
                {item.name}
              </>
            )}
          </NavLink>
        </li>
      ))}

      {/* Role badge */}
      <li className="pt-4 mt-4 border-t border-border">
        <div className="flex items-center gap-2 px-2.5 py-1.5">
          <LockKeyhole className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            role === 'SUPER_ADMIN' && 'bg-purple-500/10 text-purple-500',
            role === 'ADMIN' && 'bg-blue-500/10 text-blue-500',
            role === 'MANAGER' && 'bg-cyan-500/10 text-cyan-500',
            role === 'USER' && 'bg-gray-500/10 text-gray-500',
          )}>
            {role.replace('_', ' ')}
          </span>
        </div>
      </li>
    </ul>
  );
}

// ─── Sidebar content ─────────────────────────────────────────────────────────

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg px-1 py-1 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Go to Dashboard"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">E-Commerce</h1>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <NavItems onItemClick={onItemClick} />
          </li>
        </ul>
      </nav>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              onClick={onMobileClose}
            />

            {/* Mobile Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col lg:hidden"
            >
              <div className="relative flex grow flex-col">
                <SidebarContent onItemClick={onMobileClose} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3"
                  onClick={onMobileClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
