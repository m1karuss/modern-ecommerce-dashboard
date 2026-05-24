# Placeholder Images

This folder contains SVG placeholder images for the e-commerce dashboard.

## Available Placeholders

### 1. **product.svg** (400×400)
- Default product image placeholder
- Use for product cards, listings, and details
- Usage: `/placeholders/product.svg`

### 2. **avatar.svg** (200×200)
- User avatar placeholder
- Use for user profiles, comments, reviews
- Circular design
- Usage: `/placeholders/avatar.svg`

### 3. **image.svg** (800×600)
- General image placeholder
- Use for banners, featured images
- Usage: `/placeholders/image.svg`

### 4. **no-image.svg** (400×400)
- "No image available" indicator
- Use when image is missing or failed to load
- Usage: `/placeholders/no-image.svg`

### 5. **logo.svg** (200×60)
- Logo placeholder
- Use for brand/company logos
- Usage: `/placeholders/logo.svg`

## Usage Examples

### React Component
```tsx
import { useState } from 'react';

const ProductImage = ({ src, alt }: { src?: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src || '/placeholders/product.svg');

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc('/placeholders/no-image.svg')}
      className="w-full h-full object-cover"
    />
  );
};
```

### Direct HTML
```html
<img src="/placeholders/product.svg" alt="Product placeholder" />
```

### CSS Background
```css
.product-card {
  background-image: url('/placeholders/product.svg');
  background-size: cover;
}
```

## Customization

All placeholders are SVG files and can be easily customized:
- Colors can be changed by editing `fill` attributes
- Sizes are scalable without quality loss
- Can be converted to React components for dynamic styling

## Benefits

- ✅ Lightweight (SVG format)
- ✅ Scalable to any size
- ✅ No external dependencies
- ✅ Fast loading
- ✅ Consistent design
- ✅ Easy to customize
