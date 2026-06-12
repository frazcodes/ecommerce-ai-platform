# CORS Configuration Guide

## Understanding CORS

CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access your backend API from the frontend.

## Current CORS Configuration

### Backend CORS Settings (FastAPI)

The backend is configured in `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variable Configuration

The `CORS_ORIGINS` is set in the backend environment variables:

**Development (.env):**
```bash
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000","http://127.0.0.1:5173","http://127.0.0.1:3000"]
```

**Production (Render):**
```bash
CORS_ORIGINS=["https://your-frontend-url.vercel.app"]
```

## Step-by-Step CORS Configuration

### Step 1: Deploy Backend to Render

Follow the deployment guide to deploy your backend to Render and get your backend URL.

Example backend URL: `https://smartcart-ai-backend.onrender.com`

### Step 2: Deploy Frontend to Vercel

Follow the deployment guide to deploy your frontend to Vercel and get your frontend URL.

Example frontend URL: `https://smartcart-ai.vercel.app`

### Step 3: Update Backend CORS Origins

1. Go to your Render backend service
2. Navigate to "Environment" section
3. Find the `CORS_ORIGINS` variable
4. Update it to include your Vercel frontend URL:

```bash
CORS_ORIGINS=["https://smartcart-ai.vercel.app"]
```

**Important Notes:**
- Use the exact URL from Vercel (no trailing slash)
- Use HTTPS (not HTTP)
- Put the URL in quotes
- If you need multiple origins, separate with commas:
  ```bash
  CORS_ORIGINS=["https://smartcart-ai.vercel.app","https://www.smartcart-ai.com"]
  ```

5. Save the changes
6. Render will automatically redeploy the backend

### Step 4: Update Frontend API URL

1. Go to your Vercel project
2. Navigate to "Settings" → "Environment Variables"
3. Find `VITE_API_BASE_URL`
4. Update it to your Render backend URL:

```bash
VITE_API_BASE_URL=https://smartcart-ai-backend.onrender.com/api/v1
```

5. Save the changes
6. Redeploy the frontend

### Step 5: Verify CORS Configuration

#### Test 1: Health Check

1. Open your browser
2. Visit: `https://your-backend-url.onrender.com/api/v1/health`
3. You should see:
   ```json
   {
     "status": "healthy",
     "app": "SmartCart AI Backend",
     "version": "1.0.0",
     "environment": "production"
   }
   ```

#### Test 2: Frontend API Call

1. Open your Vercel frontend URL
2. Open browser developer tools (F12)
3. Go to Console tab
4. Try to fetch products or login
5. Check Network tab for API calls
6. Verify status codes are 200 (not CORS errors)

#### Test 3: Direct API Test

Use curl to test CORS:

```bash
curl -H "Origin: https://your-frontend-url.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-backend-url.onrender.com/api/v1/health
```

You should see CORS headers in the response.

## Common CORS Issues and Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause:** Frontend URL not in CORS_ORIGINS

**Solution:**
1. Check backend CORS_ORIGINS environment variable
2. Ensure exact URL match (HTTPS vs HTTP, www vs non-www)
3. Redeploy backend after changes

### Issue 2: "CORS policy: Multiple values for 'Access-Control-Allow-Origin'"

**Cause:** Duplicate CORS headers or misconfiguration

**Solution:**
1. Check backend middleware configuration
2. Ensure only one CORS middleware is added
3. Review FastAPI middleware order

### Issue 3: "CORS policy: Request header field authorization is not allowed"

**Cause:** Authorization header not in allowed headers

**Solution:**
The current configuration allows all headers with `allow_headers=["*"]`, so this should not occur. If it does, explicitly add:

```python
allow_headers=["*"]
```

### Issue 4: Preflight request fails

**Cause:** OPTIONS request not handled correctly

**Solution:**
FastAPI's CORSMiddleware handles preflight requests automatically. Ensure:
- CORS middleware is added before routes
- allow_methods includes the HTTP methods you need
- allow_headers includes the headers you need

### Issue 5: CORS works in development but not production

**Cause:** Environment variables not updated in production

**Solution:**
1. Verify Render environment variables are set
2. Check for typos in URLs
3. Ensure backend is redeployed after changes
4. Clear browser cache

## Security Best Practices for CORS

### 1. Restrict Origins

**Bad:** Allow all origins
```python
allow_origins=["*"]
```

**Good:** Allow specific origins
```python
allow_origins=["https://your-frontend.vercel.app"]
```

### 2. Use HTTPS Only

**Bad:** Allow HTTP origins
```bash
CORS_ORIGINS=["http://your-frontend.vercel.app"]
```

**Good:** Allow HTTPS origins
```bash
CORS_ORIGINS=["https://your-frontend.vercel.app"]
```

### 3. Limit Methods

**Bad:** Allow all methods
```python
allow_methods=["*"]
```

**Good:** Allow specific methods
```python
allow_methods=["GET", "POST", "PUT", "DELETE"]
```

### 4. Limit Headers

**Bad:** Allow all headers
```python
allow_headers=["*"]
```

**Good:** Allow specific headers
```python
allow_headers=["Content-Type", "Authorization"]
```

### 5. Credentials Only When Needed

**Bad:** Always allow credentials
```python
allow_credentials=True
```

**Good:** Only allow credentials when needed
```python
allow_credentials=True  # Only if you send cookies/auth headers
```

## Testing CORS Configuration

### Using Browser DevTools

1. Open your frontend application
2. Open Developer Tools (F12)
3. Go to Network tab
4. Make an API call (login, fetch products, etc.)
5. Click on the request
6. Check Response Headers for:
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`

### Using curl

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://your-backend-url.onrender.com/api/v1/auth/login

# Test actual request
curl -X POST \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  https://your-backend-url.onrender.com/api/v1/auth/login
```

### Using Online Tools

- [CORS Tester](https://www.test-cors.org/)
- [CORS Proxy Tester](https://cors-test.codehappy.dev/)

## Production CORS Checklist

Before going live:

- [ ] CORS_ORIGINS contains only production frontend URL
- [ ] Frontend URL uses HTTPS
- [ ] Backend URL uses HTTPS
- [ ] No wildcard origins (`*`) in production
- [ ] Credentials enabled only if needed
- [ ] Methods restricted to what's needed
- [ ] Headers restricted to what's needed
- [ ] CORS tested from production frontend
- [ ] Preflight requests working
- [ ] No CORS errors in browser console
- [ ] API calls successful from frontend
- [ ] Environment variables verified in Render
- [ ] Backend redeployed after CORS changes

## Troubleshooting CORS Issues

### Step 1: Check Backend Logs

1. Go to Render dashboard
2. Navigate to your backend service
3. Click "Logs"
4. Look for CORS-related errors

### Step 2: Check Environment Variables

1. Go to Render dashboard
2. Navigate to "Environment" section
3. Verify CORS_ORIGINS is set correctly
4. Check for typos or formatting errors

### Step 3: Test API Directly

```bash
# Test if backend is accessible
curl https://your-backend-url.onrender.com/api/v1/health

# Test with CORS headers
curl -H "Origin: https://your-frontend.vercel.app" \
     https://your-backend-url.onrender.com/api/v1/health
```

### Step 4: Clear Browser Cache

Sometimes CORS errors are cached. Clear your browser cache or try in incognito mode.

### Step 5: Check Network Access

If using MongoDB Atlas, ensure your Render backend IP is whitelisted.

## Multiple Frontend Domains

If you need to support multiple frontend domains:

```bash
CORS_ORIGINS=["https://app.vercel.app","https://www.yourdomain.com","https://staging.vercel.app"]
```

Or use a wildcard for subdomains:

```python
# In backend code, you can implement dynamic origin checking
from fastapi.middleware.cors import CORSMiddleware

def is_allowed_origin(origin: str) -> bool:
    allowed_domains = ["vercel.app", "yourdomain.com"]
    return any(origin.endswith(domain) for domain in allowed_domains)

app.add_middleware(
    CORSMiddleware,
    allow_origins=is_allowed_origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Summary

CORS configuration is critical for security and functionality:

1. **Development:** Allow localhost origins
2. **Production:** Allow only your production frontend URL
3. **Security:** Never use wildcards in production
4. **Testing:** Always test CORS after deployment
5. **Monitoring:** Check logs for CORS errors

Following this guide ensures your SmartCart AI platform has secure and functional CORS configuration between Vercel (frontend) and Render (backend).
