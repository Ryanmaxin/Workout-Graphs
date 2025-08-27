# GitHub Pages Deployment Guide

This guide explains how to deploy this Svelte app to GitHub Pages at `rmaxin.com/workouts`.

## Prerequisites

1. Your repository is pushed to GitHub
2. You have admin access to the repository
3. Your custom domain `rmaxin.com` is configured

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. This will use the workflow file we created at `.github/workflows/deploy.yml`

### 2. Configure Custom Domain

1. In the same **Pages** settings section
2. Under **Custom domain**, enter: `rmaxin.com`
3. Check **Enforce HTTPS** (recommended)
4. Click **Save**

### 3. DNS Configuration

You'll need to configure your DNS to point to GitHub Pages. Add these records to your domain's DNS:

**Option A: Using A records (recommended)**
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

**Option B: Using CNAME record**
```
CNAME @     yourusername.github.io
```

### 4. Create CNAME file for subdirectory

Since you want the app at `rmaxin.com/workouts`, you'll need to:

1. Create a repository named `yourusername.github.io` (if you don't have one)
2. In that repository, create a file called `CNAME` with content: `rmaxin.com`
3. Create a `workouts` directory in that repository
4. The GitHub Actions workflow will deploy your app to this subdirectory

### 5. Update Repository Settings

In your main repository settings:
1. Go to **Settings** → **Pages**
2. Set the **Source** to **Deploy from a branch**
3. Select the `gh-pages` branch (this will be created automatically by the workflow)
4. Set the folder to `/ (root)`

## Deployment Process

1. **Push to main branch**: Every time you push to the `main` branch, the GitHub Actions workflow will automatically:
   - Build your Svelte app
   - Deploy it to GitHub Pages
   - Make it available at `rmaxin.com/workouts`

2. **Manual deployment**: You can also trigger deployment manually:
   - Go to **Actions** tab in your repository
   - Select the "Deploy to GitHub Pages" workflow
   - Click **Run workflow**

## Troubleshooting

### Build Issues
- Check the **Actions** tab for build logs
- Ensure all dependencies are properly installed
- Verify the `svelte.config.js` configuration

### DNS Issues
- DNS changes can take up to 48 hours to propagate
- Use tools like `dig` or `nslookup` to verify DNS propagation
- Ensure your domain registrar supports the required record types

### Custom Domain Issues
- Verify the CNAME file is in the correct repository
- Check that HTTPS is properly configured
- Ensure the domain is pointing to the correct GitHub Pages repository

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

This will serve the built files locally so you can verify everything works before deployment.

## File Structure

The deployment creates these key files:
- `build/` - The built static files
- `build/404.html` - Fallback page for SPA routing
- `.github/workflows/deploy.yml` - GitHub Actions workflow

## Notes

- The app is configured with `base: '/workouts'` in `svelte.config.js`
- All assets and routes will be prefixed with `/workouts`
- The 404.html file handles client-side routing for the SPA
- The workflow uses Node.js 18 for building
