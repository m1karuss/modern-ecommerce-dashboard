import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';
import { hashPassword } from '../../common/utils/hash.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
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

  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      isActive: true,
    },
  });

  console.log('✅ Categories created');

  // Create products
  const products = [
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'Premium noise-cancelling wireless headphones',
      sku: 'WH-001',
      price: 299.99,
      comparePrice: 399.99,
      costPrice: 150.00,
      stock: 50,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: electronics.id,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
    },
    {
      name: 'Smart Watch',
      slug: 'smart-watch',
      description: 'Advanced fitness tracking smartwatch',
      sku: 'SW-001',
      price: 399.99,
      comparePrice: 499.99,
      costPrice: 200.00,
      stock: 30,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: electronics.id,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
    },
    {
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      description: 'Comfortable 100% cotton t-shirt',
      sku: 'TS-001',
      price: 29.99,
      stock: 100,
      status: ProductStatus.ACTIVE,
      categoryId: clothing.id,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('✅ Products created');
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
