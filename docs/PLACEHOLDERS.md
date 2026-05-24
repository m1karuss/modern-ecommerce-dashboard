# Placeholder Images - Usage Guide

## Overview

The project includes a comprehensive placeholder image system with SVG placeholders and React utilities for seamless integration.

## Available Placeholders

Located in `client/public/placeholders/`:

1. **product.svg** - Product images (400×400)
2. **avatar.svg** - User avatars (200×200)
3. **image.svg** - General images (800×600)
4. **no-image.svg** - Error fallback (400×400)
5. **logo.svg** - Brand logos (200×60)

## Usage Methods

### Method 1: ImageWithFallback Component (Recommended)

The easiest way to use placeholders with automatic fallback:

```tsx
import { ImageWithFallback } from '@/shared/components';

// Product image with automatic fallback
<ImageWithFallback
  src={product.imageUrl}
  fallback="product"
  alt={product.name}
  className="w-full h-64 object-cover rounded-lg"
/>

// User avatar
<ImageWithFallback
  src={user.avatar}
  fallback="avatar"
  alt={user.name}
  className="w-12 h-12 rounded-full"
/>

// Without src (uses fallback immediately)
<ImageWithFallback
  fallback="product"
  alt="Product placeholder"
  className="w-full h-full"
/>
```

### Method 2: usePlaceholder Hook

For more control over loading states:

```tsx
import { usePlaceholder } from '@/shared/hooks';

function ProductCard({ product }) {
  const { imageSrc, isLoading, hasError } = usePlaceholder({
    src: product.imageUrl,
    fallback: 'product'
  });

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      {hasError && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
          Failed to load
        </div>
      )}
    </div>
  );
}
```

### Method 3: Direct Usage

Simple direct usage without utilities:

```tsx
// In JSX
<img src="/placeholders/product.svg" alt="Product" />

// With fallback
<img
  src={imageUrl || '/placeholders/product.svg'}
  alt="Product"
  onError={(e) => {
    e.currentTarget.src = '/placeholders/no-image.svg';
  }}
/>
```

## Real-World Examples

### Product Card Component

```tsx
import { ImageWithFallback } from '@/shared/components';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <ImageWithFallback
          src={product.imageUrl}
          fallback="product"
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-lg font-bold">${product.price}</p>
      </div>
    </Card>
  );
}
```

### User Avatar Component

```tsx
import { ImageWithFallback } from '@/shared/components';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('relative', sizeClasses[size])}>
      <ImageWithFallback
        src={src}
        fallback="avatar"
        alt={name}
        className="w-full h-full rounded-full object-cover ring-2 ring-white"
      />
    </div>
  );
}
```

### Product Gallery with Loading States

```tsx
import { usePlaceholder } from '@/shared/hooks';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const { imageSrc, isLoading } = usePlaceholder({
    src: selectedImage,
    fallback: 'product'
  });

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <img
            src={imageSrc}
            alt="Product"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className="aspect-square rounded border-2 hover:border-primary"
          >
            <ImageWithFallback
              src={img}
              fallback="product"
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Order Item with Fallback

```tsx
import { ImageWithFallback } from '@/shared/components';

interface OrderItemProps {
  item: {
    productName: string;
    imageUrl?: string;
    quantity: number;
    price: number;
  };
}

export function OrderItem({ item }: OrderItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <ImageWithFallback
        src={item.imageUrl}
        fallback="product"
        alt={item.productName}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h4 className="font-medium">{item.productName}</h4>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
      </div>
      <p className="font-bold">${item.price * item.quantity}</p>
    </div>
  );
}
```

## Best Practices

1. **Always provide alt text** for accessibility
2. **Use appropriate fallback** based on context (product, avatar, etc.)
3. **Add loading states** for better UX
4. **Handle errors gracefully** with no-image fallback
5. **Optimize image sizes** before uploading
6. **Use lazy loading** for images below the fold

## Styling Tips

```tsx
// Aspect ratio container
<div className="aspect-square">
  <ImageWithFallback ... className="w-full h-full object-cover" />
</div>

// Rounded corners
<ImageWithFallback ... className="rounded-lg" />

// Circular avatar
<ImageWithFallback ... className="rounded-full" />

// Hover effects
<ImageWithFallback ... className="hover:scale-105 transition-transform" />

// With border
<ImageWithFallback ... className="border-2 border-gray-200" />
```

## TypeScript Support

All components and hooks are fully typed:

```tsx
import type { PlaceholderType } from '@/shared/types';

const fallback: PlaceholderType = 'product'; // ✅ Type-safe
const invalid: PlaceholderType = 'invalid'; // ❌ Type error
```

## Performance Considerations

- SVG placeholders are lightweight (~1-2KB each)
- No external dependencies required
- Cached by browser after first load
- Scalable without quality loss
- Fast rendering on all devices

## Troubleshooting

**Images not showing?**
- Check that files exist in `client/public/placeholders/`
- Verify Vite is serving the public folder
- Check browser console for 404 errors

**Fallback not working?**
- Ensure `onError` handler is properly set
- Check that no-image.svg exists
- Verify image paths are correct

**TypeScript errors?**
- Make sure types are properly imported
- Check that PlaceholderType is defined
- Verify component props match interface
