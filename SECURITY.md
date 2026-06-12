# Security Guide for SmartCart AI

## Secrets Management

### What Files Contain Secrets?

**NEVER COMMIT TO GITHUB:**
- `frontend/.env` - Contains API URLs and local configuration
- `backend/.env` - Contains MongoDB credentials, JWT secrets, API keys
- Any file with `.env` extension
- Any file with `secret`, `key`, `password` in the name

**SAFE TO COMMIT:**
- `frontend/.env.example` - Template without actual values
- `backend/.env.example` - Template without actual values
- `frontend/.env.production` - Production template (update with real URLs before deployment)
- `backend/.env.production` - Production template (update with real secrets before deployment)

### Current .gitignore Configuration

The `.gitignore` file already excludes:
- All `.env` files
- `frontend/.env`
- `backend/.env`
- Virtual environments (`.venv/`, `venv/`)
- Python cache files
- Node modules

### Pre-Commit Security Check

Before pushing to GitHub, run this command to ensure no secrets are committed:

```bash
# Check for any .env files that might be tracked
git ls-files | grep "\.env"

# Check for any files containing sensitive patterns
git grep -i "password\|secret\|api_key\|jwt_secret" --cached
```

### Environment Variable Setup

#### Frontend Environment Variables

**Development (frontend/.env):**
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_CATALOG_API_URL=https://dummyjson.com
```

**Production (Vercel):**
Set these in Vercel dashboard under Settings > Environment Variables:
```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
VITE_CATALOG_API_URL=https://dummyjson.com
```

#### Backend Environment Variables

**Development (backend/.env):**
```bash
MONGODB_URI=mongodb+srv://fraz24932:YOUR_PASSWORD@cluster0.9elsi.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=smartcart_db
JWT_SECRET_KEY=your-super-secret-jwt-key-here
SECRET_KEY=your-super-secret-key-here
```

**Production (Render):**
Set these in Render dashboard under Environment:
```bash
MONGODB_URI=mongodb+srv://fraz24932:YOUR_PASSWORD@cluster0.9elsi.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=smartcart_db
JWT_SECRET_KEY=GENERATE_SECURE_RANDOM_KEY
SECRET_KEY=GENERATE_SECURE_RANDOM_KEY
CORS_ORIGINS=["https://your-frontend-url.vercel.app"]
```

### Generating Secure Secrets

#### Generate JWT Secret Key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### Generate General Secret Key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Security Best Practices

1. **Never hardcode secrets in code**
   - Always use environment variables
   - Never commit secrets to version control
   - Use different secrets for development and production

2. **Rotate secrets regularly**
   - Change JWT secrets every 90 days
   - Update MongoDB passwords periodically
   - Rotate API keys if compromised

3. **Use strong secrets**
   - Minimum 32 characters for JWT secrets
   - Use a mix of letters, numbers, and symbols
   - Avoid dictionary words or predictable patterns

4. **Limit access**
   - Use principle of least privilege
   - Restrict database user permissions
   - Implement IP whitelisting for MongoDB

5. **Monitor for leaks**
   - Enable GitHub secret scanning
   - Use tools like GitGuardian or TruffleHog
   - Regularly audit committed code

### GitHub Security Features

1. **Enable Secret Scanning**
   - Go to repository Settings > Security
   - Enable "Secret scanning"
   - GitHub will automatically scan for leaked secrets

2. **Use GitHub Secrets for CI/CD**
   - Store secrets in GitHub Actions secrets
   - Never log secrets in CI/CD output
   - Use encrypted secrets for deployment

3. **Branch Protection**
   - Enable branch protection rules
   - Require pull request reviews
   - Prevent direct pushes to main branch

### Deployment Security

#### Vercel (Frontend):
- Environment variables are encrypted
- Never log environment variables
- Use Vercel's built-in security features

#### Render (Backend):
- Environment variables are encrypted
- Use Render's secret management
- Enable SSL/TLS for all connections

#### MongoDB Atlas:
- Enable IP whitelisting
- Use SCRAM-SHA-256 authentication
- Enable encryption at rest and in transit
- Enable audit logging

### Incident Response

If secrets are accidentally committed:

1. **Immediate Actions:**
   - Revoke/rotate the compromised secrets immediately
   - Remove the secrets from the repository
   - Force push to remove from history (if necessary)

2. **Git History Cleanup:**
   ```bash
   # Remove sensitive file from history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push to update remote
   git push origin --force --all
   ```

3. **Notify Stakeholders:**
   - Inform team members of the breach
   - Document the incident
   - Implement preventive measures

### Security Checklist

Before deploying to production:

- [ ] All .env files are in .gitignore
- [ ] No secrets hardcoded in source code
- [ ] Production secrets are different from development
- [ ] JWT secrets are at least 32 characters
- [ ] MongoDB password is strong
- [ ] CORS origins are set to production URLs only
- [ ] API documentation disabled in production
- [ ] Debug mode disabled in production
- [ ] HTTPS enforced for all connections
- [ ] IP whitelisting configured for MongoDB
- [ ] GitHub secret scanning enabled
- [ ] Branch protection rules enabled
- [ ] Team trained on security practices
