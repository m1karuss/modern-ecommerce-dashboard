import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreHorizontal, Eye, Package, Truck, CheckCircle, XCircle, Clock, RefreshCw, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/shared/components/ui/dialog';
import { DatePickerWithRange } from '@/shared/components/ui/date-picker';
import { Pagination } from '@/shared/components/Pagination';
import { useOrders, useUpdateOrderStatus } from './api/useOrders';
import { Order, OrderStatus } from './api/orders.api';
import { formatCurrency } from '@/shared/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  PROCESSING: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  SHIPPED: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  DELIVERED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  CANCELLED: 'bg-red-500/10 text-red-600 dark:text-red-400',
  REFUNDED: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDING: Clock,
  PROCESSING: RefreshCw,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  REFUNDED: RefreshCw,
};

// Mock fallback data while backend is connecting
const MOCK_ORDERS: Order[] = [
  {
    id: '1', orderNumber: 'ORD-20260523-0001', status: 'PROCESSING',
    subtotal: 280, tax: 14, shipping: 10, discount: 0, total: 304,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    user: { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
    items: [{ id: '1', quantity: 2, price: 140, total: 280, product: { id: '1', name: 'Wireless Headphones', sku: 'WH-001', images: [] } }],
    payment: { id: '1', method: 'CREDIT_CARD', status: 'COMPLETED', amount: 304 },
  },
  {
    id: '2', orderNumber: 'ORD-20260522-0045', status: 'SHIPPED',
    subtotal: 135, tax: 9, shipping: 5, discount: 0, total: 149,
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(),
    user: { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' },
    items: [{ id: '2', quantity: 1, price: 135, total: 135, product: { id: '2', name: 'Smart Watch', sku: 'SW-002', images: [] } }],
    payment: { id: '2', method: 'PAYPAL', status: 'COMPLETED', amount: 149 },
  },
  {
    id: '3', orderNumber: 'ORD-20260521-0032', status: 'DELIVERED',
    subtotal: 450, tax: 28, shipping: 15, discount: 0, total: 493,
    createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString(),
    user: { id: '3', email: 'bob@example.com', firstName: 'Bob', lastName: 'Johnson' },
    items: [{ id: '3', quantity: 3, price: 150, total: 450, product: { id: '3', name: 'Running Shoes', sku: 'RS-003', images: [] } }],
    payment: { id: '3', method: 'STRIPE', status: 'COMPLETED', amount: 493 },
  },
  {
    id: '4', orderNumber: 'ORD-20260520-0018', status: 'PENDING',
    subtotal: 199, tax: 12, shipping: 8, discount: 0, total: 219,
    createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date().toISOString(),
    user: { id: '4', email: 'alice@example.com', firstName: 'Alice', lastName: 'Brown' },
    items: [{ id: '4', quantity: 1, price: 199, total: 199, product: { id: '4', name: 'Yoga Mat', sku: 'YM-004', images: [] } }],
    payment: { id: '4', method: 'CASH_ON_DELIVERY', status: 'PENDING', amount: 219 },
  },
];

export function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const limit = 10;

  const { data, isLoading } = useOrders({
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    page,
    limit,
  });

  const { mutate: updateStatus } = useUpdateOrderStatus();

  const orders = data?.orders ?? MOCK_ORDERS;
  const total = data?.total ?? MOCK_ORDERS.length;

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateStatus({ id: orderId, status });
  };

  const summaryCards = [
    { label: 'Total Orders', value: total, icon: Package, color: 'text-primary' },
    { label: 'Pending', value: statusCounts['PENDING'] || 0, icon: Clock, color: 'text-yellow-500' },
    { label: 'Processing', value: statusCounts['PROCESSING'] || 0, icon: RefreshCw, color: 'text-blue-500' },
    { label: 'Shipped', value: statusCounts['SHIPPED'] || 0, icon: Truck, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and shipments</p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-16 rounded bg-muted animate-pulse" />
                ) : (
                  <div className="text-2xl font-bold">{card.value}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order number, customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                />
                {dateRange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateRange(undefined)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear dates
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b">
                    <div className="h-3 w-36 rounded bg-muted animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                      <div className="h-2 w-40 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                    <div className="h-6 w-20 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {orders.map((order, i) => {
                      const StatusIcon = STATUS_ICONS[order.status] || Package;
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-sm font-medium">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {order.user.firstName} {order.user.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">{order.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            <Badge className={STATUS_STYLES[order.status]} variant="secondary">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs ${order.payment?.status === 'COMPLETED' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                              {order.payment?.status ?? '—'}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                                  disabled={order.status !== 'PENDING'}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Mark Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                                  disabled={order.status !== 'PROCESSING'}
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Mark Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                  disabled={order.status !== 'SHIPPED'}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Delivered
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                  className="text-red-600 focus:text-red-600"
                                  disabled={['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
            {!isLoading && data?.pagination && (
              <Pagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer + Status */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Customer</h4>
                  <div className="space-y-1">
                    <p className="font-medium">{selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.user.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Order Info</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={STATUS_STYLES[selectedOrder.status]} variant="secondary">
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span className="text-sm">{format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Payment</span>
                      <span className="text-sm">{selectedOrder.payment?.method?.replace('_', ' ') ?? '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide mb-3">Items</h4>
                <div className="rounded-lg border divide-y">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.sku} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(selectedOrder.shipping)}</span>
                </div>
                {(selectedOrder.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-emerald-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedOrder.discount ?? 0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
