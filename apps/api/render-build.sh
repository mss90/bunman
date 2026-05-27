#!/usr/bin/env bash
set -e

# Navigate to repo root
cd ../..

# Install pnpm if not available
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm@10
fi

# Install all dependencies
pnpm install --frozen-lockfile || pnpm install

# Build the API
pnpm --filter bunman-api build
