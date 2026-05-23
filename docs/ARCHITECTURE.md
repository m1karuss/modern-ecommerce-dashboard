# Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Design Patterns](#design-patterns)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [API Design](#api-design)
9. [State Management](#state-management)
10. [Security](#security)
11. [Performance Optimization](#performance-optimization)
12. [Deployment Architecture](#deployment-architecture)

---

## Overview

Modern E-Commerce Dashboard is a full-stack web application built with a clear separation between client and server. The architecture follows industry best practices including:

- **Monorepo structure** with workspace management
- **Feature-based organization** for scalability
- **Layered architecture** for separation of concerns
- **Type-safe** end-to-end with TypeScript
- **RESTful API** design principles
- **Microservices-ready** architecture

### Key Principles

- **Separation of Concerns**: Clear boundaries between layers
- **DRY (Don't Repeat Yourself)**: Reusable components and utilities
- **SOLID Principles**: Clean, maintainable code
- **Security First**: Built-in security at every layer
- **Performance**: Optimized for speed and efficiency
- **Scalability**: Designed to grow with your business

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │ State Mgmt   │  │  API Client  │      │
│  │  Components  │  │   (Zustand)  │  │   (Axios)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Nginx      │  │ Rate Limiter │  │   CORS       │      │
│  │ Load Balance │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │   Services   │  │ Repositories │      │
│  │  (Routes)    │  │  (Business)  │  │  (Data)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Prisma ORM  │  │  File Store  │      │
│  │   Database   │  │              │  │   (Uploads)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client Request** → User interacts with React UI
2. **State Management** → Zustand manages local state
3. **API Call** → React Query handles server state & caching
4. **HTTP Request** → Axios sends request to backend
5. **API Gateway** → Nginx routes, rate limits, handles CORS
6. **Middleware** → Authentication, validation, logging
7. **Controller** → Receives request, validates input
8. **Service** → Business logic execution
9. **Repository** → Database operations via Prisma
10. **Database** → PostgreSQL stores/retrieves data
11. **Response** → Data flows back through layers
12. **UI Update** → React re-renders with new data

---

## Technology Stack

### Client (Frontend)

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18** | UI Library | Virtual DOM, hooks, component reusability |
| **TypeScript** | Type Safety | Catch errors at compile time, better DX |
| **Vite** | Build Tool | Fast HMR, optimized builds, modern tooling |
| **TailwindCSS** | Styling | Utility-first, rapid development, small bundle |
| **Shadcn/ui** | Components | Accessible, customizable, copy-paste friendly |
| **React Query** | Server State | Caching, background updates, optimistic UI |
| **Zustand** | Client State | Simple, performant, minimal boilerplate |
| **React Router** | Routing | Standard routing solution, code splitting |
| **Framer Motion** | Animations | Declarative animations, gesture support |
| **Recharts** | Charts | Composable, responsive, React-native |
| **React Hook Form** | Forms | Performance, validation, less re-renders |
| **Zod** | Validation | Type-safe schemas, runtime validation |

### Server (Backend)

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js** | Runtime | JavaScript everywhere, large ecosystem |
| **Express.js** | Web Framework | Minimal, flexible, battle-tested |
| **TypeScript** | Type Safety | Shared types with frontend, better DX |
| **PostgreSQL** | Database | ACID compliance, relations, performance |
| **Prisma** | ORM | Type-safe queries, migrations, great DX |
| **JWT** | Authentication | Stateless, scalable, standard |
| **Bcrypt** | Hashing | Industry standard, secure password hashing |
| **Zod** | Validation | Shared schemas with frontend |
| **Winston** | Logging | Flexible, transports, production-ready |
| **Helmet** | Security | HTTP headers security |
| **CORS** | Cross-Origin | Controlled resource sharing |

### DevOps

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy, load balancing |
| **GitHub Actions** | CI/CD pipeline |
| **PostgreSQL** | Production database |

---

## Project Structure

### Root Structure

```
modern-ecommerce-dashboard/
├── client/                 # Frontend application
├── server/                 # Backend application
├── docker/                 # Docker configurations
├── docs/                   # Documentation
├── .github/                # GitHub Actions workflows
├── docker-compose.yml      # Development compose
├── docker-compose.prod.yml # Production compose
├── package.json            # Root workspace config
└── README.md              # Project documentation
```

### Client Structure

```
client/
├── src/
│   ├── features/          # Feature modules
│   │   ├── auth/          # Authentication feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types/
│   │   ├── products/      # Products feature
│   │   ├── orders/        # Orders feature
│   │   ├── analytics/     # Analytics feature
│   │   └── users/         # Users feature
│   │
│   ├── shared/            # Shared resources
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Base UI components (shadcn)
│   │   │   ├── layout/    # Layout components
│   │   │   └── common/    # Common components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities & helpers
│   │   ├── types/         # TypeScript types
│   │   └── api/           # API client setup
│   │
│   ├── store/             # Global state (Zustand)
│   │   ├── auth.store.ts
│   │   ├── theme.store.ts
│   │   └── ui.store.ts
│   │
│   ├── router/            # Routing configuration
│   │   ├── index.tsx
│   │   ├── routes.tsx
│   │   └── guards/        # Route guards
│   │
│   ├── styles/            # Global styles
│   ├── assets/            # Static assets
│   ├── main.tsx           # Application entry
│   └── App.tsx            # Root component
│
├── public/                # Public assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

### Server Structure

```
server/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.dto.ts
│   │   │   └── auth.types.ts
│   │   ├── products/      # Products module
│   │   ├── orders/        # Orders module
│   │   ├── analytics/     # Analytics module
│   │   ├── users/         # Users module
│   │   ├── categories/    # Categories module
│   │   └── upload/        # File upload module
│   │
│   ├── common/            # Shared resources
│   │   ├── middleware/    # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── roles.middleware.ts
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   └── utils/         # Utility functions
│   │       ├── logger.util.ts
│   │       ├── hash.util.ts
│   │       ├── token.util.ts
│   │       ├── app-error.util.ts
│   │       └── async-handler.util.ts
│   │
│   ├── config/            # Configuration
│   │   └── app.config.ts
│   │
│   ├── database/          # Database related
│   │   └── seeds/         # Database seeds
│   │
│   └── main.ts            # Application entry
│
├── prisma/                # Prisma ORM
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed script
│
├── uploads/               # Uploaded files
├── logs/                  # Application logs
├── tsconfig.json          # TypeScript config
├── Dockerfile             # Docker image
└── package.json           # Dependencies
```

---

## Design Patterns

### 1. Layered Architecture (Server)

**Pattern**: Separation of concerns into distinct layers

```
Controller Layer (HTTP) → Service Layer (Business Logic) → Repository Layer (Data Access)
```

**Benefits**:
- Clear separation of concerns
- Easy to test each layer independently
- Business logic isolated from HTTP and database
- Reusable services across different controllers

**Example**:

```typescript
// Controller - Handles HTTP requests
export class ProductController {
  async getProducts(req: Request, res: Response) {
    const products = await productService.getProducts(req.query);
    res.json({ success: true, data: products });
  }
}

// Service - Business logic
export class ProductService {
  async getProducts(filters: ProductFilters) {
    const products = await productRepository.findMany(filters);
    return this.transformProducts(products);
  }
}

// Repository - Data access
export class ProductRepository {
  async findMany(filters: ProductFilters) {
    return prisma.product.findMany({ where: filters });
  }
}
```

### 2. Feature-Based Organization

**Pattern**: Organize code by features, not by technical layers

```
features/
  ├── auth/
  ├── products/
  └── orders/
```

**Benefits**:
- Related code stays together
- Easy to find and modify features
- Better scalability
- Clear feature boundaries

### 3. Repository Pattern

**Pattern**: Abstraction layer between business logic and data access

**Benefits**:
- Database-agnostic business logic
- Easy to swap data sources
- Centralized data access logic
- Easier testing with mocks

### 4. Dependency Injection

**Pattern**: Dependencies are provided rather than created

```typescript
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository
  ) {}
}
```

**Benefits**:
- Loose coupling
- Easy to test with mocks
- Flexible and maintainable

### 5. Middleware Pattern

**Pattern**: Chain of responsibility for request processing

```typescript
app.use(logger);
app.use(authenticate);
app.use(authorize);
app.use(routes);
app.use(errorHandler);
```

**Benefits**:
- Reusable request processing
- Clear request pipeline
- Easy to add/remove functionality

### 6. DTO (Data Transfer Object)

**Pattern**: Objects that carry data between processes

```typescript
export const createProductDto = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number()
});
```

**Benefits**:
- Type-safe data transfer
- Validation at boundaries
- Clear API contracts

### 7. Custom Hooks (Client)

**Pattern**: Reusable stateful logic

```typescript
export function useAuth() {
  const { user, setUser } = useAuthStore();
  const login = async (credentials) => { /* ... */ };
  return { user, login };
}
```

**Benefits**:
- Reusable logic
- Separation of concerns
- Easier testing

### 8. Compound Components

**Pattern**: Components that work together

```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Product</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Benefits**:
- Flexible composition
- Clear component relationships
- Better API design

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │   Product   │         │  Category   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id          │         │ id          │         │ id          │
│ email       │         │ name        │         │ name        │
│ password    │         │ slug        │         │ slug        │
│ firstName   │         │ description │         │ description │
│ lastName    │         │ price       │         │ createdAt   │
│ role        │         │ stock       │         │ updatedAt   │
│ createdAt   │         │ categoryId  │─────────│             │
│ updatedAt   │         │ createdAt   │         └─────────────┘
└─────────────┘         │ updatedAt   │
      │                 └─────────────┘
      │                       │
      │                       │
      ├───────────────────────┤
      │                       │
┌─────────────┐         ┌─────────────┐
│    Order    │         │  OrderItem  │
├─────────────┤         ├─────────────┤
│ id          │         │ id          │
│ orderNumber │         │ orderId     │─────────┐
│ userId      │─────────│ productId   │         │
│ status      │         │ quantity    │         │
│ total       │         │ price       │         │
│ createdAt   │         │ total       │         │
│ updatedAt   │         └─────────────┘         │
└─────────────┘                                  │
                                                 │
                                                 └─────────────┐
                                                               │
                                                         ┌─────────────┐
                                                         │   Product   │
                                                         └─────────────┘
```

### Key Entities

#### User
- Stores user account information
- Supports role-based access control (SUPER_ADMIN, ADMIN, MANAGER, USER)
- Password hashed with bcrypt

#### Product
- Core product information
- Linked to categories
- Tracks stock levels
- Supports multiple images

#### Category
- Product categorization
- Hierarchical structure support
- SEO-friendly slugs

#### Order
- Customer orders
- Status tracking (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Payment status tracking

#### OrderItem
- Individual items in an order
- Links orders to products
- Stores price at time of purchase

### Indexes

Strategic indexes for performance:

```prisma
@@index([email])           // User lookup
@@index([slug])            // Product/Category lookup
@@index([categoryId])      // Product filtering
@@index([userId])          // Order filtering
@@index([status])          // Order filtering
@@index([createdAt])       // Sorting
```

---

## Authentication & Authorization

### Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Generate JWT tokens (access + refresh)
   ↓
4. Store tokens in HTTP-only cookies
   ↓
5. Client includes cookies in requests
   ↓
6. Server validates token on protected routes
   ↓
7. Token expires → Use refresh token
   ↓
8. Get new access token
```

### Token Strategy

**Access Token**:
- Short-lived (15 minutes)
- Used for API requests
- Stored in HTTP-only cookie
- Contains user ID and role

**Refresh Token**:
- Long-lived (7 days)
- Used to get new access tokens
- Stored in HTTP-only cookie
- Rotated on each use

### Authorization (RBAC)

**Roles Hierarchy**:
```
SUPER_ADMIN (Full access)
    ↓
ADMIN (Manage products, orders, users)
    ↓
MANAGER (Manage products, orders)
    ↓
USER (View own orders)
```

**Implementation**:

```typescript
// Middleware
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
};

// Usage
router.delete('/products/:id', 
  authenticate, 
  authorize('SUPER_ADMIN', 'ADMIN'), 
  deleteProduct
);
```

---

## API Design

### RESTful Principles

- **Resource-based URLs**: `/products`, `/orders`
- **HTTP methods**: GET, POST, PUT, PATCH, DELETE
- **Stateless**: Each request contains all needed information
- **Consistent responses**: Standard format for all endpoints

### URL Structure

```
/api/v1/{resource}/{id?}/{action?}

Examples:
GET    /api/v1/products              # List products
GET    /api/v1/products/:id          # Get product
POST   /api/v1/products              # Create product
PUT    /api/v1/products/:id          # Update product
DELETE /api/v1/products/:id          # Delete product
PATCH  /api/v1/products/:id/stock    # Update stock
POST   /api/v1/products/bulk-delete  # Bulk action
```

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error**:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

### Versioning

- URL-based versioning: `/api/v1/`
- Allows breaking changes without affecting existing clients
- Clear migration path for clients

---

## State Management

### Client State (Zustand)

**Purpose**: UI state, theme, temporary data

```typescript
// Theme store
export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme })
}));
```

**When to use**:
- UI state (modals, sidebars)
- Theme preferences
- Temporary form data
- Client-only data

### Server State (React Query)

**Purpose**: Server data, caching, synchronization

```typescript
// Products query
export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**Features**:
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Pagination support

**When to use**:
- API data
- Database records
- Any server-sourced data

---

## Security

### Security Layers

1. **Network Layer**
   - HTTPS only in production
   - CORS configuration
   - Rate limiting

2. **Application Layer**
   - Input validation (Zod)
   - SQL injection protection (Prisma)
   - XSS protection (Helmet)
   - CSRF protection

3. **Authentication Layer**
   - JWT tokens
   - HTTP-only cookies
   - Secure password hashing (bcrypt)
   - Token rotation

4. **Authorization Layer**
   - Role-based access control
   - Resource-level permissions
   - Route guards

### Security Best Practices

```typescript
// 1. Input Validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// 2. Password Hashing
const hash = await bcrypt.hash(password, 12);

// 3. SQL Injection Prevention (Prisma)
await prisma.user.findUnique({ where: { email } });

// 4. XSS Prevention (Helmet)
app.use(helmet());

// 5. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

---

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
   ```typescript
   const Dashboard = lazy(() => import('./features/dashboard'));
   ```

2. **Image Optimization**
   - Lazy loading
   - Responsive images
   - WebP format

3. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Gzip compression

4. **Caching Strategy**
   - React Query caching
   - Service worker (future)
   - CDN for static assets

### Backend Optimizations

1. **Database Indexing**
   ```prisma
   @@index([email])
   @@index([slug])
   ```

2. **Query Optimization**
   - Select only needed fields
   - Use pagination
   - Avoid N+1 queries

3. **Caching**
   - Response caching (future)
   - Database query caching

4. **Connection Pooling**
   - Prisma connection pool
   - Reuse database connections

---

## Deployment Architecture

### Development Environment

```
Docker Compose
├── PostgreSQL (port 5432)
├── Backend (port 5000)
└── Frontend (port 3000)
```

### Production Environment

```
                    ┌─────────────┐
                    │   Nginx     │
                    │ (Port 80/443)│
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        ┌─────▼─────┐           ┌──────▼──────┐
        │  Frontend │           │   Backend   │
        │ Container │           │  Container  │
        └───────────┘           └──────┬──────┘
                                       │
                                ┌──────▼──────┐
                                │ PostgreSQL  │
                                │  Container  │
                                └─────────────┘
```

### CI/CD Pipeline

```
1. Push to GitHub
   ↓
2. GitHub Actions triggered
   ↓
3. Run tests
   ↓
4. Build Docker images
   ↓
5. Push to registry
   ↓
6. Deploy to server
   ↓
7. Run migrations
   ↓
8. Health check
```

### Scaling Strategy

**Horizontal Scaling**:
- Multiple backend instances
- Load balancer (Nginx)
- Stateless architecture

**Database Scaling**:
- Read replicas
- Connection pooling
- Query optimization

**Caching Layer** (Future):
- Redis for session storage
- API response caching
- Database query caching

---

## Monitoring & Logging

### Logging Strategy

**Levels**:
- `error`: Application errors
- `warn`: Warning messages
- `info`: General information
- `debug`: Debug information

**Implementation**:
```typescript
logger.info('User logged in', { userId, email });
logger.error('Database error', { error, query });
```

### Health Checks

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

---

## Future Enhancements

1. **Microservices Architecture**
   - Split into independent services
   - Event-driven communication
   - Service mesh

2. **Caching Layer**
   - Redis integration
   - Response caching
   - Session storage

3. **Real-time Features**
   - WebSocket support
   - Live notifications
   - Real-time analytics

4. **Advanced Analytics**
   - Machine learning insights
   - Predictive analytics
   - Customer behavior tracking

5. **Mobile App**
   - React Native app
   - Shared business logic
   - Offline support

---

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable e-commerce platform. The clear separation of concerns, type safety, and modern tooling make it easy to develop, test, and deploy new features.

For questions or suggestions, please open an issue on GitHub.
