#!/bin/bash

set -e

echo "========================================="
echo "PeerChain Bootstrap Installer"
echo "========================================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is required. Please install Node.js 18+ first."
    echo "  Recommended: nvm install 20"
    exit 1
fi

echo "Node.js $(node --version) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is required"
    exit 1
fi

echo "npm $(npm --version) detected"

echo ""
echo "========================================="
echo "Installing Project Dependencies"
echo "========================================="

if [ -f package.json ]; then
    npm install
fi

echo ""
echo "========================================="
echo "Generating Prisma Client"
echo "========================================="

if [ -f prisma/schema.prisma ]; then
    npx prisma generate
fi

echo ""
echo "========================================="
echo "Copy Environment File"
echo "========================================="

if [ ! -f .env.local ] && [ -f .env.example ]; then
    cp .env.example .env.local
    echo "Created .env.local from .env.example"
    echo ">>> Edit .env.local with your API keys before running <<<"
fi

echo ""
echo "========================================="
echo "Running Development Server"
echo "========================================="

echo "Starting Next.js (frontend + API backend) on http://localhost:3000"
echo ""
npm run dev
