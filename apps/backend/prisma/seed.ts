import { PrismaClient, UserRole, ProductStatus, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { hashPassword } from '../src/common/utils/hash.util';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Starting database seed...');

  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  });
  console.log('✅ Admin user:', admin.email);

  // ── Sample customers ────────────────────────────────────────────────────────
  const customerNames = [
    { first: 'John', last: 'Doe', email: 'john.doe@example.com' },
    { first: 'Jane', last: 'Smith', email: 'jane.smith@example.com' },
    { first: 'Bob', last: 'Johnson', email: 'bob.j@example.com' },
    { first: 'Alice', last: 'Brown', email: 'alice.b@example.com' },
    { first: 'Charlie', last: 'Wilson', email: 'charlie.w@example.com' },
  ];

  const customerPassword = await hashPassword('Customer@123');
  const customers = [];
  for (const { first, last, email } of customerNames) {
    const c = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: customerPassword,
        firstName: first,
        lastName: last,
        role: UserRole.USER,
        emailVerified: true,
      },
    });
    customers.push(c);
  }
  console.log(`✅ ${customers.length} customers created`);

  // ── Categories ──────────────────────────────────────────────────────────────
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', isActive: true },
  });
  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel', isActive: true },
  });
  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: { name: 'Sports', slug: 'sports', description: 'Sports equipment', isActive: true },
  });
  console.log('✅ Categories created');

  // ── Products ────────────────────────────────────────────────────────────────
  const productDefs = [
    { name: 'Wireless Headphones', slug: 'wireless-headphones', sku: 'WH-001', price: 299.99, comparePrice: 399.99, costPrice: 150.0, stock: 50, categoryId: electronics.id, isFeatured: true },
    { name: 'Smart Watch', slug: 'smart-watch', sku: 'SW-001', price: 399.99, comparePrice: 499.99, costPrice: 200.0, stock: 30, categoryId: electronics.id, isFeatured: true },
    { name: 'Laptop Stand', slug: 'laptop-stand', sku: 'LS-001', price: 49.99, stock: 80, categoryId: electronics.id },
    { name: 'Cotton T-Shirt', slug: 'cotton-t-shirt', sku: 'TS-001', price: 29.99, stock: 100, categoryId: clothing.id },
    { name: 'Denim Jeans', slug: 'denim-jeans', sku: 'DJ-001', price: 79.99, comparePrice: 99.99, stock: 60, categoryId: clothing.id },
    { name: 'Running Shoes', slug: 'running-shoes', sku: 'RS-001', price: 129.99, comparePrice: 159.99, costPrice: 65.0, stock: 40, categoryId: sports.id, isFeatured: true },
    { name: 'Yoga Mat', slug: 'yoga-mat', sku: 'YM-001', price: 39.99, stock: 70, categoryId: sports.id },
  ];

  const products = [];
  for (const p of productDefs) {
    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        description: `High quality ${p.name}`,
        status: ProductStatus.ACTIVE,
        images: [],
        isFeatured: p.isFeatured ?? false,
      },
    });
    products.push(prod);
  }
  console.log(`✅ ${products.length} products created`);

  // ── Orders ──────────────────────────────────────────────────────────────────
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  const statuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'CANCELLED'];
  const payMethods: PaymentMethod[] = ['CREDIT_CARD', 'PAYPAL', 'STRIPE', 'DEBIT_CARD'];

  let orderIndex = 1;
  const existingOrderCount = await prisma.order.count();

  if (existingOrderCount < 20) {
    for (let i = 0; i < 30; i++) {
      const customer = customers[randomInt(0, customers.length - 1)];
      const itemCount = randomInt(1, 3);
      const selectedProducts = [...products].sort(() => Math.random() - 0.5).slice(0, itemCount);
      const orderDate = randomDate(sixMonthsAgo, now);

      const items = selectedProducts.map((p) => {
        const qty = randomInt(1, 3);
        return { productId: p.id, quantity: qty, price: p.price, total: p.price * qty };
      });

      const subtotal = items.reduce((s, it) => s + it.total, 0);
      const tax = subtotal * 0.1;
      const shipping = 9.99;
      const total = subtotal + tax + shipping;
      const status = statuses[randomInt(0, statuses.length - 1)];
      const payStatus: PaymentStatus = status === 'DELIVERED' ? 'COMPLETED' : status === 'CANCELLED' ? 'FAILED' : 'PENDING';

      const orderNumber = `ORD-${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}-${String(orderIndex++).padStart(4, '0')}`;

      await prisma.order.create({
        data: {
          orderNumber,
          userId: customer.id,
          subtotal,
          tax,
          shipping,
          total,
          status,
          createdAt: orderDate,
          updatedAt: orderDate,
          items: { create: items },
          payment: {
            create: {
              amount: total,
              method: payMethods[randomInt(0, payMethods.length - 1)],
              status: payStatus,
              paidAt: payStatus === 'COMPLETED' ? orderDate : undefined,
            },
          },
        },
      });
    }
    console.log('✅ 30 sample orders created');
  } else {
    console.log(`⏭️  Orders already exist (${existingOrderCount}), skipping`);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
