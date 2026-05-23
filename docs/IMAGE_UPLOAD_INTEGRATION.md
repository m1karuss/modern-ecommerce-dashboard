# Image Upload Integration

## Overview
Successfully integrated the image upload module in the frontend, connecting it to the existing multer backend.

## Implementation Details

### Backend (Already Existed)
- **Upload endpoints**: `/api/v1/upload/image` (single) and `/api/v1/upload/images` (multiple)
- **Multer configuration**: Located in `apps/backend/src/common/utils/upload.util.ts`
- **Storage**: Files stored in `apps/backend/uploads/` directory
- **Static serving**: Configured in `apps/backend/src/main.ts` at `/uploads` path
- **Authentication**: Requires ADMIN or MANAGER role
- **File limits**: Max 10 images per request, 5MB per file

### Frontend (New Implementation)

#### 1. ImageUpload Component (`apps/frontend/src/shared/components/ImageUpload.tsx`)
- **Drag & drop support**: Users can drag images directly into the upload area
- **File browser**: Click to browse and select multiple files
- **Image preview**: Grid display of uploaded images with remove buttons
- **Progress indicator**: Loading spinner during upload
- **Validation**: Accepts only image files, enforces max file count
- **Props**:
  - `value`: Array of image URLs
  - `onChange`: Callback when images change
  - `maxFiles`: Maximum number of images (default: 5)
  - `disabled`: Disable upload functionality

#### 2. Product Form Integration (`apps/frontend/src/pages/Products/ProductsPage.tsx`)
- Added `images` field to product schema (Zod validation)
- Integrated ImageUpload component at the top of ProductFormFields
- Updated create form default values to include empty images array
- Updated edit form to load existing product images
- Images are sent to backend API during product creation/update

#### 3. Configuration Updates
- **Vite proxy** (`apps/frontend/vite.config.ts`): Added `/uploads` proxy to backend
- **API types** (`apps/frontend/src/pages/Products/api/products.api.ts`): Already supported images field
- **Backend DTO** (`apps/backend/src/modules/products/products.dto.ts`): Already supported images array

## Features

### User Experience
1. **Visual feedback**: Drag-over state changes border color
2. **Preview grid**: Shows all uploaded images in a 5-column grid
3. **Easy removal**: Hover over image to reveal delete button
4. **Progress indication**: Spinner shows during upload
5. **File count display**: Shows current/max images (e.g., "2 / 5 images")
6. **Error handling**: Alert on upload failure

### Technical Features
1. **Multiple file upload**: Batch upload multiple images at once
2. **Automatic slicing**: Respects maxFiles limit when uploading
3. **Token authentication**: Uses localStorage accessToken for API calls
4. **Relative URLs**: Uses proxy-friendly `/api/v1` paths
5. **Type safety**: Full TypeScript support with Zod validation

## Usage Example

```tsx
<Controller
  name="images"
  control={control}
  render={({ field }) => (
    <ImageUpload
      value={field.value || []}
      onChange={field.onChange}
      maxFiles={5}
    />
  )}
/>
```

## API Flow

1. User selects/drops images
2. Frontend creates FormData with images
3. POST to `/api/v1/upload/images` with Bearer token
4. Backend saves files to `uploads/` directory
5. Backend returns array of file metadata with URLs
6. Frontend updates form state with image URLs
7. On product save, URLs are sent to product API

## File Structure

```
apps/
├── backend/
│   ├── uploads/                          # Image storage directory
│   ├── src/
│   │   ├── modules/upload/
│   │   │   ├── upload.controller.ts      # Upload handlers
│   │   │   └── upload.routes.ts          # Upload endpoints
│   │   └── common/utils/
│   │       └── upload.util.ts            # Multer configuration
│   └── main.ts                           # Static file serving
└── frontend/
    ├── src/
    │   ├── shared/components/
    │   │   └── ImageUpload.tsx           # New upload component
    │   └── pages/Products/
    │       └── ProductsPage.tsx          # Integrated in forms
    └── vite.config.ts                    # Proxy configuration
```

## Testing

To test the integration:

1. Start backend: `cd apps/backend && npm run dev`
2. Start frontend: `cd apps/frontend && npm run dev`
3. Login as ADMIN or MANAGER
4. Navigate to Products page
5. Click "Add Product"
6. Drag images or click browse in the upload area
7. Verify images appear in preview grid
8. Fill other fields and create product
9. Verify product shows images in the table

## Security

- Authentication required (JWT Bearer token)
- Role-based access (ADMIN/MANAGER only)
- File type validation (images only)
- File size limits (5MB per file)
- Max file count enforcement (10 per request)

## Future Enhancements

- Image compression before upload
- Image cropping/editing tools
- Cloudinary or S3 integration for production
- Image optimization (WebP conversion)
- Thumbnail generation
- Bulk image management
