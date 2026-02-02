# Vercel Deployment Guide

This guide covers deploying the Perth Sustainability Tracker to Vercel.

## Architecture

This is a monorepo with:

- **Frontend**: React + Vite app in `/frontend`
- **Backend**: Express API in `/backend`
- **Database**: PostgreSQL (requires external hosting)

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```
3. **PostgreSQL Database**: You'll need a hosted PostgreSQL instance (see Database Setup below)

## Database Setup

Vercel doesn't host databases, so you need an external PostgreSQL provider:

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Follow the setup wizard
4. Connection details will be auto-added to your environment variables

### Option 2: Other Providers

- **Neon** (https://neon.tech) - Free tier available
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - Free tier available
- **ElephantSQL** (https://www.elephantsql.com) - Free tier available

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**:

   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Import Project on Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect the framework

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   For the full-stack deployment:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   NODE_ENV=production
   ```

   Get your DATABASE_URL from your PostgreSQL provider.

5. **Deploy**: Click "Deploy" and wait for the build to complete.

### Method 2: Deploy via Vercel CLI

1. **Login to Vercel**:

   ```bash
   vercel login
   ```

2. **Deploy Frontend**:

   ```bash
   cd frontend
   vercel --prod
   ```

3. **Deploy Backend (Separate Project)**:

   ```bash
   cd ../backend
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NODE_ENV production
   ```

## Configuration Files Created

### `/vercel.json` (Root - Monorepo Config)

Configures both frontend and backend in a single deployment with API routing.

### `/backend/vercel.json` (Backend-Only Config)

If you want to deploy backend separately as a serverless API.

### `/frontend/.env.production`

Sets the API URL to use relative paths for production.

## Important Notes

### Backend Considerations

The backend uses Express with PostgreSQL. On Vercel:

- Express runs as serverless functions
- Each request creates a new instance
- Database connections should use connection pooling
- Consider setting `max: 1` for pg pool to avoid connection limits

### Recommended Backend Changes for Vercel

Update `backend/src/database.ts` for serverless:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Important for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### CORS Configuration

Update `backend/src/index.ts` to allow your Vercel domain:

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://your-app.vercel.app",
    credentials: true,
  }),
);
```

Add `FRONTEND_URL` to your Vercel environment variables.

## Post-Deployment

1. **Run Database Migrations**:
   The schema is in `backend/src/db/schema.sql`. You can:
   - Use your database provider's dashboard to run the SQL
   - Or connect directly: `psql $DATABASE_URL < backend/src/db/schema.sql`

2. **Test Your Deployment**:
   - Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Test API endpoints: `https://your-app.vercel.app/api/households`
   - Check browser console for errors

3. **Set Custom Domain** (Optional):
   - Go to Vercel project → Settings → Domains
   - Add your custom domain and follow DNS instructions

## Alternative: Split Deployments

For better separation, deploy frontend and backend separately:

### Frontend on Vercel

- Deploy from `/frontend` directory
- Set `VITE_API_URL` to your backend URL

### Backend Options

- **Vercel**: Deploy from `/backend` directory (serverless)
- **Railway**: Better for long-running Express apps
- **Render**: Free tier available for backends
- **Fly.io**: Good for Docker-based deployments

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Routes Don't Work

- Check that `/api` routes are properly configured in `vercel.json`
- Verify CORS settings allow your frontend domain
- Check environment variables are set correctly

### Database Connection Errors

- Verify `DATABASE_URL` is correct and accessible
- Check SSL settings (many providers require `?sslmode=require`)
- Ensure database allows connections from Vercel IPs

### Cold Starts

- Serverless functions may have cold starts (1-2 seconds)
- Consider keeping backend on a traditional host if this is an issue
- Use Vercel's Edge Functions for faster response times

## Monitoring

- **Vercel Dashboard**: View deployment logs and analytics
- **Vercel Analytics**: Add `@vercel/analytics` package for detailed metrics
- **Error Tracking**: Consider Sentry or LogRocket for error monitoring

## Cost Considerations

Vercel pricing:

- **Hobby** (Free): 100GB bandwidth, 100 hours serverless execution
- **Pro** ($20/month): 1TB bandwidth, 1000 hours execution
- **Enterprise**: Custom pricing

For hobby projects, the free tier is usually sufficient.

## Questions?

Check:

- Vercel Docs: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Project Issues: Check your repository's issue tracker
