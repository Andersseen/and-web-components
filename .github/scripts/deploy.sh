#!/bin/bash

# Deploy Script for @andersseen/monorepo
# Usage: ./scripts/deploy.sh [target]
# Targets: storybook | mcp | landing | demo | all

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if wrangler is logged in
check_wrangler_auth() {
    log_info "Checking Wrangler authentication..."
    if ! wrangler whoami &> /dev/null; then
        log_error "Not authenticated with Wrangler"
        log_info "Run: wrangler login"
        exit 1
    fi
    log_success "Wrangler authenticated"
}

# Deploy Storybook
deploy_storybook() {
    log_info "Building Storybook..."
    pnpm build-storybook
    
    log_info "Deploying Storybook to Cloudflare Pages..."
    wrangler pages deploy packages/web-components/storybook-static \
        --project-name=and-web-components-storybook \
        --branch=main
    
    log_success "Storybook deployed!"
}

# Deploy MCP Worker
deploy_mcp() {
    log_info "Deploying MCP Worker..."
    cd packages/mcp-server
    
    log_info "Installing dependencies..."
    pnpm install
    
    log_info "Deploying to Cloudflare Workers..."
    wrangler deploy
    
    cd ../..
    log_success "MCP Worker deployed!"
}

# Deploy Landing Page
deploy_landing() {
    log_info "Building Landing Page..."
    pnpm build:astro
    
    log_info "Deploying Landing to Cloudflare Pages..."
    wrangler pages deploy apps/astro-landing/dist \
        --project-name=and-web-components-landing \
        --branch=main
    
    log_success "Landing Page deployed!"
}

# Deploy Demo App
deploy_demo() {
    log_info "Building Demo App..."
    pnpm build:all
    
    log_info "Deploying Demo to Cloudflare Pages..."
    wrangler pages deploy apps/angular-workspace/dist/demo-app/browser \
        --project-name=and-web-components-demo \
        --branch=main
    
    log_success "Demo App deployed!"
}

# Main script
main() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║     @andersseen Deploy Script                          ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Parse arguments
    TARGET=${1:-all}
    
    # Check wrangler auth
    check_wrangler_auth
    
    case $TARGET in
        storybook)
            log_info "Deploying Storybook only..."
            deploy_storybook
            ;;
        mcp)
            log_info "Deploying MCP Worker only..."
            deploy_mcp
            ;;
        landing)
            log_info "Deploying Landing Page only..."
            deploy_landing
            ;;
        demo)
            log_info "Deploying Demo App only..."
            deploy_demo
            ;;
        all)
            log_info "Deploying everything..."
            deploy_storybook
            deploy_mcp
            deploy_landing
            deploy_demo
            ;;
        *)
            log_error "Unknown target: $TARGET"
            echo "Usage: ./scripts/deploy.sh [target]"
            echo "Targets: storybook | mcp | landing | demo | all"
            exit 1
            ;;
    esac
    
    echo ""
    log_success "🎉 Deploy completed successfully!"
    echo ""
    echo -e "${BLUE}Deployed services:${NC}"
    echo "  • Storybook: https://and-web-components-storybook.pages.dev"
    echo "  • MCP Worker: https://andersseen-mcp.your-account.workers.dev"
    echo "  • Landing: https://and-web-components-landing.pages.dev"
    echo "  • Demo: https://and-web-components-demo.pages.dev"
}

# Run main
main "$@"
