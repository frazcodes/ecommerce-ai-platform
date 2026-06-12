# Deployment Guide for SmartCart AI Platform

This guide provides step-by-step instructions for deploying the SmartCart AI platform to production using Vercel (frontend), Render (backend), and MongoDB Atlas (database).

## Prerequisites

- GitHub account with repository created
- Vercel account (free tier)
- Render account (free tier)
- MongoDB Atlas account (free tier)
- All environment variables configured

## Step 1: Deploy Backend to Render

### 1.1 Create MongoDB Atlas Database

Follow the setup guide in `backend/MONGODB_ATLAS_SETUP.md` to:
- Create a MongoDB Atlas cluster
- Configure database user
- Set up network access
- Get your connection string

### 1.2 Deploy Backend to Render

1. **Sign up/login to Render**
   - Go to [render.com](https://render.com)
   - Sign up or login with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `frazcodes/ecommerce-ai-platform`
   - Select the repository

3. **Configure Build Settings**
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Runtime**: Python 3.11

4. **Configure Environment Variables**
   Add these environment variables in Render dashboard:
   
   ```
   ENVIRONMENT=production
   DEBUG=False
   MONGODB_URI=mongodb+srv://fraz24932:YOUR_PASSWORD@cluster0.9elsi.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DATABASE=smartcart_db
   JWT_SECRET_KEY=GENERATE_SECURE_KEY
   SECRET_KEY=GENERATE_SECURE_KEY
   CORS_ORIGINS=["https://your-frontend-url.vercel.app"]
   ```

   **Important**: Generate secure keys using:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://smartcart-ai-backend.onrender.com`)

6. **Verify Deployment**
   - Visit `https://your-backend-url.onrender.com/health`
   - You should see: `{"status": "healthy", ...}`
   - Visit `https://your-backend-url.onrender.com/api/v1/health`
   - You should see the same health check response

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. **Sign up/login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login with your GitHub account

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `frazcodes/ecommerce-ai-platform`
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Configure Environment Variables**
   Add these environment variables in Vercel dashboard:
   
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
   VITE_CATALOG_API_URL=https://dummyjson.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://smartcart-ai.vercel.app`)

6. **Verify Deployment**
   - Visit your Vercel URL
   - The application should load correctly
   - Check browser console for any API errors

## Step 3: Update CORS Configuration

### 3.1 Update Backend CORS Origins

1. Go to your Render backend service
2. Navigate to "Environment" section
3. Update `CORS_ORIGINS` to include your Vercel URL:
   ```
   CORS_ORIGINS=["https://your-frontend-url.vercel.app"]
   ```
4. Save changes and wait for redeployment

### 3.2 Verify CORS Configuration

1. Open your browser's developer tools
2. Visit your Vercel frontend
3. Try to login or fetch products
4. Check Network tab for successful API calls
5. Verify no CORS errors in console

## Step 4: Update Frontend API URL

### 4.1 Update Vercel Environment Variables

1. Go to your Vercel project
2. Navigate to "Settings" → "Environment Variables"
3. Update `VITE_API_BASE_URL` to your Render backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
   ```
4. Redeploy the frontend

## Step 5: Test Full Stack Integration

### 5.1 Test Authentication Flow

1. Visit your Vercel frontend
2. Try to register a new user
3. Verify registration succeeds
4. Try to login with the new user
5. Verify login succeeds and user is redirected

### 5.2 Test Product Features

1. Browse products
2. Search for products
3. Filter by category
4. Add products to cart
5. Add products to wishlist
6. View product details

### 5.3 Test Checkout Flow

1. Add products to cart
2. Proceed to checkout
3. Fill in shipping information
4. Complete checkout
5. Verify order success page

### 5.4 Test Admin Features

1. Login as admin user
2. Access admin dashboard
3. View products, orders, customers
4. Test admin functionality

## Step 6: Configure Custom Domain (Optional)

### 6.1 Vercel Custom Domain

1. Go to your Vercel project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. Wait for SSL certificate to be issued

### 6.2 Render Custom Domain

1. Go to your Render backend service
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Render
5. Wait for SSL certificate to be issued

## Step 7: Monitor and Maintain

### 7.1 Set Up Monitoring

**Vercel:**
- Enable Analytics
- Set up error tracking
- Configure uptime monitoring

**Render:**
- Enable metrics
- Set up alerting
- Configure log retention

**MongoDB Atlas:**
- Enable performance monitoring
- Set up alerts for high usage
- Configure automated backups

### 7.2 Regular Maintenance

- Update dependencies regularly
- Monitor database performance
- Review logs for errors
- Update security patches
- Test backup restoration

## Troubleshooting

### Backend Deployment Issues

**Build Fails:**
- Check Python version compatibility
- Verify all dependencies in requirements.txt
- Check build logs for specific errors

**Runtime Errors:**
- Verify environment variables are set correctly
- Check MongoDB connection string
- Review Render logs for errors

**Database Connection Issues:**
- Verify MongoDB Atlas network access
- Check IP whitelisting
- Test connection string locally

### Frontend Deployment Issues

**Build Fails:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

**Runtime Errors:**
- Verify API URL is correct
- Check CORS configuration
- Review browser console for errors

**API Connection Issues:**
- Verify backend is running
- Check CORS configuration
- Test API endpoints directly

### CORS Issues

**CORS Errors in Browser:**
- Verify CORS_ORIGINS includes frontend URL
- Check backend is running
- Verify environment variables are set
- Check for typos in URLs

## Security Checklist

Before going live:

- [ ] All secrets are in environment variables
- [ ] Debug mode is disabled
- [ ] API documentation is disabled in production
- [ ] HTTPS is enforced
- [ ] CORS origins are restricted
- [ ] MongoDB IP whitelisting is configured
- [ ] JWT secrets are strong and unique
- [ ] Database user has minimum required permissions
- [ ] Automated backups are enabled
- [ ] Monitoring and alerting are configured
- [ ] SSL certificates are valid
- [ ] Security headers are configured

## Performance Optimization

### Frontend Optimization

- Enable image optimization
- Configure caching headers
- Minimize JavaScript bundles
- Enable compression
- Use CDN for static assets

### Backend Optimization

- Enable database indexing
- Implement response caching
- Use connection pooling
- Optimize database queries
- Enable gzip compression

## Backup and Recovery

### Database Backups

- Enable automated daily backups in MongoDB Atlas
- Configure backup retention period
- Test backup restoration
- Document recovery procedures

### Application Backups

- Backup environment variables
- Document configuration settings
- Keep track of deployment versions
- Maintain rollback procedures

## Cost Management

### Free Tier Limitations

**Vercel (Hobby):**
- 100GB bandwidth per month
- 6GB build output
- Unlimited deployments

**Render (Free):**
- 750 hours per month
- 512MB RAM
- Sleeps after 15 minutes inactivity

**MongoDB Atlas (M0):**
- 512MB storage
- Shared RAM
- Limited connections

### Upgrade Considerations

Consider upgrading when:
- Traffic exceeds free tier limits
- Performance degrades
- Need additional features
- Require better support

## Support and Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **React Documentation**: https://react.dev

## Emergency Procedures

### If Backend Goes Down

1. Check Render status page
2. Review Render logs
3. Check MongoDB Atlas status
4. Verify environment variables
5. Restart service if needed

### If Frontend Goes Down

1. Check Vercel status page
2. Review Vercel deployment logs
3. Verify API connectivity
4. Redeploy if needed

### If Database Goes Down

1. Check MongoDB Atlas status
2. Verify network access
3. Check connection string
4. Test connection locally
5. Contact MongoDB support if needed

## Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Configure custom domains
3. Implement analytics
4. Set up CI/CD pipeline
5. Document deployment procedures
6. Train team on maintenance
7. Plan for scaling
8. Implement disaster recovery
