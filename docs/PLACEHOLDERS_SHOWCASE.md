# 🎨 Placeholder Images Showcase

## 📦 What's Included

This project includes a complete placeholder image system with:

### ✅ 5 SVG Placeholders
```
client/public/placeholders/
├── 🖼️  product.svg    (400×400)  - Product images
├── 👤  avatar.svg     (200×200)  - User avatars  
├── 🌄  image.svg      (800×600)  - General images
├── ❌  no-image.svg   (400×400)  - Error fallback
└── 🏷️  logo.svg       (200×60)   - Brand logos
```

### ⚛️ React Components
```tsx
// Auto-fallback component
<ImageWithFallback 
  src={url} 
  fallback="product" 
  alt="Product" 
/>

// Advanced hook
const { imageSrc, isLoading, hasError } = usePlaceholder({
  src: url,
  fallback: 'product'
});
```

### 📚 Documentation
- **[Full Guide](./PLACEHOLDERS.md)** - Complete documentation with examples
- **[Quick Start](./PLACEHOLDERS_QUICK_START.md)** - Get started in 2 minutes

## 🚀 Quick Usage

```tsx
import { ImageWithFallback } from '@/shared/components';

// Product card
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
```

## ✨ Features

- 🎯 **Automatic Fallback** - Shows placeholder if image fails
- 🚀 **Lightweight** - SVG files are only 1-2KB each
- 📱 **Responsive** - Scales perfectly on all devices
- 💪 **TypeScript** - Full type safety
- ♿ **Accessible** - WCAG compliant
- 🎨 **Customizable** - Easy to modify colors and styles

## 📖 Learn More

- [Complete Documentation](./PLACEHOLDERS.md)
- [Quick Start Guide](./PLACEHOLDERS_QUICK_START.md)
- [Main README](../README.md)
