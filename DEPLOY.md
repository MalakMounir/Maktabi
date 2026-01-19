# Deployment Guide

## ✅ Status

- **Repository**: [https://github.com/MalakMounir/Maktabi.git](https://github.com/MalakMounir/Maktabi.git)
- **Code Status**: ✅ Pushed to GitHub
- **Branch**: `main`
- **Deployment Configs**: ✅ Ready (Vercel & Netlify)

## Deployment Options

### 🚀 Option 1: Deploy to Vercel (Recommended - Easiest)

**Quick Deploy (Recommended):**
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import repository: **`MalakMounir/Maktabi`**
4. Vercel will auto-detect all settings from `vercel.json`
5. Click **"Deploy"** - Your site will be live in ~2 minutes!

**Build Settings (auto-detected):**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Result**: You'll get a live URL like `https://maktabi.vercel.app`

### 🌐 Option 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select repository: **`MalakMounir/Maktabi`**
4. Netlify will use the `netlify.toml` configuration automatically
5. Click **"Deploy site"**

**Build Settings (auto-detected from netlify.toml):**
- Build command: `npm run build`
- Publish directory: `dist`

**Result**: You'll get a live URL like `https://maktabi.netlify.app`

### ⚙️ Option 3: Automated Deployment with GitHub Actions

GitHub Actions workflows are already set up! To use them:

**For Vercel:**
1. Get your Vercel tokens from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Add secrets to GitHub: Repository → Settings → Secrets and variables → Actions
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push to `main` branch - deployment happens automatically!

**For Netlify:**
1. Get your Netlify tokens from [app.netlify.com/user/applications](https://app.netlify.com/user/applications)
2. Add secrets to GitHub: Repository → Settings → Secrets and variables → Actions
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
3. Push to `main` branch - deployment happens automatically!

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
