# 🛍️ Modern E-Commerce Dashboard

A production-ready, full-stack e-commerce admin dashboard built with modern technologies and industry best practices. Features comprehensive product management, order tracking, analytics, and role-based access control.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.4-blue.svg)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./docs/CONTRIBUTING.md)

---

## 📸 Screenshots

<div align="center">

### Dashboard Overview
![Dashboard](./docs/screenshots/dashboard.png)
*Real-time analytics with revenue tracking, order statistics, and performance metrics*

### Product Management
![Products](./docs/screenshots/products.png)
*Full CRUD operations with advanced search, filters, and bulk actions*

### Order Management
![Orders](./docs/screenshots/orders.png)
*Track orders, update statuses, and manage customer shipments*

### Analytics & Insights
![Analytics](./docs/screenshots/analytics.png)
*Deep insights with interactive charts and top product performance*

</div>

---

## ✨ Features

### 📊 Advanced Analytics Dashboard
- **Real-time Metrics**: Revenue, orders, customers, conversion rates
- **Interactive Charts**: Sales trends, revenue by category, order distribution
- **Performance KPIs**: Average order value, customer growth, top products
- **Date Range Filters**: Custom date ranges for detailed analysis
- **Animated Widgets**: Smooth transitions with Framer Motion

### 📦 Product Management
- **Full CRUD Operations**: Create, read, update, delete products
- **Bulk Actions**: Update multiple products, bulk delete, status changes
- **Advanced Filtering**: Search, category, price range, stock status
- **Image Management**: Multiple images per product, drag-and-drop upload
- **Stock Tracking**: Real-time inventory, low stock alerts, stock history
- **SEO Optimization**: URL slugs, meta descriptions, structured data

### 🛒 Order Management
- **Order Tracking**: Real-time order status updates
- **Status Workflow**: Pending → Processing → Shipped → Delivered
- **Payment Processing**: Multiple payment methods, payment status tracking
- **Order History**: Complete customer order history
- **Invoice Generation**: Automatic invoice creation
- **Notifications**: Real-time order updates

### 👥 User & Role Management
- **Role-Based Access Control (RBAC)**: Super Admin, Admin, Manager, User roles
- **Permission System**: Granular permissions per role
- **User Activity Tracking**: Audit logs for all actions
- **Account Management**: Profile updates, password changes
- **Team Management**: Invite and manage team members

### 🔐 Authentication & Security
- **JWT Authentication**: Access and refresh token strategy
- **HTTP-Only Cookies**: Secure token storage
- **Password Security**: Bcrypt hashing with 12 rounds
- **Protected Routes**: Client and server-side route protection
- **Rate Limiting**: Prevent brute force attacks
- **Security Headers**: Helmet.js for HTTP security
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Zod schemas for type-safe validation

### 🎨 Modern UI/UX
- **Premium Design**: Clean, professional SaaS interface
- **Dark/Light Theme**: System preference detection, manual toggle
- **Responsive Layout**: Mobile-first design, works on all devices
- **Smooth Animations**: Framer Motion for delightful interactions
- **Loading States**: Skeleton loaders, progress indicators
- **Toast Notifications**: User-friendly feedback messages
- **Accessible Components**: WCAG 2.1 AA compliant
- **Keyboard Navigation**: Full keyboard support

---

## 🛠️ Technology Stack

### Frontend (Client)

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.3 |
| **TypeScript** | Type Safety | 5.4 |
| **Vite** | Build Tool | 5.2 |
| **TailwindCSS** | Styling | 3.4 |
| **Shadcn/ui** | Component Library | Latest |
| **React Query** | Server State | 5.36 |
| **Zustand** | Client State | 4.5 |
| **React Router** | Routing | 6.23 |
| **Framer Motion** | Animations | 11.2 |
| **Recharts** | Data Visualization | 2.12 |
| **React Hook Form** | Form Handling | 7.51 |
| **Zod** | Schema Validation | 3.23 |
| **Axios** | HTTP Client | 1.7 |

### Backend (Server)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 20.x |
| **Express.js** | Web Framework | 4.19 |
| **TypeScript** | Type Safety | 5.4 |
| **PostgreSQL** | Database | 16.x |
| **Prisma** | ORM | 5.14 |
| **JWT** | Authentication | 9.0 |
| **Bcrypt** | Password Hashing | 5.1 |
| **Zod** | Validation | 3.23 |
| **Winston** | Logging | 3.13 |
| **Helmet** | Security Headers | 7.1 |
| **CORS** | Cross-Origin | 2.8 |

### DevOps & Tools

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & load balancing |
| **GitHub Actions** | CI/CD pipeline |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest** | Testing framework |
| **Vitest** | Frontend testing |

---

## 📁 Project Structure

```
modern-ecommerce-dashboard/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── features/          # Feature modules (auth, products, orders, etc.)
│   │   ├── shared/            # Shared components, hooks, utilities
│   │   ├── store/             # Global state management (Zustand)
│   │   ├── router/            # Routing configuration
│   │   └── main.tsx           # Application entry point
│   ├── public/                # Static assets
│   └── package.json
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, products, orders, etc.)
│   │   ├── common/            # Shared middleware, utilities
│   │   ├── config/            # Configuration files
│   │   └── main.ts            # Application entry point
│   ├── prisma/                # Database schema & migrations
│   └── package.json
│
├── docker/                    # Docker configurations
├── docs/                      # Documentation
│   ├── API.md                 # API documentation
│   ├── ARCHITECTURE.md        # Architecture overview
│   └── CONTRIBUTING.md        # Contribution guidelines
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production environment
└── package.json               # Root workspace configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org))
- **PostgreSQL** 16.x ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker & Docker Compose** (optional, [Download](https://www.docker.com/products/docker-desktop))

### Installation

#### Option 1: Local Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/modern-ecommerce-dashboard.git
cd modern-ecommerce-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

**Server** (`server/.env`):
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce_dev?schema=public

# JWT Secrets (generate secure random strings for production)
JWT_ACCESS_SECRET=your-access-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Client** (`client/.env`):
```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

4. **Setup database**

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed
```

5. **Start development servers**

```bash
# From root directory
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/v1

#### Option 2: Docker Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/modern-ecommerce-dashboard.git
cd modern-ecommerce-dashboard
```

2. **Start with Docker Compose**

```bash
docker-compose up -d
```

3. **Run database migrations**

```bash
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma db seed
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 🔑 Default Credentials

After seeding the database, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | admin@ecommerce.com | Admin@123 |
| **Manager** | manager@ecommerce.com | Manager@123 |
| **User** | user@ecommerce.com | User@123 |

> ⚠️ **Important**: Change these credentials in production!

---

## 📚 Documentation

- **[API Documentation](./docs/API.md)** - Complete API reference with examples
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design and architecture
- **[Contributing Guidelines](./docs/CONTRIBUTING.md)** - How to contribute to the project
- **[Getting Started Guide](./GETTING_STARTED.md)** - Detailed setup instructions

---

## 🧪 Testing

### Run Tests

```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows (coming soon)

---

## 📦 Building for Production

### Build All

```bash
npm run build
```

### Build Individually

```bash
# Build server
npm run build:server

# Build client
npm run build:client
```

### Production Build Output

- **Server**: `server/dist/`
- **Client**: `client/dist/`

---

## 🚢 Deployment

### Docker Production Deployment

1. **Configure production environment**

Create `.env.production` in the root:

```env
# Database
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=ecommerce_prod

# Application
DATABASE_URL=postgresql://user:password@postgres:5432/ecommerce_prod?schema=public
JWT_ACCESS_SECRET=your-production-access-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CORS_ORIGIN=https://yourdomain.com
```

2. **Build and start production containers**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Run production migrations**

```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Setup PostgreSQL database**

3. **Run migrations**
```bash
cd server
npx prisma migrate deploy
```

4. **Start the server**
```bash
cd server
npm start
```

5. **Serve the client**
   - Use Nginx, Apache, or any static file server
   - Point to `client/dist/` directory

### Deployment Platforms

The application can be deployed to:

- **VPS**: DigitalOcean, Linode, AWS EC2
- **PaaS**: Heroku, Railway, Render
- **Serverless**: Vercel (frontend), AWS Lambda (backend)
- **Container**: AWS ECS, Google Cloud Run, Azure Container Instances

---

## 🔧 Configuration

### Environment Variables

#### Server Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_ACCESS_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `BCRYPT_ROUNDS` | Bcrypt hashing rounds | 12 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

#### Client Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api/v1 |

---

## 🏗️ Architecture

### System Overview

The application follows a **monorepo structure** with clear separation between client and server:

- **Client**: React SPA with modern state management
- **Server**: RESTful API with layered architecture
- **Database**: PostgreSQL with Prisma ORM

### Key Architectural Patterns

- **Feature-Based Organization**: Code organized by features, not layers
- **Layered Architecture**: Controller → Service → Repository
- **Repository Pattern**: Abstraction over data access
- **Dependency Injection**: Loose coupling between components
- **SOLID Principles**: Clean, maintainable code

For detailed architecture documentation, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## 🔒 Security

### Security Features

- ✅ **JWT Authentication** with access and refresh tokens
- ✅ **HTTP-Only Cookies** for secure token storage
- ✅ **Password Hashing** with bcrypt (12 rounds)
- ✅ **Rate Limiting** to prevent brute force attacks
- ✅ **Helmet.js** for security headers
- ✅ **CORS** configuration
- ✅ **Input Validation** with Zod schemas
- ✅ **SQL Injection Protection** via Prisma ORM
- ✅ **XSS Protection** via React and sanitization
- ✅ **CSRF Protection** via SameSite cookies

### Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Keep dependencies updated** regularly
5. **Review security advisories** for dependencies
6. **Implement proper logging** and monitoring
7. **Regular security audits** of code and dependencies

---

## ⚡ Performance

### Optimization Techniques

**Frontend**:
- Code splitting with React.lazy()
- Image lazy loading
- React Query caching
- Bundle size optimization
- Gzip compression

**Backend**:
- Database indexing
- Query optimization
- Connection pooling
- Response caching (planned)
- Efficient pagination

**Database**:
- Strategic indexes on frequently queried fields
- Optimized queries with Prisma
- Connection pooling

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./docs/CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the [Coding Standards](./docs/CONTRIBUTING.md#coding-standards)
- Write tests for new features
- Update documentation as needed
- Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📝 API Reference

Complete API documentation is available at [docs/API.md](./docs/API.md).

### Quick API Overview

**Base URL**: `http://localhost:5000/api/v1`

**Authentication**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

**Products**:
- `GET /products` - List products (with filters)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

**Orders**:
- `GET /orders` - List orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Update order status (Admin)

**Analytics**:
- `GET /analytics/dashboard` - Dashboard statistics (Admin)
- `GET /analytics/top-products` - Top selling products (Admin)
- `GET /analytics/sales-over-time` - Sales trends (Admin)

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

**Port Already in Use**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

**Prisma Client Not Generated**:
```bash
cd server
npx prisma generate
```

**Module Not Found**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Project Status

- ✅ Core Features Implemented
- ✅ Authentication & Authorization
- ✅ Product Management
- ✅ Order Management
- ✅ Analytics Dashboard
- ✅ Responsive UI
- ✅ Docker Support
- 🚧 Payment Integration (In Progress)
- 🚧 Email Notifications (Planned)
- 🚧 Advanced Analytics (Planned)

---

## 🗺️ Roadmap

### Version 2.0 (Q3 2026)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications (order confirmations, shipping updates)
- [ ] Advanced search with Elasticsearch
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

### Version 3.0 (Q4 2026)
- [ ] Multi-vendor support
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML insights
- [ ] Internationalization (i18n)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@m1karuss](https://github.com/m1karuss)

## 🙏 Acknowledgments

- Shadcn/ui for the beautiful component library
- Vercel for inspiration
- The open-source community

---

## 💬 Support

- **Documentation**: Check our [docs](./docs) folder
- **Issues**: [GitHub Issues](https://github.com/m1karuss/modern-ecommerce-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/m1karuss/modern-ecommerce-dashboard/discussions)
- **Email**: support@yourdomain.com

---

## ⭐ Show Your Support

If you find this project useful, please consider giving it a star on GitHub! It helps others discover the project and motivates continued development.

[![Star on GitHub](https://img.shields.io/github/stars/m1karuss/modern-ecommerce-dashboard?style=social)](https://github.com/m1karuss/modern-ecommerce-dashboard)

---

<div align="center">

**Built with ❤️ using modern web technologies**

[Report Bug](https://github.com/m1karuss/modern-ecommerce-dashboard/issues) · [Request Feature](https://github.com/m1karuss/modern-ecommerce-dashboard/issues) · [Documentation](./docs)

</div>
