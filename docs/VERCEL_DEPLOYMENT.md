# Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- GitHub repository pushed

## Step 1: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `modern-ecommerce-dashboard` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api/v1
   ```

6. Click "Deploy"

## Step 2: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Step 3: Update Backend CORS

After deployment, update your backend `.env`:

```env
CORS_ORIGIN=https://your-app.vercel.app
```

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Push to `main` branch
- **Preview**: Push to any other branch or PR

## Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.railway.app/api/v1` | Backend API URL |

## Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## Troubleshooting

### Build fails with "command not found"
- Make sure `package.json` has correct scripts
- Check Node.js version (should be 20.x)

### 404 on page refresh
- Ensure `vercel.json` has correct rewrites configuration

### API calls fail
- Check CORS settings on backend
- Verify `VITE_API_URL` environment variable
- Check browser console for errors

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Gzip compression
- ✅ Image optimization
- ✅ Edge caching

## Monitoring

View deployment logs and analytics:
1. Go to your project dashboard
2. Click on "Deployments"
3. Select a deployment to view logs
4. Check "Analytics" tab for performance metrics
