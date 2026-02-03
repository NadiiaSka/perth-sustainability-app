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

Vercel doesn't host databases, so you need an external PostgreSQL provider. Your Docker database won't be accessible from Vercel since it runs locally.

### Option 1: Neon (Recommended - Best Free Tier)

**Why Neon**: 10GB storage free, serverless, autoscaling, excellent for hobby projects

1. **Sign up at https://neon.tech**
   - Click "Sign Up" (use GitHub for quick signup)

2. **Create a new project**:
   - Click "Create Project"
   - Project name: `perth-sustainability` (or your choice)
   - Region: Choose closest to your users
   - PostgreSQL version: 16 (default)
   - Click "Create Project"

3. **Get your connection string**:
   - You'll see a connection string immediately after creation
   - It looks like: `postgresql://username:password@host.neon.tech/dbname?sslmode=require`
   - **Copy this entire string** - you'll need it for Vercel

4. **Run the database schema**:
   - In Neon dashboard, click "SQL Editor"
   - Copy content from `backend/src/db/schema.sql`
   - Paste into SQL Editor and click "Run"
   - You should see "Successfully executed" message

5. **Test connection from your computer** (optional):
   
   You can test the connection from your local terminal/PowerShell:
   
   **On Windows (PowerShell):**
   ```powershell
   # If you have PostgreSQL installed
   psql "postgresql://username:password@host.neon.tech/dbname?sslmode=require"
   
   # Or use the Neon SQL Editor in your browser (easier for Windows users)
   ```
   
   **On Mac/Linux:**
   ```bash
   psql "postgresql://username:password@host.neon.tech/dbname?sslmode=require"
   ```
   
   **Don't have psql installed?** Skip this step and use Neon's SQL Editor instead - it works just as well!

### Option 2: Supabase (Good Free Tier)

**Why Supabase**: 500MB storage free, includes auth & storage, nice dashboard

1. **Sign up at https://supabase.com**
   - Click "Start your project"
   - Sign in with GitHub

2. **Create a new project**:
   - Organization: Create new or use existing
   - Project name: `perth-sustainability`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to your users
   - Click "Create new project" (takes ~2 minutes)

3. **Get your connection string**:
   - Go to Project Settings (gear icon) → Database
   - Scroll to "Connection string"
   - Select "URI" mode
   - Copy the connection string
   - **Replace `[YOUR-PASSWORD]`** with the password you set earlier
   - Should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

4. **Run the database schema**:
   - In Supabase dashboard, go to "SQL Editor"
   - Click "New query"
   - Copy content from `backend/src/db/schema.sql`
   - Paste and click "Run"

### Option 3: Vercel Postgres (Paid but Seamless)

**Why Vercel Postgres**: Integrates perfectly, but requires paid plan ($20/month minimum)

1. **In Vercel dashboard** (after deploying your app):
   - Go to your project
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Follow wizard

2. **Environment variables auto-added**:
   - Vercel automatically adds `POSTGRES_URL` and other variables
   - No manual configuration needed

3. **Run schema**:
   - Click on your database in Vercel
   - Go to "Query" tab
   - Copy content from `backend/src/db/schema.sql`
   - Paste and execute

### Quick Comparison

| Provider            | Free Storage | Limitations                    | Best For                     |
| ------------------- | ------------ | ------------------------------ | ---------------------------- |
| **Neon**            | 10GB         | No sleep, always on            | Hobby projects (Recommended) |
| **Supabase**        | 500MB        | Pauses after 7 days inactivity | Smaller projects             |
| **Vercel Postgres** | None (paid)  | Requires Pro plan ($20/mo)     | Production apps              |

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

   **Required variable:**
   - Name: `DATABASE_URL`
   - Value: Your connection string from Neon/Supabase (the full postgresql:// URL)
   - Apply to: Production, Preview, and Development

   **Optional but recommended:**
   - Name: `NODE_ENV`
   - Value: `production`

   Example DATABASE_URL:

   ```
   postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

5. **Deploy**: Click "Deploy" and wait for the build to complete (~2-3 minutes).

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
