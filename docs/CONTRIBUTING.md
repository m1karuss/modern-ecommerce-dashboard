# Contributing Guidelines

Thank you for considering contributing to Modern E-Commerce Dashboard! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Personal or political attacks
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 20.x or higher
- PostgreSQL 16.x
- Git
- A code editor (VS Code recommended)
- Docker & Docker Compose (optional)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/modern-ecommerce-dashboard.git
   cd modern-ecommerce-dashboard
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/modern-ecommerce-dashboard.git
   ```

### Setup Development Environment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables**:
   ```bash
   # Server
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   
   # Client
   cd ../client
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup database**:
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start development servers**:
   ```bash
   # From root directory
   npm run dev
   ```

---

## Development Workflow

### Branch Strategy

We use a simplified Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Keeping Your Branch Updated

```bash
# Fetch latest changes
git fetch upstream

# Rebase your branch
git rebase upstream/main
```

### Working on Your Feature

1. Make your changes
2. Test your changes locally
3. Commit your changes (see [Commit Guidelines](#commit-guidelines))
4. Push to your fork
5. Create a Pull Request

---

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Enable strict mode** in tsconfig.json
- **Define types** for all function parameters and return values
- **Avoid `any`** - use proper types or `unknown`
- **Use interfaces** for object shapes
- **Use enums** for fixed sets of values

**Example**:

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: UserRole;
}

function getUser(id: string): Promise<User> {
  return prisma.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUser(id: any): any {
  return prisma.user.findUnique({ where: { id } });
}
```

### Code Style

We use ESLint and Prettier for code formatting. Run before committing:

```bash
# Lint
npm run lint

# Fix linting issues
npm run lint:fix
```

### Naming Conventions

**Variables and Functions**:
```typescript
// camelCase
const userName = 'John';
function getUserById(id: string) { }
```

**Classes and Interfaces**:
```typescript
// PascalCase
class UserService { }
interface UserData { }
```

**Constants**:
```typescript
// UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

**Files**:
```typescript
// kebab-case for files
user-service.ts
auth-controller.ts

// PascalCase for React components
UserProfile.tsx
ProductCard.tsx
```

### File Organization

**Server**:
```
module-name/
├── module-name.controller.ts   # HTTP handlers
├── module-name.service.ts      # Business logic
├── module-name.repository.ts   # Data access
├── module-name.routes.ts       # Route definitions
├── module-name.dto.ts          # Data transfer objects
├── module-name.types.ts        # TypeScript types
└── module-name.test.ts         # Tests
```

**Client**:
```
feature-name/
├── components/                 # Feature components
├── hooks/                      # Custom hooks
├── api/                        # API calls
├── types/                      # TypeScript types
└── index.ts                    # Public exports
```

### React Best Practices

1. **Functional Components**: Use function components with hooks
2. **Custom Hooks**: Extract reusable logic into custom hooks
3. **Props Interface**: Define props interface for all components
4. **Avoid Prop Drilling**: Use context or state management
5. **Memoization**: Use `useMemo` and `useCallback` when needed

**Example**:

```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleClick = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);

  return (
    <div onClick={handleClick}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

// ❌ Bad
export function ProductCard(props: any) {
  return (
    <div onClick={() => props.onAddToCart(props.product.id)}>
      <h3>{props.product.name}</h3>
      <p>${props.product.price}</p>
    </div>
  );
}
```

### Backend Best Practices

1. **Layered Architecture**: Controller → Service → Repository
2. **Error Handling**: Use try-catch and custom error classes
3. **Validation**: Validate input with Zod schemas
4. **Async/Await**: Use async/await instead of callbacks
5. **Logging**: Log important events and errors

**Example**:

```typescript
// ✅ Good
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    return product;
  }
}

// ❌ Bad
export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
}
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

### Scope

The scope should be the name of the affected module:

- `auth`
- `products`
- `orders`
- `analytics`
- `ui`
- `api`

### Examples

```bash
# Feature
feat(products): add bulk delete functionality

# Bug fix
fix(auth): resolve token refresh issue

# Documentation
docs(api): update authentication endpoints

# Refactoring
refactor(orders): simplify order status logic

# Performance
perf(products): optimize product query with indexes

# Breaking change
feat(api)!: change product API response format

BREAKING CHANGE: Product API now returns nested category object
```

### Commit Message Rules

1. Use imperative mood ("add" not "added" or "adds")
2. Don't capitalize first letter
3. No period at the end
4. Keep subject line under 72 characters
5. Separate subject from body with blank line
6. Wrap body at 72 characters
7. Use body to explain what and why, not how

---

## Pull Request Process

### Before Creating a PR

1. **Update your branch** with latest main
2. **Run tests** and ensure they pass
3. **Run linter** and fix any issues
4. **Test manually** in development environment
5. **Update documentation** if needed

### Creating a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR** on GitHub from your fork to upstream `main`

3. **Fill out PR template** with:
   - Description of changes
   - Related issue number
   - Type of change (feature, bugfix, etc.)
   - Testing performed
   - Screenshots (for UI changes)

### PR Title Format

Follow the same format as commit messages:

```
feat(products): add bulk delete functionality
fix(auth): resolve token refresh issue
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Address feedback** and push updates
4. **Approval** from maintainer
5. **Merge** by maintainer

### After Merge

1. **Delete your branch**:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your local main**:
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Testing Guidelines

### Running Tests

```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test

# Run with coverage
npm run test:coverage
```

### Writing Tests

**Unit Tests**:
```typescript
describe('ProductService', () => {
  describe('getProduct', () => {
    it('should return product when found', async () => {
      const product = await productService.getProduct('123');
      expect(product).toBeDefined();
      expect(product.id).toBe('123');
    });

    it('should throw error when product not found', async () => {
      await expect(productService.getProduct('invalid'))
        .rejects.toThrow('Product not found');
    });
  });
});
```

**Integration Tests**:
```typescript
describe('POST /api/v1/products', () => {
  it('should create product with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        price: 99.99,
        stock: 10
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Product');
  });
});
```

### Test Coverage

- Aim for **80%+ code coverage**
- Focus on critical business logic
- Test edge cases and error scenarios
- Don't test third-party libraries

---

## Documentation

### Code Documentation

**JSDoc Comments**:
```typescript
/**
 * Retrieves a product by ID
 * @param id - The product ID
 * @returns The product object
 * @throws {AppError} When product is not found
 */
async getProduct(id: string): Promise<Product> {
  // Implementation
}
```

### API Documentation

When adding or modifying API endpoints:

1. Update `docs/API.md`
2. Include request/response examples
3. Document all parameters
4. List possible error codes

### README Updates

Update README.md when:

- Adding new features
- Changing setup process
- Modifying configuration
- Adding dependencies

---

## Questions?

If you have questions:

1. Check existing [documentation](./README.md)
2. Search [existing issues](https://github.com/m1karuss/modern-ecommerce-dashboard/issues)
3. Create a new issue with the `question` label
4. Join our community discussions

---

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Modern E-Commerce Dashboard! 🎉
