# 🖼️ Placeholder Images - Quick Start

## Installation

Placeholders are already included in the project! No installation needed.

## Quick Examples

### 1. Basic Usage

```tsx
import { ImageWithFallback } from '@/shared/components';

// Product image
<ImageWithFallback
  src={product.imageUrl}
  fallback="product"
  alt={product.name}
  className="w-full h-64 object-cover"
/>
```

### 2. User Avatar

```tsx
<ImageWithFallback
  src={user.avatar}
  fallback="avatar"
  alt={user.name}
  className="w-12 h-12 rounded-full"
/>
```

### 3. With Loading State

```tsx
import { usePlaceholder } from '@/shared/hooks';

const { imageSrc, isLoading } = usePlaceholder({
  src: imageUrl,
  fallback: 'product'
});

{isLoading ? <Skeleton /> : <img src={imageSrc} />}
```

## Available Placeholders

- `product` - Product images
- `avatar` - User avatars
- `image` - General images
- `logo` - Brand logos
- `no-image` - Error fallback

## Full Documentation

See [PLACEHOLDERS.md](./PLACEHOLDERS.md) for complete guide with advanced examples.
