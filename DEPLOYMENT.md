# GitHub Pages Deployment Guide

This guide explains how to deploy this Svelte app to GitHub Pages at `yourusername.github.io/Workout-Graphs`.

## Prerequisites

1. Your repository is pushed to GitHub
2. You have admin access to the repository

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. This will use the workflow file we created at `.github/workflows/deploy.yml`

### 2. Repository Settings

In your repository settings:

1. Go to **Settings** → **Pages**
2. Set the **Source** to **Deploy from a branch**
3. Select the `gh-pages` branch (this will be created automatically by the workflow)
4. Set the folder to `/ (root)`

## Deployment Process

1. **Push to main branch**: Every time you push to the `main` branch, the GitHub Actions workflow will automatically:

   - Build your Svelte app
   - Deploy it to GitHub Pages
   - Make it available at `yourusername.github.io/Workout-Graphs`

2. **Manual deployment**: You can also trigger deployment manually:
   - Go to **Actions** tab in your repository
   - Select the "Deploy to GitHub Pages" workflow
   - Click **Run workflow**

## URL Structure

- **Production**: `https://yourusername.github.io/Workout-Graphs`
- **Local development**: `http://localhost:5173` (no base path)

## Troubleshooting

### Build Issues

- Check the **Actions** tab for build logs
- Ensure all dependencies are properly installed
- Verify the `svelte.config.js` configuration

### Deployment Issues

- Verify the GitHub Actions workflow is running
- Check that the `gh-pages` branch is being created
- Ensure GitHub Pages is enabled in repository settings

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

- The app is configured with `base: '/Workout-Graphs'` in production
- All assets and routes will be prefixed with `/Workout-Graphs` in production
- The 404.html file handles client-side routing for the SPA
- The workflow uses Node.js 18 for building
- Local development runs without the base path for easier development
