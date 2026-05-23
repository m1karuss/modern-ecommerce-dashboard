# Railway Deployment Guide

## Prerequisites
- Railway account (free tier: $5 credit/month)
- GitHub repository pushed

## Step 1: Create PostgreSQL Database

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project"
3. Select "Provision PostgreSQL"
4. Database will be created automatically
5. Copy the `DATABASE_URL` from Variables tab

## Step 2: Deploy Backend

1. In the same project, click "New Service"
2. Select "GitHub Repo"
3. Choose your `modern-ecommerce-dashboard` repository
4. Configure service:
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && node dist/main.js`

## Step 3: Add Environment Variables

Click on your backend service → Variables tab, add:

```env
# Database (automatically provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# App Configuration
NODE_ENV=production
PORT=5001

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (your Vercel frontend URL)
CORS_ORIGIN=https://your-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Generate Secure JWT Secrets

Use this command to generate random secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it twice to get two different secrets for ACCESS and REFRESH.

## Step 4: Connect Database to Backend

1. Click on your backend service
2. Go to "Settings" → "Service Variables"
3. Click "Add Reference" → Select your PostgreSQL database
4. This automatically adds `DATABASE_URL`

## Step 5: Deploy

1. Railway automatically deploys on push to `main`
2. First deployment runs migrations automatically
3. Check logs for any errors
4. Copy your backend URL (e.g., `https://your-app.up.railway.app`)

## Step 6: Seed Database (Optional)

Run seed command via Railway CLI or add to start command:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run seed
railway run npx prisma db seed
```

## Step 7: Update Frontend

Update your Vercel environment variable:
```
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

## Custom Domain (Optional)

1. Go to backend service → Settings → Domains
2. Click "Generate Domain" or add custom domain
3. Update CORS_ORIGIN in backend environment variables

## Monitoring

### View Logs
1. Click on your service
2. Go to "Deployments" tab
3. Click on latest deployment
4. View real-time logs

### Metrics
- CPU usage
- Memory usage
- Network traffic
- Request count

## Database Management

### Access Database
```bash
# Via Railway CLI
railway connect postgres

# Or use the connection string in any PostgreSQL client
```

### Backup Database
Railway automatically backs up PostgreSQL databases.

Manual backup:
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

## Troubleshooting

### Build fails
- Check build logs in Railway dashboard
- Verify `package.json` scripts
- Ensure Prisma schema is valid

### Migration fails
- Check DATABASE_URL is correct
- Verify PostgreSQL service is running
- Check migration files in `prisma/migrations/`

### App crashes on start
- Check environment variables are set
- View logs for error messages
- Verify PORT is set to 5001

### CORS errors
- Update CORS_ORIGIN to match your frontend URL
- Ensure no trailing slash in URL
- Check frontend is using correct API URL

## Cost Optimization

Free tier includes:
- $5 credit/month
- 500 hours execution time
- 1GB RAM
- 1GB storage

Tips:
- Use sleep mode for non-production apps
- Monitor usage in dashboard
- Upgrade to Hobby plan ($5/month) for production

## CI/CD

Railway automatically deploys when you push to GitHub:

1. Push to `main` branch
2. Railway detects changes
3. Runs build command
4. Runs migrations
5. Starts new deployment
6. Zero-downtime deployment

## Health Checks

Add health check endpoint (already exists):
```
GET /health
```

Railway automatically monitors this endpoint.

## Environment-Specific Deployments

### Staging Environment
1. Create new Railway project
2. Deploy from `develop` branch
3. Use separate database
4. Different environment variables

### Production Environment
1. Use `main` branch
2. Production database
3. Production secrets
4. Custom domain

## Security Checklist

- ✅ Strong JWT secrets (32+ characters)
- ✅ CORS configured correctly
- ✅ Rate limiting enabled
- ✅ Environment variables set
- ✅ Database connection secure
- ✅ HTTPS enabled (automatic)
- ✅ Secrets not in code

## Useful Commands

```bash
# View logs
railway logs

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npx prisma db seed

# Open Prisma Studio
railway run npx prisma studio

# SSH into container
railway shell
```

## Support

- Railway Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app
