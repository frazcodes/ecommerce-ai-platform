# Git Setup and GitHub Deployment Guide

## Step 1: Initialize Git Repository

First, navigate to your project directory and initialize Git:

```bash
cd d:\ecommerce-ai
git init
```

## Step 2: Create Initial README

```bash
echo "# ecommerce-ai-platform" >> README.md
```

## Step 3: Configure Git User

If this is your first time using Git, configure your user information:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 4: Add All Files to Git

```bash
git add .
```

## Step 5: Check What Will Be Committed

```bash
git status
```

This will show you all files that are staged for commit. **IMPORTANT**: Verify that no `.env` files or secrets are included.

## Step 6: Create Initial Commit

```bash
git commit -m "Initial commit: SmartCart AI platform with React frontend and FastAPI backend"
```

## Step 7: Rename Branch to Main

```bash
git branch -M main
```

## Step 8: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon and select "New repository"
3. Repository name: `ecommerce-ai-platform`
4. Description: `AI-powered e-commerce platform with React frontend and FastAPI backend`
5. Make it **Public** (for free hosting on Vercel and Render)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 9: Add Remote Origin

```bash
git remote add origin https://github.com/frazcodes/ecommerce-ai-platform.git
```

## Step 10: Push to GitHub

```bash
git push -u origin main
```

If you encounter authentication issues, you may need to:
- Use a personal access token instead of password
- Configure GitHub SSH keys
- Use GitHub CLI: `gh auth login`

## Step 11: Verify Push

Go to https://github.com/frazcodes/ecommerce-ai-platform to verify all files are uploaded correctly.

## Step 12: Security Check

After pushing, verify no secrets were committed:

```bash
# Check for any .env files in the repository
git ls-files | grep "\.env"

# Should return nothing if .gitignore is working correctly
```

## Common Git Commands for Development

### Check Status
```bash
git status
```

### View Changes
```bash
git diff
```

### Stage Specific Files
```bash
git add path/to/file
```

### Commit Changes
```bash
git commit -m "Your commit message"
```

### Push Changes
```bash
git push
```

### Pull Latest Changes
```bash
git pull origin main
```

### Create a New Branch
```bash
git checkout -b feature/your-feature-name
```

### Switch Branches
```bash
git checkout main
```

### Merge Branch
```bash
git checkout main
git merge feature/your-feature-name
```

### Delete Branch
```bash
git branch -d feature/your-feature-name
```

## Git Workflow for This Project

### Development Workflow
1. Create a new branch for features: `git checkout -b feature/new-feature`
2. Make changes and commit: `git add . && git commit -m "Add new feature"`
3. Push branch: `git push origin feature/new-feature`
4. Create pull request on GitHub
5. Review and merge to main
6. Pull latest changes: `git pull origin main`

### Hotfix Workflow
1. Create hotfix branch: `git checkout -b hotfix/critical-bug`
2. Fix the issue and commit
3. Push and create pull request
4. Merge immediately to main
5. Deploy to production

## Troubleshooting

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/frazcodes/ecommerce-ai-platform.git
```

### "error: failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### "Permission denied"
```bash
# Use GitHub CLI
gh auth login

# Or use personal access token
# Generate token at: https://github.com/settings/tokens
```

### "Nothing to commit"
```bash
# Check if there are untracked files
git status

# If you want to commit everything including untracked files
git add -A
```

## Pre-Push Checklist

Before pushing to GitHub, verify:

- [ ] No `.env` files are staged for commit
- [ ] No hardcoded secrets in source code
- [ ] All tests pass (if you have tests)
- [ ] Code follows project style guidelines
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main
- [ ] No sensitive data in logs or comments

## Next Steps After Git Setup

1. **Deploy Frontend to Vercel**
   - Connect your GitHub repository to Vercel
   - Import the `frontend` directory
   - Configure environment variables
   - Deploy

2. **Deploy Backend to Render**
   - Connect your GitHub repository to Render
   - Import the `backend` directory
   - Configure environment variables
   - Deploy

3. **Configure MongoDB Atlas**
   - Follow the setup guide in `backend/MONGODB_ATLAS_SETUP.md`
   - Update environment variables in Render
   - Test connection

4. **Update CORS Configuration**
   - Add your Vercel frontend URL to backend CORS origins
   - Update environment variables in Render

5. **Test Full Stack**
   - Test frontend-backend communication
   - Verify authentication flow
   - Test database operations
   - Check all features work in production
