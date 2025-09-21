#!/bin/bash

# Frontend Deployment Script

echo "🚀 Starting Sweet Shop Frontend Deployment..."

# Set script to exit on any error
set -e

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to various platforms (uncomment as needed)

# Deploy to Netlify (requires netlify-cli)
if command -v netlify &> /dev/null; then
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir dist
fi

# Deploy to Vercel (requires vercel-cli)
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
fi

# Deploy to static hosting (copy files)
if [ -d "/var/www/sweet-shop" ]; then
    echo "📁 Copying files to web server..."
    sudo cp -r dist/* /var/www/sweet-shop/
    sudo chown -R www-data:www-data /var/www/sweet-shop
fi

# Deploy using Docker
if command -v docker &> /dev/null; then
    echo "🐳 Building Docker image..."
    docker build -t sweet-shop-frontend .
    
    # Stop existing container
    docker stop sweet-shop-frontend-container 2>/dev/null || true
    docker rm sweet-shop-frontend-container 2>/dev/null || true
    
    # Run new container
    docker run -d --name sweet-shop-frontend-container -p 80:80 sweet-shop-frontend
fi

echo "✅ Frontend deployment completed successfully!"
echo "🌐 Frontend is available at your configured domain"
echo "📱 Make sure to update VITE_API_URL in production environment"
