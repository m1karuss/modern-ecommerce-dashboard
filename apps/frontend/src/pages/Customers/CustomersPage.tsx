import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, UserCheck, UserX, Shield, Mail, MoreHorizontal, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/shared/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Pagination } from '@/shared/components/Pagination';
import { useCustomers, useUpdateCustomerStatus, useDeleteCustomer } from './api/useCustomers';
import { Customer } from './api/customers.api';

// ─── Styles ──────────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  ADMIN: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  MANAGER: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  USER: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  INACTIVE: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  SUSPENDED: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

// ─── Mock fallback ────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'USER' as const, status: 'ACTIVE' as const, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'MANAGER' as const, status: 'ACTIVE' as const, createdAt: '2024-02-20T00:00:00Z', updatedAt: '2024-02-20T00:00:00Z' },
  { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', role: 'USER' as const, status: 'INACTIVE' as const, createdAt: '2024-03-10T00:00:00Z', updatedAt: '2024-03-10T00:00:00Z' },
  { id: '4', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', role: 'USER' as const, status: 'ACTIVE' as const, createdAt: '2023-11-05T00:00:00Z', updatedAt: '2023-11-05T00:00:00Z' },
  { id: '5', firstName: 'Charlie', lastName: 'Wilson', email: 'charlie@example.com', role: 'USER' as const, status: 'SUSPENDED' as const, createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-04-01T00:00:00Z' },
];

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-muted animate-pulse ${className}`} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useCustomers({
    search: search || undefined,
    page,
    limit,
  });
  const { mutate: updateStatus } = useUpdateCustomerStatus();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const customers = data?.customers ?? (isError ? MOCK_CUSTOMERS : []);
  const total = data?.total ?? customers.length;

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedCustomer(null);
        },
      });
    }
  };

  const activeCount = customers.filter((c) => c.status === 'ACTIVE').length;
  const inactiveCount = customers.filter((c) => c.status === 'INACTIVE').length;
  const suspendedCount = customers.filter((c) => c.status === 'SUSPENDED').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer base and user roles</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Customers', value: total, icon: Users, color: 'text-primary' },
          { label: 'Active', value: activeCount, icon: UserCheck, color: 'text-emerald-500' },
          { label: 'Inactive', value: inactiveCount, icon: UserX, color: 'text-yellow-500' },
          { label: 'Suspended', value: suspendedCount, icon: Shield, color: 'text-red-500' },
        ].map((card, i) => (
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
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">{card.value}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-2 w-36" /></div></div></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                        <TableCell />
                      </TableRow>
                    ))
                  : customers.map((customer, i) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {(customer.firstName?.[0] ?? '?')}{(customer.lastName?.[0] ?? '')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {customer.firstName ?? ''} {customer.lastName ?? ''}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {customer.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={ROLE_STYLES[customer.role]} variant="secondary">
                            {customer.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_STYLES[customer.status]} variant="secondary">
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {customer.status !== 'ACTIVE' && (
                                <DropdownMenuItem
                                  onClick={() => updateStatus({ id: customer.id, status: 'ACTIVE' })}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate Account
                                </DropdownMenuItem>
                              )}
                              {customer.status !== 'INACTIVE' && (
                                <DropdownMenuItem
                                  onClick={() => updateStatus({ id: customer.id, status: 'INACTIVE' })}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate Account
                                </DropdownMenuItem>
                              )}
                              {customer.status !== 'SUSPENDED' && (
                                <DropdownMenuItem
                                  onClick={() => updateStatus({ id: customer.id, status: 'SUSPENDED' })}
                                  className="text-yellow-600 focus:text-yellow-600"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Suspend Account
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(customer)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Customer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
              </TableBody>
            </Table>
            {!isLoading && customers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No customers found
              </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedCustomer?.firstName} {selectedCustomer?.lastName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
