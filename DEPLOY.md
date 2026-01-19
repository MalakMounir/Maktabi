# Deployment Guide

## Quick Start - Push to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (name it `maktabi-workspace-hub` or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/maktabi-workspace-hub.git`)

### Step 2: Add Remote and Push

Run these commands (replace `<YOUR_REPO_URL>` with your actual repository URL):

```bash
git remote add origin <YOUR_REPO_URL>
git branch -M main
git push -u origin main
```

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

**Build Settings (auto-detected):**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Option 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository
4. Netlify will use the `netlify.toml` configuration
5. Click "Deploy site"

**Build Settings (auto-detected from netlify.toml):**
- Build command: `npm run build`
- Publish directory: `dist`

### Option 3: Deploy to GitHub Pages

1. Push your code to GitHub (see Step 2 above)
2. Go to your repository → Settings → Pages
3. Source: Deploy from a branch
4. Branch: `main` / `root`
5. Build the site first:
   ```bash
   npm run build
   ```
6. Then deploy the `dist` folder

## Manual Deployment Commands

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The dist folder contains your production-ready files
# Upload the contents of dist/ to your hosting provider
```

## Environment Variables

If your app needs environment variables, add them in your deployment platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables

## Custom Domain

After deployment, you can add a custom domain:
- **Vercel**: Project Settings → Domains
- **Netlify**: Site Settings → Domain Management
