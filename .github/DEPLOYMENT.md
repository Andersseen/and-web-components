# CI/CD & Deployment Guide

This guide explains how to use the CI/CD pipeline and local deployment scripts
for the @andersseen monorepo.

## 🚀 Quick Start

### Deploy from Local Machine

```bash
# Deploy everything (Storybook, MCP Worker, Landing, Demo)
pnpm deploy:all

# Or deploy specific services
pnpm deploy:storybook    # Deploy Storybook only
pnpm deploy:mcp         # Deploy MCP Worker only
pnpm deploy:landing     # Deploy Landing Page only
```

### Using the Deploy Script

```bash
# Make sure you're logged in to Wrangler
npx wrangler login

# Deploy all services
./scripts/deploy.sh all

# Deploy specific service
./scripts/deploy.sh storybook
./scripts/deploy.sh mcp
./scripts/deploy.sh landing
./scripts/deploy.sh demo
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

1. **Build & Test** - On every push/PR
   - Runs linter
   - Builds all packages
   - Runs tests
   - Uploads artifacts

2. **Deploy Storybook** - On main/develop branches
   - Builds Storybook
   - Deploys to Cloudflare Pages
   - URL: `https://and-web-components-storybook.pages.dev`

3. **Deploy MCP Worker** - On main branch only
   - Deploys MCP server to Cloudflare Workers
   - URL: `https://andersseen-mcp.your-account.workers.dev`

4. **Deploy Landing Page** - On main branch only
   - Builds Astro landing page
   - Deploys to Cloudflare Pages
   - URL: `https://and-web-components-landing.pages.dev`

5. **Deploy Demo App** - On main branch only
   - Builds Angular demo app
   - Deploys to Cloudflare Pages
   - URL: `https://and-web-components-demo.pages.dev`

6. **Publish to NPM** - On main with "version bump" commit
   - Publishes updated packages

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
   - Cloudflare Pages:Edit
6. Copy the token and add to GitHub secrets

## 📦 Available Scripts

### Root Package Scripts

```bash
# Development
pnpm wrangler:dev        # Run MCP Worker locally (http://localhost:8787)
pnpm storybook          # Run Storybook locally

# Building
pnpm build-storybook    # Build Storybook for production
pnpm build:all         # Build all packages

# Deployment
pnpm deploy:storybook   # Deploy Storybook
pnpm deploy:mcp        # Deploy MCP Worker
pnpm deploy:landing    # Deploy Landing Page
pnpm deploy:cloudflare # Deploy Demo App
pnpm deploy:all        # Deploy everything
```

### MCP Worker Scripts (in packages/mcp-server)

```bash
cd packages/mcp-server

# Development
pnpm dev              # Run locally with hot reload

# Deployment
pnpm deploy           # Deploy to production
```

## 🌍 Service URLs

After deployment, your services will be available at:

| Service    | URL                                               | Environment |
| ---------- | ------------------------------------------------- | ----------- |
| Storybook  | `https://and-web-components-storybook.pages.dev`  | Production  |
| MCP Worker | `https://andersseen-mcp.your-account.workers.dev` | Production  |
| Landing    | `https://and-web-components-landing.pages.dev`    | Production  |
| Demo       | `https://and-web-components-demo.pages.dev`       | Production  |

## 🧪 Testing Deployments Locally

### Test MCP Worker

```bash
# Start local worker
pnpm wrangler:dev

# In another terminal, test endpoints:
curl http://localhost:8787/health
curl http://localhost:8787/info

# Test MCP protocol
curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

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
- [ ] Cloudflare Pages projects created:
  - `and-web-components-storybook`
  - `and-web-components-landing`
  - `and-web-components-demo`
- [ ] Cloudflare Worker named `andersseen-mcp`

## 🐛 Troubleshooting

### "Not authenticated with Wrangler"

```bash
wrangler login
# Follow the browser prompt
```

### "Project not found"

Create the project first in Cloudflare Dashboard:

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

### Worker deployment fails

Check `packages/mcp-server/wrangler.toml`:

- Ensure `name` field matches your worker name
- Verify `account_id` in `.wrangler/state/config.json` or set via env var

## 📚 Additional Resources

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)

---

## 📝 Deployment Commands Summary

```bash
# Full deployment from root
pnpm deploy:all

# Individual deployments
pnpm deploy:storybook
pnpm deploy:mcp
pnpm deploy:landing
pnpm deploy:cloudflare

# Using the script
./scripts/deploy.sh all
./scripts/deploy.sh storybook
./scripts/deploy.sh mcp
./scripts/deploy.sh landing
./scripts/deploy.sh demo

# Development
pnpm wrangler:dev     # MCP Worker local
pnpm storybook        # Storybook local
```
