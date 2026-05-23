# API Documentation

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security.

### Authentication Flow

1. **Register** or **Login** to receive access and refresh tokens
2. Access token is valid for 15 minutes
3. Refresh token is valid for 7 days
4. Use the refresh endpoint to get a new access token when it expires

### Headers

```http
Content-Type: application/json
Cookie: accessToken=<token>; refreshToken=<token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

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

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules:**
- `email`: Valid email format (required)
- `password`: Min 8 characters, must contain uppercase, lowercase, and number (required)
- `firstName`: Min 2 characters (optional)
- `lastName`: Min 2 characters (optional)

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "2026-05-23T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

---

### Login

Authenticate and receive tokens.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Access:** Public (requires refresh token in cookie)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Token refreshed successfully"
}
```

---

### Logout

Invalidate current session.

**Endpoint:** `POST /auth/logout`

**Access:** Protected

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Logout All Devices

Invalidate all sessions for the user.

**Endpoint:** `POST /auth/logout-all`

**Access:** Protected

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

---

### Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Access:** Protected

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2026-05-23T10:00:00.000Z",
    "updatedAt": "2026-05-23T10:00:00.000Z"
  }
}
```

---

### Update Profile

Update user profile information.

**Endpoint:** `PATCH /auth/me/profile`

**Access:** Protected

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "USER"
  },
  "message": "Profile updated successfully"
}
```

---

### Change Password

Change user password.

**Endpoint:** `PATCH /auth/me/password`

**Access:** Protected

**Request Body:**

```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Product Endpoints

### Get Products

Retrieve a list of products with filtering, sorting, and pagination.

**Endpoint:** `GET /products`

**Access:** Public

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Items per page | 10 |
| search | string | Search in name/description | - |
| category | string | Filter by category ID | - |
| status | string | Filter by status (ACTIVE/INACTIVE) | - |
| minPrice | number | Minimum price | - |
| maxPrice | number | Maximum price | - |
| inStock | boolean | Filter in-stock products | - |
| sortBy | string | Sort field (name, price, createdAt) | createdAt |
| sortOrder | string | Sort order (asc, desc) | desc |

**Example Request:**

```
GET /products?page=1&limit=20&category=electronics&minPrice=100&maxPrice=1000&sortBy=price&sortOrder=asc
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Wireless Headphones",
        "slug": "wireless-headphones",
        "description": "High-quality wireless headphones",
        "price": 299.99,
        "compareAtPrice": 399.99,
        "costPrice": 150.00,
        "sku": "WH-001",
        "barcode": "1234567890123",
        "stock": 50,
        "lowStockThreshold": 10,
        "status": "ACTIVE",
        "images": ["url1", "url2"],
        "category": {
          "id": "uuid",
          "name": "Electronics",
          "slug": "electronics"
        },
        "createdAt": "2026-05-23T10:00:00.000Z",
        "updatedAt": "2026-05-23T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### Get Product by ID

Retrieve a single product by ID.

**Endpoint:** `GET /products/:id`

**Access:** Public

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 299.99,
    "compareAtPrice": 399.99,
    "costPrice": 150.00,
    "sku": "WH-001",
    "barcode": "1234567890123",
    "stock": 50,
    "lowStockThreshold": 10,
    "status": "ACTIVE",
    "images": ["url1", "url2"],
    "category": {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics"
    },
    "createdAt": "2026-05-23T10:00:00.000Z",
    "updatedAt": "2026-05-23T10:00:00.000Z"
  }
}
```

---

### Get Product by Slug

Retrieve a single product by slug.

**Endpoint:** `GET /products/slug/:slug`

**Access:** Public

**Response:** `200 OK` (same as Get Product by ID)

---

### Create Product

Create a new product.

**Endpoint:** `POST /products`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Request Body:**

```json
{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 299.99,
  "compareAtPrice": 399.99,
  "costPrice": 150.00,
  "sku": "WH-001",
  "barcode": "1234567890123",
  "stock": 50,
  "lowStockThreshold": 10,
  "categoryId": "uuid",
  "images": ["url1", "url2"],
  "status": "ACTIVE"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones",
    "price": 299.99,
    "stock": 50,
    "status": "ACTIVE",
    "createdAt": "2026-05-23T10:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

---

### Update Product

Update an existing product.

**Endpoint:** `PUT /products/:id`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Request Body:** (all fields optional)

```json
{
  "name": "Updated Product Name",
  "price": 349.99,
  "stock": 75,
  "status": "ACTIVE"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Product Name",
    "price": 349.99,
    "stock": 75,
    "updatedAt": "2026-05-23T11:00:00.000Z"
  },
  "message": "Product updated successfully"
}
```

---

### Delete Product

Delete a product.

**Endpoint:** `DELETE /products/:id`

**Access:** Protected (SUPER_ADMIN, ADMIN)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Bulk Delete Products

Delete multiple products at once.

**Endpoint:** `POST /products/bulk-delete`

**Access:** Protected (SUPER_ADMIN, ADMIN)

**Request Body:**

```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  },
  "message": "Products deleted successfully"
}
```

---

### Bulk Update Product Status

Update status for multiple products.

**Endpoint:** `POST /products/bulk-update-status`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Request Body:**

```json
{
  "ids": ["uuid1", "uuid2"],
  "status": "INACTIVE"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "updatedCount": 2
  },
  "message": "Product status updated successfully"
}
```

---

### Update Product Stock

Update product stock quantity.

**Endpoint:** `PATCH /products/:id/stock`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Request Body:**

```json
{
  "stock": 100
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "stock": 100
  },
  "message": "Stock updated successfully"
}
```

---

### Get Low Stock Products

Get products with stock below threshold.

**Endpoint:** `GET /products/low-stock`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "stock": 5,
      "lowStockThreshold": 10,
      "status": "ACTIVE"
    }
  ]
}
```

---

## Order Endpoints

### Get Orders

Retrieve orders with filtering and pagination.

**Endpoint:** `GET /orders`

**Access:** Protected

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | Filter by order status |
| paymentStatus | string | Filter by payment status |
| userId | string | Filter by user ID (admin only) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-2026-001",
        "status": "PROCESSING",
        "paymentStatus": "PAID",
        "total": 599.98,
        "subtotal": 499.98,
        "tax": 50.00,
        "shipping": 50.00,
        "user": {
          "id": "uuid",
          "email": "user@example.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "items": [
          {
            "id": "uuid",
            "productId": "uuid",
            "productName": "Wireless Headphones",
            "quantity": 2,
            "price": 299.99,
            "total": 599.98
          }
        ],
        "shippingAddress": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "country": "USA"
        },
        "createdAt": "2026-05-23T10:00:00.000Z",
        "updatedAt": "2026-05-23T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

### Get Order by ID

Retrieve a single order.

**Endpoint:** `GET /orders/:id`

**Access:** Protected

**Response:** `200 OK` (same structure as order in list)

---

### Create Order

Create a new order.

**Endpoint:** `POST /orders`

**Access:** Protected

**Request Body:**

```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "CREDIT_CARD"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2026-001",
    "status": "PENDING",
    "total": 599.98
  },
  "message": "Order created successfully"
}
```

---

### Update Order Status

Update order status.

**Endpoint:** `PATCH /orders/:id/status`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Request Body:**

```json
{
  "status": "SHIPPED"
}
```

**Valid statuses:** `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "SHIPPED"
  },
  "message": "Order status updated successfully"
}
```

---

### Update Payment Status

Update payment status.

**Endpoint:** `PATCH /orders/:id/payment`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Request Body:**

```json
{
  "paymentStatus": "PAID"
}
```

**Valid statuses:** `PENDING`, `PAID`, `FAILED`, `REFUNDED`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "paymentStatus": "PAID"
  },
  "message": "Payment status updated successfully"
}
```

---

### Cancel Order

Cancel an order.

**Endpoint:** `POST /orders/:id/cancel`

**Access:** Protected

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

### Get Order Statistics

Get order statistics.

**Endpoint:** `GET /orders/stats`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "totalOrders": 1250,
    "pendingOrders": 45,
    "processingOrders": 120,
    "shippedOrders": 890,
    "deliveredOrders": 180,
    "cancelledOrders": 15,
    "totalRevenue": 125000.00,
    "averageOrderValue": 100.00
  }
}
```

---

## Analytics Endpoints

### Get Dashboard Statistics

Get comprehensive dashboard statistics.

**Endpoint:** `GET /analytics/dashboard`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Start date (ISO 8601) |
| endDate | string | End date (ISO 8601) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 125000.00,
      "change": 15.5,
      "trend": "up"
    },
    "orders": {
      "total": 1250,
      "change": 8.2,
      "trend": "up"
    },
    "customers": {
      "total": 450,
      "change": 12.3,
      "trend": "up"
    },
    "products": {
      "total": 320,
      "lowStock": 15,
      "outOfStock": 3
    },
    "conversionRate": 3.5,
    "averageOrderValue": 100.00
  }
}
```

---

### Get Revenue by Category

Get revenue breakdown by product category.

**Endpoint:** `GET /analytics/revenue-by-category`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "categoryId": "uuid",
      "categoryName": "Electronics",
      "revenue": 45000.00,
      "percentage": 36.0,
      "orderCount": 450
    },
    {
      "categoryId": "uuid",
      "categoryName": "Clothing",
      "revenue": 35000.00,
      "percentage": 28.0,
      "orderCount": 700
    }
  ]
}
```

---

### Get Top Products

Get best-selling products.

**Endpoint:** `GET /analytics/top-products`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| limit | number | Number of products | 10 |
| period | string | Time period (7d, 30d, 90d, 1y) | 30d |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "productId": "uuid",
      "productName": "Wireless Headphones",
      "totalSold": 250,
      "revenue": 74997.50,
      "averageRating": 4.5
    }
  ]
}
```

---

### Get Sales Over Time

Get sales data over time for charts.

**Endpoint:** `GET /analytics/sales-over-time`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Start date (ISO 8601) |
| endDate | string | End date (ISO 8601) |
| interval | string | Data interval (day, week, month) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-05-01",
      "revenue": 5000.00,
      "orders": 50,
      "customers": 35
    },
    {
      "date": "2026-05-02",
      "revenue": 6200.00,
      "orders": 62,
      "customers": 42
    }
  ]
}
```

---

### Get Order Status Distribution

Get distribution of orders by status.

**Endpoint:** `GET /analytics/order-status`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "status": "PENDING",
      "count": 45,
      "percentage": 3.6
    },
    {
      "status": "PROCESSING",
      "count": 120,
      "percentage": 9.6
    },
    {
      "status": "SHIPPED",
      "count": 890,
      "percentage": 71.2
    },
    {
      "status": "DELIVERED",
      "count": 180,
      "percentage": 14.4
    },
    {
      "status": "CANCELLED",
      "count": 15,
      "percentage": 1.2
    }
  ]
}
```

---

### Get Customer Growth

Get customer growth over time.

**Endpoint:** `GET /analytics/customer-growth`

**Access:** Protected (SUPER_ADMIN, ADMIN, MANAGER)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Start date (ISO 8601) |
| endDate | string | End date (ISO 8601) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-05-01",
      "newCustomers": 12,
      "totalCustomers": 438
    },
    {
      "date": "2026-05-02",
      "newCustomers": 8,
      "totalCustomers": 446
    }
  ]
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Default:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP

When rate limit is exceeded, you'll receive:

```json
{
  "success": false,
  "error": {
    "message": "Too many requests, please try again later",
    "statusCode": 429
  }
}
```

---

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

---

## Filtering and Sorting

Most list endpoints support:

- **Filtering:** Use query parameters to filter results
- **Sorting:** Use `sortBy` and `sortOrder` parameters
- **Search:** Use `search` parameter for text search

Example:
```
GET /products?search=headphones&category=electronics&sortBy=price&sortOrder=asc
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** - tokens are in HTTP-only cookies
3. **Handle token expiration** - use refresh token endpoint
4. **Implement retry logic** for failed requests
5. **Respect rate limits** - implement exponential backoff
6. **Validate input** on client side before sending
7. **Handle errors gracefully** - check error codes and messages

---

## Postman Collection

Import our Postman collection for easy API testing:

[Download Postman Collection](./postman_collection.json)

---

## Support

For API support or questions:
- GitHub Issues: [github.com/yourusername/modern-ecommerce-dashboard/issues](https://github.com/yourusername/modern-ecommerce-dashboard/issues)
- Email: support@yourdomain.com
