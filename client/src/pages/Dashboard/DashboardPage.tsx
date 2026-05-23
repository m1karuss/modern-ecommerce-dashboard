import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, ArrowRight, Percent, Package } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useDashboardStats, useRevenueByCategory, useSalesOverTime, useTopProducts } from './api/useDashboard';
import { formatCurrency } from '@/shared/lib/utils';
import { Link } from 'react-router-dom';

// ─── Fallback mock data ───────────────────────────────────────────────────────

const MOCK_STATS = {
  revenue: { total: 45231.89, change: 20.1, trend: 'up' as const },
  orders: { total: 2350, change: 12.5, trend: 'up' as const },
  customers: { total: 1234, change: 8.2, trend: 'up' as const },
  conversion: { rate: 3.24, change: -1.5, trend: 'down' as const },
};

const MOCK_SALES_OVER_TIME = [
  { name: 'Jan 1', revenue: 4000, orders: 240 },
  { name: 'Jan 8', revenue: 3000, orders: 198 },
  { name: 'Jan 15', revenue: 5000, orders: 320 },
  { name: 'Jan 22', revenue: 4500, orders: 278 },
  { name: 'Jan 29', revenue: 6000, orders: 389 },
  { name: 'Feb 5', revenue: 5500, orders: 349 },
  { name: 'Feb 12', revenue: 7200, orders: 420 },
];

const MOCK_CATEGORIES = [
  { name: 'Electronics', value: 4500, color: '#7c3aed' },
  { name: 'Clothing', value: 3200, color: '#6d28d9' },
  { name: 'Sports', value: 2800, color: '#5b21b6' },
  { name: 'Home', value: 2100, color: '#4c1d95' },
];

const MOCK_TOP_PRODUCTS = [
  { id: '1', name: 'Wireless Headphones', totalSold: 142, totalRevenue: 42657.58 },
  { id: '2', name: 'Smart Watch', totalSold: 98, totalRevenue: 39199.02 },
  { id: '3', name: 'Cotton T-Shirt', totalSold: 87, totalRevenue: 2609.13 },
  { id: '4', name: 'Running Shoes', totalSold: 65, totalRevenue: 8449.35 },
  { id: '5', name: 'Backpack', totalSold: 54, totalRevenue: 5399.46 },
];

// ─── Animation ────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  color: 'hsl(var(--card-foreground))',
  fontSize: '13px',
  padding: '8px 12px',
};

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</p>
      <p>{formatCurrency(item.value)}</p>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────


// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-md bg-muted animate-pulse ${className}`} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { data: statsData, isLoading: loadingStats } = useDashboardStats();
  const { data: categoriesData, isLoading: loadingCats } = useRevenueByCategory();
  const { data: salesData, isLoading: loadingSales } = useSalesOverTime('30d');
  const { data: topProductsData, isLoading: loadingProducts } = useTopProducts();

  // Fallback to mock when API fails or loading
  const stats = statsData ?? MOCK_STATS;
  const salesOverTime = salesData ?? MOCK_SALES_OVER_TIME;
  const categories = categoriesData ?? MOCK_CATEGORIES;
  const topProducts = topProductsData ?? MOCK_TOP_PRODUCTS;

  const statCards = [
    {
      name: 'Total Revenue',
      value: formatCurrency(stats.revenue.total),
      change: stats.revenue.change,
      trend: stats.revenue.trend,
      icon: DollarSign,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      name: 'Total Orders',
      value: stats.orders.total.toLocaleString(),
      change: stats.orders.change,
      trend: stats.orders.trend,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      name: 'Customers',
      value: stats.customers.total.toLocaleString(),
      change: stats.customers.change,
      trend: stats.customers.trend,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Conversion Rate',
      value: `${stats.conversion.rate.toFixed(2)}%`,
      change: stats.conversion.change,
      trend: stats.conversion.trend,
      icon: Percent,
      gradient: 'from-orange-500 to-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your store.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-28 mb-2" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <div className="flex items-center text-xs mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="ml-1 text-muted-foreground">from last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart + Top Products */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Over Time */}
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSales ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: 4 }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/products" className="flex items-center gap-1 text-xs">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingProducts
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-2 w-20" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))
                  : topProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Package className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.totalSold} sold</p>
                        </div>
                        <div className="text-sm font-semibold shrink-0">
                          {formatCurrency(product.totalRevenue)}
                        </div>
                      </motion.div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCats ? (
                <Skeleton className="h-[280px]" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={95}
                      innerRadius={40}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Orders Over Time</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/orders" className="flex items-center gap-1 text-xs">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loadingSales ? (
                <Skeleton className="h-[280px]" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={salesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: 4 }}
                      formatter={(value: number) => [value, 'Orders']}
                    />
                    <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
