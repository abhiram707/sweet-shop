#!/bin/bash

# Production deployment script for Sweet Shop Management System
# This script handles the complete production deployment process

set -e

# Configuration
PROJECT_NAME="sweet-shop-management"
DOCKER_REGISTRY="ghcr.io"
IMAGE_TAG="${GITHUB_SHA:-latest}"
DEPLOYMENT_ENV="${DEPLOYMENT_ENV:-production}"

echo "🍬 Starting Sweet Shop Management System deployment..."
echo "Environment: $DEPLOYMENT_ENV"
echo "Image Tag: $IMAGE_TAG"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo "📋 Checking required tools..."
for tool in docker docker-compose node npm; do
    if ! command_exists $tool; then
        echo "❌ Error: $tool is not installed"
        exit 1
    fi
done
echo "✅ All required tools found"

# Environment setup
echo "🔧 Setting up environment..."
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found"
    echo "Please create .env.production with required environment variables"
    exit 1
fi

# Copy production environment
cp .env.production .env
echo "✅ Production environment configured"

# Build application
echo "🏗️ Building application..."
npm ci --production=false
npm run build:all
echo "✅ Application built successfully"

# Run tests
echo "🧪 Running tests..."
npm run test:coverage
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Deployment aborted."
    exit 1
fi
echo "✅ All tests passed"

# Security audit
echo "🔒 Running security audit..."
npm audit --audit-level high
if [ $? -ne 0 ]; then
    echo "⚠️ Security vulnerabilities found. Please review."
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment aborted."
        exit 1
    fi
fi

# Database migration (if needed)
echo "🗄️ Checking database..."
if [ "$DEPLOYMENT_ENV" = "production" ]; then
    echo "Running production database setup..."
    node -e "
        const { Pool } = require('pg');
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        pool.query('SELECT NOW()')
            .then(() => console.log('✅ Database connection successful'))
            .catch(err => {
                console.error('❌ Database connection failed:', err.message);
                process.exit(1);
            })
            .finally(() => pool.end());
    "
fi

# Docker deployment
echo "🐳 Deploying with Docker..."
if [ "$DEPLOYMENT_ENV" = "production" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
else
    docker-compose up -d
fi

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health checks
echo "🏥 Running health checks..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        echo "✅ Backend health check passed"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Waiting for backend... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 5
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Backend health check failed"
    docker-compose logs backend
    exit 1
fi

# Frontend health check
if curl -f http://localhost:80 >/dev/null 2>&1; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
    docker-compose logs frontend
    exit 1
fi

# Performance test (basic)
echo "🚀 Running basic performance test..."
curl -w "@scripts/curl-format.txt" -o /dev/null -s "http://localhost:3001/api/sweets"

# Cleanup old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"
echo "📊 Application is running at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/health"

# Post-deployment verification
echo "🔍 Running post-deployment verification..."
./scripts/verify-deployment.sh

echo "✅ Sweet Shop Management System is now running in $DEPLOYMENT_ENV mode!"
