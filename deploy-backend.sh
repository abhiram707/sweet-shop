#!/bin/bash

# Backend Deployment Script

echo "🚀 Starting Sweet Shop Backend Deployment..."

# Set script to exit on any error
set -e

# Change to backend directory
cd server

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Set up production environment
echo "⚙️ Setting up production environment..."
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo "Please create .env.production with your production settings"
    exit 1
fi

# Start the application with PM2 (if available) or Node.js
if command -v pm2 &> /dev/null; then
    echo "🏃 Starting with PM2..."
    pm2 stop sweet-shop-backend 2>/dev/null || true
    pm2 delete sweet-shop-backend 2>/dev/null || true
    pm2 start dist/index.js --name sweet-shop-backend --env production
    pm2 save
else
    echo "🏃 Starting with Node.js..."
    NODE_ENV=production node dist/index.js &
    echo $! > app.pid
fi

echo "✅ Backend deployment completed successfully!"
echo "🌐 Backend is running on port 3003"
echo "🔍 Check logs with: pm2 logs sweet-shop-backend (if using PM2)"
