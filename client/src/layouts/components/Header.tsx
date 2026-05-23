import { useState } from 'react';
import { Bell, Search, Menu, ShoppingCart, Package, Users, TrendingUp, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/pages/Auth/api/useAuth';
import { cn } from '@/shared/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  type: 'order' | 'product' | 'customer' | 'revenue';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-20260523-0042 for $299.99 from John Doe',
    time: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    link: '/orders',
  },
  {
    id: '2',
    type: 'product',
    title: 'Low Stock Alert',
    message: 'Wireless Headphones has only 3 units left',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    link: '/products',
  },
  {
    id: '3',
    type: 'customer',
    title: 'New Customer Registration',
    message: 'Alice Johnson just created an account',
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
    link: '/customers',
  },
  {
    id: '4',
    type: 'revenue',
    title: 'Daily Revenue Target',
    message: "You've hit 85% of today's revenue goal 🎉",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    link: '/analytics',
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Delivered',
    message: 'Order #ORD-20260522-0038 was marked as delivered',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    link: '/orders',
  },
];

const NOTIFICATION_ICONS = {
  order: { icon: ShoppingCart, bg: 'bg-blue-500/10', color: 'text-blue-500' },
  product: { icon: Package, bg: 'bg-orange-500/10', color: 'text-orange-500' },
  customer: { icon: Users, bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
  revenue: { icon: TrendingUp, bg: 'bg-purple-500/10', color: 'text-purple-500' },
};

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotifClick = (notif: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setNotifOpen(false);
    navigate(notif.link);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1 max-w-md" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search className="pointer-events-none absolute left-3 inset-y-0 h-full w-4 text-muted-foreground" />
          <Input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-9 pr-0 focus-visible:ring-0 bg-transparent"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          <ThemeToggle />

          {/* Notifications Popover */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-destructive flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white leading-none">{unreadCount}</span>
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge className="h-5 px-1.5 bg-primary/10 text-primary text-xs" variant="secondary">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    onClick={markAllRead}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Notification list */}
              <div className="divide-y max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const { icon: Icon, bg, color } = NOTIFICATION_ICONS[notif.type];
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className={cn(
                          'relative flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50',
                          !notif.read && 'bg-primary/5'
                        )}
                      >
                        {/* Icon */}
                        <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', bg)}>
                          <Icon className={cn('h-4 w-4', color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn('text-sm leading-snug', !notif.read ? 'font-semibold' : 'font-medium')}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(notif.time, { addSuffix: true })}
                          </p>
                        </div>

                        {/* Dismiss */}
                        <button
                          onClick={(e) => dismissNotification(notif.id, e)}
                          className="absolute right-2 top-2 opacity-0 hover:opacity-100 group-hover:opacity-100 p-1 rounded-md hover:bg-muted transition-opacity"
                          aria-label="Dismiss"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t px-4 py-2">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" asChild>
                    <Link to="/analytics" onClick={() => setNotifOpen(false)}>
                      View all activity
                    </Link>
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
