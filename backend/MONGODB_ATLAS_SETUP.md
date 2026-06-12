# MongoDB Atlas Production Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create a New Cluster

1. Click "Build a Database"
2. Choose "M0" (Free Tier) or select a paid tier for production
3. Select a cloud provider (AWS, GCP, or Azure)
4. Choose a region closest to your users
5. Name your cluster (e.g., "smartcart-cluster")
6. Click "Create"

## Step 3: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username: `fraz24932` (or your preferred username)
5. Enter a strong password (save this securely!)
6. Select "Read and write to any database" for built-in role
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
4. For production, add specific IP addresses:
   - Render backend IP ranges
   - Your development machine IP
5. Click "Confirm"

## Step 5: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Drivers" and choose Python version 3.11 or later
4. Copy the connection string

## Step 6: Update Environment Variables

### For Local Development (backend/.env)
```
MONGODB_URI=mongodb+srv://fraz24932:YOUR_PASSWORD@cluster0.9elsi.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=smartcart_db
```

### For Production (Render)
1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to "Environment" section
4. Add the following environment variables:
   - `MONGODB_URI`: Your full connection string
   - `MONGODB_DATABASE`: smartcart_db

## Step 7: Test Connection

Run this command to test your connection locally:
```bash
cd backend
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; asyncio.run(AsyncIOMotorClient('mongodb+srv://fraz24932:YOUR_PASSWORD@cluster0.9elsi.mongodb.net/?retryWrites=true&w=majority').admin.command('ping'))"
```

## Step 8: Security Best Practices

1. **Never commit .env files to Git** - They're already in .gitignore
2. **Use strong passwords** - Minimum 16 characters with mixed case, numbers, and symbols
3. **Enable IP whitelisting** - Restrict access to specific IPs in production
4. **Enable Atlas Security** - Enable encryption at rest and in transit
5. **Monitor usage** - Set up alerts for high usage or unusual activity
6. **Regular backups** - Enable automated backups in Atlas

## Step 9: Connection String Format

Your connection string should look like this:
```
mongodb+srv://fraz24932:PASSWORD@cluster0.9elsi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Replace:
- `PASSWORD` with your actual MongoDB password
- `cluster0.9elsi.mongodb.net` with your actual cluster endpoint

## Step 10: Troubleshooting

### Connection Timeout
- Check your network access settings
- Verify your IP is whitelisted
- Check if your firewall allows MongoDB connections

### Authentication Failed
- Verify username and password are correct
- Check if the user has proper permissions
- Ensure you're using the correct database name

### DNS Resolution Issues
- Ensure you're using the `mongodb+srv://` protocol
- Check your DNS settings
- Try using the direct connection string format

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Network access configured with IP whitelisting
- [ ] Connection string obtained and tested
- [ ] Environment variables updated in Render
- [ ] Connection tested from production environment
- [ ] Automated backups enabled
- [ ] Monitoring and alerts configured
- [ ] Security settings reviewed
- [ ] Performance monitoring enabled
