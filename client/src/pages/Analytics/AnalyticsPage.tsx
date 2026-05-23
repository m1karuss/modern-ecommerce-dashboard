import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, Loader2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { formatCurrency } from '@/shared/lib/utils';
import { useDashboardStats, useTopProducts, useSalesOverTime } from './api/useAnalytics';
import { format } from 'date-fns';

export function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');

  const { data: stats, isLoading: statsLoading } = useDashboardStats(period);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts(period, 5);
  const { data: salesData, isLoading: salesLoading } = useSalesOverTime(period);

  const isLoading = statsLoading || productsLoading || salesLoading;

  // Transform sales data for chart
  const chartData = salesData?.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    revenue: item.revenue,
    orders: item.orders,
  })) || [];

  const kpiCards = stats ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.revenue.total),
      change: stats.revenue.change,
      trend: stats.revenue.trend,
      icon: DollarSign,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Total Orders',
      value: stats.orders.total.toLocaleString(),
      change: stats.orders.change,
      trend: stats.orders.trend,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Total Customers',
      value: stats.customers.total.toLocaleString(),
      change: stats.customers.change,
      trend: stats.customers.trend,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversion.rate.toFixed(1)}%`,
      change: stats.conversion.change,
      trend: stats.conversion.trend,
      icon: Package,
      gradient: 'from-orange-500 to-amber-600',
    },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">Deep insights into your business performance</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 rounded bg-muted animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted animate-pulse mt-2" />
              </CardContent>
            </Card>
          ))
        ) : (
          kpiCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                    <card.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {card.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {card.change >= 0 ? '+' : ''}{card.change.toFixed(1)}% vs previous period
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Revenue & Orders Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="h-[320px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revenue-gradient)" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                No data available for this period
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                    <div className="h-2 w-full rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : topProducts && topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, i) => {
                  const maxSales = topProducts[0]?.sales || 1;
                  return (
                    <div key={product.productId} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{product.productName}</span>
                        <span className="text-muted-foreground">{product.sales} sold</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(product.sales / maxSales) * 100}%` }}
                            transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-20 text-right">{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No product data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
