# CI/CD & Deployment Guide

This guide explains how to use the CI/CD pipeline and local deployment scripts
for the @andersseen monorepo.

## 🚀 Quick Start

### Deploy from Local Machine

```bash
# Deploy everything (Storybook, Landing, Demo)
pnpm deploy:all

# Or deploy specific services
pnpm deploy:storybook    # Deploy Storybook only
pnpm deploy:landing      # Deploy Landing Page only
pnpm deploy:cloudflare   # Deploy Angular Demo App only
```

## 🔄 CI/CD Pipeline

The pipeline is split across four workflow files in `.github/workflows/`:

### 1. `ci-cd.yml` — Build, Test & Storybook Deploy

**Triggers:** push to `main`/`develop`, pull requests to `main`.

| Job                | What it does                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build-and-test`   | Lints, runs `pnpm build:all`, runs `pnpm test:headless`, runs Stencil spec tests (`pnpm -C packages/web-components test:spec`), uploads build artifacts |
| `deploy-storybook` | Downloads artifacts, builds Storybook, deploys to Cloudflare Pages (`and-web-components-storybook`) — `main`/`develop` only                             |

**URLs:**

- Storybook: `https://and-web-components-storybook.pages.dev`

### 2. `release.yml` — Version & Publish

**Trigger:** push to `main`.

Builds all publishable libraries in dependency order, then uses
`changesets/action@v1` to:

1. Open (or update) a "chore: version packages" PR when there are pending
   changesets.
2. Publish the newly-versioned packages to npm when that version PR is merged.

There is no "version bump commit" — versioning and publishing are managed by
Changesets.

### 3. `deploy-demo.yml` — Deploy Angular Demo

**Trigger:** push to `main`.

Builds the Angular demo app via `pnpm deploy:cloudflare:actions` and deploys to
Cloudflare Pages.

**URL:** `https://and-web-components-demo.pages.dev`

### 4. `deploy-landing.yml` — Deploy Astro Landing

**Trigger:** push to `main`.

Builds the Astro landing page via `pnpm deploy:landing:actions` and deploys to
Cloudflare Pages. The landing app also has Playwright e2e tests run locally with
`pnpm -C apps/astro-landing test:e2e`.

**URL:** `https://and-web-components-landing.pages.dev`

## 🔧 Prerequisites

### Local Development

1. **Install Wrangler CLI**

   ```bash
   npm install -g wrangler
   # or
   pnpm add -g wrangler
   ```

2. **Login to Cloudflare**

   ```bash
   wrangler login
   ```

3. **Verify authentication**
   ```bash
   wrangler whoami
   ```

### GitHub Actions Secrets

Add these secrets to your GitHub repository:

- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `NPM_TOKEN` - NPM authentication token (for publishing)

**Creating a Cloudflare API Token:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to "My Profile" → "API Tokens"
3. Click "Create Token"
4. Use the "Edit Cloudflare Workers" template
5. Include permissions:
   - Zone:Read (for Pages)
   - Workers Scripts:Edit
   - Account:Read
   - Account:Edit (needed to create Pages projects from CI)
   - Cloudflare Pages:Edit
6. Copy the token and add to GitHub secrets

## 📦 Available Scripts

### Root Package Scripts

```bash
# Development
pnpm storybook          # Run Storybook locally

# Building
pnpm build-storybook    # Build Storybook for production
pnpm build:all          # Build all packages

# Deployment
pnpm deploy:storybook   # Deploy Storybook
pnpm deploy:landing     # Deploy Landing Page
pnpm deploy:cloudflare  # Deploy Demo App
pnpm deploy:all         # Deploy all services
```

## 🌍 Service URLs

After deployment, your services will be available at:

| Service   | URL                                              | Environment |
| --------- | ------------------------------------------------ | ----------- |
| Storybook | `https://and-web-components-storybook.pages.dev` | Production  |
| Landing   | `https://and-web-components-landing.pages.dev`   | Production  |
| Demo      | `https://and-web-components-demo.pages.dev`      | Production  |

## 🧪 Testing Deployments Locally

### Test Storybook

```bash
# Build and serve locally
pnpm build-storybook
npx serve packages/web-components/storybook-static
```

## 🚀 Manual Deployment Checklist

Before running `pnpm deploy:all`:

- [ ] `wrangler login` - You're authenticated
- [ ] `pnpm build:all` - All packages build successfully
- [ ] `pnpm lint` - No linting errors
- [ ] `pnpm test:headless` - All tests pass
- [ ] Cloudflare Pages projects created (CI will auto-create them if missing):
  - `and-web-components-storybook`
  - `and-web-components-landing`
  - `and-web-components-demo`

## 🐛 Troubleshooting

### "Not authenticated with Wrangler"

```bash
wrangler login
# Follow the browser prompt
```

### "Project not found"

GitHub Actions now attempts to create Cloudflare Pages projects automatically
before deploying. If a deploy still fails with "Project not found", verify that
`CLOUDFLARE_API_TOKEN` has the `Cloudflare Pages:Edit` permission.

To create a project manually:

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Choose "Direct Upload"
4. Set project name (e.g., `and-web-components-storybook`)

### Build fails

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build:all
```

## 📚 Additional Resources

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Changesets Documentation](https://github.com/changesets/changesets)

---

## 📝 Deployment Commands Summary

```bash
# Full deployment from root
pnpm deploy:all

# Individual deployments
pnpm deploy:storybook
pnpm deploy:landing
pnpm deploy:cloudflare

# Development
pnpm storybook        # Storybook local
```
