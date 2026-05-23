import { PrismaClient, Order } from '@prisma/client';
import { OrderRepository } from './orders.repository';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto, UpdatePaymentStatusDto, OrderQueryDto } from './orders.dto';
import { PaginatedResponse, OrderWithDetails } from './orders.types';
import { AppError } from '../../common/utils/app-error.util';

export class OrderService {
  private repository: OrderRepository;

  constructor(private prisma: PrismaClient) {
    this.repository = new OrderRepository(prisma);
  }

  async getOrders(query: OrderQueryDto): Promise<PaginatedResponse<OrderWithDetails>> {
    const { page, limit, sortBy, sortOrder, ...filters } = query;

    return this.repository.findAll(filters, {
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  async getOrderById(id: string): Promise<OrderWithDetails> {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for product ${product.name}`, 400);
      }
    }

    const orderNumber = await this.repository.generateOrderNumber();

    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const shipping = 10;
    const total = subtotal + tax + shipping;

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId,
          subtotal,
          tax,
          shipping,
          total,
          status: 'PENDING',
          shippingAddressId: data.shippingAddressId,
          billingAddressId: data.billingAddressId,
          notes: data.notes,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          },
          payment: {
            create: {
              amount: total,
              method: data.paymentMethod,
              status: 'PENDING',
            },
          },
        },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    return order;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<Order> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return this.repository.update(id, data);
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return this.repository.updateStatus(id, data.status);
  }

  async updatePaymentStatus(id: string, data: UpdatePaymentStatusDto): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (!order.payment) {
      throw new AppError('Payment not found for this order', 404);
    }

    await this.prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        status: data.status,
        transactionId: data.transactionId,
        paidAt: data.status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    if (data.status === 'COMPLETED') {
      await this.repository.updateStatus(id, 'PROCESSING');
    }
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new AppError('Cannot cancel this order', 400);
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    });

    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    await this.repository.delete(id);
  }

  async getOrderStats(userId?: string) {
    return this.repository.getOrderStats(userId);
  }
}
